import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photo: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDueDate: string;
  recurrenceType: 'once' | 'monthly' | 'yearly' | 'every-3-years' | 'custom';
  recurrenceInterval?: number; // For custom: number of months
}

export interface Treatment {
  id: string;
  name: string;
  date: string;
  notes: string;
}

export interface Reminder {
  id: string;
  petId?: string;
  title: string;
  date: string;
  description: string;
  status: 'pending' | 'completed';
  recurrenceType?: 'once' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  recurrenceDay?: number; // For weekly: 0-6 (Sunday-Saturday), for monthly: 1-31 (day of month)
  recurrenceInterval?: number; // For custom: number of days/weeks/months
  recurrenceUnit?: 'days' | 'weeks' | 'months'; // For custom intervals
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  birthDate: string;
  microchipCode: string;
  photo: string;
  vaccinations: Vaccination[];
  treatments: Treatment[];
  veterinarian?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
}

interface PetContextType {
  pets: Pet[];
  reminders: Reminder[];
  userProfile: UserProfile;
  addPet: (pet: Omit<Pet, 'id' | 'vaccinations' | 'treatments'>) => void;
  addVaccination: (petId: string, vaccination: Omit<Vaccination, 'id'>) => void;
  addTreatment: (petId: string, treatment: Omit<Treatment, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminderStatus: (reminderId: string) => void;
  getPetById: (id: string) => Pet | undefined;
  updateUserProfile: (profile: UserProfile) => void;
  showSuccessToast: (message: string) => void;
  successMessage: string | null;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// Sample data
const initialPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    birthDate: '2021-03-15',
    microchipCode: '982000123456789',
    photo: 'https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2clMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI1MjM1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    vaccinations: [
      {
        id: '1',
        name: 'Rabies',
        date: '2024-01-15',
        nextDueDate: '2027-01-15',
        recurrenceType: 'every-3-years',
      },
      {
        id: '2',
        name: 'Distemper',
        date: '2023-06-10',
        nextDueDate: '2026-06-10',
        recurrenceType: 'every-3-years',
      },
    ],
    treatments: [
      {
        id: '1',
        name: 'Dental Cleaning',
        date: '2024-02-10',
        notes: 'Professional cleaning, no issues found',
      },
    ],
    veterinarian: {
      name: 'Dr. Sarah Johnson',
      phone: '+1 555-0123',
      email: 'sarah.j@vetclinic.com',
      address: '123 Pet Care Lane, Springfield',
    },
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Tabby',
    birthDate: '2022-07-20',
    microchipCode: '982000987654321',
    photo: 'https://images.unsplash.com/photo-1670739088209-64414249354b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjU4Nzc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    vaccinations: [
      {
        id: '3',
        name: 'FVRCP',
        date: '2024-02-20',
        nextDueDate: '2027-02-20',
        recurrenceType: 'every-3-years',
      },
    ],
    treatments: [],
    veterinarian: {
      name: 'Dr. Sarah Johnson',
      phone: '+1 555-0123',
      email: 'sarah.j@vetclinic.com',
      address: '123 Pet Care Lane, Springfield',
    },
  },
];

const initialReminders: Reminder[] = [
  {
    id: '1',
    petId: '1',
    title: 'Max - Rabies booster due',
    date: '2027-01-15',
    description: 'Annual rabies vaccination',
    status: 'pending',
  },
  {
    id: '2',
    petId: '2',
    title: 'Luna - Vet checkup',
    date: '2026-03-20',
    description: 'Regular health checkup',
    status: 'pending',
  },
];

const initialUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 555-1234',
  photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwY2FyZCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjU4Nzc1OXww&ixlib=rb-4.1.0&q=80&w=1080',
};

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addPet = (pet: Omit<Pet, 'id' | 'vaccinations' | 'treatments'>) => {
    const newPet: Pet = {
      ...pet,
      id: Date.now().toString(),
      vaccinations: [],
      treatments: [],
    };
    setPets([...pets, newPet]);
    setSuccessMessage(`Pet ${newPet.name} added successfully!`);
  };

  const addVaccination = (petId: string, vaccination: Omit<Vaccination, 'id'>) => {
    setPets(
      pets.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              vaccinations: [
                ...pet.vaccinations,
                { ...vaccination, id: Date.now().toString() },
              ],
            }
          : pet
      )
    );
    setSuccessMessage(`Vaccination added successfully!`);
  };

  const addTreatment = (petId: string, treatment: Omit<Treatment, 'id'>) => {
    setPets(
      pets.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              treatments: [
                ...pet.treatments,
                { ...treatment, id: Date.now().toString() },
              ],
            }
          : pet
      )
    );
    setSuccessMessage(`Treatment added successfully!`);
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setReminders([...reminders, newReminder]);
    setSuccessMessage(`Reminder added successfully!`);
  };

  const toggleReminderStatus = (reminderId: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === reminderId
          ? {
              ...reminder,
              status: reminder.status === 'pending' ? 'completed' : 'pending',
            }
          : reminder
      )
    );
    setSuccessMessage(`Reminder status updated successfully!`);
  };

  const getPetById = (id: string) => {
    return pets.find((pet) => pet.id === id);
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setSuccessMessage(`User profile updated successfully!`);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        reminders,
        userProfile,
        addPet,
        addVaccination,
        addTreatment,
        addReminder,
        toggleReminderStatus,
        getPetById,
        updateUserProfile,
        showSuccessToast,
        successMessage,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}