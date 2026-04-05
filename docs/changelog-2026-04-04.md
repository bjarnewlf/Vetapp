# Changelog — 04. April 2026

## Zusammenfassung

Intensiver Sprint-Tag mit zwei grossen Arbeitsbloecken. Vormittags: Stabilitaet und Features — Error-Handling flaechendeckend eingefuehrt, Pet-Fotos fertiggestellt, Erinnerungs-Einstellungen aktiviert, 11 QA-Findings gefixt. Nachmittags: visueller Aufwertungs-Sprint — 8 Design-Verbesserungen umgesetzt, danach erste Animations-Implementierungen. Die App ist jetzt bereit fuer den Handy-Test vor Phase-2-Abschluss.

---

## Neue Features

### Pet-Fotos in Supabase Storage
- **Was:** Haustiere koennen jetzt ein Profilfoto haben. Foto wird beim Anlegen oder Bearbeiten hochgeladen, in Supabase Storage gespeichert und als Signed URL geladen.
- **Warum:** War als Feature im Angebot enthalten, aber noch nicht umgesetzt.
- **Details:** Storage-Pfad wird in der DB gespeichert (nicht die URL), Signed URLs werden on-demand generiert — damit bleiben Fotos auch nach App-Neustart erreichbar. Beim Loeschen eines Tieres wird das Foto automatisch mitgeloescht.
- **Dateien:** `src/utils/fileUpload.ts` (neu), `src/context/PetContext.tsx`, `src/screens/AddPetScreen.tsx`, `src/screens/PetDetailScreen.tsx`

### Erinnerungs-Einstellungen aktiviert
- **Was:** Der ReminderSettings-Screen ist jetzt funktionsfaehig — die eingestellten Regeln (z.B. ab wann eine Erinnerung als "ueberfaellig" gilt) wirken sich tatsaechlich auf die Anzeige aus.
- **Warum:** Die UI existierte schon, war aber nicht an die Logik angebunden.
- **Dateien:** `src/hooks/useOverdueSettings.ts` (neu), `src/screens/ReminderSettingsScreen.tsx`, `src/screens/RemindersScreen.tsx`

---

## Stabilitaet & Fehlerbehebung

### Error-Handling flaechendeckend eingefuehrt
- **Was:** Alle CRUD-Methoden in den drei Haupt-Contexts geben jetzt `boolean` zurueck. Screens pruefen das Ergebnis und navigieren nur bei Erfolg zurueck. Fehler werden als Alert angezeigt.
- **Warum:** Bisher konnte ein Speicher-Fehler unbemerkt bleiben — der User sah keinen Hinweis und wunderte sich, warum seine Eingabe verschwunden war.
- **Umfang:** 16 CRUD-Aufrufe in 3 Contexts angepasst.
- **Dateien:** `src/context/PetContext.tsx`, `src/context/MedicalContext.tsx`, `src/context/VetContactContext.tsx`, alle Formular-Screens

### QA-Runde 4 — 7 Findings behoben
- **F-014:** storagePath-Fallback fuer aeltere Dokumente ohne Storage-Pfad
- **F-016:** Dropped Promise in RemindersScreen (unbehandelte async-Operation)
- **F-017:** Guard fuer leere petId in AddEventScreen (verhinderte Absturz)
- **F-018:** Error-Handling im OnboardingScreen fehlte komplett
- **F-020:** WelcomeScreen.tsx geloescht (toter, nie erreichbarer Code)
- **F-021:** "Anrufen"-Button im Tierarzt-Screen nur anzeigen wenn Telefonnummer vorhanden
- **Demo-Checklist** erstellt — Uebersicht was vor dem Kunden-Demo geprueft werden muss

### QA-Runde 5 — 3 Findings behoben
- **F-023:** Foto-Upload im Onboarding wurde nicht korrekt an den Context weitergegeben
- **F-024:** Falscher Navigate-Parameter beim Oeffnen von "Behandlung hinzufuegen" aus PetDetail
- **F-025:** Verwaiste Style-Definitionen nach EmptyState-Umstellung entfernt

---

## Design

### Gradient Header im HomeScreen
- **Was:** Der HomeScreen-Header hat jetzt einen Farbverlauf (expo-linear-gradient) statt einer Flachfarbe.
- **Dateien:** `src/screens/HomeScreen.tsx`, `package.json` (neues Package: expo-linear-gradient)

### Pet-Hero-Banner im PetDetailScreen
- **Was:** Oben im Tier-Profil erscheint jetzt ein grosses Foto (oder ein grosses Icon falls kein Foto vorhanden) mit Gradient-Overlay.
- **Dateien:** `src/screens/PetDetailScreen.tsx`

