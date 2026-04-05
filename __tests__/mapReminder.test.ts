import { mapReminder } from '../src/utils/medicalHelpers';

describe('mapReminder', () => {
  const futureDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  })();

  it('vollstaendige Row -> korrektes Reminder-Objekt', () => {
    const row = {
      id: 'r1',
      pet_id: 'p1',
      title: 'Flohschutz',
      date: futureDate,
      description: 'Frontline',
      recurrence: 'Monthly',
      status: 'upcoming',
      notification_id: 'notif-42',
      created_at: '2025-01-01T10:00:00Z',
    };
    const reminder = mapReminder(row);
    expect(reminder.id).toBe('r1');
    expect(reminder.petId).toBe('p1');
    expect(reminder.title).toBe('Flohschutz');
    expect(reminder.recurrence).toBe('Monthly');
    expect(reminder.notificationId).toBe('notif-42');
    expect(reminder.status).toBe('upcoming');
  });

  it('status=completed in DB -> status bleibt completed (nicht neu berechnet)', () => {
    const pastDate = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      return d.toISOString().split('T')[0];
    })();
    const row = {
      id: 'r2',
      pet_id: null,
      title: 'Impfung',
      date: pastDate,
      description: null,
      recurrence: 'Yearly',
      status: 'completed',
      notification_id: null,
      created_at: '2025-01-01T10:00:00Z',
    };
    const reminder = mapReminder(row);
    expect(reminder.status).toBe('completed');
  });

  it('Row ohne optionale Felder -> recurrence default Once, kein notificationId', () => {
    const row = {
      id: 'r3',
      pet_id: null,
      title: 'Kontrolle',
      date: futureDate,
      description: null,
      recurrence: null,
      status: 'upcoming',
      notification_id: null,
      created_at: '2025-06-01T08:00:00Z',
    };
    const reminder = mapReminder(row);
    expect(reminder.recurrence).toBe('Once');
    expect(reminder.notificationId).toBeUndefined();
    expect(reminder.petId).toBeNull();
  });
});
