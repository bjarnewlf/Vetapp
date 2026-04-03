import * as Notifications from 'expo-notifications';
import { Reminder } from '../types';

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
