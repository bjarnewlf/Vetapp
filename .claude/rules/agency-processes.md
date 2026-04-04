---
paths:
  - ".claude/agents/brian.md"
---

# Agentur-Prozesse (nur Brian)

Diese Prozesse sind Brians Verantwortung. Spezialisten muessen sie nicht kennen.

## Entscheidungskompetenz (Autonomie Level 2)

### Brian handelt eigenstaendig:
- Welcher Spezialist einen Auftrag bekommt
- Reihenfolge der Delegation
- Tasks aus "SOFORT" abarbeiten (bereits von Claas priorisiert)
- QA-Findings "Niedrig" direkt fixen lassen
- QA-Findings "Mittel" fixen wenn risikoarm (< 3 Dateien)
- Kleine Refactorings (< 3 Dateien) nach QA-Empfehlung
- Committen wenn TypeScript clean + keine kritischen QA-Findings
- Alle Dokumentation (handoff, tasks, status, vault, learnings)

### Brian fragt Claas:
- Neue Features — immer Plan zeigen
- Architektur-Aenderungen (Datenmodell, Dependencies, Navigation)
- QA-Findings "Kritisch" — Claas entscheidet Fix-Strategie
- Scope-Erweiterungen ("Das Feature braucht eigentlich auch X")
- Aenderungen > 5 Dateien

### Brian informiert Claas nachtraeglich:
- Zusammenfassung was eigenstaendig erledigt wurde
- Beim naechsten Kontakt oder im Handoff

## QA-Findings Workflow

Jedes QA-Finding braucht eine **explizite Entscheidung**. Stilles Verschieben in den Backlog ist nicht erlaubt.

### Ablauf

1. QA schreibt Findings in `qa-findings.md` (hat Write-Zugriff darauf)
2. Brian liest `qa-findings.md` nach jedem QA-Review
3. Brian entscheidet nach Schwere:
   - **Niedrig:** Brian entscheidet selbst → direkt fixen lassen
   - **Mittel:** Brian entscheidet selbst wenn risikoarm (< 3 Dateien), sonst Claas fragen
   - **Kritisch:** Brian bespricht mit Claas → Claas entscheidet Fix-Strategie
4. Brian traegt die Entscheidung in `qa-findings.md` und `tasks.md` ein

## Uebergabeprotokoll (handoff.md)

Damit Zwischenschritte nicht verloren gehen — wie beim Schichtwechsel.

### Regeln

- **Developer und Designer** aktualisieren `handoff.md` bevor sie fertig sind
- **QA** schreibt in `qa-findings.md`, Brian uebernimmt Zusammenfassung in `handoff.md`
- **Brian** liest `handoff.md` bei jedem Session-Start als erstes
- **Dokumentar** raeumt alte Eintraege auf, sobald sie im Changelog erfasst sind

### Format eines Eintrags

```
## Aktuelle Uebergabe

**Agent:** [Name]
**Zeitpunkt:** [YYYY-MM-DD HH:MM]
**Auftrag:** [Was war der Auftrag?]

### Erledigt
- [Was wurde gemacht, konkret]

### Offen / Nicht fertig
- [Was noch fehlt, warum]

### Naechster Schritt
- [Was sollte als naechstes passieren, wer sollte es tun]

### Wichtig fuer den Naechsten
- [Stolperfallen, Abhaengigkeiten, Entscheidungen die getroffen wurden]
```

### Lebenszyklus

1. Agent arbeitet → schreibt Uebergabe in `handoff.md` (Bereich "Aktuelle Uebergabe")
2. Naechster Agent startet → vorherige Uebergabe rutscht nach "Vorherige Uebergaben"
3. Commit wird gemacht → `handoff.md` wird mitcommittet
4. Dokumentar laeuft → alte Eintraege werden aufgeraeumt

## Agency-Vault (Obsidian)

Das zentrale Langzeitgedaechtnis der Agentur. Ein Obsidian-Vault mit vernetzten Markdown-Notizen.

**Pfad:** `D:\Agency-Vault\`

### Struktur

| Ordner | Inhalt |
|---|---|
| `Projekte/` | Projekt-Hub-Notizen (z.B. VetApp.md) — zentraler Einstiegspunkt |
| `Learnings/` | Erkenntnisse als vernetzte Notizen |
| `Entscheidungen/` | Architektur- und Prozess-Entscheidungen mit Kontext |
| `Features/` | Feature-Dokumentation |
| `Technik/` | Technologie-Wissen (Supabase, React Native, etc.) |
| `Architektur/` | Patterns und Konventionen |
| `Agentur/` | Agent-Profile, Workflows |
| `Chronik/` | Session- und Sprint-Zusammenfassungen |
| `Inbox/` | Unsortiertes |
| `_Templates/` | Vorlagen fuer neue Notizen |

### Wer macht was

- **Brian liest** den Vault selbst — `Projekte/VetApp.md` beim Start, weitere Notizen bei Bedarf
- **Wissensmanager schreibt** — Nur er legt Notizen an, ergaenzt Links und verdichtet das Netz
- **Alle Agents duerfen lesen** — Jeder Agent kann bei Bedarf im Vault nachschlagen

### Vault = Quelle der Wahrheit

- Der Vault ist das ausfuehrliche Langzeitgedaechtnis
- `learnings.md` im Projekt ist nur ein Index (Einzeiler pro Learning)
- Bei Widerspruechen gilt der Vault
