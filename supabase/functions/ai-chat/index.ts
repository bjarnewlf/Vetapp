import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

function buildSystemPrompt(pets: PetContext[]): string {
  let petInfo = '';
  if (pets.length === 0) {
    petInfo = 'Keine Tiere angegeben.';
  } else {
    petInfo = pets
      .map((pet) => {
        const vaccs =
          pet.vaccinations.length > 0
            ? pet.vaccinations.join(', ')
            : 'Keine Impfungen eingetragen';
        const treats =
          pet.treatments.length > 0
            ? pet.treatments.join(', ')
            : 'Keine Behandlungen eingetragen';
        return `- ${pet.name} (${pet.type}, ${pet.breed}, ${pet.age})\n  Impfungen: ${vaccs}\n  Behandlungen: ${treats}`;
      })
      .join('\n');
  }

  return `Du bist ein freundlicher Tiergesundheits-Assistent in der VetApp. Du beantwortest Fragen zur Tiergesundheit auf Deutsch.

WICHTIG: Du bist KEIN Ersatz für einen Tierarzt. Bei ernsten Symptomen empfiehlst du IMMER einen Tierarztbesuch.

Du kennst folgende Tiere des Users:
${petInfo}

Antworte kurz und verständlich. Beziehe dich auf die konkreten Tiere wenn relevant.`;
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
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Nicht autorisiert.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Nicht autorisiert.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Request-Body parsen
  let messages: ChatMessage[];
  let petContext: PetContext[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
    petContext = body.petContext ?? [];
  } catch {
    return new Response(
      JSON.stringify({ error: 'Ungültiges Anfrage-Format.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Input-Validierung
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
        JSON.stringify({ error: 'Ungültiges Nachrichtenformat.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (msg.role !== 'user' && msg.role !== 'assistant') {
      return new Response(
        JSON.stringify({ error: 'Ungültige Nachrichtenrolle.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (typeof msg.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Nachricht ist zu lang. Bitte kürze deine Anfrage.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        model: 'claude-3-haiku-20240307',
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
    return new Response(
      JSON.stringify({ error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const anthropicData = await anthropicResponse.json();
  const content: string = anthropicData.content?.[0]?.text ?? '';

  return new Response(
    JSON.stringify({ content }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
