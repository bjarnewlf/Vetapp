import * as Notifications from 'expo-notifications';
import { Reminder } from '../types';
import { OverdueRule } from '../hooks/useOverdueSettings';

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminderNotification(reminder: Reminder): Promise<string | null> {
  const eventDate = new Date(reminder.date);
  const now = new Date();

  // Don't schedule if date is in the past
  if (eventDate <= now) return null;

  // Schedule notification for 9:00 AM on the reminder date
  eventDate.setHours(9, 0, 0, 0);
  if (eventDate <= now) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Erinnerung: ' + reminder.title,
        body: reminder.description || `${reminder.title} ist heute fällig.`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: eventDate,
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Notification may already have fired
  }
}

/**
 * Plant für jede überfällige Erinnerung eine erneute Push-Notification,
 * abhängig von der gewählten Überfällig-Regel.
 *
 * Wird beim App-Start aufgerufen nachdem Reminders geladen wurden.
 * Bei 'never' passiert nichts. Bei 'daily' wird eine Notification für
 * morgen früh 9 Uhr geplant, bei 'weekly' für in 7 Tagen.
 */
export async function scheduleOverdueNotifications(
  reminders: Reminder[],
  rule: OverdueRule,
): Promise<void> {
  if (rule === 'never') return;

  const overdue = reminders.filter(r => r.status === 'overdue');
  if (overdue.length === 0) return;

  const offsetDays = rule === 'weekly' ? 7 : 1; // daily und custom → 1 Tag

  const fireAt = new Date();
  fireAt.setDate(fireAt.getDate() + offsetDays);
  fireAt.setHours(9, 0, 0, 0);

  // Bereits geplante Notifications für den gleichen Zeitpunkt nicht doppelt anlegen.
  // Wir verwenden ein einziges Sammel-Notification statt einer pro Erinnerung,
  // um Notification-Spam zu vermeiden.
  const count = overdue.length;
  const title = count === 1
    ? `Überfällig: ${overdue[0].title}`
    : `${count} überfällige Erinnerungen`;
  const body = count === 1
    ? `${overdue[0].title} ist noch offen.`
    : `Du hast ${count} offene Erinnerungen, die erledigt werden müssen.`;

  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireAt,
      },
    });
  } catch {
    // Notifications nicht verfügbar oder Berechtigung fehlt
  }
}
