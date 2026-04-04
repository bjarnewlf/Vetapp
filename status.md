# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert.

## Aktueller Stand

**VetApp** — React Native / Expo (SDK 54), TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

Phase 2 (MVP-Entwicklung) ist inhaltlich abgeschlossen. Handy-Test laeuft — erste Flows erfolgreich, restliche noch offen.

### Was funktioniert (auf echtem iPhone verifiziert ✅)

- Auth (Supabase) ✅
- Haustier-CRUD inkl. Bearbeiten und **Foto-Upload** ✅ (FormData, Storage-Policy korrigiert)
- Gesundheits-Events (MedicalEvent-Modell) — Impfungen, Entwurmungen, Checkups, freie Eintraege ✅
- MedicalEvent-Editing — alle Events editierbar
- **Error-Handling** — CRUD-Methoden geben boolean zurueck, Screens pruefen vor goBack()
- Erinnerungen mit Ueberfaellig-Erkennung + **einstellbare Regeln** ✅
- **Erinnerung abhaken** mit Slide-Out-Animation + Optimistic Update ✅
- Dokumente mit Storage (Pro-Funktion)
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent ✅ — Eigener Tab, Edge Function deployed, Rate Limiting
- Error-Banner-Komponente — sichtbares Feedback bei DB-Fehlern
- **Navigation** zwischen Tabs fluessig ✅

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
- **Slide-Out + Fade** beim Erinnerung-Abhaken (neu)
- Hilfsdateien: `useFadeIn.ts`, `AnimatedPressable.tsx`

---

## Letzte Aenderungen (04.04.2026 Abend)

- **Package-Versionen** auf Expo 54 kompatibel (AsyncStorage v2.2.0, etc.)
- **Foto-Upload** gefixt: FormData statt fetch+blob, Storage-Policy [2] statt [1]
- **Slide-Out-Animation** beim Erinnerung-Abhaken
- Sicherheitsanalyse: 8 Findings dokumentiert

---

## Offene Punkte

### Handy-Test (fortsetzen)
- Restliche Flows: Hero-Banner, Tier bearbeiten, Event bearbeiten/loeschen, Dokument, Tierarzt, Gradient
- Bugs sammeln und fixen
- Alte Tabellen `vaccinations`/`treatments` nach Test droppen

### Vor Phase-2-Abschluss
- notification_id Migration fuer reminders deployen
- Demo dem Kunden zeigen, Phase-2-Zahlung ausloesen (2.160 EUR)

### Sicherheit (vor Go-Live)
- S-1 KRITISCH: Premium-Bypass (togglePro) — IAP noetig
- S-2 bis S-8: Details in `sicherheitsbericht-2026-04-04.html`

### Phase 3
- PDF-Export, Tierarztfinder (Scope mit Kunde klaeren)
- KI-Assistent mit Tool Use (Konzept liegt vor)
- Weitere Animationen (Konzept + Showcase vorhanden)

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
- Supabase CLI: `npx supabase` (Windows)
- KI-Assistent: Custom Header x-user-token (JWT-Workaround), Edge Function heisst `ai-chat`
- Accent-Farbe: #CC6B3D (WCAG AA)
- Theme: 5 neue Color-Tokens, 2 neue Typography-Styles
- MedicalEvent-Edit: route.params.editMedicalEvent (nicht editEvent)
- Animationen: `useFadeIn`, `AnimatedPressable`, Slide-Out in RemindersScreen
- `useNativeDriver: true` — nur opacity und transform, kein backgroundColor
- **Package-Versionen**: Immer `npx expo install --check` vor Handy-Test

---

## Konzepte (bereit zur Umsetzung)

- **KI-Assistent mit Tool Use** — Variante B (Confirm First), ~2-3 Tage
- **Animations-Konzept** — 8 Animationen, priorisiert, Showcase als HTML

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — ~85+ vernetzte Notizen. Agency.md ist zentraler Hub.

---
Zuletzt aktualisiert: 2026-04-04 Abend
