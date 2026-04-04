# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert, manuell von Brian bei Bedarf.

## Aktueller Stand

**VetApp** — React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

### Was funktioniert

- Auth (Supabase), Haustier-CRUD inkl. Bearbeiten
- **Pet-Fotos in Supabase Storage** — Upload, signed URLs, Neuinstallation-sicher
- Gesundheits-Events (MedicalEvent-Modell) — Impfungen, Entwurmungen, Checkups, Freie Eintraege
- MedicalEvent-Editing — alle Events editierbar
- **Error-Handling** — CRUD-Methoden geben boolean zurueck, Screens pruefen vor goBack()
- Erinnerungen mit Ueberfaellig-Erkennung + **einstellbare Regeln** (ReminderSettings funktionsfaehig)
- Dokumente mit Storage (Pro-Funktion)
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent: Eigener Tab, Edge Function deployed, Rate Limiting, Sicherheitsschutz
- Error-Banner-Komponente — sichtbares Feedback bei DB-Fehlern

### Design-System (aktualisiert)

- Theme-Tokens durchgaengig, Accent WCAG-konform (#CC6B3D), Spacing smd:12
- **Gradient Header** im HomeScreen (expo-linear-gradient)
- **Pet-Hero-Banner** im PetDetailScreen (grosses Foto/Icon mit Gradient-Overlay)
- **AI-Card** als Premium-Feature visuell hervorgehoben
- **Card-Varianten**: default, tinted, warning, error (variant-Prop)
- **EmptyState-Komponente** mit Emoji + Action-Button
- **SkeletonLoader** mit Shimmer-Animation statt Spinner
- **Display-Typography** (38px/28px) fuer emotionale Momente
- Dezenter KI-Disclaimer

---

## Offene Punkte

### Handy-Test (jetzt)
- App auf echtem Geraet testen (Expo Go)
- Bugs sammeln und fixen
- Alte Tabellen droppen nach Verifikation

### Vor Phase-2-Abschluss
- notification_id Migration fuer reminders deployen
- Package-Versionen aktualisieren (Expo-Kompatibilitaet)
- Demo dem Kunden zeigen

### Phase 3
- F-002: togglePro/IAP
- F-003: CORS einschraenken
- PDF-Export (Scope mit Kunde klaeren)
- Tierarztfinder (Scope mit Kunde klaeren)
- KI-Assistent mit Tool Use (Konzept liegt vor)
- Animationen (Konzept + Showcase vorhanden)

---

## Architektur-Hinweise

- 5 Contexts: AuthContext, PetContext, MedicalContext, VetContactContext, SubscriptionContext
- DataContext existiert nicht mehr — `useData()` nicht verwenden
- **CRUD-Methoden geben `Promise<boolean>` zurueck** — Screens pruefen vor goBack()
- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- **Pet-Fotos**: storagePath in DB, Upload via fileUpload.ts, Bucket `pet-documents`
- Premium-Gates via SubscriptionContext.isPro + isLoading
- Supabase CLI: `npx supabase` (Windows)
- KI-Assistent: Custom Header x-user-token (JWT-Workaround), Edge Function heisst `ai-chat`
- Accent-Farbe: #CC6B3D (WCAG AA)
- Theme: 5 neue Color-Tokens (primaryMid, primaryGradientEnd, primaryBorder, warningBorder, errorBorder)
- Typography: display (38px) + displaySmall (28px) fuer Hero-Texte
- MedicalEvent-Edit: route.params.editMedicalEvent (nicht editEvent)

---

## Konzepte (bereit zur Umsetzung)

- **KI-Assistent mit Tool Use** — Konzept liegt vor, Variante B (Confirm First), ~2-3 Tage
- **Animations-Konzept** — 8 Animationen, priorisiert, Showcase als HTML
- **Design-Recherche** — Trends analysiert, alle Quick Wins umgesetzt

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — ~85 vernetzte Notizen. Agency.md ist zentraler Hub.
Zuletzt aktualisiert: 2026-04-04

---
Zuletzt aktualisiert: 2026-04-04
