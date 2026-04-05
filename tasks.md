# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-05 Abend
>
> Status-Konvention: `[ ]` = offen, `[~]` = in Arbeit, `[x]` = erledigt

---

## SOFORT — Handy-Test (wartet auf Claas)

- [x] **Erinnerungen abhaken (einmalig)** — funktioniert, Slide-Out OK
- [ ] **Erinnerungen abhaken (jaehrlich)** — 30-Tage-Horizont-Filter eingebaut, Claas testet spaeter
- [ ] **Tierarzt-Kontakt** testen (ST-07: Anlegen, Bearbeiten, Telefon-Link)
- [ ] **SafeArea pruefen** — paddingTop:60 durch useSafeAreaInsets() ersetzt, auf iPhone testen
- [ ] Bugs sammeln und fixen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (nach erfolgreichem Test)

---

## SOFORT — Infrastruktur

- [x] ~~API-Key aus settings.local.json entfernen~~ — erledigt
- [x] ~~Jest minimal Setup~~ — 11 Tests, alle gruen
- [ ] **notification_id Migration deployen** — SQL bereit (`supabase/migrations/`)

---

## DIESE WOCHE

- [ ] **Changelog-Automation** — DevOps setzt Option C um
- [ ] **Taeglicher Vault-Report** — Wissensmanager als Scheduled Agent
- [ ] **Link-Annotationen** — nach und nach

---

## VOR PHASE-2-ABSCHLUSS

- [x] Erinnerungen-abhaken-Bug fixen — Fix V2 implementiert
- [x] QA-Runde + Findings fixen
- [x] Jest Setup
- [x] SafeArea — useSafeAreaInsets() in 12 Screens
- [x] Falsche Premium-Features entfernt
- [ ] Handy-Test: Erinnerungen jaehrlich + Tierarzt + SafeArea
- [ ] notification_id Migration deployen
- [ ] Bugs aus Handy-Test fixen
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## SICHERHEIT — Vor Go-Live abarbeiten (~1h Developer + S-1 separat)

> Vollstaendiger Bericht: `sicherheitsbericht-2026-04-04.html`
> Analyse vom 05.04.: S-5 bereits erledigt, S-2 bis S-8 ca. 1h Aufwand

### Quick Wins (10 Min gesamt)
- [ ] **S-2: Rate-Limit Fail-Closed** (5 Min) — `supabase/functions/ai-chat/index.ts` Z.131-134: bei `usageError` mit 503 ablehnen statt Request durchlassen
- [ ] **S-7: E-Mail-Validierung** (5 Min) — `RegisterScreen.tsx` Z.19-28: Regex-Check `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` vor `signUp()`

### Hygiene (20 Min gesamt)
- [ ] **S-8: Auth-Logging** (10 Min) — `src/services/aiService.ts` Z.29-56: alle `console.log/warn/error` hinter `if (__DEV__)` Guard
- [ ] **S-3: ai_usage Schema-Doku** (10 Min) — Tabellen-Definition + RLS aus Migration in `supabase-schema.sql` nachtragen

### Architektur (35 Min gesamt)
- [ ] **S-4: Authorization-Header** (20 Min) — `aiService.ts` Z.48 + `ai-chat/index.ts` Z.12/93-99: `x-user-token` durch Standard `Authorization: Bearer <access_token>` ersetzen, CORS anpassen
- [ ] **S-6: Storage-Bucket-Policies** (15 Min) — `supabase-schema.sql`: INSERT/SELECT Policies fuer `pet-documents` Bucket ergaenzen

### Bereits erledigt
- [x] **S-5: Dokument-URLs** — bereits auf 1h begrenzt (3600s in `fileUpload.ts`)

### Separates Projekt (1-2 Tage)
- [ ] **S-1: Premium-Bypass** — `togglePro()` durch echtes IAP ersetzen (RevenueCat), RLS fuer `profiles.is_premium` sperren. Pre-Release-Blocker, aber nicht pre-Demo.

---

## PHASE 3 — Testing & Uebergabe

- [ ] S-1: RevenueCat IAP Integration (= Premium-Bypass fixen)
- [ ] KI-Assistent mit Tool Use (~2-3 Tage)
- [ ] Weitere Animationen
- [ ] Feinschliff, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## BACKLOG (nach MVP)

- [ ] **Stretch-Header PetDetail** — Pull-to-Reveal Parallax-Effekt (Idee Claas 05.04.)
- [ ] Chat-Historie persistent
- [ ] Custom Font (Inter)
- [ ] Dark Mode
- [ ] Bottom Sheets
- [ ] SelectField: Tap-outside
- [ ] F-010: signUp Fehlermeldung
- [ ] F-012: Paywall-Check Recurrence
- [ ] F-030: Accessibility-Labels
- [ ] QA-027: Reduce-Motion-Support
- [ ] DatePicker statt Textfeld
- [ ] PDF-Export
- [ ] Tierarztfinder

---

## ERLEDIGT

### 2026-04-05 — Session 7 (Security-Analyse)
- [x] Security-Findings S-2 bis S-8 analysiert: Dateien, Zeilen, konkrete Fixes, Aufwand
- [x] S-5 als bereits erledigt identifiziert
- [x] Security-Plan erstellt und in Tasks eingearbeitet

### 2026-04-05 — Session 6 (Quick Wins)
- [x] SafeArea: paddingTop:60 durch useSafeAreaInsets() in 12 Screens
- [x] ProfileScreen: Fotoanalyse + Gesundheitstrends entfernt
- [x] Design-Review als design-review.md

### 2026-04-05 — Session 5 (Handy-Test + Fix)
- [x] Erinnerungen einmalig — funktioniert
- [x] 30-Tage-Horizont-Filter eingebaut

### 2026-04-05 — Session 4 (autonom)
- [x] API-Key Hygiene, QA-Runde (6 Findings), Jest Setup, Migration SQL

### 2026-04-05 — Session 3 (Crash-Recovery)
- [x] Sammel-Commit (60 Dateien), Slide-Out Fix V2

### 2026-04-05 — Session 1+2
- [x] 10 Entscheidungen, Autonomie Level 3, Erinnerungen Fix V1

### 2026-04-04
- [x] Health-Check, Stitch, Meeting, Dashboard, Roadmaps, QA

### 2026-04-03
- [x] Sprint Tag 1: Alle Basis-Features

---
Zuletzt aktualisiert: 2026-04-05 Abend
