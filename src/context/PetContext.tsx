import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Pet, Document } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { uploadFile, deleteFile, uploadPetPhoto, getPetPhotoUrl, deletePetPhoto } from '../utils/fileUpload';

interface PetContextType {
  pets: Pet[];
  documents: Document[];
  loading: boolean;
  error: string | null;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>, photoUri?: string) => Promise<boolean>;
  updatePet: (id: string, data: Partial<Omit<Pet, 'id' | 'createdAt'>>, photoUri?: string) => Promise<boolean>;
  deletePet: (id: string) => Promise<boolean>;
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const PetContext = createContext<PetContextType>({} as PetContextType);

function isPetPhotoStoragePath(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith('pet-photos/');
}

function mapPet(row: any): Pet {
  const photoUrl: string | undefined = row.photo_url || undefined;
  // photo_url enthält entweder einen Storage-Pfad (pet-photos/...) oder eine alte lokale URI.
  const photoStoragePath = isPetPhotoStoragePath(photoUrl) ? photoUrl : undefined;
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    breed: row.breed || '',
    birthDate: row.birth_date || '',
    // photo wird nach dem Laden mit signed URL befüllt (siehe refresh)
    photo: photoStoragePath ? undefined : photoUrl,
    photoStoragePath,
    microchipCode: row.microchip_code,
    createdAt: row.created_at,
  };
}

function mapDocument(row: any): Document {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    // file_url in der DB enthält den Storage-Pfad (nicht eine direkte Download-URL).
    // storagePath wird für signed-URL-Generierung und Storage-Löschung verwendet.
    // fileUrl bleibt leer — signed URLs werden on-demand in PetDetailScreen generiert.
    fileUrl: '',
    storagePath: row.file_url,
    fileType: row.file_type,
    fileSize: row.file_size,
    createdAt: row.created_at,
  };
}

export function PetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPets([]);
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [petsRes, docsRes] = await Promise.all([
        supabase.from('pets').select('*').order('created_at', { ascending: false }),
        supabase.from('documents').select('*').order('created_at', { ascending: false }),
      ]);

      if (petsRes.error) throw petsRes.error;
      if (docsRes.error) throw docsRes.error;

      let mappedPets = petsRes.data ? petsRes.data.map(mapPet) : [];

      // Signed URLs für Pet-Fotos generieren (parallel)
      const petsWithPhotos = await Promise.all(
        mappedPets.map(async (pet) => {
          if (!pet.photoStoragePath) return pet;
          try {
            const signedUrl = await getPetPhotoUrl(pet.photoStoragePath);
            return { ...pet, photo: signedUrl };
          } catch {
            // Fehler bei URL-Generierung ist nicht kritisch — Placeholder wird angezeigt
            return pet;
          }
        }),
      );
      setPets(petsWithPhotos);

      if (docsRes.data) setDocuments(docsRes.data.map(mapDocument));
    } catch (e: any) {
      const message = e?.message || 'Haustierdaten konnten nicht geladen werden.';
      console.error('Haustierdaten konnten nicht geladen werden:', e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt'>, photoUri?: string): Promise<boolean> => {
    if (!user) return false;
    try {
      // Pet zuerst ohne Foto anlegen um die ID zu erhalten
      const { data: inserted, error: insertError } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name: petData.name,
          type: petData.type,
          breed: petData.breed || null,
          birth_date: petData.birthDate || null,
          photo_url: null,
          microchip_code: petData.microchipCode || null,
        })
        .select('id')
        .single();

      if (insertError) { setError(insertError.message); return false; }

      // Wenn Foto vorhanden: hochladen und Storage-Pfad in DB speichern
      if (photoUri && inserted?.id) {
        try {
          const { path } = await uploadPetPhoto(user.id, inserted.id, photoUri);
          await supabase.from('pets').update({ photo_url: path }).eq('id', inserted.id);
        } catch (e: any) {
          console.error('Pet-Foto-Upload fehlgeschlagen:', e.message);
          // Pet wurde erfolgreich angelegt — Fehler beim Foto ist nicht kritisch
        }
      }

      await refresh();
      return true;
    } catch (e: any) {
      setError(e?.message || 'Tier konnte nicht gespeichert werden.');
      return false;
    }
  };

  const updatePet = async (id: string, data: Partial<Omit<Pet, 'id' | 'createdAt'>>, photoUri?: string): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.breed !== undefined) updateData.breed = data.breed;
      if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;
      if (data.microchipCode !== undefined) updateData.microchip_code = data.microchipCode;

      // Foto hochladen wenn neue URI übergeben wurde
      if (photoUri && user) {
        // Altes Foto aus Storage löschen
        const existingPet = pets.find(p => p.id === id);
        if (existingPet?.photoStoragePath) {
          try {
            await deletePetPhoto(existingPet.photoStoragePath);
          } catch {
            // Nicht kritisch
          }
        }
        try {
          const { path } = await uploadPetPhoto(user.id, id, photoUri);
          updateData.photo_url = path;
        } catch (e: any) {
          console.error('Pet-Foto-Upload fehlgeschlagen:', e.message);
          // Update ohne Foto fortsetzen
        }
      }

      const { error } = await supabase.from('pets').update(updateData).eq('id', id);
      if (error) { setError(error.message); return false; }
      await refresh();
      return true;
    } catch (e: any) {
      setError(e?.message || 'Tier konnte nicht aktualisiert werden.');
      return false;
    }
  };

  const deletePet = async (id: string): Promise<boolean> => {
    // Foto aus Storage löschen (best effort — Pet wird trotzdem gelöscht)
    const pet = pets.find(p => p.id === id);
    if (pet?.photoStoragePath) {
      try {
        await deletePetPhoto(pet.photoStoragePath);
      } catch (e) {
        console.warn('Pet-Foto konnte nicht aus Storage gelöscht werden:', e);
      }
    }
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const addDocument = async (data: Omit<Document, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!user) return false;
    try {
      const { path } = await uploadFile(
        user.id, data.petId, data.fileUrl, data.name, data.fileType,
      );
      const { error } = await supabase.from('documents').insert({
        user_id: user.id,
        pet_id: data.petId,
        name: data.name,
        file_url: path,
        file_type: data.fileType || null,
        file_size: data.fileSize || null,
      });
      if (error) { setError(error.message); return false; }
      await refresh();
      return true;
    } catch (e: any) {
      console.error('Dokument-Upload fehlgeschlagen:', e.message);
      setError(e.message || 'Dokument-Upload fehlgeschlagen.');
      return false;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    const doc = documents.find(d => d.id === id);
    if (doc?.storagePath) {
      try {
        await deleteFile(doc.storagePath);
      } catch (e) {
        console.warn('Storage-Datei konnte nicht gelöscht werden:', e);
      }
    }
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  return (
    <PetContext.Provider value={{
      pets, documents, loading, error,
      addPet, updatePet, deletePet, addDocument, deleteDocument, refresh,
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  return useContext(PetContext);
}
