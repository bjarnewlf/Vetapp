# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert.

## Aktueller Stand

**VetApp** — React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

### Was funktioniert (committed)

- Auth (Supabase), Haustier-CRUD inkl. Bearbeiten, Dokumente mit Storage
- Impfungen + Behandlungen erfassen, Erinnerungen mit Ueberfaellig-Erkennung
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent: Eigener Tab (Position 3, Mitte), Edge Function deployed, ANTHROPIC_API_KEY gesetzt
- Loading/Error-States, Doppel-Submit-Schutz, SelectField-Komponente, petHelpers
- Bottom-Navigation: Home, Tiere, KI-Assistent, Erinnerungen, Tierarzt
- Profil ueber Icon-Button im HomeScreen-Header erreichbar

---

## Uncommittete Aenderungen

**Letzter Commit:** `2f798f7` — docs: changelog 2026-04-03 Session 2 (03.04.2026, 19:19)

Es gibt **11 geaenderte Dateien** mit ca. +519 / -203 Zeilen, die noch nicht committet wurden:

| Datei | Art der Aenderung |
|-------|-------------------|
| `src/screens/AIAssistantScreen.tsx` | Groessteil der Session-2-Aenderungen (Redesign, Touch-Targets, Theme-Tokens) |
| `src/navigation/AppNavigator.tsx` | KI-Tab auf Position 3, Profil-Tab entfernt |
| `src/screens/HomeScreen.tsx` | Profil-Button im Header |
| `src/screens/ProfileScreen.tsx` | Text aktualisiert, Touch-Targets 44px |
| `src/services/aiService.ts` | Auth-Header wird explizit mitgeschickt (unauthorized-Fix) |
| `supabase/functions/ai-chat/index.ts` | Edge Function Aenderungen |
| `.claude/rules/navigation.md` | Navigationsregel aktualisiert |
| `.claude/settings.local.json` | Agent-Konfiguration |
| `learnings.md` | Neue Erkenntnisse aus Session |
| `tasks.md` | Task-Status aktualisiert |
| `status.md` | Diese Datei |

**Zusaetzlich ungetrackte Dateien/Verzeichnisse:**
- `agency-backlog.md`, `agentic-os-template.md`
- `briefings/`, `scripts/`, `supabase/.temp/`
- `docs/` (mehrere HTML- und MD-Dateien)

> **Naechster Schritt:** Alle uncommitteten Aenderungen committen, bevor neue Features gestartet werden.

---

## Offene Punkte

### Sofort / Hochprioritaet

- **KI-Assistent testen** — Auth-Fix (`aiService.ts`) konnte wegen voller Festplatte nicht getestet werden. Expo-Server neu starten, Assistent testen. Falls noch "unauthorized": Browser-Console (F12 → Network) pruefen, ob Authorization-Header im Request steht.
- **Uncommittete Aenderungen committen** — 11 Dateien, vor naechster Feature-Arbeit erledigen
- **Gesundheits-UX** — Tab umbenennen, Sektionen labeln, Datenmodell vereinheitlichen (MedicalEvent), DataContext + Screens umbauen

### Diese Woche

- **D1:** Accessibility Basics — Labels, Touch-Targets min. 44px (teilweise erledigt in AIAssistantScreen)
- **D4:** Inkonsistente Farben — Theme konsequent nutzen (teilweise erledigt in AIAssistantScreen)
- **SelectField:** Tap-outside schliesst nicht
- **ProfileScreen:** "Datenschutz" + "Hilfe" noch ohne Handler

### Backlog

- **M7:** DataContext refactoren (God-Object, ~350 Zeilen)
- **Chat-Historie** persistent machen (nach MVP)
- **Demo** fuer Kunden vorbereiten (Expo Go / EAS Build / Web)
- **Brian global** — sidekick.md aus VetApp-Scope in `~/.claude/agents/` verschieben
- **Obsidian-Agent** — Wissenzentrum der Agentur (Vault-Struktur noch offen)

---

## Architektur-Hinweise

- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- Premium-Gates via `SubscriptionContext.isPro` + `isLoading` Check + `useEffect`-Navigation
- Supabase CLI auf Windows: `npx supabase` nutzen (globale Installation nicht moeglich)

---
Zuletzt aktualisiert: 2026-04-04 08:00
