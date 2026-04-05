# Changelog — 03. April 2026, Session 2

## Zusammenfassung

Navigation-Umbau und Design-Haertung. Der KI-Assistent ist jetzt ein vollwertiger Tab in der Bottom-Navigation (Position 3, Mitte). Der Profil-Tab entfaellt — Profil ist ueber ein Icon im HomeScreen-Header erreichbar. Dazu Theme-Konsistenz und Accessibility-Fixes im AIAssistantScreen.

---

## Navigation

### KI-Assistent als eigener Tab
- **Was:** Neuer Tab "KI-Assistent" mit sparkles-Icon auf Position 3 der Bottom-Navigation.
- **Warum:** Der Assistent ist ein Kern-Feature — er verdient einen permanenten Einstiegspunkt, nicht nur Entry Points auf Home und Profil.
- **Dateien:** `src/navigation/AppNavigator.tsx`

### Profil-Tab entfernt, Profil in HomeScreen-Header
- **Was:** Der Profil-Tab weicht dem KI-Assistenten. Das Profil ist jetzt ueber ein `person-circle-outline`-Icon im Header des HomeScreens erreichbar.
- **Dateien:** `src/navigation/AppNavigator.tsx`, `src/screens/HomeScreen.tsx`

### Back-Button im AIAssistantScreen entfernt
- **Was:** Der AIAssistantScreen hatte einen eigenen Back-Button aus der Zeit als Stack-Screen. Als Tab-Screen macht der Button keinen Sinn mehr.
- **Dateien:** `src/screens/AIAssistantScreen.tsx`

---

## Design & Accessibility

### Theme-Tokens im AIAssistantScreen (Audit-Finding D4)
- **Was:** Hardcodierte Farben (`#FFF8E1`, `#D4A020`) und Padding-Werte durch Theme-Tokens und Spacing-Tokens ersetzt.
- **Warum:** Konsistenz mit dem restlichen Design-System, Dark-Mode-Vorbereitung.
- **Dateien:** `src/screens/AIAssistantScreen.tsx`

### Touch-Target und Kontrast-Fixes (Audit-Finding D1)
- **Was:** Send-Button von 40px auf 44px vergroessert. TextInput erhaelt `minHeight: 44px`. Typing-Indikator nutzt `textSecondary` statt `textLight` fuer besseren Kontrast.
- **Warum:** 44px ist die von Apple/Google empfohlene Mindestgroesse fuer Touch-Targets.
- **Dateien:** `src/screens/AIAssistantScreen.tsx`

---

## Texte

### ProfileScreen "Kommt bald"-Text ersetzt
- **Was:** Den Platzhaltertext "Kommt bald: Personalisierte Gesundheitsempfehlungen..." durch den Produktionstext ersetzt, der auf den jetzt fertigen KI-Assistenten verweist.
- **Dateien:** `src/screens/ProfileScreen.tsx`

---

## Statistik

| Metrik | Wert |
|--------|------|
| Betroffene Dateien | ~4 |
| Geschlossene Audit-Findings | D1 (teilweise), D4 (teilweise) |
| Offene Punkte abgehakt | "ProfileScreen Kommt-bald-Text" |

---

## Offene Punkte

- Edge Function `ai-chat` muss noch deployed werden (`supabase functions deploy ai-chat`)
- `ANTHROPIC_API_KEY` als Supabase Secret setzen
- DataContext God-Object — Refactoring im Backlog
- ProfileScreen: "Datenschutz" + "Hilfe" noch ohne Handler
- SelectField: Tap-outside schliesst nicht
