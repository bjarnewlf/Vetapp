# Changelog — VetApp

## 2026-04-07 — Security-Audit + Fixes

### Security-Fixes (9 Findings behoben)

**KRITISCH**
- File-Size-Limit: Max 10MB Dokumente, 5MB Fotos — Validierung in `fileUpload.ts` und `PetDetailScreen.tsx`
- MIME-Type-Whitelist: Nur PDF, JPEG, PNG, HEIC erlaubt — `fileUpload.ts`

**HOCH**
- Storage UPDATE-Policy: `pet-documents` Bucket hat jetzt UPDATE-RLS — Migration `20260407000002`
- ai_usage Cleanup-Index: `idx_ai_usage_created_at` fuer periodische Bereinigung — Migration `20260407000003`
- Prompt-Injection Haertung: `sanitizeString()` erweitert, Pet-Daten als JSON-Block statt Freitext, XML-Delimiter — `ai-chat/index.ts`
- MIME-Validierung serverseitig in `uploadFile()` — `fileUpload.ts`

**MITTEL**
- `console.warn` hinter `__DEV__`-Guard — `fileUpload.ts`
- E-Mail-Validierung im LoginScreen (Regex aus RegisterScreen) — `LoginScreen.tsx`
- signUp Auto-Login: Blinder `signInWithPassword`-Fallback entfernt — `AuthContext.tsx`

**NIEDRIG**
- Passwort-Minimum von 6 auf 8 Zeichen — `RegisterScreen.tsx`

### Weitere Aenderungen
- RLS-Sperre `is_premium`: WITH CHECK Policy verhindert Client-seitige Premium-Manipulation — Migration `20260407000001`
- CORS-Wildcard entfernt: `Access-Control-Allow-Origin: *` durch Env-Variable ersetzt — `ai-chat/index.ts`
- `SubscriptionContext.tsx`: Upsert ohne `is_premium` (kompatibel mit neuer RLS-Policy)

### Noch zu deployen
- 3 SQL-Migrationen: `supabase db push`
- Edge Function `ai-chat`: `supabase functions deploy ai-chat`
