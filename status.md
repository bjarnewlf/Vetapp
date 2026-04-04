# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert, manuell von Brian bei Bedarf.

## Aktueller Stand

**VetApp** — React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

### Was funktioniert (committed)

- Auth (Supabase), Haustier-CRUD inkl. Bearbeiten, Dokumente mit Storage
- Impfungen + Behandlungen erfassen, Erinnerungen mit Ueberfaellig-Erkennung
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent: Eigener Tab (Position 3, Mitte), Edge Function deployed, ANTHROPIC_API_KEY gesetzt
- KI-Chat abgesichert: Rate Limiting (20/h), Input-Validierung, Prompt-Injection-Schutz
- Loading/Error-States, Doppel-Submit-Schutz, SelectField-Komponente, petHelpers
- Bottom-Navigation: Home, Tiere, KI-Assistent, Erinnerungen, Tierarzt
- Profil ueber Icon-Button im HomeScreen-Header erreichbar
- Accessibility: Button + InputField Labels/Roles, Checkbox 44px, Settings deaktiviert
- Design-System: Alle Komponenten nutzen Theme-Tokens (keine Inline-Werte mehr)

---

## Uncommittete Aenderungen

**Letzter Commit:** `2df9930` — docs: Handoff und Tasks aktualisiert nach Design-Sprint

Keine uncommitteten Aenderungen. Working tree ist clean.

---

## Offene Punkte

### Sofort / Hochprioritaet

- **Gesundheits-UX** — Datenmodell vereinheitlichen (MedicalEvent), DataContext + Screens umbauen

### Vor Release

- **F-02:** togglePro() absichern — IAP implementieren, RLS fuer is_premium einschraenken
- **F-03:** CORS in Edge Function einschraenken (Origin statt Wildcard *)
- **F-05/F-06:** goBack() bei null-Events/Pets in Detail-Screens
- **F-07:** DataContext.refresh() — DB-Fehler nicht verschlucken
- **F-08:** Pet-Fotos in Supabase Storage hochladen (wie Dokumente)
- **F-11:** notification_id Spalte ins supabase-schema.sql nachpflegen

### Backlog

- **M7:** DataContext refactoren (God-Object, ~350 Zeilen)
- **Chat-Historie** persistent machen (nach MVP)
- **SelectField:** Tap-outside schliesst nicht
- **Demo** fuer Kunden vorbereiten (Expo Go / EAS Build / Web)
- **Guenstigeres KI-Modell** evaluieren (claude-sonnet-4-6 ist teuer)
- **Deno std** Version aktualisieren (0.168.0 → aktuell)

---

## Architektur-Hinweise

- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- Premium-Gates via `SubscriptionContext.isPro` + `isLoading` Check + `useEffect`-Navigation
- Supabase CLI auf Windows: `npx supabase` nutzen (globale Installation nicht moeglich)
- KI-Assistent nutzt Custom Header `x-user-token` fuer Auth (JWT-Workaround)
- Rate Limiting via `ai_usage` Tabelle — fail-open bei DB-Fehler

---

## Vault

Agency-Vault in `D:\Agency-Vault\` — 55+ vernetzte Notizen. Zuletzt vollstaendig inventarisiert am 04.04.2026.

---
Zuletzt aktualisiert: 2026-04-04
