---
paths:
  - "src/**"
  - ".claude/agents/**"
---

# Projekt-Stack (VetApp)

## Tech-Stack

- **Framework:** React Native / Expo (TypeScript, strict mode)
- **Backend:** Supabase (PostgreSQL, RLS, Edge Functions, Storage)
- **UI-Sprache:** Deutsch

## Type-Check

```bash
npx tsc --noEmit
```

Nach jeder Code-Aenderung ausfuehren. 0 Fehler ist Pflicht.

## Design-System

- Theme: `src/theme/` (Farben, Typografie, Spacing)
- Komponenten: `src/components/`
- Farben, Spacing und Typografie kommen aus dem Theme — keine Inline-Werte
- Details: `.claude/rules/design-system.md`
