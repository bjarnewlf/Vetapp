# Changelog — 07. April 2026

## Zusammenfassung

Grosses UI-Redesign der VetApp. Ziel: App visuell auf Top-Tier-Niveau heben. Custom Fonts (DM Sans + Inter), Bento-Dashboard, Floating Tab Bar, neues 4-Seiten-Onboarding, Haptic Feedback, Skeleton Loading auf allen Screens. Anschliessend QA-Review, Design-Review und Vereinfachung des Dashboards.

---

## Neue Features

### Custom Fonts — DM Sans + Inter (AP-1)
- **Was:** DM Sans fuer Headlines/Display/Stats, Inter fuer Body/Labels/Captions/Buttons. 7 Font-Varianten geladen.
- **Warum:** Fonts sind der Unterschied zwischen "sieht wie ein Template aus" und "sieht designed aus". Passend zu Stitch-Design-Tokens.
- **Details:** `fontWeight` komplett aus typography.ts entfernt — Android kollidiert bei gleichzeitigem `fontWeight` + `fontFamily`. Weight kommt jetzt ausschliesslich durch die Font-Variante (z.B. `DMSans_700Bold`). Font-Loading in App.tsx mit `useFonts`, App rendert erst wenn Fonts bereit.
- **Dateien:** `src/theme/fonts.ts` (neu), `src/theme/typography.ts`, `src/theme/index.ts`, `App.tsx`

### Bento-Dashboard HomeScreen (AP-5)
- **Was:** HomeScreen von linearer Liste zu asymmetrischem Bento-Grid umgebaut. Gradient Header (84px), Bento Row 1: "Naechster Termin" Card (2/3) + Quick-Action "Event" (1/3), KI-Assistent Card (volle Breite), "Anstehend" Timeline.
- **Warum:** Groesster visueller Sprung. Asymmetrische Cards erzeugen Rhythmus und Hierarchie.
- **Details:** Kein Grid-Library — `flexDirection: 'row'` + `flex: 2`/`flex: 1` + `gap`. Termin-Card zeigt naechsten offenen Reminder oder MedicalEvent mit farbigem 4px Links-Border (rot=overdue, teal=upcoming). Timeline filtert Duplikat mit Termin-Card raus.
- **Dateien:** `src/screens/HomeScreen.tsx`

### Floating Tab Bar (AP-7)
- **Was:** Pillenfoermige Tab Bar (borderRadius 32), schwebt ueber Content, Glasmorphismus auf iOS (BlurView), semi-transparentes Weiss auf Android.
- **Warum:** Sofort sichtbare Modernisierung. Kein Konkurrent in der Vet-Nische hat das.
- **Details:** Custom `FloatingTabBar` Komponente ersetzt Standard-Tab-Bar. `position: 'absolute'`, Accent-Dot unter aktivem Tab. Alle 5 Tab-Screens haben extra `paddingBottom` fuer die schwebende Bar. `TAB_BAR_HEIGHT = 80` als shared Konstante.
- **Dateien:** `src/components/FloatingTabBar.tsx` (neu), `src/navigation/AppNavigator.tsx`, alle 5 Tab-Screens

### Onboarding Redesign (AP-8)
- **Was:** Von 2-Schritt-Formular zu 4-Seiten emotionaler Reise: Welcome, Features, Tier hinzufuegen, Fertig!
- **Warum:** Erster Eindruck bestimmt Retention. Storytelling statt Formular.
- **Details:** Horizontaler `FlatList` mit `pagingEnabled`. Progress-Dots (aktiver Dot als 24px Pille). Page 4 mit LinearGradient und Checkmark. Zurueck-Button auf Seite 3 (QA-044 Fix). Bestehende Pet-Speicherungslogik 1:1 uebernommen.
- **Dateien:** `src/screens/OnboardingScreen.tsx`

### Haptic Feedback (AP-3)
- **Was:** `expo-haptics` Integration. AnimatedPressable hat neuen `haptic` Prop. Button (Primary) gibt leichtes Feedback. RemindersScreen vibriert beim Abhaken.
- **Warum:** Macht die App "fuehlig" und premium.
- **Dateien:** `src/components/AnimatedPressable.tsx`, `src/components/Button.tsx`, `src/screens/RemindersScreen.tsx`

