# Offene Aufgaben

> Ziel: Phase 2 (Entwicklung MVP) abschliessen — vorzeigbar auf dem Handy.
> PDF-Export und Tierarztfinder sind bewusst ausgeklammert (Scope noch undefiniert).
> Stand: 2026-04-04

---

## JETZT — Handy-Test

- [ ] App auf echtem Geraet testen (Expo Go laeuft auf localhost:8081)
- [ ] Alle Flows durchklicken: Onboarding → Tier anlegen (mit Foto!) → Event → Erinnerung → Dokument → KI-Chat
- [ ] Bugs sammeln und fixen
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (nach erfolgreichem Test)

---

## VOR PHASE-2-ABSCHLUSS

- [ ] Bugs aus Handy-Test fixen
- [ ] notification_id Migration fuer reminders deployen
- [ ] Package-Versionen aktualisieren (Expo-Kompatibilitaet)
- [ ] Dem Kunden vorzeigbaren MVP praesentieren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## PHASE 3 — Testing & Uebergabe

- [ ] F-002: togglePro() absichern — IAP implementieren, RLS einschraenken
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

---

## ERLEDIGT (heute)

### Deploys (Claas)
- [x] DB-Migration: medical_events + Daten-Migration
- [x] DB-Migration: recurrence_check Constraint
- [x] Edge Function ai-chat deployed (neues medicalHistory-Format)
- [x] Storage-Policy fuer Pet-Fotos im SQL-Editor

### Code-Fixes (Agentur)
- [x] F-014: storagePath Fallback gefixt
- [x] F-015: Error-Handling Pattern — 3 Contexts, 16 CRUD-Aufrufe, boolean-Return
- [x] F-016: Dropped Promise in RemindersScreen
- [x] F-017: Guard fuer leere petId in AddEventScreen
- [x] F-018: Error-Handling im OnboardingScreen
- [x] F-020: WelcomeScreen.tsx geloescht (toter Code)
- [x] F-021: Anrufen-Button nur bei vorhandener Telefonnummer
- [x] F-023: Onboarding Foto-Upload korrekt an PetContext
- [x] F-024: Navigate-Param eventType statt defaultType
- [x] F-025: Tote Styles nach EmptyState-Umstellung entfernt

### Features (Agentur)
- [x] F-008: Pet-Fotos in Supabase Storage (Upload-Flow komplett)
- [x] F-022: ReminderSettings funktionsfaehig (Ueberfaellig-Regeln wirken)

### Design-Polish (8 Punkte — alle umgesetzt)
- [x] Gradient Header im HomeScreen (expo-linear-gradient)
- [x] Pet-Hero-Banner im PetDetailScreen (grosses Foto/Icon, Gradient)
- [x] AI-Card Upgrade im HomeScreen (Premium-Look mit Badge + CTA)
- [x] EmptyState-Komponente (Emoji + Action-Button)
- [x] SkeletonLoader-Komponente (animierter Shimmer statt Spinner)
- [x] Card-Varianten formalisiert (default/tinted/warning/error)
- [x] Display-Typography (38px/28px) + displaySmall
- [x] KI-Disclaimer dezenter (Icon weg, kuerzerer Text)

### QA (2 Runden)
- [x] QA-Audit Runde 4: 8 Findings, 0 kritisch — 6 direkt gefixt
- [x] QA-Audit Runde 5: 3 Findings, 0 kritisch — alle gefixt

### Analyse & Planung
- [x] Demo-Ready Checklist erstellt
- [x] Angebot-Abgleich: Scope-Luecken identifiziert
- [x] Design-Recherche mit Visualisierungen (HTML-Bericht)
- [x] Animations-Showcase (interaktive HTML-Demos)
- [x] KI-Assistent Tool Use Konzept (technische Architektur)

---
Zuletzt aktualisiert: 2026-04-04
