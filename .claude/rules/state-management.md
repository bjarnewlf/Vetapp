---
paths:
  - "App.tsx"
  - "src/context/**/*.{ts,tsx}"
---

# State Management

Three React Context providers wrap the entire app (see `App.tsx`):

- `AuthContext` — Supabase Auth session, `signUp`/`signIn`/`signOut`
- `DataContext` — All CRUD for pets, reminders, vaccinations, treatments, vet contacts, and documents; syncs with Supabase
- `SubscriptionContext` — Pro tier status read from `profiles.is_premium`

`DataContext` depends on `AuthContext` (user ID required to scope queries). Both wrap `AppNavigator`.
