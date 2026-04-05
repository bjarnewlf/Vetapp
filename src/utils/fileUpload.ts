import { supabase } from '../lib/supabase';

const BUCKET = 'pet-documents';

/**
 * Lädt ein Pet-Profilfoto in Supabase Storage hoch.
 * Pfad: pet-photos/{userId}/{petId}.jpg
 * Gibt den Storage-Pfad zurück (wird in photo_url der DB gespeichert).
 */
export async function uploadPetPhoto(
  userId: string,
  petId: string,
  fileUri: string,
): Promise<{ path: string }> {
  const path = `pet-photos/${userId}/${petId}.jpg`;

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: `${petId}.jpg`,
    type: 'image/jpeg',
  } as any);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, formData, {
      contentType: 'multipart/form-data',
      upsert: true, // Überschreiben erlaubt (Foto ersetzen)
    });

  if (error) throw new Error(`Foto-Upload fehlgeschlagen: ${error.message}`);

  return { path };
}

/**
 * Generiert eine signed URL für ein Pet-Foto (1 Stunde gültig).
 */
export async function getPetPhotoUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 3600);

  if (error || !data?.signedUrl) {
    throw new Error('Foto-URL konnte nicht erstellt werden.');
  }
  return data.signedUrl;
}

/**
 * Löscht ein Pet-Foto aus Supabase Storage.
 */
export async function deletePetPhoto(storagePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    console.warn('Foto-Löschung fehlgeschlagen:', error.message);
  }
}

export async function uploadFile(
  userId: string,
  petId: string,
  fileUri: string,
  fileName: string,
  mimeType?: string,
): Promise<{ path: string }> {
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${petId}/${timestamp}_${safeName}`;

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: safeName,
    type: mimeType || 'application/octet-stream',
  } as any);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, formData, {
      contentType: 'multipart/form-data',
      upsert: false,
    });

  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

  return { path };
}

export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    console.warn('Datei-Löschung fehlgeschlagen:', error.message);
  }
}
