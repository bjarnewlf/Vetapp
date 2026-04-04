# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-04

---

## JETZT — Handy-Test fortsetzen

- [x] App auf echtem Geraet starten (Expo Go, iPhone) ✅
- [x] Package-Versionen Expo 54-kompatibel ✅
- [x] Foto-Upload auf Handy getestet ✅
- [ ] Restliche Flows testen: Hero-Banner, Tier bearbeiten, Event bearbeiten/loeschen, Dokument, Tierarzt-Kontakt, Gradient-Header, Slide-Out-Animation
- [ ] Bugs sammeln und fixen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (nach erfolgreichem Test)

---

## VOR PHASE-2-ABSCHLUSS

- [ ] Bugs aus Handy-Test fixen
- [ ] notification_id Migration fuer reminders deployen
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## SICHERHEIT — Vor Go-Live abarbeiten

> Vollstaendiger Bericht: `sicherheitsbericht-2026-04-04.html`

- [ ] **[KRITISCH] S-1: Premium-Bypass fixen** — `togglePro()` durch echtes IAP ersetzen (RevenueCat empfohlen), RLS fuer `profiles.is_premium` sperren — Pre-Release-Blocker
- [ ] **[HOCH] S-2: Rate-Limit Fail-Closed** — `ai-chat/index.ts` bei `usageError` mit 429/503 ablehnen statt durchlassen
- [ ] **[HOCH] S-3: `ai_usage`-Tabelle im Schema** — Definition + RLS-Policies in `supabase-schema.sql` nachtragen (Brian: erst in Supabase-Konsole pruefen ob vorhanden)
- [ ] **[MITTEL] S-4: Authorization-Header** — User-JWT direkt als Bearer Token, `x-user-token` entfernen
- [ ] **[MITTEL] S-5: Dokument-URLs verkuerzen** — on-demand generieren, max. 24–48h statt 1 Jahr
- [ ] **[MITTEL] S-6: Storage-Bucket-Policies** — in Schema erganzen, Bucket `pet-documents` in Supabase-Konsole auf privat pruefen (Brian)
- [ ] **[NIEDRIG] S-7: E-Mail-Validierung** — Regex-Check in `RegisterScreen.tsx` vor API-Call
- [ ] **[NIEDRIG] S-8: Auth-Logging** — `console.log/warn` in `aiService.ts` hinter `__DEV__`-Flag

---

## PHASE 3 — Testing & Uebergabe

- [ ] F-002: togglePro() absichern — IAP implementieren, RLS einschraenken (= S-1 oben, KRITISCH)
- [ ] F-003: CORS einschraenken (nur relevant falls Web-Version)
- [ ] PDF-Export definieren und umsetzen (Scope mit Kunde klaeren)
- [ ] Tierarztfinder definieren und umsetzen (Scope mit Kunde klaeren)
- [ ] KI-Assistent mit Dateneingabe (Tool Use) — Konzept liegt vor, ~2-3 Tage Aufwand
- [ ] Animationen umsetzen (Konzept + Showcase vorhanden)
- [ ] Bugs aus Kunden-Feedback fixen
- [ ] Feinschliff, finale MVP-Version, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## BACKLOG (nach MVP)

- [ ] Chat-Historie persistent machen
- [ ] Custom Font (Inter)
- [ ] Dark Mode (Semantic Color Tokens zuerst)
- [ ] Bottom Sheets fuer schnelle Erfassung
- [ ] SelectField: Tap-outside zum Schliessen
- [ ] Guenstigeres KI-Modell evaluieren
- [ ] Deno std Version aktualisieren
- [ ] F-010: signUp — klare Fehlermeldung bei Email-Confirmation
- [ ] F-012: Paywall-Check fuer Recurrence in AddReminderScreen
- [ ] F-023: ai_usage-Tabelle in Schema-Doku ergaenzen
- [ ] Accessibility systematisch (Labels, SafeAreaView)
- [ ] Test-Suite (Claas entscheidet Strategie)
- [ ] DatePicker statt Textfeld (nice-to-have)

---

## ERLEDIGT (heute)

### Handy-Test Fixes
- [x] AsyncStorage v3→v2.2.0 (Expo Go Crash gefixt)
- [x] Alle Packages auf Expo 54-kompatible Versionen
- [x] Foto-Upload: fetch+blob → FormData (funktioniert auf echten Geraeten)
- [x] Storage-Policy pet-photos: foldername[1] → [2] (Pfad-Fix)
- [x] Erinnerung abhaken: Slide-Out-Animation (Designer)
- [x] Erinnerung abhaken: Accessibility-Props ergaenzt

### Deploys (Claas)
- [x] DB-Migration: medical_events + Daten-Migration
- [x] DB-Migration: recurrence_check Constraint
- [x] Edge Function ai-chat deployed (neues medicalHistory-Format)
- [x] Storage-Policy fuer Pet-Fotos (korrigiert: [2])

### Code-Fixes (Agentur)
- [x] F-014 bis F-025 (10 Findings)
- [x] Erinnerungen: Optimistic Update + Doppel-Tap-Schutz

### Features (Agentur)
- [x] F-008: Pet-Fotos in Supabase Storage
- [x] F-022: ReminderSettings funktionsfaehig

### Design-Polish
- [x] 8 Design-Punkte umgesetzt (Gradient, Hero-Banner, EmptyState, etc.)
- [x] Erste Animationen (Fade-In, Scale, Slide, Pulse, Slide-Out)

### QA & Analyse
- [x] QA-Audit Runde 4+5
- [x] Sicherheitsanalyse (8 Findings, Bericht als HTML)
- [x] Demo-Ready Checklist, Angebot-Abgleich, Design-Recherche, Animations-Showcase

---
Zuletzt aktualisiert: 2026-04-04
