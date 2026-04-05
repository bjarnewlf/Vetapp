# Changelog — 05. April 2026

## Zusammenfassung

Langer Sprint-Tag mit neun Sessions. Kernthemen: Security-Fixes (S-2 bis S-8), Deployment, QA-Runden und Animierter Header. Am Abend zwei visuelle Features implementiert — Collapsing Gradient Header fuer den HomeScreen und Parallax Hero fuer den PetDetailScreen. Handy-Test bestaetigt: jaehrliche Erinnerungen, Tierarzt-Kontakt und SafeArea funktionieren korrekt.

---

## Neue Features

### HomeScreen — Collapsing Gradient Header (Session 10)
- **Was:** Animated Header der beim Scrollen von expanded (120px, Greeting + Welcome-Text) zu collapsed (64px, "VetApp" + Profil-Icon) schrumpft. Pull-to-Reveal produziert visuellen Stretch-Effekt.
- **Warum:** Mehr Platz fuer Inhalt beim Scrollen, visuell polierte Uebergabe an den Kunden.
- **Details:** `ScrollView.onScroll`-Event interpoliert Header-Hoehe und Opacity zweier Layer. `insets.top` korrekt beruecksichtigt. "VetApp"-Text war initial unsichtbar (paddingTop fraß den Platz) — Fix: `headerCollapsedContent` positioniert am `bottom: 0`, kein `paddingTop` mehr in der JSX-Instanz.
- **Dateien:** `src/screens/HomeScreen.tsx`

### PetDetailScreen — Parallax Hero (Session 10)
- **Was:** 240px Hero mit Tierfoto (50% Opacity), Parallax-Effekt beim Scrollen, Gradient-Overlay. Collapsed auf 80px mit zentriertem Tiernamen. Overscroll stretcht das Foto.
- **Warum:** Visueller Aufwertungs-Sprint — App soll beim Kunden-Demo beeindrucken.
- **Details:** Foto-Opacity fadet beim Collapse von 0.5 auf 0 (Hintergrund "verschwindet" sauber). Performance-Optimierungen: `shouldRasterizeIOS`, `renderToHardwareTextureAndroid`, `removeClippedSubviews`, doppeltes Nav-Rendering eliminiert. `LinearGradient` von `absoluteFill` auf feste Positionen umgestellt — kein Layout-Recalc mehr pro Frame. `useNativeDriver: true` nicht moeglich fuer height-Interpolation (RN-Einschraenkung), Hardware-Texture-Hints kompensieren.
- **Dateien:** `src/screens/PetDetailScreen.tsx`

---

## Fehlerbehebungen

### F-034 — console.error/warn ohne __DEV__-Guard (Sessions 8+9)
- **Was:** 2 verbleibende Stellen mit Production-Logging gefunden und gefixt.
- **Wo:** `src/context/VetContactContext.tsx` Z.49 (console.error), `src/context/PetContext.tsx` Z.241 (console.warn)
- **Fix:** Beide Stellen in `if (__DEV__) { ... }` gewrapped. Alle anderen Context-Stellen waren bereits geguardet (S-8).
- **Dateien:** `src/context/VetContactContext.tsx`, `src/context/PetContext.tsx`

### SafeArea Tab-Bar — Bottom-Padding korrigiert (Session 10)
- **Was:** Tab-Bar Bottom-Padding war zu knapp, dann zu gross — jetzt korrekt: `insets.bottom` ohne Extra-Padding, Tab-Hoehe `60 + insets.bottom`.
- **Warum:** Auf iPhone-Geraeten mit Home-Indicator wurde die Tab-Bar entweder abgeschnitten oder hatte zu viel Luft.
- **Dateien:** Tab-Bar-Konfiguration (AppNavigator / Tab-Styles)

### HomeScreen — "VetApp" Text im Collapsed Header sichtbar (Session 10)
- **Was:** Text war unsichtbar weil `paddingTop: insets.top` in der Collapsed-View den verfuegbaren Platz auffrass (64 - 47 - 12 = 5px Resthoehe).
- **Fix:** `paddingTop` aus JSX-inline-Style entfernt. `headerCollapsedContent` jetzt `bottom: 0` + `height: HEADER_COLLAPSED_HEIGHT`, `justifyContent: 'center'`.
- **Dateien:** `src/screens/HomeScreen.tsx`

