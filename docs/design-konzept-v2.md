# VetApp — Design-Konzept v2
**Stand:** 2026-04-03  
**Autor:** Designer  
**Status:** Entwurf — wartet auf Freigabe von Claas

---

## 1. Ausgangslage

Das bestehende Design-System hat eine solide Basis: Die Farbpalette (Teal + Orange + Warmweiß) ist stimmig und differenziert VetApp von den üblichen Blau-dominanten Health-Apps. Die Probleme liegen nicht in der Identität, sondern in der **Ausführung**:

- Inkonsistenz zwischen Screens (hardcoded Farben, duplizierte Styles)
- Keine Accessibility
- Fehlende States (Loading, Error, Empty)
- Komponenten wirken "generisch" — kein eigenes Feeling
- Touch-Targets zu klein, keine visuellen Feedback-Momente

**Fazit:** Kein Redesign nötig. Aber ein konsequenter Qualitätssprung.

---

## 2. Design-Leitbild

> **VetApp fühlt sich an wie eine persönliche Tierarzt-Assistentin — warm, kompetent, aufgeräumt.**

Drei Adjektive, die jede Design-Entscheidung leiten:

| Adjektiv | Was das bedeutet |
|---|---|
| **Warm** | Organische Formen, echte Fotos, keine sterile Klinik-Optik |
| **Kompetent** | Klare Hierarchie, keine Überraschungen, konsistente Patterns |
| **Aufgeräumt** | Viel Luft, wenig Text, starke Typografie statt Dekoelemente |

---

## 3. Farb-System — Bewertung & Erweiterung

### 3.1 Was bleibt (ist gut)

```
primary:        #1B6B5A   — Teal, Vertrauen, Gesundheit
accent:         #E8895C   — Orange, Wärme, CTAs
background:     #FAF6F1   — Warmweiß, kein hartes Weiß
```

Diese drei Farben sind die DNA der App — nicht anfassen.

### 3.2 Was fehlt: Semantic Tokens

Aktuell werden `colors.primary` und `colors.accent` direkt verwendet — ohne semantische Bedeutung. Für ein modernes System brauchen wir eine zweite Ebene:

```typescript
// Vorschlag: Ergänzung in colors.ts

// Surfaces (Tiefe durch leichte Tönung statt nur Schatten)
surfaceElevated: '#FFFFFF',      // Karten über Background
surfaceSunken:   '#F2ECE6',      // Input-Felder, eingesunkene Bereiche

// Interactive States
interactivePrimary:        '#1B6B5A',
interactivePrimaryHover:   '#145244',
interactivePrimaryPressed: '#0F3D32',
interactiveDisabled:       '#C5C5C5',

// Status (bereits vorhanden, aber Benennung konsistenter machen)
statusError:    '#D94040'
statusWarning:  '#D4A020'
statusSuccess:  '#2E8B57'
statusInfo:     '#1B6B5A'   // = primary

// Neu: Für den AI-Chat
aiBubble:       '#F0F7F5',  // Sehr helles Teal für AI-Nachrichten
aiAccent:       '#1B6B5A',  // AI-Icon-Farbe
```

### 3.3 Das Shadow-Problem lösen

Aktuell: `shadowColor: '#000'` — hardcoded, 5x dupliziert.

**Moderne Alternative:** Farbige Schatten statt schwarzer. Wirkt weicher und moderner:

```typescript
// In colors.ts:
shadowSoft:   'rgba(27, 107, 90, 0.08)',   // Teal-getönter Schatten
shadowMedium: 'rgba(27, 107, 90, 0.14)',
shadowStrong: 'rgba(27, 107, 90, 0.22)',
```

---

## 4. Typografie — Bewertung & Anpassungen

### 4.1 Was gut läuft

Die Skala ist vollständig (h1–caption, button, label, sectionHeader, stat). Keine neuen Größen nötig.

### 4.2 Was moderner wirkt

**Enger Line-Height bei Headlines** — aktuell h1: `fontSize 28 / lineHeight 34` (Ratio 1.21). Modernes Mobile-Design liegt eher bei 1.1–1.15 für Headlines:

```typescript
h1: { fontSize: 28, fontWeight: '700', lineHeight: 32 },  // war: 34
h2: { fontSize: 22, fontWeight: '700', lineHeight: 26 },  // war: 28
```

