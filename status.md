# Projektstatus

> Brian liest diese Datei beim Start jeder Session.

## Aktueller Stand (03.04.2026)

**App:** React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

**Was funktioniert:**
- Auth (Supabase Auth), Haustier-CRUD inkl. Bearbeiten, Dokumente mit Storage
- Impfungen + Behandlungen erfassen, Erinnerungen mit Ueberfaellig-Erkennung
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent als eigener Tab (Chat-UI fertig, Edge Function fertig, NICHT deployed)
- Loading/Error-States, Doppel-Submit-Schutz, petHelpers, SelectField
- Bottom-Navigation: Home, Kalender, KI-Assistent, Tiere (Profil ueber HomeScreen-Header)

**Was NICHT deployed ist:**
- Edge Function `ai-chat` muss noch via `supabase functions deploy ai-chat` deployed werden
- `ANTHROPIC_API_KEY` muss als Supabase Secret gesetzt werden
- Ohne beides antwortet der KI-Assistent nicht

## Naechste Prioritaeten
1. Gesundheits-UX Overhaul (Tab umbenennen, MedicalEvent-Modell, Screens)
2. Edge Function deployen + API-Key setzen
3. Accessibility Basics vervollstaendigen (Labels, weitere Touch-Targets)
4. Farb-Konsistenz weiter haerten (Theme konsequent in allen Screens)

## Bekannte Probleme
- DataContext ist ein God-Object (~350 Zeilen) — Refactoring im Backlog
- ProfileScreen: "Datenschutz" + "Hilfe" Settings ohne Handler
- SelectField: Tap-outside schliesst nicht

## Architektur-Hinweise
- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- Premium-Gates via SubscriptionContext.isPro + useEffect-Navigation

## Letzte Aenderungen (03.04.2026, Session 2)
- KI-Assistent als eigener Tab (Position 3, Mitte) in Bottom-Navigation
- Profil-Tab entfernt — Profil jetzt ueber Icon im HomeScreen-Header
- AIAssistantScreen: hardcodierte Farben durch Theme-Tokens ersetzt
- Touch-Targets auf 44px angehoben, Kontrast verbessert
- ProfileScreen "Kommt bald"-Text durch Produktionstext ersetzt

---
Zuletzt aktualisiert: 2026-04-03 19:30
