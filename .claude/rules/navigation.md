---
paths:
  - "src/navigation/**/*.{ts,tsx}"
  - "src/screens/**/*.{ts,tsx}"
---

# Navigation

`AppNavigator.tsx` renders either auth screens or a bottom tab navigator depending on `AuthContext.session`. The tab navigator has 5 tabs (Home, Pets, Reminders, Vet Contacts, Profile), each with a nested stack for add/edit/detail screens.