**Letter-Spacing für sectionHeader erhöhen** — aktuell `0.5`, moderne Apps nutzen `0.8–1.2` für Caps-Labels:

```typescript
sectionHeader: {
  fontSize: 11,           // war: 13 — kleiner wirkt edler
  fontWeight: '700',      // war: 600
  lineHeight: 16,
  letterSpacing: 1.0,     // war: 0.5
  textTransform: 'uppercase',
},
```

### 4.3 Mittelfristig: Custom Font

Aktuell System-Font (SF Pro / Roboto). Für ein klareres Markenprofil empfehle ich **Inter** (bereits in vielen Expo-Projekten, 0 Extra-Bundle-Size da Web-Standard). Entscheidung liegt bei Claas — kein Blocker für Phase 2.

---

## 5. Spacing & Layout

### 5.1 Bestand ist gut

```typescript
xs: 4 / sm: 8 / md: 16 / lg: 24 / xl: 32 / xxl: 48
```

Vollständig, konsistent. Keine Änderung.

### 5.2 Fehlend: Safe Areas

Aktuell wird `paddingTop: 60` überall hardcoded, um die Statusbar zu kompensieren. Das ist fragil (iPhone 14 vs. 15 vs. Android).

**Lösung:** `useSafeAreaInsets()` aus `react-native-safe-area-context` nutzen. Ist bereits als Expo-Dependency vorhanden. Jeder Screen-Header muss davon abhängen.

```typescript
// Pattern für alle Screens:
const insets = useSafeAreaInsets();
// statt: paddingTop: 60
// nutzen: paddingTop: insets.top + spacing.md
```

### 5.3 Horizontale Margins konsistent machen

Aktuell: Einige Screens haben `paddingHorizontal: spacing.md` am Container, andere an jedem einzelnen Element. Beides führt zu inkonsistenten Ergebnissen.

**Regel:** Horizontal-Padding immer am Screen-Container, nie an Card-Komponenten innen.

---

## 6. Component Library — Lücken

### 6.1 Bestand

| Komponente | Status | Anmerkung |
|---|---|---|
| `Button` | ✅ Gut | Fehlt: `loading`-Prop mit ActivityIndicator |
| `Card` | ⚠️ Unvollständig | Fehlt: `pressable`-Variante, `shadowColor` hardcoded |
| `InputField` | ✅ Gut | Fehlt: Fehlerzustand (roter Border + Fehlertext) |
| `StatusBadge` | ✅ Gut | Vollständig |
| `SelectField` | ✅ Existiert bereits | Wird noch nicht überall genutzt |

### 6.2 Neue Komponenten (Phase 2)

#### `EmptyState` — Priorität: Hoch
Aktuell werden leere Zustände inline in jedem Screen gebaut. Das führt zu 5 verschiedenen Stilen.

```
[ Icon 48px ]
[ Titel h3  ]
[ Subtext   ]
[ Optional: CTA-Button ]
```

#### `ListItem` — Priorität: Mittel
Für MyPets, Reminders, VetContacts — alle nutzen denselben Row-Pattern mit Avatar, Info, Chevron. Aktuell 3x dupliziert.

```
[ Avatar 56px ] [ Titel / Subtext flex-1 ] [ Chevron / Badge ]
```

#### `SectionHeader` — Priorität: Mittel
"TIER-INFORMATIONEN", "ERINNERUNGEN" etc. — aktuell inline. Standardisieren.

```
[ LABEL caps ] [ optional: Action-Link rechts ]
```

#### `ChatBubble` — Priorität: Hoch (für Paket 3)
Zwei Varianten: User (rechts, accent-Hintergrund) und AI (links, aiBubble-Hintergrund).

```
// AI-Bubble:
backgroundColor: colors.aiBubble
borderRadius: borderRadius.lg (außer unten-links: 4px)
maxWidth: '80%'
padding: spacing.md

// User-Bubble:
backgroundColor: colors.accent
color: colors.textOnAccent
borderRadius: borderRadius.lg (außer unten-rechts: 4px)
```

#### `SkeletonLoader` — Priorität: Mittel
Für den initialen Ladevorgang. Animiertes Grau-Rechteck als Platzhalter. Moderner als ActivityIndicator in der Mitte des Screens.

---

## 7. Screen-Konzepte

### 7.1 HomeScreen — Verbesserungen

