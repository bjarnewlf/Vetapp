---
paths:
  - "src/navigation/**/*.{ts,tsx}"
  - "src/screens/**/*.{ts,tsx}"
---

# Navigation

`AppNavigator.tsx` renders either auth screens or a bottom tab navigator depending on `AuthContext.session`. The tab navigator has 5 tabs (Home, Pets, AI Assistant, Reminders, Vet Contacts), each with a nested stack for add/edit/detail screens.

Profile is a stack screen accessible via a header button on the HomeScreen (not a tab).
