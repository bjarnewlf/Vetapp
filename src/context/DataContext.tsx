import React, { createContext, useContext, useState } from 'react';
import { Pet, Reminder, Vaccination, Treatment, VetContact } from '../types';
import { mockPets, mockReminders, mockVaccinations, mockTreatments, mockVetContact } from '../data/mockData';

interface DataContextType {
  pets: Pet[];
  reminders: Reminder[];
  vaccinations: Vaccination[];
  treatments: Treatment[];
  vetContact: VetContact;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'status'>) => void;
  addVaccination: (vaccination: Omit<Vaccination, 'id' | 'createdAt'>) => void;
  completeReminder: (id: string) => void;
  deletePet: (id: string) => void;
  deleteReminder: (id: string) => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getStatus(dateStr: string): 'upcoming' | 'overdue' {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? 'overdue' : 'upcoming';
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);

  const addPet = (petData: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...petData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPets(prev => [...prev, newPet]);
  };

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'status'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: generateId(),
      status: getStatus(reminderData.date),
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const addVaccination = (vacData: Omit<Vaccination, 'id' | 'createdAt'>) => {
    const newVac: Vaccination = {
      ...vacData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setVaccinations(prev => [...prev, newVac]);
  };

  const completeReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'completed' as const } : r)
    );
  };

  const deletePet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
    setReminders(prev => prev.filter(r => r.petId !== id));
    setVaccinations(prev => prev.filter(v => v.petId !== id));
    setTreatments(prev => prev.filter(t => t.petId !== id));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <DataContext.Provider value={{
      pets, reminders, vaccinations, treatments,
      vetContact: mockVetContact,
      addPet, addReminder, addVaccination,
      completeReminder, deletePet, deleteReminder,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
