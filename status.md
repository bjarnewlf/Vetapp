# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert.

## Aktueller Stand

**VetApp** — React Native / Expo (SDK 54), TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

Phase 2 (MVP-Entwicklung) ist inhaltlich abgeschlossen. Handy-Test laeuft — erste Flows erfolgreich, restliche noch offen.

**Mehrere Brian-Instanzen aktiv** — tasks.md ist die Koordinationsdatei.

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

## Letzte Aenderungen (05.04.2026 Vormittag)

- **Erinnerungen abhaken Bug gefixt:** Nested TouchableOpacity aufgeloest (View + 2x Pressable), activeReminders-Filter beruecksichtigt pendingIds fuer saubere Animation, accessibilityState ergaenzt
- **QA-Findings gefixt:** QA-026, QA-029, QA-031
- **TypeScript:** 0 Fehler

---

## Offene Punkte

### Handy-Test (fortsetzen)
- Erinnerungen-Fix auf Handy bestaetigen (ST-04)
- Tierarzt-Kontakt testen
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
- **RemindersScreen:** Karte = View, Content = Pressable, Checkbox = Pressable (keine nested Touchables!)

---

## Konzepte (bereit zur Umsetzung)

- **KI-Assistent mit Tool Use** — Variante B (Confirm First), ~2-3 Tage
- **Animations-Konzept** — 8 Animationen, priorisiert, Showcase als HTML

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — ~85+ vernetzte Notizen. Agency.md ist zentraler Hub.

---
Zuletzt aktualisiert: 2026-04-05 Vormittag
