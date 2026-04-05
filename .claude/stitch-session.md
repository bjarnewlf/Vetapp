# Stitch Session — Abgeschlossen

Status: ERLEDIGT — 2026-04-05

## Ablauf (genau in dieser Reihenfolge)

### 1. Projekt anlegen
Tool: `create_project`
```
title: "VetApp — Redesign Prototypen"
```

### 2. Design System anlegen
Tool: `create_design_system`
```json
{
  "projectId": "<id aus Schritt 1>",
  "designSystem": {
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
      "designMd": "German pet health app. Warm, premium, trustworthy. Generous whitespace. Card-based layouts with subtle shadows. Accent color #CC6B3D for CTAs and active states."
    }
  }
}
```

### 3. Screen 1 — HomeScreen
Tool: `generate_screen_from_text`
deviceType: `MOBILE` | modelId: `GEMINI_3_1_PRO`

Prompt:
```
Mobile pet health app dashboard in German. Light theme, warm and premium feel.

Colors: Primary #1B6B5A, Accent #CC6B3D, Background #FAF6F1, Surface white #FFFFFF, Text #1A1A1A, Secondary text #6B6B6B.

Layout top to bottom:
- Status bar safe area (44px top padding)
- Gradient header (#1B6B5A to #3AA08A, rounded bottom corners 24px): "Hallo, Claas! 👋" white bold 28px, "Willkommen zurück bei VetApp" white 85% opacity 14px below, profile circle button 44px top-right
- Section "Meine Tiere" — label h2 bold dark + "+ Hinzufügen" teal link right-aligned. Horizontal scroll row of pet cards (150×185px, white, rounded 16px, shadow): 80px circular photo, pet name bold 16px, species badge pill, age caption grey. Show 2 full cards + partial 3rd as scroll hint.
- Section "Nächste Termine" — label h2 bold dark + "Alle" teal link. 3 list rows: 4px colored left border (red=overdue, teal=upcoming), event icon 20px, title bold 15px, pet name grey caption below, date right-aligned. First row: red border, "Überfällig" red pill badge.
- KI card — bg #E8F5F1, border #B8DDD4, radius 16px: sparkle icon in teal 44px circle left, "KI-Gesundheitsassistent" bold #145244 16px, "Deine Tiere kennt die KI bereits." grey 13px, bottom row: "PRO" dark teal pill badge left + "Frage stellen →" teal 14px right.
- Bottom tab bar white, 5 tabs (Haus/Home, Pfote/Pets, Sparkle/AI, Glocke/Reminders, Stethoskop/Vet), Pfote tab active in #CC6B3D.

Style: 16px section padding, 12px between cards, 44px minimum touch targets, strong typographic hierarchy. Breathes. No icon overload.
```

### 4. Screen 2 — PetDetailScreen
Tool: `generate_screen_from_text`
deviceType: `MOBILE` | modelId: `GEMINI_3_1_PRO`

Prompt:
```
Mobile pet detail screen for a German pet health app. Light theme, warm and premium.

Colors: Primary teal #1B6B5A, Accent orange #CC6B3D, Background #FAF6F1, Surface white, Text #1A1A1A.

Layout top to bottom:
- Hero section 260px — teal gradient (#2A9E82 to #145244), pet photo as full bleed overlay 35% opacity. Nav row at top: back arrow in semi-transparent dark circle 44px left, edit pencil icon circle 44px right (top: 52px from screen top). Bottom of hero: "Bella" white bold 32px letter-spacing -0.5, "Golden Retriever · 3 Jahre" white 75% opacity 13px below.
- Quick stats row — 3 white cards equal width, rounded 12px, subtle shadow, 12px padding: icon (bandage/document/bell) in teal circle 32px, number bold 20px teal, label grey 12px. Values: "3 Impfungen", "1 Dokument", "2 Termine".
- Tab bar — white bg, radius 12px, 4px padding, 3 tabs: "Gesundheit" (active: teal indicator bg pill, teal icon+text), "Dokumente" (grey, small gold lock icon), "Tierarzt" (grey). Animated spring indicator.
- Health tab content — two sub-sections:
  "Impfungen" label uppercase grey small + "+ Event" small teal button right. 2 cards white rounded-12 shadow: 3px teal left border, vaccine name bold 15px, date grey 13px, "Nächste: 12. Mai 2026" teal 12px bottom.
  "Behandlungen" label uppercase grey small. 1 card white, 3px orange left border, treatment name bold, date grey.
- Floating action button: teal circle 56px bottom-right 24px margin, "+" white bold.

Style: generous spacing, cards breathe, hierarchy is clear. Professional medical feel with warmth.
```

### 5. Screen 3 — RemindersScreen
Tool: `generate_screen_from_text`
deviceType: `MOBILE` | modelId: `GEMINI_3_1_PRO`

Prompt:
```
Mobile reminders screen for a German pet health app. Light theme.

Colors: Teal #1B6B5A, Orange #CC6B3D, Red #D94040, Background #FAF6F1, Surface white, Text #1A1A1A.

Layout top to bottom:
- Status bar padding + simple header: "Erinnerungen" h1 bold dark left, settings gear icon right 44px. No gradient.
- Overdue banner card — bg #FDEAEA, left border 4px #D94040, radius 12px, 16px padding: warning triangle icon red left, "2 Erinnerungen überfällig" bold red 15px, "Bitte zeitnah erledigen" red 75% opacity 13px below.
- Reminder list 3 cards white radius-12 shadow 12px margin-bottom:
  a. Overdue: 4px red left border, "Flohschutzmittel" bold 15px, "Bella · Hund" grey 13px below, "vor 3 Tagen" red 13px right-aligned, checkbox circle 44px right (red ring, unchecked).
  b. Upcoming: 4px teal left border, "Impfung Tollwut" bold, "Max · Katze" grey, "in 5 Tagen" teal right, checkbox (teal ring, unchecked).
  c. Future: 4px grey left border, "Vorsorge-Untersuchung" bold, "Bella" grey, "in 14 Tagen" grey right, checkbox grey ring.
- Spacer then full-width button: "+ Erinnerung hinzufügen" bg #1B6B5A white text bold 16px, 50px height, radius 12px, 16px horizontal margin.
- Bottom tab bar, bell/Glocke tab active in #CC6B3D.

Style: functional, calm. Urgency through color not chaos. Perfect rhythm. 44px touch targets on checkboxes.
```

### 6. Design System anwenden (optional)
Tool: `apply_design_system`
Auf alle 3 Screens anwenden für konsistente Tokens.

### 7. Screenshots + HTML abrufen
Tool: `get_screen` für jeden der 3 Screens
→ `htmlCode` speichern als `stitch-[screenname].html`
→ `screenshot` URL notieren für handoff.md

---

## Ergebnis-Ziel

3 HTML-Prototypen + Screenshots die der Developer als Vorlage nutzt.
Übergabe via handoff.md: Screenshot-URLs + Abweichungshinweise React Native vs. HTML.
