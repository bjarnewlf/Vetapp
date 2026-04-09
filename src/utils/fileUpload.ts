import { supabase } from '../lib/supabase';

const BUCKET = 'pet-documents';

export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;     // 5 MB
export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'] as const;
type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

/**
 * Lädt ein Pet-Profilfoto in Supabase Storage hoch.
 * Pfad: pet-photos/{userId}/{petId}.jpg
 * Gibt den Storage-Pfad zurück (wird in photo_url der DB gespeichert).
 */
export async function uploadPetPhoto(
  userId: string,
  petId: string,
  fileUri: string,
  fileSize?: number,
): Promise<{ path: string }> {
  if (fileSize && fileSize > MAX_PHOTO_SIZE) throw new Error('Foto ist zu groß (max. 5 MB).');

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
      contentType: 'image/jpeg',
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
    .createSignedUrl(storagePath, 7 * 24 * 3600);

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
    if (__DEV__) console.warn('Foto-Löschung fehlgeschlagen:', error.message);
  }
}

export async function uploadFile(
  userId: string,
  petId: string,
  fileUri: string,
  fileName: string,
  mimeType?: string,
  fileSize?: number,
): Promise<{ path: string }> {
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    throw new Error('Dateityp nicht erlaubt. Erlaubt: PDF, JPEG, PNG, HEIC.');
  }
  if (fileSize && fileSize > MAX_DOCUMENT_SIZE) {
    throw new Error('Datei ist zu groß (max. 10 MB).');
  }

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
      contentType: mimeType || 'application/octet-stream',
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
    if (__DEV__) console.warn('Datei-Löschung fehlgeschlagen:', error.message);
  }
}
