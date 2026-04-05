---
paths:
  - "src/services/notifications.ts"
  - "src/screens/ReminderSettingsScreen.tsx"
  - "src/screens/AddEventScreen.tsx"
---

# Notifications

`src/services/notifications.ts` schedules Expo local push notifications at 9:00 AM on a reminder's due date. Recurring reminders (Weekly/Monthly/Yearly) re-schedule on completion.
