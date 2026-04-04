# Offene Aufgaben

## SOFORT
- [ ] Gesundheits-UX: Datenmodell vereinheitlichen (MedicalEvent)
- [ ] Gesundheits-UX: DataContext + Screens umbauen

## VOR RELEASE
- [ ] F-02: togglePro() absichern — IAP implementieren, RLS fuer is_premium einschraenken
- [ ] F-03: CORS in Edge Function einschraenken (Origin statt Wildcard *)
- [ ] F-05/F-06: goBack() bei null-Events/Pets in EventDetailScreen + PetDetailScreen
- [ ] F-07: DataContext.refresh() — DB-Fehler nicht verschlucken
- [ ] F-08: Pet-Fotos in Supabase Storage hochladen (wie Dokumente)
- [ ] F-11: notification_id Spalte ins supabase-schema.sql nachpflegen

## BACKLOG
- [ ] M7: DataContext refactoren (God-Object, ~350 Zeilen)
- [ ] Chat-Historie persistent machen (nach MVP)
- [ ] SelectField: Tap-outside zum Schliessen (QA-Finding)
- [ ] Demo fuer Kunden vorbereiten (Expo Go / EAS Build / Web)
- [ ] Guenstigeres KI-Modell evaluieren (claude-sonnet-4-6 ist teuer)
- [ ] Deno std Version aktualisieren (0.168.0 → aktuell)
- [ ] F-10: signUp Auto-SignIn — klare Fehlermeldung bei Email-Confirmation
- [ ] F-12: AddReminderScreen — Paywall-Check fuer Recurrence ergaenzen
- [ ] F-14: getAge() — Zukunftsdaten abfangen

## ERLEDIGT
- [x] D-A: Accessibility — Button + InputField (Labels, Roles, States)
- [x] D-B: Touch-Target Checkbox RemindersScreen (28px → 44px)
- [x] D-C: Deaktivierte Settings-Items im ProfileScreen ("Kommt bald" Alert)
- [x] D-D: Inline-Werte bereinigen (Card spacing.md, StatusBadge typography.caption)
- [x] D-E: Hardcoded Farbe HomeScreen (war schon gefixt)
- [x] F-01: .env in Git-History pruefen — nie committet, Entwarnung
- [x] Ungetrackte Dateien committen (briefings/, docs/, scripts/)
- [x] .gitignore erweitert (supabase/.temp/, generierte HTML)
- [x] Edge Function deployen (Security-Fix: debug-Felder entfernt)
- [x] KI-Chat absichern: Rate Limiting (20/h), Input-Validierung, Prompt-Schutz, Client-Logs bereinigt
- [x] Quick Wins: Gesundheits-UX (Tab umbenannt, Add-Buttons, toter Code weg)
- [x] Quick Wins: Theme-Farben konsistent (10 Screens, neuer overlayLight-Token)
- [x] Quick Wins: Security — debug-Felder aus Edge Function entfernt
- [x] Quick Wins: Inkonsistente Farben bereinigt
- [x] AI-Assistent: Edge Function deployed + funktioniert (JWT-Workaround + Modell-Fix)
- [x] AI-Assistent: ANTHROPIC_API_KEY als Secret gesetzt
- [x] AI-Assistent: Komplett-Redesign (Hero-Badge, Feature-Cards, Chat-Bubbles, Input-Bar)
- [x] AI-Assistent: Eigener Tab (Position 3, Mitte) in Bottom-Navigation
- [x] AI-Assistent: QA-Findings gefixt (Race Condition, Retry, Paywall-Crash)
- [x] Profil-Tab entfernt, Profil ueber HomeScreen-Header erreichbar
- [x] ProfileScreen: Back-Button + Touch-Targets 44px
- [x] ProfileScreen: "Kommt bald" Text aktualisiert
- [x] navigation.md Regel aktualisiert
- [x] Paket 3: AI-Assistent (Claude, Premium-only, Chat-UI + Edge Function)
- [x] K1: Supabase-Credentials in .env auslagern
- [x] K2: user!.id Non-Null-Assertion in completeReminder
- [x] M5: Dev-Toggle entfernen (Security)
- [x] D6: getAge() dedupliziert + Fallback
- [x] Temp-Bild entfernt
- [x] M2: Datums-Validierung — parseGermanDate() zentral
- [x] D3: SelectField-Komponente extrahiert
- [x] D2/Paket 4: Tote Buttons gefixt
- [x] Paket 1: Haustier bearbeiten (updatePet + Edit-Modus)
- [x] M1/M6: Storage-URLs refactored (Pfad statt signed URL)
- [x] Paket 5: Loading/Error-States + Doppel-Submit-Schutz
- [x] Paket 2: Ueberfaellig-Regeln aktivieren (Notifications)

---
Zuletzt aktualisiert: 2026-04-04
