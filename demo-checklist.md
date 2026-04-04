# Demo-Ready Checklist

> Was muss stehen, bevor wir dem Kunden die App zeigen (MVP-Demo)?
> Erstellt: 2026-04-04 | Status: QA + Design eingearbeitet

---

## BLOCKER — Demo nicht moeglich ohne das

### Infrastruktur (Claas)
- [ ] **DB-Migrationen deployen** — medical_events + recurrence_check auf Supabase Production
- [ ] **Edge Function deployen** — neues medicalHistory-Format, sonst KI-Assistent kaputt
- [ ] **notification_id Migration** — reminders-Tabelle braucht das Feld fuer Push-Notifications
- [ ] **Manuell testen** — MedicalEvent CRUD, Edit-Flow, ErrorBanner (nach Deploy)
- [ ] **App startet sauber** — kein Crash, kein White Screen, alle Tabs erreichbar

### Code-Fixes (Agentur)
- [ ] **F-015: Error-Swallowing in Contexts** — CRUD-Methoden verschlucken Fehler still, Screens navigieren zurueck auch bei Fehler. User denkt "gespeichert" aber nichts passiert. MUSS MIT CLAAS BESPROCHEN WERDEN (Pattern-Aenderung, potenziell viele Dateien)
- [ ] **F-017: Guard fuer leere petId** — AddEventScreen kann Event mit leerem pet_id speichern → WIRD GEFIXT
- [ ] **F-018: Onboarding Error-Handling** — addPet() ohne try/catch, User glaubt Tier gespeichert → WIRD GEFIXT

### UI-Fixes (alle klein, ~halber Tag)
- [ ] **Leerer Screen bei Nicht-Pro im KI-Tab** — AIAssistantScreen zeigt kurz weisse Flaeche waehrend Paywall-Redirect
- [ ] **Card shadowColor hardcoded** — Card.tsx verwendet `#000` statt `colors.cardShadow`
- [ ] **Gesundheits-Sektionen ohne Trennung** — PetDetailScreen: Kategorien fliessen visuell ineinander
- [ ] **Inline-Styles im AIAssistantScreen** — Loading-State ohne StyleSheet

## SOLLTE REIN — deutlich besserer Eindruck

### Features
- [ ] **Pet-Fotos in Storage** (F-08) — Fotos ueberleben Neuinstallation nicht
- [ ] **Demo-Daten vorbereiten** — Beispiel-Tier mit Events, Erinnerungen, Dokumenten

### UI/UX (Designer-Empfehlung)
- [ ] **DatePicker statt Textfeld** — AddEventScreen: manuelles Datum-Tippen wirkt unpoliert (Aufwand: mittel)
- [ ] **Hero-Bild im PetDetail-Header** — Tierfoto nur 64x64, grosses Header-Bild waere eindrucksvoller (Aufwand: mittel)
- [ ] **KI-Disclaimer dezenter** — gelber Warnstreifen permanent sichtbar, untergräbt Vertrauen (Aufwand: klein)
- [ ] **Tier-Icons differenzieren** — HomeScreen zeigt nur Hund/Nicht-Hund (Aufwand: klein)
- [ ] **Error-Handling sichtbar** — ErrorBanner in allen relevanten Screens pruefen
- [ ] **Anrufen-Button nur mit Nummer** — VetContactScreen zeigt Button auch bei leerer Nummer → WIRD GEFIXT

## KANN FAKEN / WORKAROUND — fuer Demo akzeptabel

- [ ] **togglePro()** (F-02) — fuer Demo reicht der Dev-Toggle, IAP ist Post-MVP
- [ ] **CORS** (F-03) — nur relevant fuer Web, native Demo braucht das nicht
- [ ] **Chat-Historie** — Session-basiert ist OK fuer eine Demo
- [ ] **EAS Build** — Demo via Expo Go auf dem Geraet reicht
- [ ] **ReminderSettings** (F-022) — Einstellungen werden gespeichert aber nie gelesen. Feature-Stub, fuer Demo irrelevant

## NICHT NOETIG FUER DEMO — erst spaeter

- IAP / echter Kaufprozess
- Dark Mode, Custom Font (Inter)
- Micro-Animationen (kein Reanimated fuers MVP)
- Accessibility-Audit (Labels, SafeAreaView)
- Test-Suite
- Deno std Update
- App Store Submission
- StatusBadge-Nutzung ausbauen

## ERLEDIGT (diese Session)

- [x] **F-014: storagePath Fallback** — toter `?? fileUrl` Fallback entfernt
- [x] **F-016: Dropped Promise** — RemindersScreen completeReminder() → WIRD GEFIXT
- [x] **F-020: Toter Code** — WelcomeScreen.tsx nirgends eingebunden → WIRD GELOESCHT

---

## Offene Fragen an Claas

1. Auf welchem Geraet zeigen wir die Demo? (Expo Go? EAS Build? Web?)
2. Brauchen wir einen Demo-Account mit vorbereiteten Daten?
3. Welche Features sollen im Vordergrund stehen? (KI-Assistent? Health-Tracking? Erinnerungen?)
4. Zeitrahmen — wann ist die Demo?
5. **F-015 besprechen:** Error-Swallowing in Contexts — wie wollen wir das loesen? (Pattern-Aenderung)

---

> Zuletzt aktualisiert: 2026-04-04
