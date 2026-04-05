# Stitch — Designtool fuer den Designer-Agent

## Was ist Stitch?

Google Stitch ist ein AI-gesteuertes UI-Design- und Prototyping-Tool. Es generiert aus Textbeschreibungen vollstaendige UI-Screens als **HTML-Code + Screenshot-Bilder**. Es nutzt Gemini-Modelle im Backend.

Stitch ist als **MCP-Server** eingerichtet und direkt aus dem Chat nutzbar — keine separaten Tools noetig.

## Einrichtung

- MCP-Endpunkt: `https://stitch.googleapis.com/mcp`
- API-Key: in `~/.claude.json` gespeichert (NICHT im Repo!)
- Status: Bereit nach Neustart von Claude Code

## Verfuegbare MCP-Tools

### Projekt-Management

| Tool | Beschreibung | Wichtige Parameter |
|---|---|---|
| `create_project` | Neues Projekt anlegen | `title` (optional) |
| `get_project` | Projekt-Details abrufen | `name` (Format: `projects/{id}`) |
| `list_projects` | Alle Projekte auflisten | `filter` (optional) |

### Screen-Generierung

| Tool | Beschreibung | Wichtige Parameter |
|---|---|---|
| `generate_screen_from_text` | Screen aus Prompt generieren | `projectId`, `prompt`, `deviceType`, `modelId` |
| `edit_screens` | Bestehende Screens bearbeiten | `projectId`, `selectedScreenIds`, `prompt` |
| `generate_variants` | Varianten generieren | `projectId`, `selectedScreenIds`, `prompt`, `variantOptions` |
| `list_screens` | Screens eines Projekts auflisten | `projectId` |
| `get_screen` | Einzelnen Screen abrufen | `projectId`, `screenId` |

### Design-System

| Tool | Beschreibung | Wichtige Parameter |
|---|---|---|
| `create_design_system` | Design-System anlegen | `projectId`, `designSystem` |
| `update_design_system` | Design-System aendern | `projectId`, `name`, `designSystem` |
| `list_design_systems` | Design-Systeme auflisten | `projectId` |
| `apply_design_system` | Auf Screens anwenden | `projectId`, `assetId`, `selectedScreenInstances` |

### Device Types

`MOBILE` | `DESKTOP` | `TABLET` | `AGNOSTIC`

Fuer VetApp IMMER `MOBILE` verwenden.

### Modell-Auswahl

| Modell | Beschreibung |
|---|---|
| `GEMINI_3_PRO` | Standard, beste Qualitaet |
| `GEMINI_3_FLASH` | Schneller, etwas weniger Detail |
| `GEMINI_3_1_PRO` | Neuestes Modell |

## Screen-Output

Ein generierter Screen liefert:

| Feld | Beschreibung |
|---|---|
| `htmlCode` | Vollstaendiges, renderbares HTML |
| `screenshot` | Bild des gerenderten Designs (PNG/JPG) |
| `figmaExport` | Optionaler Figma-Export |
| `prompt` | Der verwendete Prompt |
| `deviceType` | Geraetetyp |
| `theme` | Verwendetes Design-Theme |

## VetApp Design-System in Stitch

Beim ersten Einsatz ein Design-System anlegen:

```json
{
  "displayName": "VetApp Design System",
  "theme": {
    "customColor": "#1B6B5A",
    "headlineFont": "DM_SANS",
    "bodyFont": "INTER",
    "colorMode": "LIGHT",
    "colorVariant": "TONAL_SPOT",
    "roundness": "ROUND_TWELVE",
    "overridePrimaryColor": "#1B6B5A",
    "overrideSecondaryColor": "#CC6B3D",
    "overrideNeutralColor": "#FAF6F1",
    "designMd": "German pet health app. Warm, premium, trustworthy. Generous whitespace. Card-based layouts with subtle shadows. Accent color #CC6B3D for CTAs."
  }
}
```

