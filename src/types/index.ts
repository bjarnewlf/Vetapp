export interface Pet {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  birthDate: string;
  photo?: string;
  microchipCode?: string;
  createdAt: string;
}

export type AnimalType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Fish' | 'Reptile' | 'Other';

export interface Reminder {
  id: string;
  petId?: string;
  title: string;
  date: string;
  description?: string;
  recurrence: RecurrenceType;
  status: ReminderStatus;
  notificationId?: string;
  createdAt: string;
}

export type RecurrenceType = 'Once' | 'Weekly' | 'Monthly' | 'Yearly' | 'Custom';
export type ReminderStatus = 'upcoming' | 'overdue' | 'completed';

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  givenDate: string;
  nextDate?: string;
  recurrenceInterval?: RecurrenceType;
  createdAt: string;
}

export interface Treatment {
  id: string;
  petId: string;
  name: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface VetContact {
  id: string;
  name: string;
  clinic: string;
  phone: string;
  email: string;
  address: string;
}

export interface Document {
  id: string;
  petId: string;
  name: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
}

export const recurrenceDisplayLabels: Record<RecurrenceType, string> = {
  Once: 'Einmalig',
  Weekly: 'Wöchentlich',
  Monthly: 'Monatlich',
  Yearly: 'Jährlich',
  Custom: 'Benutzerdefiniert',
};

export const animalTypeDisplayLabels: Record<AnimalType, string> = {
  Dog: 'Hund', Cat: 'Katze', Bird: 'Vogel', Rabbit: 'Kaninchen',
  Fish: 'Fisch', Reptile: 'Reptil', Other: 'Andere',
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  isPremium: boolean;
}