### Skeleton Loading Audit (AP-4)
- **Was:** SkeletonLoader auf alle datenladenden Screens ausgerollt. Neue Variante `SkeletonPetCard`.
- **Warum:** Professionelle Ladezustaende statt leerer Screens.
- **Dateien:** `src/components/SkeletonLoader.tsx`, `src/screens/HomeScreen.tsx`, `src/screens/MyPetsScreen.tsx`, `src/screens/RemindersScreen.tsx`, `src/screens/pet/PetHealthTab.tsx`

---

## Verbesserungen

### Button-Konsistenz
- **Was:** `size` Prop (`default`/`large`) fuer Button-Komponente. Onboarding-Buttons auf Button-Komponente migriert. `fontWeight` ohne `fontFamily` in 7 Screens gefixt. AI-Chat Send-Button von Teal auf Accent (Orange) geaendert.
- **Dateien:** `src/components/Button.tsx`, `src/screens/OnboardingScreen.tsx`, `src/screens/AIAssistantScreen.tsx`, `src/screens/PetDetailScreen.tsx`, `src/screens/LoginScreen.tsx`, `src/screens/RegisterScreen.tsx`, `src/screens/AddEventScreen.tsx`, `src/screens/ProfileScreen.tsx`

### Dashboard-Vereinfachung
- **Was:** Erinnerungs-Quick-Action entfernt (KI-Card volle Breite). "Aktivitaet" umbenannt zu "Anstehend". Duplikat-Filter: Timeline zeigt nicht denselben Eintrag wie die Termin-Card.
- **Warum:** Designer-Review ergab Datenredundanz und zu viele gleichwertige Actions.
- **Dateien:** `src/screens/HomeScreen.tsx`

---

## Fehlerbehebungen

### QA-037 — AIAssistantScreen paddingBottom
- Kein Code-Change noetig — SafeAreaView handhabt insets bereits. Dokumentiert als akzeptiert.

### QA-038/039/040/041/042 — Inline-Hex und fontWeight Fixes
- Gradient-Farben auf Theme-Tokens umgestellt. `fontWeight` ohne `fontFamily` in PRO-Badges und Button-Texten gefixt.

### QA-044 — Onboarding Abbruch-Pfad
- Zurueck-Button auf Onboarding Seite 3 hinzugefuegt.

### Doppeltes Profil-Icon im Header
- Profil-Icon in der Greeting-Row durch Platzhalter ersetzt. Absolut positioniertes Icon bleibt.

### Tab Bar Positionierung
- `bottom: insets.bottom > 0 ? insets.bottom : 12` statt `insets.bottom + 16`.

---

## Neue Dependencies

| Library | Zweck |
|---|---|
| `expo-font` | Font-Loading |
| `@expo-google-fonts/dm-sans` | DM Sans Font-Files |
| `@expo-google-fonts/inter` | Inter Font-Files |
| `react-native-reanimated` | Performante Animationen (Fundament) |
| `react-native-gesture-handler` | Gesture-Support |
| `@gorhom/bottom-sheet` | Bottom Sheet Pattern (vorbereitet) |
| `expo-haptics` | Haptic Feedback |
| `expo-blur` | BlurView fuer Floating Tab Bar |
| `babel-preset-expo` | Babel Preset (fehlte) |

---

## Design-Artefakte

| Datei | Inhalt |
|---|---|
| `stitch-petcard.html` | PetCard Karussell Design-Referenz |
| `stitch-bento-dashboard.html` | Bento-Dashboard Design-Referenz |
| `stitch-floating-tabbar.html` | Floating Tab Bar Design-Referenz |
| `stitch-onboarding.html` | Onboarding 4-Seiten Design-Referenz |
| `button-audit.md` | Button-Konsistenz-Analyse |
| `dashboard-review.md` | Dashboard Design-Review |

---

## Geparkt (spaeter)

- **Pet-Card Karussell** — Claas unsicher ob es gut kommt, erstmal nicht
- **Bottom Sheets** — Libraries installiert, Implementierung spaeter
- **Dark Mode** — Eigenes Projekt, beruehrt alle Dateien
- **Personalisierter KI-Chat** — Nach KI-Tool-Use-Integration
- **Erfolgs-Animationen** — Nice-to-have
- **QA-043** — OnboardingScreen Navigation-Refactoring (kein akutes Risiko)
