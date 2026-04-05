# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert.

## Aktueller Stand

**VetApp** — React Native / Expo (SDK 54), TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

Phase 2 (MVP-Entwicklung) ist inhaltlich abgeschlossen. **Alle Deployments sind durch.** Handy-Test laeuft — erste Flows erfolgreich, 3 Tests noch offen.

### Was funktioniert (auf echtem iPhone verifiziert)

- Auth (Supabase)
- Haustier-CRUD inkl. Bearbeiten und **Foto-Upload** (FormData, Storage-Policy korrigiert)
- Gesundheits-Events (MedicalEvent-Modell) — Impfungen, Entwurmungen, Checkups, freie Eintraege
- MedicalEvent-Editing — alle Events editierbar
- **Error-Handling** — CRUD-Methoden geben boolean zurueck, Screens pruefen vor goBack()
- Erinnerungen mit Ueberfaellig-Erkennung + **einstellbare Regeln**
- **Erinnerung abhaken** — Fix implementiert (Nested Touchables + Race Condition), in Test auf Handy
- Dokumente mit Storage (Pro-Funktion)
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent — Eigener Tab, Edge Function deployed, Rate Limiting
- Error-Banner-Komponente — sichtbares Feedback bei DB-Fehlern
- **Navigation** zwischen Tabs fluessig

### Deployed (live auf Supabase)

- Edge Function `ai-chat` — S-2 (Rate-Limit fail-closed) + S-4 (Authorization Bearer)
- Migration `notification_id` fuer reminders
- Migration CLI synchronisiert (14-stellige Timestamps, repair applied)

### Design-System

- Theme-Tokens durchgaengig, Accent WCAG-konform (#CC6B3D), Spacing smd:12
- **Gradient Header** im HomeScreen (expo-linear-gradient)
- **Pet-Hero-Banner** im PetDetailScreen (grosses Foto/Icon mit Gradient-Overlay)
- **AI-Card** als Premium-Feature visuell hervorgehoben
- **Card-Varianten**: default, tinted, warning, error (variant-Prop)
- **EmptyState-Komponente** mit Emoji + Action-Button
- **SkeletonLoader** mit Shimmer-Animation statt Spinner
- **Display-Typography** (38px/28px) fuer emotionale Momente
- Dezenter KI-Disclaimer

### Animationen

- Fade-In auf HomeScreen, AIAssistantScreen
- Scale-Feedback auf Pet-Cards und AI-Card
- Tab-Slide-Indikator in PetDetailScreen
- Pulse auf Ueberfaellig-Banner
- **Slide-Out + Fade** beim Erinnerung-Abhaken (gefixt: separate Pressables statt nested Touchables)
- Hilfsdateien: `useFadeIn.ts`, `AnimatedPressable.tsx`

---

## Offene Punkte

### Handy-Test (wartet auf Claas)
- Erinnerungen abhaken (jaehrlich) — 30-Tage-Filter testen
- Tierarzt-Kontakt testen (ST-07)
- SafeArea auf iPhone pruefen (jetzt inkl. OnboardingScreen)

### Vor Go-Live (nicht dringend)
- F-034: console.error/warn ohne __DEV__-Guard in Contexts
- F-035: ai_usage Insert-Reihenfolge
- F-036: UTC/Lokal-Mix im 30-Tage-Horizont
- S-1 KRITISCH: Premium-Bypass (togglePro) — IAP noetig

### Vor Phase-2-Abschluss
- Handy-Tests gruen → Dem Kunden MVP praesentieren → Phase-2-Zahlung (2.160 EUR)

### Phase 3
- RevenueCat IAP (S-1, Go-Live-Blocker)
- KI-Assistent mit Tool Use (Konzept liegt vor)
- Weitere Animationen (Konzept + Showcase vorhanden)
- PDF-Export, Tierarztfinder (Scope mit Kunde klaeren)

---

## Architektur-Hinweise

- 5 Contexts: AuthContext, PetContext, MedicalContext, VetContactContext, SubscriptionContext
- DataContext existiert nicht mehr — `useData()` nicht verwenden
- **CRUD-Methoden geben `Promise<boolean>` zurueck** — Screens pruefen vor goBack()
- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- **Pet-Fotos**: storagePath in DB, **FormData-Upload** via fileUpload.ts, Bucket `pet-documents`
- **Storage-Policy**: `(storage.foldername(name))[2]` fuer pet-photos (wegen `pet-photos/` Prefix)
- Premium-Gates via SubscriptionContext.isPro + isLoading
- Supabase CLI: `npx supabase` (Windows), **14-stellige Timestamps** fuer Migrationen
- KI-Assistent: Authorization Bearer Header, Edge Function heisst `ai-chat`
- Accent-Farbe: #CC6B3D (WCAG AA)
- Theme: 5 neue Color-Tokens, 2 neue Typography-Styles
- MedicalEvent-Edit: route.params.editMedicalEvent (nicht editEvent)
- Animationen: `useFadeIn`, `AnimatedPressable`, Slide-Out in RemindersScreen
- `useNativeDriver: true` — nur opacity und transform, kein backgroundColor
- **Package-Versionen**: Immer `npx expo install --check` vor Handy-Test
- **RemindersScreen:** Karte = View, Content = Pressable, Checkbox = Pressable (keine nested Touchables!)

---

## Konzepte (bereit zur Umsetzung)

- **KI-Assistent mit Tool Use** — Variante B (Confirm First), ~2-3 Tage
- **Animations-Konzept** — 8 Animationen, priorisiert, Showcase als HTML
- **Maestro E2E-Tests** — Recherche im Vault archiviert, Setup ~halber Tag

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — ~187+ vernetzte Notizen. Agency.md ist zentraler Hub.

---
Zuletzt aktualisiert: 2026-04-05
