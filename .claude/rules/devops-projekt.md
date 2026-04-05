---
paths:
  - "supabase/**"
  - ".claude/agents/devops.md"
---

# DevOps-Kontext (VetApp)

## Supabase-Projekt

- Migrationen: `supabase/migrations/`
- Edge Functions: `supabase/functions/`
- Credentials: `.env` (nie in Klartext ausgeben)

## Deploy-Commands

| Was | Command |
|---|---|
| DB-Migration | `npx supabase db push` |
| Edge Function | `npx supabase functions deploy [name]` |
| Expo Build iOS | `eas build --platform ios` |
| Expo Build Android | `eas build --platform android` |
| OTA Update | `eas update` |

## Offene Deployments

Siehe `tasks.md` und `handoff.md` — alles mit Bezug zu "deploy" oder "migration".

## Bekannte Edge Functions

- `ai-chat` — KI-Assistent (Claude via Anthropic API)