### AI-Card visuell aufgewertet
- **Was:** Die KI-Assistenten-Karte auf dem HomeScreen sieht jetzt wie ein Premium-Feature aus — mit Badge und klarem Call-to-Action.
- **Dateien:** `src/screens/HomeScreen.tsx`

### Neue UI-Komponenten
- **EmptyState:** Einheitliche Darstellung fuer leere Listen — mit Emoji, erklaerenden Text und optionalem Aktions-Button. Ersetzt ad-hoc Loesungen in mehreren Screens.
- **SkeletonLoader:** Animierter Shimmer-Effekt als Ladezustand, ersetzt den einfachen Spinner.
- **Dateien:** `src/components/EmptyState.tsx` (neu), `src/components/SkeletonLoader.tsx` (neu), `src/components/index.ts`

### Card-Varianten formalisiert
- **Was:** Die Card-Komponente hat jetzt eine `variant`-Prop: `default`, `tinted`, `warning`, `error`.
- **Dateien:** `src/components/Card.tsx`, `src/theme/colors.ts` (5 neue Tokens)

### Display-Typografie
- **Was:** Zwei neue Schriftgroessen fuer emotionale Momente: `display` (38px) und `displaySmall` (28px) — z.B. fuer Begruessung oder Tier-Namen.
- **Dateien:** `src/theme/typography.ts`

### KI-Disclaimer dezenter
- **Was:** Der Hinweistext unter dem KI-Chat wurde gekuerzt und das Icon entfernt — weniger aufdringlich, bleibt aber lesbar.
- **Dateien:** `src/screens/AIAssistantScreen.tsx`

---

## Animationen

### Erste Animationen implementiert (Tier 1)
- **Was:** Vier Animations-Typen mit Reacts eingebautem `Animated`-API umgesetzt — ohne neue Packages.
  - **Fade-In:** HomeScreen und AIAssistantScreen blenden beim Oeffnen sanft ein
  - **Scale-Feedback:** Tippen auf Pet-Cards und die AI-Card gibt haptisches Feedback durch kurzes Einfedern
  - **Tab-Slide:** Der aktive Tab-Indikator im PetDetailScreen gleitet smooth zwischen den Tabs
  - **Pulse:** Der "Ueberfaellig"-Banner pulst einmalig beim Erscheinen
- **Neue Hilfsdateien:**
  - `src/hooks/useFadeIn.ts` — konfigurierbarer Fade-In Hook
  - `src/components/AnimatedPressable.tsx` — wiederverwendbarer Pressable mit Scale-Feedback
- **Dateien:** `src/hooks/useFadeIn.ts` (neu), `src/components/AnimatedPressable.tsx` (neu), `src/screens/HomeScreen.tsx`, `src/screens/PetDetailScreen.tsx`, `src/screens/AIAssistantScreen.tsx`

---

## Infrastruktur (Claas, manuell)

### Datenbank-Migrationen deployed
- `medical_events`-Tabelle erstellt, Daten aus alten Tabellen migriert
- `recurrence_check`-Constraint hinzugefuegt

### Edge Function aktualisiert
- `ai-chat` Edge Function mit neuem `medicalHistory`-Format deployed

### Storage-Policy
- Bucket-Policy fuer Pet-Fotos im SQL-Editor eingerichtet

---

## Statistik

| Metrik | Wert |
|--------|------|
| Commits | 6 (Code + Docs) |
| Dateien geaendert | ~36 |
| Zeilen hinzugefuegt | ~1.716 |
| Zeilen entfernt | ~595 |
| Neue Dateien | 6 (`fileUpload.ts`, `useOverdueSettings.ts`, `EmptyState.tsx`, `SkeletonLoader.tsx`, `useFadeIn.ts`, `AnimatedPressable.tsx`) |
| Geloeschte Dateien | 1 (`WelcomeScreen.tsx`) |
| QA-Findings behoben | 10 (F-014 bis F-025) |
| Design-Verbesserungen | 8 |
| Animations-Typen | 4 |
| Neues Package | `expo-linear-gradient` |

---

## Offene Punkte

- **Handy-Test steht aus** — App laeuft auf localhost:8081, alle Flows muessen auf echtem Geraet geprueft werden
- **notification_id Migration** fuer Reminders-Tabelle muss noch deployed werden
- **Alte Tabellen droppen** — `vaccinations` und `treatments` nach erfolgreichem Handy-Test
- **Package-Versionen** aktualisieren (Expo-Kompatibilitaet)
- Phase-2-Demo fuer den Kunden, dann Phase-2-Zahlung ausloesen
- TS-Fehler in `PetDetailScreen.tsx` (vorbestehend, StyleSheet mit vielen Keys — `tabIndicator`)
- ProfileScreen: "Datenschutz" und "Hilfe" noch ohne Handler
