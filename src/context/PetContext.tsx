import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Pet, Document } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { uploadFile, deleteFile } from '../utils/fileUpload';

interface PetContextType {
  pets: Pet[];
  documents: Document[];
  loading: boolean;
  error: string | null;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  updatePet: (id: string, data: Partial<Omit<Pet, 'id' | 'createdAt'>>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const PetContext = createContext<PetContextType>({} as PetContextType);

function mapPet(row: any): Pet {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    breed: row.breed || '',
    birthDate: row.birth_date || '',
    photo: row.photo_url,
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

      if (petsRes.data) setPets(petsRes.data.map(mapPet));
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

  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { error } = await supabase.from('pets').insert({
      user_id: user.id,
      name: petData.name,
      type: petData.type,
      breed: petData.breed || null,
      birth_date: petData.birthDate || null,
      photo_url: petData.photo || null,
      microchip_code: petData.microchipCode || null,
    });
    if (!error) await refresh();
  };

  const updatePet = async (id: string, data: Partial<Omit<Pet, 'id' | 'createdAt'>>) => {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.breed !== undefined) updateData.breed = data.breed;
    if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;
    if (data.photo !== undefined) updateData.photo_url = data.photo;
    if (data.microchipCode !== undefined) updateData.microchip_code = data.microchipCode;
    const { error } = await supabase.from('pets').update(updateData).eq('id', id);
    if (!error) await refresh();
  };

  const deletePet = async (id: string) => {
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (!error) await refresh();
  };

  const addDocument = async (data: Omit<Document, 'id' | 'createdAt'>) => {
    if (!user) return;
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
      if (!error) await refresh();
    } catch (e: any) {
      console.error('Dokument-Upload fehlgeschlagen:', e.message);
      throw e;
    }
  };

  const deleteDocument = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.storagePath) {
      try {
        await deleteFile(doc.storagePath);
      } catch (e) {
        console.warn('Storage-Datei konnte nicht gelöscht werden:', e);
      }
    }
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) await refresh();
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
