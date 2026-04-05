---
paths:
  - "src/lib/**/*.ts"
  - "src/context/DataContext.tsx"
  - "src/context/AuthContext.tsx"
  - "supabase-schema.sql"
---

# Backend (Supabase)

- `src/lib/supabase.ts` — client initialization (credentials are stored inline)
- `supabase-schema.sql` — full database schema with 6 tables: `profiles`, `pets`, `reminders`, `medical_events`, `vet_contacts`, `documents`
- All tables use Row Level Security with `auth.uid()` policies — users access only their own data
- Documents are stored in the `pet-documents` Supabase Storage bucket (Pro feature)
- Push notification IDs are persisted in the `reminders` table for cancellation
- `medical_events` ersetzt die alten Tabellen `vaccinations` und `treatments` — alle medizinischen Ereignisse (Impfungen, Entwurmungen, Untersuchungen, Custom) werden einheitlich mit einem `type`-Feld gespeichert