**Problem heute:** Der grüne Header ist ein harter Farb-Block. Moderne Apps nutzen subtilere Hierarchie.

**Vorschlag:**
- Header: Hintergrund bleibt `colors.primary`, aber mit einem leichten Bogen nach unten (`borderBottomLeftRadius: 32, borderBottomRightRadius: 32`) — bereits so umgesetzt, gut.
- Greeting-Text: Emoji `👋` entfernen — wirkt auf manchen Devices inkonsistent. Stattdessen die Begrüßung fett, der Untertitel light.
- Pet-Grid: Karten wirken generisch. **Verbesserung:** Foto nimmt 70% der Karte ein, Name/Typ unten als Overlay mit leichtem Gradient (schwarz 0% → 40%). Wirkt wie eine moderne App, nicht wie eine Liste.
- Stats-Karte: 4 Zahlen nebeneinander. Gut so. Aber `colors.primary` für alle 4 Zahlen ist langweilig — Überfällig-Zahl sollte `colors.error` sein wenn > 0.

### 7.2 PetDetailScreen — Verbesserungen

**Problem heute:** Drei identisch große Tabs (Impfungen / Dokumente / Tierarzt) nehmen zu viel Platz. Das Tab-Pattern ist nicht nötig wenn Dokumente Pro-only ist.

**Vorschlag:**
- Tier-Foto: Wenn vorhanden, als Vollbreite-Hero oben (aspect ratio 16:9), kein weißes Card-Padding darum. Name + Rasse als Overlay unten.
- Info-Rows: Aktuell zu viel vertikaler Abstand. Dichter packen, dafür mit Divider-Linien trennen.
- Tab-Bar: Behalten, aber aktiver Tab mit `accent`-Unterstrich statt `primaryLight`-Hintergrund — sieht moderner aus.
- Trash-Icons: 18px ist zu klein. Minimum 44px Touch-Target, Icon bleibt 18px, aber `hitSlop: {top: 12, bottom: 12, left: 12, right: 12}`.

### 7.3 RemindersScreen — Verbesserungen

**Problem heute:** `borderLeftWidth: 4` als Status-Indikator ist alt und austauschbar.

**Vorschlag:**
- Status-Indikator: Kleines farbiges Dot (12px Kreis) links oben in der Karte, nicht Border.
- Überfällige Karten: Leichter `errorLight`-Hintergrund statt nur Border-Farbe. Visuell deutlicher.
- Checkbox: Aktuell 28px, zu klein. 36px, mit `borderRadius: 18`. Beim Abhaken: kurze Skalierungsanimation (0.9 → 1.05 → 1.0).

### 7.4 ProfileScreen — Verbesserungen

**Problem heute:** User-Avatar ist ein generisches Person-Icon in einem Kreis. Wirkt wie ein Platzhalter.

**Vorschlag:**
- Avatar: Initialen des Namens als Avatar (erster Buchstabe groß, farbiger Hintergrund aus Name-Hash) — deutlich persönlicher als Icon.
- Premium-Card: Bereits gut umgesetzt (Teal-Hintergrund). Einzige Verbesserung: Einen leichten diagonalen Highlight oben rechts einbauen (mit LinearGradient — optional).
- Settings-Items: Jedes Item sollte ein Icon links haben (`bell-outline`, `shield-outline`, `help-circle-outline`). Aktuell nur Text + Chevron — wirkt nackt.

### 7.5 AI-Chat-Screen — Neues Konzept (Paket 3)

Dieser Screen braucht eine eigene visuelle Sprache, die trotzdem ins System passt.

**Layout:**
```
┌─────────────────────────────┐
│  ← Zurück    KI-Assistent   │  Header: standard
│              [spark-Icon]   │
├─────────────────────────────┤
│  [Disclaimer-Banner]        │  Erinnerung: kein Tierarzt-Ersatz
│                             │  backgroundColor: warningLight
│                             │
│  [AI-Bubble]                │  links, aiBubble-Hintergrund
│  "Hallo! Ich kenne deine    │
│   Tiere: Bello (Hund) und   │
│   Mimi (Katze). Wie kann    │
│   ich helfen?"              │
│                             │
│              [User-Bubble]  │  rechts, accent-Hintergrund
│              "Bello hustet" │
│                             │
│  [AI-Bubble mit Typing...]  │  Animated dots während Laden
│                             │
├─────────────────────────────┤
│  [TextInput] [Senden-Btn]   │  Footer: immer sichtbar
└─────────────────────────────┘
```

