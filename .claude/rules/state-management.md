---
paths:
  - "App.tsx"
  - "src/context/**/*.{ts,tsx}"
---

# State Management

Fünf React Context Provider wrappen die gesamte App (siehe `App.tsx`):

- `AuthContext` — Supabase Auth Session, `signUp`/`signIn`/`signOut`
- `PetContext` (`usePets()`) — CRUD für Pets und Documents; syncs mit Supabase
- `MedicalContext` (`useMedical()`) — CRUD für MedicalEvents (Impfungen, Entwurmungen, Vorsorgen, eigene Typen) und Reminders; syncs mit Supabase
- `VetContactContext` (`useVetContact()`) — Lesen und Speichern des Tierarztkontakts (ein Eintrag pro User)
- `SubscriptionContext` — Pro-Status aus `profiles.is_premium`

Alle Screens sollen direkt `usePets()`, `useMedical()` oder `useVetContact()` importieren.

`PetContext`, `MedicalContext` und `VetContactContext` hängen von `AuthContext` ab (User-ID für RLS-Queries erforderlich). Alle Contexts wrappen `AppNavigator`.

## Was jeder Context verwaltet

**`PetContext` / `usePets()`**
- `pets: Pet[]` — Liste aller Haustiere des Users
- `documents: Document[]` — Dokumente (PDFs, Bilder) aller Haustiere
- CRUD-Methoden: `addPet`, `updatePet`, `deletePet`, `addDocument`, `deleteDocument`
- `loading: boolean`, `error: string | null`

**`MedicalContext` / `useMedical()`**
- `medicalEvents: MedicalEvent[]` — Gesundheitseinträge (Typ: vaccination, deworming, checkup, custom)
- `reminders: Reminder[]` — Erinnerungen mit Status (upcoming, overdue, completed)
- CRUD-Methoden: `addMedicalEvent`, `updateMedicalEvent`, `deleteMedicalEvent`, `addReminder`, `completeReminder`, `updateReminder`, `deleteReminder`
- Overdue-Status wird minütlich neu berechnet (falls App über Nacht offen bleibt)
- `loading: boolean`, `error: string | null`

**`VetContactContext` / `useVetContact()`**
- `vetContact: VetContact | null` — Tierarztkontakt des Users (max. ein Eintrag)
- `saveVetContact` — legt an oder aktualisiert (upsert-artig)
- `loading: boolean`, `error: string | null`
