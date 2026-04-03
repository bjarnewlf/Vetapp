import { supabase } from '../lib/supabase';
import { Pet, Vaccination, Treatment } from '../types';
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
  vaccinations: string[];
  treatments: string[];
}

export async function sendChatMessage(
  messages: ChatMessage[],
  petContext: PetContext[]
): Promise<string> {
  let data: { content?: string } | null = null;
  let error: { status?: number; message?: string } | null = null;

  try {
    const result = await supabase.functions.invoke('ai-chat', {
      body: { messages, petContext },
    });
    data = result.data;
    error = result.error;
  } catch {
    throw new Error('Keine Internetverbindung. Bitte prüfe deine Verbindung.');
  }

  if (error) {
    if (error.status === 429) {
      throw new Error('Zu viele Anfragen. Bitte warte einen Moment.');
    }
    throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
  }

  if (!data?.content) {
    throw new Error('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
  }

  return data.content;
}

export function buildPetContext(
  pets: Pet[],
  vaccinations: Vaccination[],
  treatments: Treatment[]
): PetContext[] {
  return pets.map((pet) => {
    const petVaccinations = vaccinations
      .filter((v) => v.petId === pet.id)
      .map((v) => v.name);

    const petTreatments = treatments
      .filter((t) => t.petId === pet.id)
      .map((t) => t.name);

    return {
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: getAge(pet.birthDate),
      vaccinations: petVaccinations,
      treatments: petTreatments,
    };
  });
}
