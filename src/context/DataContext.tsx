import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Pet, Reminder, Vaccination, Treatment, VetContact, Document } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
  pets: Pet[];
  reminders: Reminder[];
  vaccinations: Vaccination[];
  treatments: Treatment[];
  documents: Document[];
  vetContact: VetContact | null;
  loading: boolean;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  addVaccination: (vaccination: Omit<Vaccination, 'id' | 'createdAt'>) => Promise<void>;
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  saveVetContact: (data: Omit<VetContact, 'id'>) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

function getStatus(dateStr: string): 'upcoming' | 'overdue' {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? 'overdue' : 'upcoming';
}

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

function mapReminder(row: any): Reminder {
  return {
    id: row.id,
    petId: row.pet_id,
    title: row.title,
    date: row.date,
    description: row.description,
    recurrence: row.recurrence || 'Once',
    status: row.status === 'completed' ? 'completed' : getStatus(row.date),
    createdAt: row.created_at,
  };
}

function mapVaccination(row: any): Vaccination {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    givenDate: row.given_date,
    nextDate: row.next_date,
    recurrenceInterval: row.recurrence_interval,
    createdAt: row.created_at,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vetContact, setVetContact] = useState<VetContact | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setPets([]);
      setReminders([]);
      setVaccinations([]);
      setTreatments([]);
      setDocuments([]);
      setVetContact(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [petsRes, remindersRes, vacsRes, treatRes, docsRes, vetRes] = await Promise.all([
      supabase.from('pets').select('*').order('created_at', { ascending: false }),
      supabase.from('reminders').select('*').order('date', { ascending: true }),
      supabase.from('vaccinations').select('*').order('given_date', { ascending: false }),
      supabase.from('treatments').select('*').order('date', { ascending: false }),
      supabase.from('documents').select('*').order('created_at', { ascending: false }),
      supabase.from('vet_contacts').select('*').limit(1),
    ]);

    if (petsRes.data) setPets(petsRes.data.map(mapPet));
    if (remindersRes.data) setReminders(remindersRes.data.map(mapReminder));
    if (vacsRes.data) setVaccinations(vacsRes.data.map(mapVaccination));
    if (docsRes.data) setDocuments(docsRes.data.map((row: any) => ({
      id: row.id, petId: row.pet_id, name: row.name,
      fileUrl: row.file_url, fileType: row.file_type,
      fileSize: row.file_size, createdAt: row.created_at,
    })));
    if (treatRes.data) setTreatments(treatRes.data.map((row: any) => ({
      id: row.id, petId: row.pet_id, name: row.name,
      date: row.date, notes: row.notes, createdAt: row.created_at,
    })));
    if (vetRes.data && vetRes.data.length > 0) {
      const v = vetRes.data[0];
      setVetContact({
        id: v.id, name: v.name, clinic: v.clinic || '',
        phone: v.phone || '', email: v.email || '', address: v.address || '',
      });
    }
    setLoading(false);
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

  const addReminder = async (data: Omit<Reminder, 'id' | 'createdAt' | 'status'>) => {
    if (!user) return;
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      pet_id: data.petId || null,
      title: data.title,
      date: data.date,
      description: data.description || null,
      recurrence: data.recurrence,
      status: getStatus(data.date),
    });
    if (!error) await refresh();
  };

  const addVaccination = async (data: Omit<Vaccination, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { error } = await supabase.from('vaccinations').insert({
      user_id: user.id,
      pet_id: data.petId,
      name: data.name,
      given_date: data.givenDate,
      next_date: data.nextDate || null,
      recurrence_interval: data.recurrenceInterval || null,
    });
    if (!error) await refresh();
  };

  const completeReminder = async (id: string) => {
    const { error } = await supabase
      .from('reminders')
      .update({ status: 'completed' })
      .eq('id', id);
    if (!error) await refresh();
  };

  const deletePet = async (id: string) => {
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (!error) await refresh();
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (!error) await refresh();
  };

  const addDocument = async (data: Omit<Document, 'id' | 'createdAt'>) => {
    if (!user) return;
    const { error } = await supabase.from('documents').insert({
      user_id: user.id,
      pet_id: data.petId,
      name: data.name,
      file_url: data.fileUrl,
      file_type: data.fileType || null,
      file_size: data.fileSize || null,
    });
    if (!error) await refresh();
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) await refresh();
  };

  const saveVetContact = async (data: Omit<VetContact, 'id'>) => {
    if (!user) return;
    if (vetContact) {
      const { error } = await supabase.from('vet_contacts').update({
        name: data.name,
        clinic: data.clinic || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
      }).eq('id', vetContact.id);
      if (!error) await refresh();
    } else {
      const { error } = await supabase.from('vet_contacts').insert({
        user_id: user.id,
        name: data.name,
        clinic: data.clinic || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
      });
      if (!error) await refresh();
    }
  };

  return (
    <DataContext.Provider value={{
      pets, reminders, vaccinations, treatments, documents, vetContact,
      loading, addPet, addReminder, addVaccination, addDocument, deleteDocument,
      saveVetContact, completeReminder, deletePet, deleteReminder, refresh,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
