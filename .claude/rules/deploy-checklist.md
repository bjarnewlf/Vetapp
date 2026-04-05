---
paths:
  - "supabase/**"
  - ".claude/agents/devops.md"
---

# Deploy-Checkliste (VetApp)

> Gilt fuer jeden Release, Handy-Test und jedes Supabase-Deployment.
> Kein Deploy ohne Bestaetigung von Claas — ausser Brian hat Autonomie-Freigabe erteilt.

---

## 1. Pre-Release Checks

Vor jedem Release oder Handy-Test — in dieser Reihenfolge:

- [ ] **Package-Versionen** — `npx expo install --check`
      Bei Abweichungen: `npx expo install --fix`, danach TypeScript-Check wiederholen
- [ ] **TypeScript-Check** — `npx tsc --noEmit` muss fehlerfrei durchlaufen
      TypeScript-Fehler blockieren den Release (Schwere: Kritisch per QA-Baseline)
- [ ] **Offene Migrationen** — Migration-Tracking-Tabelle unten pruefen
      Gibt es ungdeployete Migrationen? Reihenfolge korrekt?
- [ ] **Edge Functions Status** — Sind alle Functions deployed und aktuell?
      Bekannte Functions: `ai-chat`
- [ ] **Environment-Variablen** — `.env` vorhanden und vollstaendig?
      Pflicht-Keys: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
      Edge Functions brauchen zusaetzlich `ANTHROPIC_API_KEY` (in Supabase Secrets)

---

## 2. Deployment-Schritte

Reihenfolge einhalten — Migrationen immer vor Functions, Functions vor App-Build.

### Schritt 1: DB-Migrationen
```bash
npx supabase db push
```
- RLS-Policies nach Migration manuell pruefen (Supabase Dashboard > Authentication > Policies)
- Bei DROP/DELETE/ALTER: Rollback-Plan dokumentieren BEVOR der Command ausgefuehrt wird

### Schritt 2: Edge Functions deployen
```bash
npx supabase functions deploy ai-chat
```
- Nur deployen wenn sich die Function geaendert hat
- Logs nach Deploy kurz pruefen: Supabase Dashboard > Edge Functions > Logs

### Schritt 3: App-Build / Expo Go Test
- **Development (Handy-Test):** Expo Go — `npm start`, QR-Code scannen
- **Production Build iOS:** `eas build --platform ios`
- **Production Build Android:** `eas build --platform android`
- **OTA Update (kein Store-Release noetig):** `eas update`

### Schritt 4: Smoke-Test
Smoke-Test-Checkliste ausfuehren — siehe `.claude/rules/qa-baseline.md`.
Mindestens: Login, Haustier-Ansicht, Erinnerungen, Dokument-Upload (falls Storage deployed).

---

## 3. Post-Deployment

- [ ] **Funktionstest auf Geraet** — Alle gerade gdeployten Aenderungen manuell testen
- [ ] **Logs pruefen** — Edge Function Logs, Supabase Logs auf Fehler scannen
- [ ] **handoff.md aktualisieren** — Was deployed, Zeitpunkt, offene Punkte
- [ ] **Migration-Status dokumentieren** — Tabelle unten aktualisieren (Status auf "deployed", Datum eintragen)
- [ ] **Rollback noetig?** — Wenn ja: Sofort stoppen, nicht improvisieren, Claas informieren

---

## 4. Rollback-Grundsaetze

- **Migrationen** sind weitgehend irreversibel — bei destruktiven Aenderungen (DROP, DELETE, ALTER) vorher Backup-Strategie definieren
- **Edge Functions** — einfach die vorherige Version neu deployen (Git-Commit auschecken + `functions deploy`)
- **App (OTA)** — `eas update --rollback-to-embedded` (nur bei EAS Updates, nicht bei Store-Builds)
- **App (Store-Build)** — kein automatischer Rollback moeglich; vorherige Version erneut einreichen

---

## 5. Migration-Tracking

| Migration | Status | Datum | Notizen |
|-----------|--------|-------|---------|
| `20260404_medical_events.sql` | deployed | 2026-04-04 | medical_events Tabelle, ersetzt vaccinations + treatments |
| `20260404_medical_events_recurrence_check.sql` | deployed | 2026-04-04 | Recurrence-Check Constraint |
| `20260404_ai_usage.sql` | deployed | 2026-04-04 | AI-Usage Tracking |
| `notification_id` fuer reminders-Tabelle | **offen** | — | Push Notification ID persistieren fuer Cancellation; Migration-Datei noch nicht erstellt |

---

## Befehle auf einen Blick

| Was | Command |
|-----|---------|
| Package-Check | `npx expo install --check` |
| Package-Fix | `npx expo install --fix` |
| TypeScript | `npx tsc --noEmit` |
| DB-Migration | `npx supabase db push` |
| Edge Function | `npx supabase functions deploy [name]` |
| Dev-Server | `npm start` |
| OTA Update | `eas update` |
| iOS Build | `eas build --platform ios` |
| Android Build | `eas build --platform android` |
