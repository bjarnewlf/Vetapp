# Skill: Task zerlegen

## Wann
Wenn eine Aufgabe als "Groß" eingeschätzt wird (6+ Dateien) oder mehr als 2 Spezialisten involviert sind.

## Schritte
1. Ziel in einem Satz definieren
2. Betroffene Dateien identifizieren (Glob/Grep nutzen)
3. In max 7 nummerierte Schritte zerlegen
4. Pro Schritt: Spezialist zuweisen, parallele Schritte markieren
5. Unklarheiten/Blocker auflisten
6. In tasks.md eintragen wenn Claas bestätigt

## Output-Format

```
AUFGABE: [Name]
ZIEL: [Ein Satz]
UMFANG: Groß ([X] Dateien, [Y] Spezialisten)

SCHRITTE:
1. [Schritt] → [Spezialist] [parallel: ja/nein]
2. [Schritt] → [Spezialist] [parallel: ja/nein]
...

BLOCKER: [Liste oder "keine"]
```