### PetDetailScreen — Foto-Bleed im Collapsed State behoben (Session 10)
- **Was:** Hintergrundfoto verschwand nicht wenn Header vollstaendig collapsed war — Foto blieb sichtbar als visueller Artefakt.
- **Fix:** Foto-Opacity fadet per Animated.interpolate von 0.5 (expanded) auf 0 (collapsed).
- **Dateien:** `src/screens/PetDetailScreen.tsx`

---

## Security-Fixes (Sessions 7+8)

### S-2 bis S-8 deployed (Sessions 7-9)
- **S-2:** Rate-Limit Fail-Closed in Edge Function `ai-chat` — deployed
- **S-3:** `ai_usage`-Tabelle Schema-Dokumentation
- **S-4:** Authorization Bearer Header auf User-JWT umgestellt — deployed
- **S-5:** Dokument-URLs bestaetigt auf 1h begrenzt (kein Fix noetig)
- **S-6:** Storage-Bucket `pet-documents` Policies dokumentiert
- **S-7:** E-Mail-Validierung clientseitig
- **S-8:** Auth-Logging flaechendeckend hinter `__DEV__`-Guard (inkl. F-034)

---

## Infrastruktur & Deployment

### Migrations und CLI synchronisiert (Session 9)
- Migration-Dateien von 8-stellig auf 14-stellig umbenannt (Supabase CLI Format)
- 3 alte Migrationen als `applied` markiert — CLI synchron
- `notification_id`-Migration deployed (Spalte existierte bereits)
- Edge Function `ai-chat` deployed (S-2 + S-4 live)

### GitHub bereinigt (Session 9)
- 14 Commits gepusht
- `master` in `main` gemerged — beide Branches aktuell
- Fake-Task "alte Tabellen droppen" als ungueltig entfernt (waren nur Variablennamen)

### SafeArea flaechendeckend (Session 6)
- `useSafeAreaInsets()` in allen Screens eingefuehrt
- F-033: OnboardingScreen SafeArea — beim vorherigen Umbau uebersehen, nachgefixt

---

## QA-Runden

### QA-Runde 7 (Session 9) — 4 Findings
- F-033 (Mittel): OnboardingScreen SafeArea fehlte — gefixt
- 3 Niedrig-Findings dokumentiert

### Handy-Test (Session 10) — alle Punkte bestanden
- Jaehrliche Erinnerungen abhaken: bestanden
- 30-Tage-Anzeige: bestanden
- Tierarzt-Kontakt (Anlegen, Bearbeiten, Anrufen): bestanden
- SafeArea unten: bestanden

---

## Archiv / Recherchen

- **Maestro E2E-Tests** — Konzept evaluiert, im Vault archiviert. Nicht weiterverfolgt fuer MVP.
- **Agency-Website Black-Hole-Hover** — Idee von Claas, im Vault unter Ideen gesichert.

---

## Statistik

- Sessions: 10 (inkl. Crash-Recovery, Security-Sprint, Deployment, Feature-Entwicklung)
- Haupt-Dateien geaendert: `HomeScreen.tsx`, `PetDetailScreen.tsx`, `VetContactContext.tsx`, `PetContext.tsx`, Edge Function `ai-chat`
- TypeScript-Check: 0 Fehler (bestaetigt nach jeder Session)
- Offene Findings: F-022, F-023, F-024, F-025, F-027, F-028, F-029, F-030, F-031, F-032, F-035, F-036

---

## Offene Punkte

- **S-1 — Premium-Bypass:** `togglePro()` muss vor Go-Live durch RevenueCat IAP ersetzt werden. Release-Blocker. (Phase 3)
- **F-035:** `ai_usage` Insert-Reihenfolge — Rate-Limit-Zaehler koennte bei gleichzeitigen Requests inkonsistent sein
- **F-036:** UTC/Lokal-Mix im 30-Tage-Horizont — bis zu 2h Abweichung, kosmetisch
- **useNativeDriver:** height-Interpolationen laufen auf JS-Thread (RN-Einschraenkung) — Hardware-Texture-Hints mildern, echter Native Driver nicht moeglich ohne Architektur-Umbau
- **Naechster Schritt:** MVP-Demo beim Kunden vorbereiten → Phase-2-Zahlung (2.160 EUR) ausloesen
