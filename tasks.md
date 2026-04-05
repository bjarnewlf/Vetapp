# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-05 Nachmittag
>
> Status-Konvention: `[ ]` = offen, `[~]` = in Arbeit, `[x]` = erledigt

---

## SOFORT — Handy-Test (wartet auf Claas)

- [ ] **Erinnerungen abhaken** — Fix V2 (completedIds Ref) auf Handy testen
- [ ] **Tierarzt-Kontakt** testen (ST-07: Anlegen, Bearbeiten, Telefon-Link)
- [ ] Slide-Out-Animation Timing/Smoothness pruefen
- [ ] Bugs sammeln und fixen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (nach erfolgreichem Test)

---

## SOFORT — Infrastruktur

- [x] ~~API-Key aus settings.local.json entfernen~~ — erledigt, .gitignore ergaenzt
- [x] ~~Jest minimal Setup~~ — 11 Tests, 3 Suites, alle gruen
- [ ] **notification_id Migration deployen** — SQL-Datei bereit (`supabase/migrations/`), `npx supabase db push` oder manuell im SQL Editor

---

## DIESE WOCHE

- [ ] **Changelog-Automation** — DevOps setzt Option C um (Git Hook + Task Scheduler)
- [ ] **Taeglicher Vault-Report** — Wissensmanager als Scheduled Agent einrichten
- [ ] **Link-Annotationen** — nach und nach bei neuen/ueberarbeiteten Notizen

---

## VOR PHASE-2-ABSCHLUSS

- [x] Erinnerungen-abhaken-Bug fixen — Fix V2 implementiert
- [x] Sammel-Commit — 60 Dateien (da90b83)
- [x] QA-Runde + Findings fixen (F-027 bis F-032)
- [x] Jest Setup
- [ ] Handy-Test: Erinnerungen-Fix V2 bestaetigen
- [ ] Handy-Test: Tierarzt-Kontakt
- [ ] notification_id Migration deployen
- [ ] Bugs aus Handy-Test fixen
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## SICHERHEIT — Vor Go-Live abarbeiten

> Vollstaendiger Bericht: `sicherheitsbericht-2026-04-04.html`

- [ ] **[KRITISCH] S-1: Premium-Bypass fixen** — `togglePro()` durch echtes IAP ersetzen
- [ ] **[HOCH] S-2: Rate-Limit Fail-Closed**
- [ ] **[HOCH] S-3: `ai_usage`-Tabelle im Schema**
- [ ] **[MITTEL] S-4: Authorization-Header**
- [ ] **[MITTEL] S-5: Dokument-URLs verkuerzen**
- [ ] **[MITTEL] S-6: Storage-Bucket-Policies**
- [ ] **[NIEDRIG] S-7: E-Mail-Validierung**
- [ ] **[NIEDRIG] S-8: Auth-Logging**

---

## QA-FINDINGS

- [x] F-027 bis F-029, F-031, F-032 — gefixt
- [ ] **F-030: Accessibility-Labels** — Backlog

---

## PHASE 3 — Testing & Uebergabe

- [ ] F-002: togglePro() absichern (= S-1)
- [ ] F-003: CORS einschraenken
- [ ] KI-Assistent mit Tool Use (~2-3 Tage)
- [ ] Weitere Animationen
- [ ] Bugs aus Kunden-Feedback
- [ ] Feinschliff, finale MVP-Version, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## BACKLOG (nach MVP)

- [ ] Chat-Historie persistent machen
- [ ] Custom Font (Inter)
- [ ] Dark Mode
- [ ] Bottom Sheets
- [ ] SelectField: Tap-outside
- [ ] Guenstigeres KI-Modell
- [ ] F-010: signUp Fehlermeldung
- [ ] F-012: Paywall-Check Recurrence
- [ ] Accessibility systematisch
- [ ] QA-027: Reduce-Motion-Support
- [ ] DatePicker statt Textfeld
- [ ] PDF-Export
- [ ] Tierarztfinder

---

## ERLEDIGT

### 2026-04-05 — Session 4 (Nachmittag, autonom)
- [x] API-Key Hygiene (settings.local.json aus Git, .gitignore)
- [x] QA-Runde: 6 Findings, 5 gefixt (F-027 bis F-032 außer F-030)
- [x] notification_id Migration SQL erstellt
- [x] Jest Setup: 11 Tests, medicalHelpers.ts extrahiert

### 2026-04-05 — Session 3 (Crash-Recovery)
- [x] PC-Crash geprueft, Sammel-Commit (60 Dateien), Slide-Out Fix V2

### 2026-04-05 — Session 1+2
- [x] 10 Entscheidungen, Autonomie Level 3, Erinnerungen-Bug Fix V1

### 2026-04-04
- [x] Health-Check, Stitch, Meeting, Dashboard, Roadmaps, QA

### 2026-04-03
- [x] Sprint Tag 1: Alle Basis-Features

---
Zuletzt aktualisiert: 2026-04-05 Nachmittag
