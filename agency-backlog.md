# Agency Backlog

> Offene Infrastruktur-Aufgaben der Dev-Agentur. Wird vom Agency Admin gepflegt.

## Offen

### Brian global machen
- **Was:** Brian (sidekick.md) aus `VetApp/.claude/agents/` nach `~/.claude/agents/` verschieben
- **Warum:** Damit Brian in allen Projekten verfuegbar ist, nicht nur in VetApp
- **Aenderungen noetig:**
  - Scheduled Agents Sektion generisch machen (nicht mehr hardcoded "Full Audit 06:00")
  - Team-Sektion generisch machen ("Pruefe welche Agents verfuegbar sind" statt hardcoded developer/designer/qa)
  - Stack-Infos (React Native, Expo, Supabase) gehoeren in projekt-spezifische Rules, nicht in den Agent
- **Betrifft auch:** Developer, Designer, QA — wenn die auch global werden sollen, muss der Stack ebenfalls in Rules ausgelagert werden. Erstmal nur Brian.

### Obsidian-Agent
- **Was:** Agent der ein Obsidian-Vault als Wissenszentrum der Agentur pflegt
- **Noch zu klaeren:**
  - Hat Claas Obsidian installiert?
  - Vault-Struktur definieren (Projekte, Agents, Learnings, Entscheidungen, Technik)
  - Zusammenspiel mit Dokumentar (Dokumentar schreibt Changelogs, Obsidian-Agent verlinkt und ergaenzt?)
  - Verlinkung zwischen Notizen (`[[Wiki-Links]]`)
- **Vision:** Vernetztes Wissen das ueber die Zeit wertvoller wird — Projekte, Entscheidungen, Learnings, Technik alles verlinkt

### Dashboard verfeinern
- **Was:** Dashboard laeuft auf localhost:3333, Design-Feedback von Claas abwarten
- **Moegliche Verbesserungen:** Auto-Refresh, zusaetzliche Sektionen, Mobile-Ansicht

## Erledigt (2026-04-03)
- [x] db-expert Agent angelegt (Supabase/PostgreSQL, Opus, read-only)
- [x] dokumentar Agent angelegt (Changelogs + Status, Sonnet)
- [x] Scheduled Tasks: Dokumentar morgens 08:00 + abends 18:00
- [x] Dashboard-Server auf localhost:3333 (live Daten, PowerShell)
- [x] Autostart: Dashboard oeffnet sich beim Windows-Login

---
Zuletzt aktualisiert: 2026-04-03
