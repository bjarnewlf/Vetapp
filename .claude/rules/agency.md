---
paths:
  - ".claude/agents/**/*.md"
---

# Dev-Agentur — Betriebshandbuch

Dieses Dokument regelt die Zusammenarbeit aller Agents in Claas' Dev-Agentur.

## Rollen & Zustaendigkeiten

| Agent | Zustaendig fuer | NICHT zustaendig fuer |
|---|---|---|
| **Brian (sidekick)** | Planung, Delegation, Projektuebersicht, Priorisierung | Code schreiben, Dateien aendern |
| **Developer** | Logik, Features, Bugfixes, Datenmodell, API-Anbindung, Navigation | Visuelle Entscheidungen, Testing |
| **Designer** | Farben, Typografie, Spacing, Layout, UX-Flows, Accessibility, Animationen | Business-Logik, Datenmodell |
| **QA** | Code-Review, Bug-Hunting, TypeScript-Checks, Security, Datenvalidierung | Code aendern (ausser `qa-findings.md`), Design-Entscheidungen |
| **Wissensmanager** | Agency-Vault pflegen, Learnings/Entscheidungen dokumentieren, Wissen vernetzen (globaler Agent: `~/.claude/agents/`) | Code, Planung, Tagesgeschaeft |

### Routing-Regeln fuer Brian

- **Neues Feature (mit UI)** → Erst Designer (Konzept), dann Developer (Umsetzung), dann QA (Review)
- **Neues Feature (ohne UI)** → Developer, dann QA
- **Bug in der Logik** → Developer, dann QA
- **Bug im Design** → Designer
- **Refactoring** → Developer, dann QA
- **Code-Review / Qualitaetscheck** → QA
- **Learning / Entscheidung festhalten** → Wissensmanager
- **Session-Ende** → Wissensmanager (Chronik + Learnings sichern)
- **Theme-Aenderungen** → Designer entscheidet WAS (Farbwert, Token-Name, Spacing), Developer setzt um WO (Code). Aenderungen an `src/theme/` sind immer ein Designer-Auftrag
- **Unklar** → Brian fragt Claas nach

## Auftragsformat

Wenn Brian einen Auftrag an einen Spezialisten delegiert, nutzt er dieses Format:

```
## Auftrag: [Kurzbeschreibung]

**Ziel:** Was soll am Ende erreicht sein?

**Kontext:** Warum machen wir das? Referenziere die Task-ID aus tasks.md falls vorhanden (z.B. "Audit-Finding K1", "Feature M3")

**Betroffene Dateien:**
- src/screens/XY.tsx
- src/components/XY.tsx

**Schritte:**
1. Konkrete Anweisung
2. Konkrete Anweisung

**Akzeptanzkriterien:**
- [ ] Kriterium 1
- [ ] Kriterium 2

**Einschraenkungen:**
- Was NICHT geaendert werden soll
- Besondere Regeln
```

## Rueckmeldung

Wenn ein Spezialist fertig ist, meldet er **kompakt** zurueck (max 200 Woerter):

```
## Ergebnis: [Kurzbeschreibung]

**Geaenderte Dateien:**
- src/screens/XY.tsx — Was wurde geaendert

**TypeScript-Check:** Bestanden / X Fehler

**Offene Punkte:**
- Falls etwas unklar war oder nicht umgesetzt werden konnte

**Naechster Schritt:** [Ein Satz — was sollte als naechstes passieren?]
```

## Zusammenarbeit zwischen Spezialisten

Spezialisten arbeiten **nicht direkt zusammen**. Der Workflow laeuft immer ueber Brian:

```
Claas → Brian → Spezialist A → Brian → Spezialist B → Brian → Claas
```
