# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-05
>
> Status-Konvention: `[ ]` = offen, `[~]` = in Arbeit, `[x]` = erledigt

---

## SOFORT — Handy-Test (wartet auf Claas)

- [x] **Erinnerungen abhaken (einmalig)** — funktioniert, Slide-Out OK
- [ ] **Erinnerungen abhaken (jaehrlich)** — 30-Tage-Horizont-Filter eingebaut, Claas testet spaeter
- [ ] **Tierarzt-Kontakt** testen (ST-07: Anlegen, Bearbeiten, Telefon-Link)
- [ ] **SafeArea pruefen** — useSafeAreaInsets() in allen Screens (inkl. OnboardingScreen), auf iPhone testen
- [ ] Bugs sammeln und fixen

---

## SOFORT — Deployment

- [x] **Edge Function `ai-chat` deployed** — S-2 (Rate-Limit) + S-4 (Auth-Header) live
- [x] **notification_id Migration deployed** — CLI synchronisiert, 14-stellige Timestamps
- [x] ~~Alte Tabellen `vaccinations`/`treatments` droppen~~ — GESTRICHEN: sind nur Variablennamen, keine DB-Tabellen

---

## VOR GO-LIVE (nicht dringend)

- [ ] **F-034:** console.error/warn in Contexts ohne __DEV__-Guard (10 Stellen, Batch)
- [ ] **F-035:** ai_usage Insert-Reihenfolge optimieren
- [ ] **F-036:** UTC/Lokal-Mix im 30-Tage-Horizont (kosmetisch, max 2h)

---

## VOR PHASE-2-ABSCHLUSS

- [x] Erinnerungen-abhaken-Bug fixen — Fix V2
- [x] QA-Runde + Findings fixen
- [x] Jest Setup
- [x] SafeArea — useSafeAreaInsets() in allen Screens (inkl. F-033 OnboardingScreen)
- [x] Falsche Premium-Features entfernt
- [x] Security S-2 bis S-8 gefixt
- [x] Edge Function + Migration deployed
- [ ] Handy-Test: Erinnerungen jaehrlich + Tierarzt + SafeArea
- [ ] Bugs aus Handy-Test fixen
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## DIESE WOCHE

- [ ] **Changelog-Automation** — DevOps setzt Option C um
- [ ] **Taeglicher Vault-Report** — Wissensmanager als Scheduled Agent

---

## SICHERHEIT — Status

### Erledigt + Deployed
- [x] **S-2: Rate-Limit Fail-Closed** — deployed
- [x] **S-3: ai_usage Schema-Doku**
- [x] **S-4: Authorization-Header** — deployed
- [x] **S-5: Dokument-URLs** — bereits auf 1h begrenzt
- [x] **S-6: Storage-Bucket-Policies**
- [x] **S-7: E-Mail-Validierung**
- [x] **S-8: Auth-Logging** — hinter __DEV__ (aiService, Contexts noch offen → F-034)

### Offen (separates Projekt)
- [ ] **S-1: Premium-Bypass** (1-2 Tage) — `togglePro()` durch RevenueCat IAP ersetzen. Pre-Release-Blocker.

---

## PHASE 3 — Testing & Uebergabe

- [ ] S-1: RevenueCat IAP Integration
- [ ] KI-Assistent mit Tool Use (~2-3 Tage)
- [ ] Weitere Animationen
- [ ] Feinschliff, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## BACKLOG (nach MVP)

- [ ] **Stretch-Header PetDetail** — Pull-to-Reveal Parallax-Effekt (Idee Claas 05.04.)
- [ ] **Maestro E2E-Tests** — Setup evaluiert, Konzept im Vault archiviert
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

### 2026-04-05 — Session 9 (Deployments + QA)
- [x] Edge Function ai-chat deployed (S-2 + S-4 live)
- [x] Migration-Dateien umbenannt (14-stellig), CLI synchronisiert
- [x] notification_id Migration deployed
- [x] QA-Runde 7: F-033 gefixt (OnboardingScreen SafeArea)
- [x] "Alte Tabellen droppen" als ungueltig gestrichen
- [x] Maestro-Recherche archiviert, Black-Hole-Idee im Vault

### 2026-04-05 — Session 8 (Security-Fixes)
- [x] S-2, S-3, S-4, S-6, S-7, S-8 gefixt (parallel, 3 Developer-Agents)
- [x] S-5 als bereits erledigt bestaetigt

### 2026-04-05 — Session 7 (Security-Analyse)
- [x] Alle Findings analysiert: Dateien, Zeilen, Fixes, Aufwand

### 2026-04-05 — Session 6 (Quick Wins)
- [x] SafeArea, falsche Premium-Features, Design-Review

### 2026-04-05 — Session 5 (Handy-Test + Fix)
- [x] Erinnerungen einmalig OK, 30-Tage-Filter

### 2026-04-05 — Session 4 (autonom)
- [x] API-Key, QA-Runde, Jest, Migration SQL

### 2026-04-05 — Session 3 (Crash-Recovery)
- [x] Sammel-Commit, Slide-Out Fix V2

### 2026-04-05 — Session 1+2
- [x] Entscheidungen, Autonomie, Erinnerungen Fix V1

### 2026-04-04
- [x] Health-Check, Stitch, Meeting, Dashboard, Roadmaps, QA

### 2026-04-03
- [x] Sprint Tag 1: Alle Basis-Features

---
Zuletzt aktualisiert: 2026-04-05
