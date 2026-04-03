import { supabase } from '../lib/supabase';

const BUCKET = 'pet-documents';

export async function uploadFile(
  userId: string,
  petId: string,
  fileUri: string,
  fileName: string,
  mimeType?: string,
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${petId}/${timestamp}_${safeName}`;

  // Fetch the file as blob
  const response = await fetch(fileUri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: mimeType || 'application/octet-stream',
      upsert: false,
    });

  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`);

  // Get signed URL (valid for 1 year)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (urlError || !urlData?.signedUrl) {
    throw new Error('URL-Erstellung fehlgeschlagen');
  }

  return { url: urlData.signedUrl, path };
}

export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    console.warn('Datei-Löschung fehlgeschlagen:', error.message);
  }
}
