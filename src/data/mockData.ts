import { Pet, Reminder, Vaccination, Treatment, VetContact, UserProfile } from '../types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    birthDate: '2022-03-15',
    photo: undefined,
    microchipCode: '982000123456789',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Tabby',
    birthDate: '2022-07-20',
    photo: undefined,
    microchipCode: '982000987654321',
    createdAt: '2024-01-01',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    petId: '2',
    title: 'Luna - Vet checkup',
    date: '2026-03-20',
    description: 'Regular health checkup',
    recurrence: 'Once',
    status: 'overdue',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    petId: '1',
    title: 'Max - Rabies booster due',
    date: '2027-01-15',
    description: 'Annual rabies vaccination',
    recurrence: 'Yearly',
    status: 'upcoming',
    createdAt: '2024-01-01',
  },
];

export const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    petId: '2',
    name: 'FVRCP',
    givenDate: '2024-02-20',
    nextDate: '2027-02-20',
    recurrenceInterval: 'Every 3 years',
    createdAt: '2024-02-20',
  },
];

export const mockTreatments: Treatment[] = [];

export const mockVetContact: VetContact = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  clinic: 'Veterinary Clinic',
  phone: '+1 555-0123',
  email: 'sarah.j@vetclinic.com',
  address: '123 Pet Care Lane, Springfield',
};

export const mockUser: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 555-1234',
  photo: undefined,
  isPremium: false,
};
