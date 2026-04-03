# Changelog — 03. April 2026

## Zusammenfassung

Umfangreicher Qualitaets- und Feature-Sprint. 16 Dateien geaendert, ca. 540 Zeilen neu, 500 Zeilen entfernt. Fokus auf Security-Fixes, Code-Deduplizierung, neue Features und bessere Fehlerbehandlung.

---

## Security & Housekeeping

### Dev-Toggle entfernt (M5)
- **Was:** Der Debug-Toggle zum manuellen Aktivieren des Premium-Modus wurde aus dem Profil-Screen entfernt.
- **Warum:** Security-Risiko — der Toggle war in der Production-Version sichtbar und ermoeglichte das Umgehen der Paywall.
- **Dateien:** `ProfileScreen.tsx` (JSX-Block + 7 Style-Definitionen + unused Imports entfernt)

### Temp-Bild entfernt
- **Was:** Eine verwaiste `.webp`-Datei im Projekt-Root wurde geloescht.
- **Dateien:** `227d64a25639f660b6ba6ad086f0b85c.webp` (geloescht)

---

## Code-Qualitaet & Refactoring

### getAge() dedupliziert (D6)
- **Was:** Die Funktion `getAge()` war identisch in zwei Screens definiert und lieferte "NaN Jahre" bei leerem Geburtsdatum.
- **Loesung:** Zentrale Funktion in `src/utils/petHelpers.ts` mit Fallback auf "Alter unbekannt" bei ungueltigen Eingaben.
- **Dateien:** `petHelpers.ts` (neu), `PetDetailScreen.tsx`, `MyPetsScreen.tsx`

### Datums-Validierung zentralisiert (M2)
- **Was:** In 5 Screens wurde `tt.mm.jjjj`-Eingabe manuell per `split('.')` geparst — ohne Validierung. Ungueltige Daten wie "31.02.2026" wurden stillschweigend akzeptiert.
- **Loesung:** Neue Funktion `parseGermanDate()` in `petHelpers.ts`. Prueft Format, Wertebereiche und kalendarische Gueltigkeit. Gibt `null` bei ungueltiger Eingabe zurueck.
- **Dateien:** `petHelpers.ts`, `AddEventScreen.tsx`, `EventDetailScreen.tsx`, `AddReminderScreen.tsx`, `AddPetScreen.tsx`, `OnboardingScreen.tsx`

### SelectField-Komponente extrahiert (D3)
- **Was:** Der Custom-Picker (Dropdown mit Toggle-State, Optionsliste, Styles) war 4x identisch kopiert.
- **Loesung:** Neue wiederverwendbare `SelectField`-Komponente mit `label`, `placeholder`, `value`, `options`, `onSelect` und `rightElement`-Props. Ca. 240 Zeilen duplizierter Code entfernt.
- **Dateien:** `SelectField.tsx` (neu), `components/index.ts`, `AddPetScreen.tsx`, `AddEventScreen.tsx`, `AddReminderScreen.tsx`, `OnboardingScreen.tsx`

---

## Neue Features

### Haustier bearbeiten (Paket 1)
- **Was:** User koennen jetzt bestehende Haustiere bearbeiten — bisher war nur Hinzufuegen und Loeschen moeglich.
- **Umsetzung:**
  - `updatePet()` in DataContext implementiert (Supabase Update mit camelCase→snake_case Mapping)
  - `AddPetScreen` erkennt Edit-Modus via `route.params.pet` und fuellt alle Felder vor
  - Titel und Button-Text passen sich an ("Tier bearbeiten" / "Aenderungen speichern")
  - `PetDetailScreen` hat einen neuen Bearbeiten-Button (Stift-Icon) im Header
- **Dateien:** `DataContext.tsx`, `AddPetScreen.tsx`, `PetDetailScreen.tsx`

### Tote Buttons aktiviert (Paket 4)
- **Was:** Drei Buttons in der App hatten keinen oder einen leeren `onPress`-Handler.
- **Fixes:**
  - PetDetail: "Behandlung hinzufuegen"-Button navigiert zu AddEvent mit vorausgewaehltem Typ `checkup`
  - ProfileScreen: Bleistift-Icon zeigt "In Entwicklung"-Alert
  - ProfileScreen: "Premium-Funktionen ansehen" navigiert zur Paywall
- **Dateien:** `PetDetailScreen.tsx`, `ProfileScreen.tsx`, `AddEventScreen.tsx` (eventType-Auswertung)

---

## Stabilitaet & UX

### Storage-URLs refactored (M1/M6)
- **Was:** Dokument-URLs wurden als signed URLs mit Ablaufdatum in der Datenbank gespeichert. Beim Loeschen wurde der Storage-Pfad ueber ein fragiles Regex aus der URL extrahiert.
- **Loesung:**
  - Neue Dokumente speichern den Storage-Pfad direkt in der DB
  - Signed URLs werden on-demand generiert (1h Gueltigkeit) beim Oeffnen
  - Loeschen nutzt den Pfad direkt — kein Regex mehr
  - Bestehende Dokumente funktionieren ueber Fallback weiterhin
- **Dateien:** `DataContext.tsx`, `PetDetailScreen.tsx`, `types/index.ts` (neues `storagePath`-Feld)

### Loading-States + Doppel-Submit-Schutz (Paket 5)
- **Was:** Bei langsamer Verbindung konnte man mehrfach auf "Speichern" tippen und Duplikate erzeugen. Kein visuelles Feedback beim Speichern.
- **Loesung:**
  - Alle 5 Formular-Screens haben `saving`-State mit `if (saving) return`-Guard
  - Buttons zeigen "Wird gespeichert..." und sind disabled waehrend des Speicherns
  - Fehler werden als Alert angezeigt (try/catch um alle async-Operationen)
  - `Button`-Komponente unterstuetzt neue `disabled`-Prop (opacity 0.5)
- **Dateien:** `Button.tsx`, `AddPetScreen.tsx`, `AddEventScreen.tsx`, `AddReminderScreen.tsx`, `EventDetailScreen.tsx`, `AddVetContactScreen.tsx`

---

## Statistik

| Metrik | Wert |
|--------|------|
| Commits | 5 |
| Dateien geaendert | 16 |
| Zeilen hinzugefuegt | ~540 |
| Zeilen entfernt | ~500 |
| Neue Dateien | 2 (`SelectField.tsx`, `petHelpers.ts`) |
| Geschlossene Audit-Findings | M1, M2, M5, M6, D3, D6 |
| Geschlossene Feature-Pakete | Paket 1, 4, 5 |

---

## Offene Punkte

- Paket 2: Ueberfaellig-Regeln aktivieren (Notifications)
- D1: Accessibility Basics (Labels, Touch-Targets)
- D4: Inkonsistente Farben — Theme konsequent nutzen
- SelectField: Tap-outside zum Schliessen (QA-Finding)
- ProfileScreen: Settings-Items "Datenschutz" + "Hilfe" noch ohne Handler
