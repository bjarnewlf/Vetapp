import { MedicalEvent, MedicalEventType, Reminder, RecurrenceType } from '../types';

export function getStatus(dateStr: string): 'upcoming' | 'overdue' {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today ? 'overdue' : 'upcoming';
}

export function calculateNextDate(currentDate: string, recurrence: RecurrenceType): string | null {
  if (recurrence === 'Once' || recurrence === 'Custom') return null;
  const date = new Date(currentDate);
  switch (recurrence) {
    case 'Weekly': date.setDate(date.getDate() + 7); break;
    case 'Monthly': date.setMonth(date.getMonth() + 1); break;
    case 'Yearly': date.setFullYear(date.getFullYear() + 1); break;
  }
  return date.toISOString().split('T')[0];
}

export function mapMedicalEvent(row: any): MedicalEvent {
  return {
    id: row.id,
    petId: row.pet_id,
    type: row.type as MedicalEventType,
    name: row.name,
    date: row.date,
    nextDate: row.next_date || undefined,
    notes: row.notes || undefined,
    recurrenceInterval: row.recurrence_interval || undefined,
    createdAt: row.created_at,
  };
}

export function mapReminder(row: any): Reminder {
  return {
    id: row.id,
    petId: row.pet_id,
    title: row.title,
    date: row.date,
    description: row.description,
    recurrence: row.recurrence || 'Once',
    status: row.status === 'completed' ? 'completed' : getStatus(row.date),
    notificationId: row.notification_id || undefined,
    createdAt: row.created_at,
  };
}
