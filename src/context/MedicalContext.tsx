import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MedicalEvent, Reminder, RecurrenceType } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { scheduleReminderNotification, cancelNotification } from '../services/notifications';
import { getStatus, calculateNextDate, mapMedicalEvent, mapReminder } from '../utils/medicalHelpers';

interface MedicalContextType {
  medicalEvents: MedicalEvent[];
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  addMedicalEvent: (event: Omit<MedicalEvent, 'id' | 'createdAt'>) => Promise<boolean>;
  updateMedicalEvent: (id: string, updates: Partial<Omit<MedicalEvent, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteMedicalEvent: (id: string) => Promise<boolean>;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'status' | 'notificationId'>) => Promise<boolean>;
  completeReminder: (id: string) => Promise<boolean>;
  updateReminder: (id: string, data: Partial<Pick<Reminder, 'title' | 'date' | 'description' | 'recurrence'>>) => Promise<boolean>;
  deleteReminder: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const MedicalContext = createContext<MedicalContextType>({} as MedicalContextType);

export function MedicalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setMedicalEvents([]);
      setReminders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [medicalRes, remindersRes] = await Promise.all([
        supabase.from('medical_events').select('*').order('date', { ascending: false }),
        supabase.from('reminders').select('*').order('date', { ascending: true }),
      ]);

      if (medicalRes.error) throw medicalRes.error;
      if (remindersRes.error) throw remindersRes.error;

      if (medicalRes.data) setMedicalEvents(medicalRes.data.map(mapMedicalEvent));
      if (remindersRes.data) setReminders(remindersRes.data.map(mapReminder));
    } catch (e: any) {
      const message = e?.message || 'Medizinische Daten konnten nicht geladen werden.';
      if (__DEV__) console.error('Medizinische Daten konnten nicht geladen werden:', e);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Overdue-Status jede Minute neu berechnen (falls App über Nacht offen bleibt)
  useEffect(() => {
    const interval = setInterval(() => {
      setReminders(prev => prev.map(r => {
        if (r.status === 'completed') return r;
        const newStatus = getStatus(r.date);
        if (newStatus !== r.status) return { ...r, status: newStatus };
        return r;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const addMedicalEvent = async (event: Omit<MedicalEvent, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('medical_events').insert({
      user_id: user.id,
      pet_id: event.petId,
      type: event.type,
      name: event.name,
      date: event.date,
      next_date: event.nextDate || null,
      notes: event.notes || null,
      recurrence_interval: event.recurrenceInterval || null,
    });
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const updateMedicalEvent = async (id: string, updates: Partial<Omit<MedicalEvent, 'id' | 'createdAt'>>): Promise<boolean> => {
    const updateData: Record<string, unknown> = {};
    if (updates.petId !== undefined) updateData.pet_id = updates.petId;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.nextDate !== undefined) updateData.next_date = updates.nextDate;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.recurrenceInterval !== undefined) updateData.recurrence_interval = updates.recurrenceInterval;
    const { error } = await supabase.from('medical_events').update(updateData).eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const deleteMedicalEvent = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('medical_events').delete().eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const addReminder = async (data: Omit<Reminder, 'id' | 'createdAt' | 'status' | 'notificationId'>): Promise<boolean> => {
    if (!user) return false;
    const notifId = await scheduleReminderNotification({
      id: '', petId: data.petId, title: data.title, date: data.date,
      description: data.description, recurrence: data.recurrence,
      status: 'upcoming', createdAt: '',
    });
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      pet_id: data.petId || null,
      title: data.title,
      date: data.date,
      description: data.description || null,
      recurrence: data.recurrence,
      status: getStatus(data.date),
      notification_id: notifId || null,
    });
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const completeReminder = async (id: string): Promise<boolean> => {
    const reminder = reminders.find(r => r.id === id);

    // Optimistisches Update: Status sofort lokal auf 'completed' setzen
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));

    if (reminder?.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    const { error } = await supabase
      .from('reminders')
      .update({ status: 'completed' })
      .eq('id', id);
    if (error) {
      // Rollback bei Fehler
      setReminders(prev => prev.map(r => r.id === id ? { ...r, status: getStatus(r.date) } : r));
      setError(error.message);
      return false;
    }

    if (reminder && reminder.recurrence !== 'Once' && reminder.recurrence !== 'Custom') {
      const nextDate = calculateNextDate(reminder.date, reminder.recurrence);
      if (nextDate && user) {
        const nextNotifId = await scheduleReminderNotification({
          ...reminder, date: nextDate, status: 'upcoming',
        });
        await supabase.from('reminders').insert({
          user_id: user.id,
          pet_id: reminder.petId || null,
          title: reminder.title,
          date: nextDate,
          description: reminder.description || null,
          recurrence: reminder.recurrence,
          status: getStatus(nextDate),
          notification_id: nextNotifId || null,
        });
      }
    }
    await refresh();
    return true;
  };

  const updateReminder = async (id: string, data: Partial<Pick<Reminder, 'title' | 'date' | 'description' | 'recurrence'>>): Promise<boolean> => {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.date !== undefined) {
      updateData.date = data.date;
      updateData.status = getStatus(data.date);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.recurrence !== undefined) updateData.recurrence = data.recurrence;
    const { error } = await supabase.from('reminders').update(updateData).eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  const deleteReminder = async (id: string): Promise<boolean> => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder?.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) { setError(error.message); return false; }
    await refresh();
    return true;
  };

  return (
    <MedicalContext.Provider value={{
      medicalEvents, reminders, loading, error,
      addMedicalEvent, updateMedicalEvent, deleteMedicalEvent,
      addReminder, completeReminder, updateReminder, deleteReminder, refresh,
    }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  return useContext(MedicalContext);
}
