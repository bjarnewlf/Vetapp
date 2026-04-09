import { supabase } from '../lib/supabase';
import { Pet, MedicalEvent } from '../types';
import { getAge } from '../utils/petHelpers';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PetContext {
  name: string;
  type: string;
  breed: string;
  age: string;
  medicalHistory: { type: string; name: string; date: string }[];
}

export async function sendChatMessage(
  messages: ChatMessage[],
  petContext: PetContext[]
): Promise<string> {
  // Session mit frischem Token holen
  let session = null;

  // Immer refreshen um sicherzustellen dass das Token gültig ist
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshData?.session) {
    session = refreshData.session;
    if (__DEV__) console.log('[aiService] Token refreshed erfolgreich');
  } else {
    if (__DEV__) console.warn('[aiService] Refresh fehlgeschlagen:', refreshError?.message, '— versuche getSession()');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      if (__DEV__) console.error('[aiService] Keine aktive Session:', sessionError?.message);
      throw new Error('Bitte melde dich erneut an.');
    }
    session = sessionData.session;
  }

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!}`,
          'x-user-token': session.access_token,
        },
        body: JSON.stringify({ messages, petContext }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (__DEV__) console.error('[aiService] Edge Function Fehler:', response.status, errorText);
      if (response.status === 401) {
        throw new Error('Sitzung abgelaufen. Bitte melde dich erneut an.');
      }
      if (response.status === 429) {
        throw new Error('Zu viele Anfragen. Bitte warte einen Moment.');
      }
      throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }

    const data = await response.json();
    if (!data?.content) {
      throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    }

    return data.content;
  } catch (fetchError) {
    if (fetchError instanceof Error && fetchError.message.includes('Sitzung')) {
      throw fetchError;
    }
    if (fetchError instanceof Error && fetchError.message.includes('Zu viele')) {
      throw fetchError;
    }
    if (fetchError instanceof Error && fetchError.message.includes('Fehler ist aufgetreten')) {
      throw fetchError;
    }
    if (__DEV__) console.error('[aiService] Netzwerkfehler:', fetchError);
    throw new Error('Keine Internetverbindung. Bitte prüfe deine Verbindung.');
  }
}

export function buildPetContext(
  pets: Pet[],
  medicalEvents: MedicalEvent[]
): PetContext[] {
  return pets.map((pet) => {
    const petMedicalHistory = medicalEvents
      .filter((e) => e.petId === pet.id)
      .map((e) => ({ type: e.type, name: e.name, date: e.date }))
      .slice(0, 40);

    return {
      name: (pet.name || '').substring(0, 100),
      type: (pet.type || '').substring(0, 100),
      breed: (pet.breed || '').substring(0, 100),
      age: getAge(pet.birthDate).substring(0, 100),
      medicalHistory: petMedicalHistory,
    };
  });
}
