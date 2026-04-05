# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-05 Feierabend
>
> **ACHTUNG: Mehrere Brian-Instanzen aktiv!** Vor Aufgabenstart pruefen ob Task schon vergeben ist.
> Status-Konvention: `[ ]` = offen, `[~]` = in Arbeit (Instanz angeben), `[x]` = erledigt

---

## SOFORT — Handy-Test fortsetzen

- [x] App auf echtem Geraet starten (Expo Go, iPhone)
- [x] Package-Versionen Expo 54-kompatibel
- [x] Foto-Upload auf Handy getestet
- [x] Hero-Banner
- [x] Tier bearbeiten
- [x] Event bearbeiten
- [x] Dokument hochladen
- [x] Gradient-Header
- [x] Dashboard-Redesign auf Handy verifiziert
- [ ] **Erinnerungen abhaken** — Fix V2 implementiert (completedIds Ref), Claas muss auf Handy testen
- [ ] Tierarzt-Kontakt testen
- [ ] Slide-Out-Animation nach Fix nochmal testen
- [ ] Bugs sammeln und fixen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (nach erfolgreichem Test)

---

## SOFORT — Hygiene

- [ ] **API-Key aus settings.local.json entfernen** — Stitch API-Key steht im Klartext in erlaubter Bash-Zeile. Key entfernen oder `.claude/settings.local.json` in `.gitignore` aufnehmen.

---

## NEUE TASKS — Aus Entscheidungsrunde 2026-04-05

- [ ] **Changelog-Automation** — DevOps setzt Option C um (Git Hook + Task Scheduler)
- [ ] **Jest minimal Setup** — Developer richtet Jest ein, 5-10 Unit-Tests fuer Context-Logik
- [ ] **Taeglicher Vault-Report** — Wissensmanager als Scheduled Agent einrichten
- [ ] **Link-Annotationen** — nach und nach bei neuen/ueberarbeiteten Notizen

---

## STITCH-INTEGRATION

### Erledigt
- [x] MCP-Server eingerichtet
- [x] API-Key gespeichert
- [x] Stitch evaluiert
- [x] Designer-Rule erstellt + ueberarbeitet
- [x] Vault-Dokumentation
- [x] VetApp Design-System-Mapping
- [x] 3 Screens generiert (Home, PetDetail, Reminders)

### Naechste Schritte
- [ ] Developer setzt Stitch-Referenzen in React Native um (nach Bedarf)

---

## VOR PHASE-2-ABSCHLUSS

- [x] Erinnerungen-abhaken-Bug fixen — Fix V2 implementiert, in Test
- [x] **Sammel-Commit** — 60 Dateien committed (da90b83)
- [ ] Handy-Test: Erinnerungen-Fix V2 bestaetigen
- [ ] Bugs aus Handy-Test fixen
- [ ] notification_id Migration fuer reminders deployen
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## SICHERHEIT — Vor Go-Live abarbeiten

> Vollstaendiger Bericht: `sicherheitsbericht-2026-04-04.html`

- [ ] **[KRITISCH] S-1: Premium-Bypass fixen** — `togglePro()` durch echtes IAP ersetzen (RevenueCat empfohlen), RLS fuer `profiles.is_premium` sperren — Pre-Release-Blocker
- [ ] **[HOCH] S-2: Rate-Limit Fail-Closed** — `ai-chat/index.ts` bei `usageError` mit 429/503 ablehnen statt durchlassen
- [ ] **[HOCH] S-3: `ai_usage`-Tabelle im Schema** — Definition + RLS-Policies in `supabase-schema.sql` nachtragen
- [ ] **[MITTEL] S-4: Authorization-Header** — User-JWT direkt als Bearer Token, `x-user-token` entfernen
- [ ] **[MITTEL] S-5: Dokument-URLs verkuerzen** — on-demand generieren, max. 24-48h statt 1 Jahr
- [ ] **[MITTEL] S-6: Storage-Bucket-Policies** — in Schema ergaenzen, Bucket `pet-documents` in Supabase-Konsole auf privat pruefen
- [ ] **[NIEDRIG] S-7: E-Mail-Validierung** — Regex-Check in `RegisterScreen.tsx` vor API-Call
- [ ] **[NIEDRIG] S-8: Auth-Logging** — `console.log/warn` in `aiService.ts` hinter `__DEV__`-Flag

---

## QA-FINDINGS — Erinnerungen (aus Review 7)

- [x] **QA-026: Animation nach DB-Call** — Gefixt
- [ ] **QA-027: Kein Reduce-Motion-Support** — Offen (Backlog)
- [x] **QA-028: Memory Leak animValues** — Akzeptiert
- [x] **QA-029: Rollback setzt Animation zurueck** — Gefixt
- [x] **QA-030: Mehrfach-Abhaken** — Akzeptiert (pendingIds-Guard)
- [x] **QA-031: accessibilityState.checked** — Gefixt

---

## PHASE 3 — Testing & Uebergabe

- [ ] F-002: togglePro() absichern — IAP implementieren, RLS einschraenken (= S-1)
- [ ] F-003: CORS einschraenken (nur relevant falls Web-Version)
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
- [ ] Guenstigeres KI-Modell evaluieren (bei Bedarf)
- [ ] Deno std Version aktualisieren
- [ ] F-010: signUp — klare Fehlermeldung bei Email-Confirmation
- [ ] F-012: Paywall-Check fuer Recurrence in AddReminderScreen
- [ ] Accessibility systematisch (Labels, SafeAreaView)
- [ ] QA-027: Reduce-Motion-Support fuer Animationen
- [ ] DatePicker statt Textfeld (nice-to-have)
- [ ] PDF-Export (Scope mit Kunde klaeren)
- [ ] Tierarztfinder (Scope mit Kunde klaeren)

---

## ERLEDIGT

### 2026-04-05 — Session 4 (Nachmittag, Feierabend)
- [x] PC-Crash: alle Dateien und Git geprueft, keine Schaeden
- [x] Sammel-Commit: 60 Dateien (da90b83)
- [x] API-Key-Leak in settings.local.json identifiziert
- [x] Erinnerungen Slide-Out Fix V2: completedIds Ref statt fragiler pendingIds-Filter

### 2026-04-05 — Session 2 (Vormittag)
- [x] Erinnerungen-abhaken-Bug analysiert und gefixt (Nested Touchables + Race Condition)
- [x] QA-026, QA-029, QA-031 gefixt

### 2026-04-05 — Session 1 (Entscheidungsrunde)
- [x] 10 Entscheidungen mit Claas geklaert
- [x] Autonomie Level 3 freigeschaltet

### 2026-04-04 — Sessions 1-6
- [x] Alle Basis-Features, Health-Check, Stitch, Meeting, Dashboard, Roadmaps

### 2026-04-03 — Sprint Tag 1
- [x] Alle Basis-Features, Design-System, erste QA

---
Zuletzt aktualisiert: 2026-04-05 Feierabend