**Details:**
- AI-Avatar: Kleiner Teal-Kreis mit Sparkles-Icon links neben jeder AI-Bubble
- Disclaimer-Banner: Einmalig am Anfang jeder Session, collapsible
- Typing-Indicator: Drei pulsierende Dots in AI-Farbe
- Leerer Zustand: 3 Vorschlag-Chips ("Impfplan prüfen", "Symptom beschreiben", "Nächsten Tierarztbesuch planen")
- Fehlerzustand: AI-Bubble in `errorLight`, Text: "Verbindung unterbrochen. Bitte versuche es erneut."
- Tastatur-Verhalten: `KeyboardAvoidingView` + automatisches Scrollen zur letzten Nachricht

---

## 8. Accessibility — Pflichtliste

Kein Nice-to-have. Diese Punkte sind vor Release umzusetzen:

| Element | Anforderung |
|---|---|
| Alle `TouchableOpacity` | `accessibilityLabel` und `accessibilityRole="button"` |
| Alle Icons ohne Text | `accessibilityLabel` am Icon-Container |
| `StatusBadge` | `accessibilityLabel="Status: Überfällig"` etc. |
| Touch-Targets | Minimum 44×44px. Wo Icon kleiner: `hitSlop` nutzen |
| Kontrast | Teal auf Warmweiß: 5.2:1 ✅ Orange auf Weiß: 3.1:1 ⚠️ — Button-Text auf Orange prüfen |
| `TextInput` | `accessibilityLabel` = Label-Text, `returnKeyType` setzen |
| Trash-Icons | `accessibilityLabel="[Name] löschen"` |
| Bilder/Fotos | `accessibilityLabel="Foto von [Tiername]"` |

**Kontrast-Check Orange:**  
`#E8895C` auf `#FFFFFF` → Kontrast 3.1:1. Das WCAG AA-Minimum für großen Text (18px+) ist 3:1 — knapp erfüllt. Für kleineren Text (unter 18px, normal weight) brauchen wir 4.5:1. **Maßnahme:** Button-Labels sind 16px/600 → grenzwertig. Entweder Button-Hintergrund abdunkeln auf `#D4743E` oder Text-Farbe auf `#1A1A1A` wechseln.

---

## 9. Umsetzungsplan

### Sofort (parallel zu Developer-Paketen)
1. `colors.ts` — Shadow-Tokens + `surfaceSunken` + `aiBubble` ergänzen
2. `Card.tsx` — `shadowColor` auf Token umstellen, `pressable`-Variante hinzufügen
3. `Button.tsx` — `loading`-Prop mit ActivityIndicator
4. `InputField.tsx` — Error-State (roter Border + Fehlertext unten)
5. Neue Komponente: `EmptyState`
6. Neue Komponente: `ListItem`
7. `typography.ts` — sectionHeader anpassen

### Phase 2 (mit Paket 3: AI-Chat)
8. Neue Komponente: `ChatBubble`
9. Neuer Screen: `AIAssistantScreen` nach oben beschriebenem Layout
10. `SkeletonLoader`-Komponente

### Mittelfristig (nach MVP)
11. Safe-Area-Migration (alle Screens)
12. Initialen-Avatar im ProfileScreen
13. Pet-Karten als Foto-Overlay (HomeScreen)
14. Custom Font (Inter) evaluieren

---

## 10. Was wir NICHT ändern

- Farbpalette (Primary / Accent / Background) — Identität der App
- Tab-Navigation (5 Tabs) — funktioniert, keine UX-Probleme
- Card-Pattern — etabliert, User kennt es
- Generelle Struktur der Screens — kein Redesign, nur Qualitätssprung

---

## Offene Fragen für Claas

1. **Dark Mode:** Scope für Phase 2 oder Backlog? (Beinflusst Token-Struktur erheblich)
2. **Custom Font (Inter):** Ja / Nein / Später?
3. **Animationen:** Micro-Animations (Checkbox, Tab-Wechsel) — oder lieber schlank halten für MVP?
4. **Orange-Kontrast:** Button-Hintergrund abdunkeln (`#D4743E`) oder Button-Text auf Dunkel wechseln?
