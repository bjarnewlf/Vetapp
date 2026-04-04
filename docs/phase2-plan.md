# VetApp Phase 2 — MVP fertigstellen

Erstellt: 2026-04-03
Status: Wartet auf Freigabe von Claas

---

## Arbeitspakete

### Paket 1 — Haustier bearbeiten (Klein, ~3-4h)
**Spezialist:** Developer

- AddPetScreen um Edit-Modus erweitern (Route-Param `petId?`)
- DataContext: neue Funktion `updatePet()`
- PetDetailScreen: "Bearbeiten"-Button im Header
- Kein neuer Screen noetig

**Dateien:**
- src/context/DataContext.tsx
- src/screens/AddPetScreen.tsx
- src/screens/PetDetailScreen.tsx

**Akzeptanz:**
- User kann von PetDetail auf "Bearbeiten" tippen
- Formular ist mit aktuellen Daten vorbelegt (inkl. Foto)
- Nach Speichern sieht User aktualisierte Daten
- TypeScript fehlerfrei

---

### Paket 2 — Ueberfaellig-Regeln aktivieren (Klein-Mittel, ~4-5h)
**Spezialist:** Developer

- ReminderSettingsScreen speichert Auswahl in AsyncStorage, aber nichts liest den Wert aus
- Bei jedem App-Start: ueberfaellige Reminders pruefen, je nach Regel (nie/taeglich/woechentlich/custom) neue Notifications planen
- App-Start-Pruefung (kein Background-Task) — reicht fuer MVP
- ReminderSettingsScreen: bei "custom" ein Zahlen-Input anzeigen

**Dateien:**
- src/services/notifications.ts — neue Funktion `scheduleOverdueNotifications()`
- src/screens/ReminderSettingsScreen.tsx — Storage-Key teilen, Custom-Input
- src/context/DataContext.tsx — am Ende von `refresh()` aufrufen

**Akzeptanz:**
- "never": keine zusaetzlichen Notifications
- "daily": Notification fuer naechsten Tag bei ueberfaelligen Reminders
- "weekly": analog, 7 Tage spaeter
- "custom": User kann Tage eingeben
- TypeScript fehlerfrei

---

### Paket 3 — AI-Assistent (Gross, ~8-12h)
**Spezialisten:** Designer (Chat-UI) -> Developer (Implementierung) -> QA

**Architektur:**
- Neuer AIAssistantScreen (Chat-Interface)
- Supabase Edge Function als API-Proxy (kein API-Key im Client!)
- Claude Haiku als AI-Provider (gutes Deutsch, guenstiger Preis)
- AI kennt die Tiere des Users (Name, Art, Rasse, Alter)
- Premium-Feature: Free-User sehen Paywall-CTA
- Disclaimer: kein Ersatz fuer Tierarzt
- Chat-Historie nur pro Session (kein Persist fuer MVP)

**Dateien:**
- NEU: src/screens/AIAssistantScreen.tsx
- NEU: src/services/aiService.ts
- NEU: Supabase Edge Function (separat deployen)
- src/screens/index.ts — Export hinzufuegen
- src/navigation/AppNavigator.tsx — Stack-Screen registrieren
- src/screens/ProfileScreen.tsx — Teaser funktional machen
- src/screens/HomeScreen.tsx — optional CTA

**Akzeptanz:**
- Premium-User koennen Chat oeffnen und Fragen stellen
- Free-User sehen Paywall
- AI antwortet auf Deutsch, kennt die Tiere
- Fehler werden verstaendlich angezeigt
- TypeScript fehlerfrei

---

### Paket 4 — Tote Buttons fixen (Klein, ~2-3h)
**Spezialist:** Developer

- Behandlungen-Button in PetDetail: kein TouchableOpacity mehr, nur Info-View
- Stift-Icon in ProfileScreen: einfachen Name-Edit implementieren
- "Premium ansehen": Navigation zur Paywall
- Datenschutz/Support: "Kommt bald"-Alert

**Dateien:**
- src/screens/PetDetailScreen.tsx
- src/screens/ProfileScreen.tsx

**Akzeptanz:**
- Kein Button ohne funktionalen onPress-Handler
- Jedes interaktive Element tut etwas Sinnvolles

---

### Paket 5 — Loading/Error-States + Doppel-Submit-Schutz (Klein, ~3-4h)
**Spezialist:** Developer

- DataContext: Mutations werfen Fehler statt sie zu schlucken
- Button-Komponente: `disabled` und `loading` Props
- Alle Save-Buttons: `saving`-State, try/catch, Alert bei Fehler

**Dateien:**
- src/context/DataContext.tsx
- src/components/Button.tsx
- src/screens/AddPetScreen.tsx
- src/screens/AddReminderScreen.tsx
- src/screens/AddEventScreen.tsx
- src/screens/AddVetContactScreen.tsx

**Akzeptanz:**
- Save-Button deaktiviert + Spinner waehrend Save
- Fehlermeldung bei Supabase-Fehlern
- Kein Doppel-Submit moeglich
- TypeScript fehlerfrei

---

### Paket 6 — QA-Review (3-4h)
**Spezialist:** QA

- `npx tsc --noEmit` fehlerfrei
- Alle neuen Flows durchspielen
- Edge Cases: AI (leere Nachricht, Netzwerkfehler), Edit (alle Felder), Overdue
- Doppel-Submit testen
- Premium-Gates pruefen
- Tote Buttons pruefen

---

## Reihenfolge

Pakete 1, 2, 4, 5 → parallel (unabhaengig)
Paket 3 (AI) → eigener Block (Designer -> Developer -> QA)
Paket 6 (QA) → am Ende ueber alles

## Entscheidungen (geklaert 2026-04-03)

| # | Frage | Entscheidung | Begruendung |
|---|-------|--------------|-------------|
| 1 | AI-Provider | Claude Haiku (Anthropic) | Besseres Deutsch, gleiches Oekosystem |
| 2 | AI als Premium-only | Ja | Kostenkontrolle + Premium-Anreiz |
| 3 | Chat-Historie speichern | Nein, nur Session | MVP-Scope, spaeter nachruestbar |
| 4 | Supabase Edge Functions Plan | Free reicht | Erst bei Launch oder Speicherengpass upgraden |
