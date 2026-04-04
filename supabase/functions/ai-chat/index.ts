import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ChatMessage {
  role: string;
  content: string;
}

interface PetContext {
  name: string;
  type: string;
  breed: string;
  age: string;
  vaccinations: string[];
  treatments: string[];
}

// Sanitize-Hilfsfunktion: trim, Newlines entfernen, auf maxLen kuerzen
function sanitizeString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[\n\r]/g, ' ')
    .substring(0, maxLen);
}

function buildSystemPrompt(pets: PetContext[]): string {
  let petInfo = '';
  if (pets.length === 0) {
    petInfo = 'Keine Tiere angegeben.';
  } else {
    petInfo = pets
      .map((pet) => {
        const name = sanitizeString(pet.name, 100);
        const type = sanitizeString(pet.type, 100);
        const breed = sanitizeString(pet.breed, 100);
        const age = sanitizeString(pet.age, 100);

        const vaccs =
          pet.vaccinations.length > 0
            ? pet.vaccinations.map((v) => sanitizeString(v, 200)).join(', ')
            : 'Keine Impfungen eingetragen';
        const treats =
          pet.treatments.length > 0
            ? pet.treatments.map((t) => sanitizeString(t, 200)).join(', ')
            : 'Keine Behandlungen eingetragen';

        return `- ${name} (${type}, ${breed}, ${age})\n  Impfungen: ${vaccs}\n  Behandlungen: ${treats}`;
      })
      .join('\n');
  }

  return `Du bist ein freundlicher Tiergesundheits-Assistent in der VetApp. Du beantwortest Fragen zur Tiergesundheit auf Deutsch.

WICHTIG: Du bist KEIN Ersatz fuer einen Tierarzt. Bei ernsten Symptomen empfiehlst du IMMER einen Tierarztbesuch.

Du kennst folgende Tiere des Users:
--- TIERDATEN (vom System bereitgestellt) ---
${petInfo}
--- ENDE TIERDATEN ---

Antworte kurz und verstaendlich. Beziehe dich auf die konkreten Tiere wenn relevant.`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Methode nicht erlaubt.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // JWT verifizieren
  const userToken = req.headers.get('x-user-token');
  if (!userToken) {
    return new Response(
      JSON.stringify({ error: 'Nicht autorisiert.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: 'Server-Konfigurationsfehler.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Nicht autorisiert.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Rate Limiting: Max 20 Anfragen pro Stunde pro User
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: usageCount, error: usageError } = await supabase
    .from('ai_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', oneHourAgo);

  if (usageError) {
    // Fail-open: Bei DB-Fehler Request durchlassen, nur loggen
    console.error('[ai-chat] Rate-Limit-Abfrage fehlgeschlagen:', usageError.message);
  }

  if ((usageCount ?? 0) >= 20) {
    return new Response(
      JSON.stringify({ error: 'Du hast das Nachrichten-Limit erreicht (20 pro Stunde). Bitte versuche es spaeter erneut.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Request-Body parsen
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Ungueltiges Anfrage-Format.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Gesamt-Body-Groesse pruefen (max 50KB)
  if (JSON.stringify(body).length > 50000) {
    return new Response(
      JSON.stringify({ error: 'Anfrage ist zu gross.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const typedBody = body as Record<string, unknown>;
  const messages: ChatMessage[] = (typedBody.messages as ChatMessage[]) ?? [];
  const petContext: PetContext[] = (typedBody.petContext as PetContext[]) ?? [];

  // Input-Validierung: Nachrichten
  const MAX_MESSAGES = 50;
  const MAX_MESSAGE_LENGTH = 2000;

  if (messages.length > MAX_MESSAGES) {
    return new Response(
      JSON.stringify({ error: 'Zu viele Nachrichten. Bitte starte einen neuen Chat.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return new Response(
        JSON.stringify({ error: 'Ungueltiges Nachrichtenformat.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (msg.role !== 'user' && msg.role !== 'assistant') {
      return new Response(
        JSON.stringify({ error: 'Ungueltige Nachrichtenrolle.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Nachricht ist zu lang. Bitte kuerze deine Anfrage.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // PetContext validieren: max 10 Tiere
  if (petContext.length > 10) {
    return new Response(
      JSON.stringify({ error: 'Zu viele Tiere im Kontext (max. 10).' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  for (const pet of petContext) {
    // name, type, breed: max 100 Zeichen
    for (const field of ['name', 'type', 'breed', 'age'] as const) {
      if (typeof pet[field] !== 'string' || pet[field].length > 100) {
        return new Response(
          JSON.stringify({ error: `Ungueltige Tier-Daten: Feld "${field}" ist zu lang oder ungueltig.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // vaccinations: max 20 Eintraege, je max 200 Zeichen
    if (!Array.isArray(pet.vaccinations) || pet.vaccinations.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Ungueltige Tier-Daten: Zu viele Impfeintraege (max. 20).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    for (const v of pet.vaccinations) {
      if (typeof v !== 'string' || v.length > 200) {
        return new Response(
          JSON.stringify({ error: 'Ungueltige Tier-Daten: Impfeintrag zu lang (max. 200 Zeichen).' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // treatments: max 20 Eintraege, je max 200 Zeichen
    if (!Array.isArray(pet.treatments) || pet.treatments.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Ungueltige Tier-Daten: Zu viele Behandlungseintraege (max. 20).' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    for (const t of pet.treatments) {
      if (typeof t !== 'string' || t.length > 200) {
        return new Response(
          JSON.stringify({ error: 'Ungueltige Tier-Daten: Behandlungseintrag zu lang (max. 200 Zeichen).' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Anthropic API aufrufen
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    return new Response(
      JSON.stringify({ error: 'Server-Konfigurationsfehler.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let anthropicResponse: Response;
  try {
    anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: buildSystemPrompt(petContext),
        messages,
      }),
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Netzwerkfehler beim Verbinden mit dem KI-Dienst.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (anthropicResponse.status === 429) {
    return new Response(
      JSON.stringify({ error: 'Zu viele Anfragen. Bitte warte einen Moment.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!anthropicResponse.ok) {
    const errorBody = await anthropicResponse.text();
    console.error('[ai-chat] Anthropic API error:', anthropicResponse.status, errorBody);
    return new Response(
      JSON.stringify({ error: 'KI-Dienst nicht verfuegbar. Bitte versuche es spaeter erneut.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const anthropicData = await anthropicResponse.json();
  const content: string = anthropicData.content?.[0]?.text ?? '';

  // Usage tracken fuer Rate Limiting
  const { error: insertError } = await supabase
    .from('ai_usage')
    .insert({ user_id: user.id });

  if (insertError) {
    // Nicht fatal — Antwort trotzdem zurueckgeben, nur loggen
    console.error('[ai-chat] Usage-Insert fehlgeschlagen:', insertError.message);
  }

  return new Response(
    JSON.stringify({ content }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
