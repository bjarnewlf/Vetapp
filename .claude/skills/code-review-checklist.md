# Skill: Code-Review Checkliste

## Wann
Bei jedem Review-Auftrag von Brian. QA arbeitet diese Liste systematisch ab.

## Checkliste

### 1. TypeScript
- [ ] `npx tsc --noEmit` fehlerfrei
- [ ] Keine `any`-Types ohne Begruendung
- [ ] Keine Non-Null-Assertions (`!`) ohne Absicherung

### 2. Datenvalidierung
- [ ] User-Inputs werden validiert bevor sie in die DB gehen
- [ ] Leere Strings, undefined, null werden behandelt
- [ ] Datums-Parsing nutzt `parseGermanDate()` (zentrale Funktion)

### 3. Security
- [ ] Keine Credentials im Code (alles in .env)
- [ ] Supabase-Queries sind durch RLS geschuetzt
- [ ] Auth-State wird korrekt geprueft

### 4. Error Handling
- [ ] Async-Operationen haben try/catch
- [ ] Fehler werden dem User angezeigt (nicht verschluckt)
- [ ] Loading-States sind vorhanden

### 5. Konsistenz
- [ ] Theme-Tokens statt Inline-Werte (Farben, Spacing)
- [ ] Bestehende Components wiederverwendet (Button, Card, InputField, StatusBadge)
- [ ] Navigation-Patterns aus navigation.md eingehalten
- [ ] State-Management ueber Context (kein lokaler State fuer globale Daten)

### 6. Accessibility
- [ ] Touch-Targets mindestens 44px
- [ ] Labels auf interaktiven Elementen
- [ ] Ausreichend Kontrast

## Output-Format

```
## Review: [Was wurde geprueft]

**TypeScript:** Bestanden / X Fehler
**Findings:** [Anzahl] (X Kritisch, Y Mittel, Z Niedrig)

### Findings
1. [Schwere] [Datei:Zeile] — Beschreibung + Fix-Vorschlag
2. ...

**Fazit:** [Ein Satz — Freigabe oder Nacharbeit noetig]
```
