# Offene Aufgaben

## SOFORT
- [ ] DB-Migrationen deployen (medical_events + recurrence_check)
- [ ] Edge Function neu deployen (medicalHistory-Format)
- [ ] Manuell testen: MedicalEvent CRUD, Edit-Flow, ErrorBanner
- [ ] F-015 mit Claas besprechen: Error-Swallowing in Contexts (CRUD schweigt bei Fehler, Screens navigieren trotzdem zurueck)

## VOR RELEASE
- [ ] F-002: togglePro() absichern — IAP implementieren, RLS fuer is_premium einschraenken
- [ ] F-003: CORS in Edge Function einschraenken vor Web-Release (TODO im Code)
- [ ] F-008: Pet-Fotos in Supabase Storage hochladen (wie Dokumente)
- [ ] F-011: notification_id DB-Migration fuer reminders erstellen
- [ ] Alte Tabellen vaccinations/treatments droppen (nach Deploy-Verifikation)
- [ ] F-022: ReminderSettings werden gespeichert aber nie gelesen — Feature fertig bauen oder entfernen

## PHASE 2
- [ ] Custom Font (Inter) einfuehren — frueh in Phase 2, bevor Screen-Bestand waechst
- [ ] Dark Mode — erst Semantic Color Tokens, dann Dark-Varianten
- [ ] Micro-Animationen — maximal ein einzelner Effekt (Card-Press), kein Reanimated fuers MVP

## BACKLOG
- [ ] Chat-Historie persistent machen (nach MVP)
- [ ] SelectField: Tap-outside zum Schliessen (QA-Finding)
- [ ] Demo fuer Kunden vorbereiten (Expo Go / EAS Build / Web)
- [ ] Guenstigeres KI-Modell evaluieren (claude-sonnet-4-6 ist teuer)
- [ ] Deno std Version aktualisieren (0.168.0 → aktuell)
- [ ] F-010: signUp Auto-SignIn — klare Fehlermeldung bei Email-Confirmation
- [ ] F-012: AddReminderScreen — Paywall-Check fuer Recurrence ergaenzen
- [ ] F-023: ai_usage-Tabelle in Schema-Doku ergaenzen
- [ ] Error-States in weiteren Screens anzeigen (State existiert, UI fehlt teilweise)

## ERLEDIGT (diese Session)
- [x] F-014: storagePath ?? fileUrl Fallback gefixt (leerer String statt totem Fallback)
- [x] F-016: Dropped Promise in RemindersScreen gefixt (await hinzugefuegt)
- [x] F-017: Guard fuer leere petId in AddEventScreen
- [x] F-018: Error-Handling im OnboardingScreen (try/catch + Alert)
- [x] F-020: WelcomeScreen.tsx geloescht (toter Code, nirgends eingebunden)
- [x] F-021: Anrufen-Button nur bei vorhandener Telefonnummer
- [x] QA-Audit Runde 4 durchgefuehrt (8 Findings, 0 kritisch)
- [x] Demo-Ready Checklist erstellt (demo-checklist.md)
- [x] Designer-Analyse fuer Demo-Relevanz

## ERLEDIGT (fruehere Sessions)
- [x] MedicalEvent Datenmodell vereinheitlichen (Vaccination+Treatment → MedicalEvent)
- [x] DataContext aufgeteilt in PetContext, MedicalContext, VetContactContext
- [x] Alle Screens auf neue Hooks migriert
- [x] DataContext.tsx + alte Typen geloescht
- [x] F-001: Edge Function auf medicalHistory umgestellt
- [x] F-002: Custom-Events als MedicalEvent gespeichert
- [x] F-003: DataProvider entfernt
- [x] F-004: CHECK-Constraint recurrence_interval
- [x] F-006: Loading-Spinner PetDetailScreen
- [x] F-007: storagePath/fileUrl Mapping korrigiert
- [x] F-009: MedicalEvent Edit-Button + Edit-Support in AddEventScreen
- [x] F-010: Ungenutzter FREE_LIMITS Import entfernt
- [x] F-011: state-management.md aktualisiert
- [x] F-012: Error-State in allen drei Contexts
- [x] F-013: Label "Weitere Gesundheitseintraege"
- [x] F-03: CORS dokumentiert
- [x] F-05/F-06: Null-Fallbacks mit Zurueck-Button
- [x] F-07: ErrorBanner Komponente + Integration
- [x] Rules aktualisiert (supabase.md, state-management.md)
- [x] Edge Function auf neues Format angepasst
- [x] Vault dokumentiert (Chronik, Entscheidung, Schema, State Management)
- [x] Orange-Kontrast: accent #E8895C → #CC6B3D (WCAG-konform)
- [x] Spacing-Token smd: 12 eingefuehrt
- [x] D-A bis D-E: Design-Findings gefixt
- [x] F-01: .env in Git-History pruefen — nie committet, Entwarnung
- [x] Edge Function deployen (Security-Fix: debug-Felder entfernt)
- [x] KI-Chat absichern: Rate Limiting, Input-Validierung, Prompt-Schutz
- [x] AI-Assistent: Edge Function deployed + funktioniert
- [x] AI-Assistent: Komplett-Redesign + eigener Tab

---
Zuletzt aktualisiert: 2026-04-04
