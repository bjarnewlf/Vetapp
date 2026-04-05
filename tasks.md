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

## SICHERHEIT — Vor Go-Live abarbeiten

- [ ] **[KRITISCH] S-1: Premium-Bypass fixen**
- [ ] **[HOCH] S-2: Rate-Limit Fail-Closed**
- [ ] **[HOCH] S-3: `ai_usage`-Tabelle im Schema**
- [ ] **[MITTEL] S-4 bis S-6**
- [ ] **[NIEDRIG] S-7, S-8**

---

## PHASE 3 — Testing & Uebergabe

- [ ] togglePro() absichern (= S-1)
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
