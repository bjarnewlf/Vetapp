# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-04

---

## JETZT — in dieser Session abschliessen

### Prio 1: Commit + Storage-Policy
- [ ] **Alle Team-Aenderungen committen** — 18 geaenderte Dateien, TypeScript clean
- [ ] **Storage-Policy fuer Pet-Fotos** — SQL im Supabase-Editor ausfuehren (ohne das funktioniert Foto-Upload nicht)

### Prio 2: Handy-Test
- [ ] App auf echtem Geraet starten (Expo Go)
- [ ] Alle Flows durchklicken: Onboarding → Tier anlegen (mit Foto!) → Event → Erinnerung → Dokument → KI-Chat
- [ ] Bugs sammeln und fixen

### Prio 3: Aufraumen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (erst nach erfolgreichem Handy-Test)
- [ ] QA-Runde ueber alle Aenderungen laufen lassen

---

## VOR PHASE-2-ABSCHLUSS

- [ ] Bugs aus Handy-Test fixen
- [ ] Design Quick Wins umsetzen (aus Designer-Recherche — Claas entscheidet welche)
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## PHASE 3 — Testing & Uebergabe

- [ ] F-002: togglePro() absichern — IAP implementieren, RLS einschraenken
- [ ] F-003: CORS einschraenken (nur relevant falls Web-Version)
- [ ] PDF-Export definieren und umsetzen (Scope mit Kunde klaeren)
- [ ] Tierarztfinder definieren und umsetzen (Scope mit Kunde klaeren)
- [ ] Bugs aus Kunden-Feedback fixen
- [ ] Feinschliff, finale MVP-Version, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## BACKLOG (nach MVP)

- [ ] Chat-Historie persistent machen
- [ ] Custom Font (Inter)
- [ ] Dark Mode (Semantic Color Tokens zuerst)
- [ ] Micro-Animationen (Card-Press, kein Reanimated)
- [ ] Skeleton Loading statt ActivityIndicator
- [ ] Bottom Sheets fuer schnelle Erfassung
- [ ] SelectField: Tap-outside zum Schliessen
- [ ] Guenstigeres KI-Modell evaluieren
- [ ] Deno std Version aktualisieren
- [ ] F-010: signUp — klare Fehlermeldung bei Email-Confirmation
- [ ] F-012: Paywall-Check fuer Recurrence in AddReminderScreen
- [ ] F-023: ai_usage-Tabelle in Schema-Doku ergaenzen
- [ ] Accessibility systematisch (Labels, SafeAreaView)
- [ ] Test-Suite (Claas entscheidet Strategie)

---

## ERLEDIGT (heute)

### Deploys (Claas)
- [x] DB-Migration: medical_events + Daten-Migration
- [x] DB-Migration: recurrence_check Constraint
- [x] Edge Function ai-chat deployed (neues medicalHistory-Format)

### Code-Fixes (Agentur)
- [x] F-014: storagePath Fallback gefixt
- [x] F-015: Error-Handling Pattern — 3 Contexts, 16 CRUD-Aufrufe, boolean-Return
- [x] F-016: Dropped Promise in RemindersScreen
- [x] F-017: Guard fuer leere petId in AddEventScreen
- [x] F-018: Error-Handling im OnboardingScreen
- [x] F-020: WelcomeScreen.tsx geloescht (toter Code)
- [x] F-021: Anrufen-Button nur bei vorhandener Telefonnummer

### Features (Agentur)
- [x] F-008: Pet-Fotos in Supabase Storage (Upload-Flow komplett)
- [x] F-022: ReminderSettings funktionsfaehig (Ueberfaellig-Regeln wirken)

### UI-Fixes (Agentur)
- [x] AIAssistantScreen: Leerer Screen bei Nicht-Pro gefixt
- [x] Card.tsx: shadowColor auf Theme-Token
- [x] PetDetailScreen: Gesundheits-Sektionen visuell getrennt
- [x] AIAssistantScreen: Inline-Styles in StyleSheet

### Analyse & Planung
- [x] QA-Audit Runde 4 (8 Findings, 0 kritisch)
- [x] Designer-Analyse fuer Demo-Relevanz
- [x] Design-Recherche (moderne Trends, HTML-Bericht in Arbeit)
- [x] Demo-Ready Checklist erstellt
- [x] Angebot-Abgleich: Scope-Luecken identifiziert
- [x] Task-Liste auf Phase-2-Abschluss ausgerichtet

---
Zuletzt aktualisiert: 2026-04-04