### Token-Mapping: Stitch → VetApp Theme

| Stitch | VetApp Theme |
|---|---|
| `customColor` (#1B6B5A) | `colors.primary` |
| `overrideSecondaryColor` (#CC6B3D) | `colors.accent` |
| `overrideNeutralColor` (#FAF6F1) | `colors.background` |
| `headlineFont` (DM_SANS) | `typography.h1-h3` |
| `bodyFont` (INTER) | `typography.body*` |
| `roundness` (ROUND_TWELVE) | `borderRadius.lg` (12) |

## Prompting Best Practices

### Prompt-Struktur

1. **Emotionales Ziel zuerst** — "warm, premium, trustworthy" VOR den technischen Specs. Beeinflusst den Gesamtstil spuerbar.
2. **Farben als Hex, nie als Namen** — `#1B6B5A` statt "teal". Immer alle relevanten Farben angeben.
3. **Layout von oben nach unten, nummeriert** — kein Fliesstext. Abschnitt fuer Abschnitt.
4. **Pixelwerte fuer alles Kritische** — Hero-Hoehe, FAB-Groesse, Touch-Targets, Padding. Stitch haelt sich daran.
5. **Echten Content** — "Bella", "Golden Retriever · 3 Jahre", "Flohschutzmittel" statt Placeholder. Was reinkommt, kommt raus.
6. **Hierarchie explizit** — "h1 bold 28px", "grey caption 13px", "PRO orange pill badge" — sonst rät Stitch und liegt daneben.
7. **Whitespace als Befehl** — "generous whitespace", "breathes", "16px gap between sections". Ohne Anweisung stapelt Stitch.

### Beispiel-Prompt (VetApp HomeScreen)

```
Mobile pet health app dashboard in German. Light theme, warm and premium feel.

Colors: Primary #1B6B5A, Accent #CC6B3D, Background #FAF6F1, Surface white #FFFFFF, Text #1A1A1A, Secondary text #6B6B6B.

Layout top to bottom:
1. Status bar safe area (44px top padding)
2. Gradient header (#1B6B5A to #3AA08A, rounded bottom 24px): "Hallo, Claas!" white bold 28px, subtitle white 85% opacity 14px, profile circle 44px top-right
3. Section "Meine Tiere" — h2 bold dark + "+ Hinzufuegen" teal link. Horizontal scroll: pet cards 150x185px white rounded-16 shadow, 80px circular photo, name bold 16px, species badge, age grey caption. 2 full + partial 3rd as scroll hint.
4. Section "Naechste Termine" — h2 bold + "Alle" teal link. 3 rows: 4px colored left border (red=overdue, teal=upcoming), icon 20px, title bold 15px, pet name grey below, date right. First row red + "Ueberfaellig" red pill.
5. KI card — bg #E8F5F1, border #B8DDD4, radius 16px: sparkle icon teal 44px circle, "KI-Gesundheitsassistent" bold 16px, subtitle grey 13px, "PRO" pill + "Frage stellen" teal right.
6. Bottom tab bar white, 5 tabs, active tab #CC6B3D.

Style: 16px section gaps, cards breathe, 44px touch targets, strong hierarchy. No icon overload.
```

### Einschraenkungen

- Generierung kann **mehrere Minuten** dauern — NICHT retrien oder abbrechen
- Output ist **HTML, nicht React Native Code** — Developer muss uebersetzen
- API ist v0.1.0 — Breaking Changes moeglich
- Figma-Export ist optional und nicht immer verfuegbar

---

## Iterativer Workflow — so entstehen wirklich gute Designs

> **Einmal-Prompts produzieren Kompromisse. Iterieren produziert Ergebnisse.**
> Der folgende Workflow ersetzt den alten "einmal prompten und uebergeben"-Ansatz.

### Phase 1 — Grob generieren

Ziel: Struktur und Feeling stimmen, kein Pixelperfect.

```
1. create_project (ein Projekt pro Screen — Rate-Limit-Workaround!)
2. create_design_system mit VetApp-Tokens
3. generate_screen_from_text — Prompt nach obiger Struktur, GEMINI_3_PRO
4. get_screen → Screenshot ansehen
```

Fragen nach Phase 1:
- Stimmt die Grundstruktur (Reihenfolge der Sektionen)?
- Stimmt das Feeling (warm/premium oder kalt/generisch)?
- Sind die Farben nah genug?

Wenn nein → Prompt anpassen und neu generieren. Wenn ja → Phase 2.

### Phase 2 — Chirurgisch verbessern mit `edit_screens`

`edit_screens` ist der eigentliche Qualitaets-Hebel. Gezielt iterieren statt neu generieren:

**Spacing & Rhythm:**
- "Increase padding inside cards to 16px"
- "Add 24px gap between the pet cards section and the timeline section"
- "The header needs more breathing room at the bottom — add 20px"

**Farbe & Kontrast:**
- "Make the gradient darker — from #145244 to #1B6B5A"
- "The secondary text should be #6B6B6B, currently too dark"
- "Change the overdue badge background to #FDEAEA, text to #D94040"

**Typografie & Hierarchie:**
- "The section label and the card title are fighting — make section label uppercase 11px grey, more quiet"
- "Pet name inside card should be bold 16px, breed should be regular 13px #6B6B6B"

**Komponenten:**
- "The FAB shadow is too heavy — softer, 4px blur, 20% opacity"
- "Checkbox touch target must be exactly 44x44px"
- "The KI card border should be 1.5px, not 1px — needs more presence"

### Phase 3 — Varianten fuer Entscheidungen

Bei echten Design-Fragen (Hierarchie-Variante, CTA-Platzierung):

```
generate_variants → 2-3 Varianten mit unterschiedlichem Ansatz
→ Claas entscheidet → Sieger geht in Uebergabe
```

Beispiel-Prompt fuer Varianten:
```
"Generate two variants:
A: Timeline with date block left (large day number, small month)
B: Timeline with colored dot left and full date text right"
```

### Phase 4 — Uebergabe an Developer

Erst wenn der Designer mit dem Output zufrieden ist:

```
get_screen → HTML + Screenshot lokal speichern (stitch-[name].html)
```

Uebergabe-Paket:
- `stitch-[name].html` — stabile Referenz (Screenshot-URLs laufen ab!)
- Screenshot-URL — visuelles Ziel fuer Developer und QA
- Abweichungshinweise — was React Native anders rendert als HTML

---

## Workflow: Designer → Developer

```
Phase 1: Grob generieren
  create_project (ein Projekt pro Screen!)
  create_design_system (VetApp Tokens)
  generate_screen_from_text (MOBILE, GEMINI_3_PRO)
  → Screenshot pruefen

Phase 2: Iterieren bis gut
  edit_screens (chirurgische Korrekturen)
  → Screenshot pruefen
  → Wiederholen bis Qualitaet stimmt

Phase 3 (optional): Varianten
  generate_variants → Claas entscheidet

Phase 4: Uebergabe
  get_screen → HTML lokal speichern
  handoff.md aktualisieren mit Dateinamen + Screenshot-URL + Abweichungshinweisen

Developer:
  HTML als Referenz, Theme-Tokens aus src/theme/ fuer alle Werte
  React Native Umsetzung

QA:
  Umsetzung gegen Screenshot pruefen
```

## Wichtig

- Screenshots sind REFERENZEN, nicht 1:1-Vorgaben — React Native hat andere Rendering-Capabilities als HTML
- Alle finalen Farben/Spacing/Typografie kommen aus `src/theme/`, NICHT aus dem Stitch-Output
- Stitch-Designs immer im LIGHT Mode — die App hat keinen Dark Mode
- API-Key NIEMALS committen — bleibt in `~/.claude.json`
