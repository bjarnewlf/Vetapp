# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert, manuell von Brian bei Bedarf.

## Aktueller Stand

**VetApp** — React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

### Was funktioniert

- Auth (Supabase), Haustier-CRUD inkl. Bearbeiten, Dokumente mit Storage
- Gesundheits-Events (MedicalEvent-Modell) — Impfungen, Entwurmungen, Checkups, Freie Eintraege
- MedicalEvent-Editing — alle Events editierbar
- Erinnerungen mit Ueberfaellig-Erkennung
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent: Eigener Tab, Edge Function deployed, Rate Limiting, Sicherheitsschutz
- Error-Banner-Komponente — sichtbares Feedback bei DB-Fehlern
- Design-System: Theme-Tokens durchgaengig, Accent WCAG-konform (#CC6B3D), Spacing smd:12

---

## Offene Punkte

### Sofort / Naechste Session
- DB-Migration deployen: `20260404_medical_events_recurrence_check.sql`
- Migration fuer `notification_id` in `reminders` deployen
- QA: MedicalEvent-Edit-Funktion manuell testen

### Vor Release (Blocking)
- **F-01:** Git-History auf Credentials pruefen — ggf. Supabase Key rotieren
- **F-02:** togglePro() absichern — RLS: `is_premium` nur serverseitig schreibbar + IAP
- **F-03:** CORS einschraenken (aktuell Wildcard, OK fuer native App, nicht fuer Web)
- Pet-Fotos in Storage (F-08)

### Vor Release (Wichtig)
- Design-Konzept v2 umsetzen (Designer)
- accentLight #F5D0B9 designerisch pruefen

### Phase 2
- Chat-Historie persistent
- Custom Font (Inter), Dark Mode (nach Semantic Tokens)
- Accessibility systematisch (Labels, SafeAreaView)
- Test-Suite — Claas entscheidet (→ Test-Strategie.md)

### Backlog
- Guenstigeres KI-Modell evaluieren
- Deno std updaten (veraltet in Edge Function)
- EAS Build / Demo vorbereiten

---

## Architektur-Hinweise

- 5 Contexts: AuthContext, PetContext, MedicalContext, VetContactContext, SubscriptionContext
- DataContext existiert nicht mehr — `useData()` nicht verwenden
- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- Premium-Gates via SubscriptionContext.isPro + isLoading
- Supabase CLI: `npx supabase` (Windows)
- KI-Assistent: Custom Header x-user-token (JWT-Workaround)
- Accent-Farbe: #CC6B3D (WCAG AA)
- Theme-Aenderungen: Designer entscheidet WAS, Developer setzt um WO
- MedicalEvent-Edit: route.params.editMedicalEvent (nicht editEvent)
- Document.fileUrl ist leer-String — Storage nur ueber storagePath

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — ~85 vernetzte Notizen. Agency.md ist zentraler Hub.
Zuletzt aktualisiert: 2026-04-04

---
Zuletzt aktualisiert: 2026-04-04
