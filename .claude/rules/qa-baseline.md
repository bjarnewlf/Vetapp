---
paths:
  - "**/*"
---

# QA Baseline

## Wann QA laeuft

QA laeuft NACH der Delegation — nie parallel zur Feature-Entwicklung.
Wenn Brian eine Aufgabe abschliesst, prueft er das Ergebnis bevor er es als erledigt markiert.

## Minimum-Checks

Jede QA-Runde umfasst mindestens:

1. **TypeScript-Check** — `npx tsc --noEmit` muss fehlerfrei durchlaufen
2. **Funktionstest** — das implementierte Feature manuell oder per Script pruefen
3. **Findings dokumentieren** — alle Auffaelligkeiten in `qa-findings.md` festhalten

## Finding-Format

Findings werden in `qa-findings.md` im Projektroot dokumentiert:

```
### QA-XXX — [Kurztitel]
- **Schwere:** Kritisch / Mittel / Niedrig
- **Beschreibung:** Was ist das Problem?
- **Wo:** Datei(en) und Zeilen/Bereich
- **Fix:** Vorgeschlagene Loesung
- **Entscheidung:** Offen / Gefixt / Akzeptiert / Zurueckgestellt
```

## Eskalation nach Schwere

| Schwere | Wer entscheidet | Vorgehen |
|---------|----------------|----------|
| **Kritisch** | Claas | Brian bespricht das Finding mit Claas bevor weitergearbeitet wird. Blockiert den Release. |
| **Mittel** | Brian | Brian entscheidet eigenstaendig ob Fix noetig ist oder akzeptabel. Dokumentiert die Entscheidung. |
| **Niedrig** | Brian | Direkt fixen, kein Rueckfrage-Overhead. |

## Regeln

- Kein Feature gilt als "fertig" ohne QA-Durchlauf
- TypeScript-Fehler sind immer Kritisch
- Wenn QA Findings produziert, werden diese in tasks.md als SOFORT oder DIESE WOCHE eingeplant
- QA-Findings die zurueckgestellt werden brauchen eine Begruendung
