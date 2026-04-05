# Design-Review — VetApp
**Datum:** 2026-04-05
**Reviewer:** Designer
**Basis:** Quellcode in `src/`, Mockups (`mockup-dashboard-redesign.html`, `mockup-dashboard-v2.html`, `stitch-home.html`, `animations-showcase.html`, `design-recherche.html`), `qa-findings.md`, `status.md`

---

## 1. Design-System — Gesamtbewertung

**Urteil: Solid, aber nicht konsequent.**

Das Theme in `src/theme/` ist gut aufgestellt. Die Token-Palette deckt den Bedarf vollständig ab: 35 Farb-Tokens, 10 Typografie-Styles, 7 Spacing-Werte, 5 Border-Radien. Die Grundidee — warm, premium, trustworthy — ist in den Farben (#1B6B5A Teal, #CC6B3D Amber, #FAF6F1 Cream) sauber ausgearbeitet und spiegelt sich in den Mockups wider.

**Was stimmt:**
- Alle Screens importieren `colors`, `typography`, `spacing`, `borderRadius` aus `src/theme/`
- Schatten, Ränder und Radien sind einheitlich über die Card-Komponente geregelt
- Der Button hat drei Varianten (primary, secondary, outline) und nutzt konsequent Theme-Tokens
- `EmptyState`, `ErrorBanner`, `StatusBadge`, `SkeletonLoader` — solide primitive Komponente

**Was fehlt oder ist inkonsistent:**

| Problem | Ort | Schwere |
|---|---|---|
| `marginBottom: 16` hardcoded | `InputField.tsx` Z.25 — sollte `spacing.md` sein | Niedrig |
| `paddingHorizontal: 14`, `paddingVertical: 12` hardcoded | `InputField.tsx` Z.37-38 — kein passender Token (spacing.smd=12 und spacing.md=16 wären Optionen) | Niedrig |
| `paddingVertical: 12` im EmptyState-Button | `EmptyState.tsx` Z.53 — sollte `spacing.smd` sein | Niedrig |
| `fontSize: 9` für PRO-Badge | `HomeScreen.tsx` Z.276 — kein Token (bekannt, TODO vorhanden) | Niedrig |
| `paddingTop: 60` hardcoded in 4 Screens | Kein SafeArea-Token, kein `useSafeAreaInsets`-Hook | **Mittel** |
| Gradient-Farben im LinearGradient-Header | `HomeScreen.tsx` Z.71 — `primaryMid` und `primaryGradientEnd` existieren als Token, werden aber als hardcodiertes Array übergeben, nicht aus `colors` gelesen | Niedrig |
| `fontSize: 32` im LoginScreen-Titel | `LoginScreen.tsx` Z.95 — überschreibt `typography.h1` (28px) ohne Token-Basis | Niedrig |

**Gesamtbewertung:** 90% Token-Nutzung ist für den aktuellen MVP-Stand gut. Die Ausreißer sind überschaubar.

---

## 2. Screen-by-Screen Review

### 2.1 LoginScreen / RegisterScreen

**Stärken:**
- Zweiteiliges Layout (grüner Header + weißes Form-Sheet) erzeugt gute visuelle Spannung
- Das Icon-Circle-Pattern ist konsistent mit der Paywall-Eröffnung
- `KeyboardAvoidingView` korrekt implementiert

**Probleme:**
- **Kein Loading-State während Auth:** Der Button-Text wechselt auf "Wird geladen...", aber der Button bleibt aktiv (kein `disabled={loading}`). User kann mehrfach auf Anmelden tippen.
- **Kein Passwort-Vergessen-Link.** Bei einem Auth-Fehler ("falsches Passwort") gibt es keinen Ausweg. Das ist eine UX-Sackgasse.
- **Kein Keyboard-Dismiss** beim Tippen außerhalb des Formulars.
- **Passwortfeld ohne Toggle.** `secureTextEntry` ohne Sichtbarkeits-Toggle ist 2026 ein Usability-Problem.

**Priorität: Hoch** — Passwort-Vergessen blockiert echte User.

---

### 2.2 HomeScreen

**Stärken:**
- Gradient-Header mit Greeting ist das stärkste visuelle Element der App — warm, einladend
- KI-Card ist gut positioniert: visuell distinct, aber nicht aufdringlich
- Die dreistufige Struktur (Tiere → Termine → KI) hat eine klare Logik

**Probleme:**
- **Section-Trennung fehlt.** Zwischen "Meine Tiere", "Nächste Termine" und der KI-Card gibt es kein visuelles Atemholen. Nur `marginBottom: spacing.lg` (24px). Ein dezenter Divider oder ein `paddingTop: spacing.sm` am sectionHeader würde Luft schaffen.
- **sectionTitle (h2, 22px) kämpft mit dem Body-Content.** Die Sektion "Nächste Termine" hat denselben Typography-Stil wie "Meine Tiere" — aber die Termine sind kleiner/dichter. Ein `typography.sectionHeader` (13px uppercase) würde hier besser hierarchisieren.
- **Die Timeline-Empty-State ist zu leise.** Nur ein `caption`-Text in der Mitte — kein Card-Container, kein Icon. Inkonsistent gegenüber dem PetList-EmptyState, der die `EmptyState`-Komponente nutzt.
- **Das Greeting-Emoji** ("👋") ist der einzige Emoji außerhalb von EmptyState-Komponenten. Entweder System-weit Emojis zulassen oder konsequent weglassen.
- **Kein Skeleton-State beim initialen Laden.** Der HomeScreen hat FadeIn-Animation, aber solange Pets und MedicalEvents laden, ist der Body leer. Mindestens ein SkeletonLoader für die Pet-Liste wäre angemessen.

**Vergleich Mockup:** Die `mockup-dashboard-v2.html` zeigt Pet-Cards als horizontales Scroll-Karussell (150x185px) mit Tier-Foto oben und Name/Badge unten. Im Code sind es vertikale PetListRows — kein Karussell. Das ist eine bewusste Vereinfachung (oder noch nicht umgesetzt). Die Mockup-Hierarchie ist visuell stärker.

**Priorität: Mittel**

---

### 2.3 MyPetsScreen

Nicht direkt gelesen, aber aus der Struktur: Nutzt PetListRow-Komponente. Da PetListRow 42px-Avatare hat (knapp unter dem 44px-Touch-Target-Minimum), sollte der Avatar auf mindestens 44x44px angehoben werden.

**Priorität: Niedrig**

---

### 2.4 PetDetailScreen — Hero-Banner + Tab-Navigation

**Stärken:**
- Pet-Hero-Banner mit Gradient-Overlay ist das zweite starke visuelle Moment neben dem HomeScreen-Header
- Tab-Slide-Indikator mit Animated.spring ist eine schöne Detail-Animation
- Tab mit "Pro"-Badge (Dokumente) — klare visuelle Kommunikation des Paywall-Gates

**Probleme:**
- **Tab-Bar hat keinen Hintergrund-Separator** zum Content darunter. Wenn der Tab-Inhalt scrollt, gibt es kein klares Trennelement.
- **Die drei Tab-Labels** ("Gesundheit", "Dokumente", "Tierarzt") sind sprachlich inkonsistent mit der Navigation: der Tab heißt "Vet Contact" (Englisch), der Screen heißt "Tierarzt" (Deutsch). Das ist ein Lokalisierungs-Leak.
- **Kein Refresh-Indikator** beim Pull-to-Refresh in der Health-Tab-Liste.

**Priorität: Niedrig**

---

### 2.5 AddPetScreen / AddEventScreen (Forms)

**Stärken:**
- `InputField` hat konsistentes Label + Input-Pattern
- `SelectField` für Dropdown — ordentlich

**Probleme:**
- **Das Foto-Upload-Feld ist zu klein.** Die dashed-border Box mit `padding: spacing.lg` hat keine Mindesthöhe definiert. Auf kleinen Bildschirmen kann das zusammenquetschen. Ein `minHeight: 120` würde das sichern.
- **Kein visueller Fortschritt beim Speichern.** Der Button-Text wechselt auf "Wird gespeichert...", aber es gibt keine Progress-Indikation (kein ActivityIndicator, kein Ladebalken). Auf langsamen Verbindungen wirkt das wie eingefroren.
- **AddEventScreen: Der 3-Schritt-Stepper** ist funktional korrekt, aber visuell nicht ausgearbeitet. Die Schritte (Tier wählen → Typ wählen → Details) haben keinen sichtbaren Progress-Indikator im UI — nur den internen State. Ein Step-Indicator (3 Dots oder "Schritt 1 von 3") würde die Orientierung massiv verbessern.
- **Datum-Eingabe** als freies Textfeld (`tt.mm.jjjj`) ist die größte UX-Schwäche der App. Es gibt keinen DatePicker, keinen Platzhalter-Text im Feld, keine Live-Validierung während der Eingabe. Ein Fehler wird erst beim Speichern gemeldet. Das ist ein häufiger Drop-Off-Punkt.

**Priorität: Hoch** (Datum-Problem) / Mittel (Stepper, Foto)

---

### 2.6 RemindersScreen

**Stärken:**
- Farbcodierte Karten (roter Rand = überfällig, akzent = upcoming) sind intuitiv
- Slide-Out-Animation beim Abhaken ist das beste Micro-Interaction-Moment der App
- Überdue-Banner mit Pulse-Animation ist kommunikativ

**Probleme:**
- **Der "+ Erinnerung hinzufügen"-Button** sitzt ganz oben — vor der Liste. Das ist ungewöhnlich. Typischerweise ist der CTA ein FAB (Floating Action Button) rechts unten oder ein Header-Button. Gerade wenn die Liste lang wird, muss der User nach oben scrollen um eine neue Erinnerung anzulegen.
- **Kein FAB** vorhanden — im Mockup angedeutet, nicht umgesetzt.
- **Visuelle Dichte:** Titel (h3, 18px) + Datum + Badge + Description in einer Karte kann sehr dicht werden. Ein `gap: 6` statt festem `marginTop` würde mehr Flexibilität geben (schon vorhanden, gut).
- **Datums-Formatierung:** `toLocaleDateString('de-DE', ...)` — korrekt, aber das Ergebnis ("5. Apr. 2026") ist anders als das Eingabe-Format ("05.04.2026"). Das kann User verwirren.

**Priorität: Mittel** (FAB/CTA-Positionierung)

---

### 2.7 AIAssistantScreen

**Stärken:**
- Der Empty-State ist der beste im ganzen Projekt: Hero-Badge, 3 Feature-Cards, Quick-Action-Chips. Viel Arbeit, gut sichtbar.
- Chat-Bubbles mit abgerundeten Ecken (24px oben, 8px Ecke unten = Tail-Effekt) sind sauber
- Disclaimer-Strip immer sichtbar — Accessibility-Bewusstsein

**Probleme:**
- **Der AI-Avatar-Badge** (28x28px Sparkles-Icon) ist zu klein für visuelles Gewicht. In einer langen Chat-Unterhaltung verliert der User den Überblick wer gerade spricht. 36px wäre besser.
- **Kein Markdown-Rendering in AI-Antworten.** LLM-Antworten enthalten oft **Fettdruck**, Aufzählungen oder `Code`. Die App rendert reinen Text — Formatierung geht verloren.
- **Quick-Action-Chips:** Das `chevron-forward`-Icon links und das `arrow-forward-outline`-Icon rechts in derselben Zeile sind redundant. Ein Icon reicht — rechts.
- **Keyboard-Offset von 0** (`keyboardVerticalOffset={0}`) kann auf bestimmten Geräten dazu führen, dass die Input-Bar hinter der Tastatur verschwindet. Sollte device-spezifisch getestet werden.
- **Kein "Neues Chat"-Button** im leeren Zustand nach dem Löschen — der User landet auf dem Empty-State, muss aber aktiv tippen. Eine Quick-Action für den letzten Kontext wäre hilfreich.

**Priorität: Niedrig–Mittel**

---

### 2.8 PaywallScreen

**Stärken:**
- Sauberes, fokussiertes Layout: Icon → Titel → Features → Preis → CTA
- Feature-Icons in `primaryLight`-Circles sind konsistent mit dem Design-System
- "Vielleicht später" als sekundärer CTA — psychologisch korrekt

**Probleme:**
- **Der "Jetzt upgraden"-Button ist Orange (Accent-Farbe).** Das ist richtig — Accent ist die CTA-Farbe. Aber die Paywall-Header-Farbe ist `primary` (Teal). Der Kontrast zwischen Teal-Header-Icon und Orange-Button unten bricht die visuelle Linie.
- **Kein Preis-Kontext.** "4,99 € / Monat" steht allein. Was bekommt der User für Free? Ein Mini-Vergleich ("Free: 1 Tier | Pro: Unbegrenzt") würde die Conversion-Rate verbessern.
- **Feature-List ist statisch** — unabhängig vom Trigger-Feature (`feature`-Parameter) sind immer alle 5 Features gelistet. Wenn der User von der Dokumente-Paywall kommt, könnte der erste Eintrag hervorgehoben werden.
- **Kein "Restore Purchase"**-Link — notwendig für App-Store-Compliance (auch wenn IAP noch nicht implementiert ist, sollte der Platz vorgehalten werden).

**Priorität: Mittel** (Conversion-Optimierung) / **Hoch** (App-Store-Compliance vor Release)

---

### 2.9 VetContactScreen

**Stärken:**
- Kompakte Kontakt-Karte mit Icon-Circles vor jeder Info-Zeile ist konsistent
- Direktanruf via `Linking.openURL` — sofortiger Mehrwert

**Probleme:**
- **Empty-State verwendet Inline-Styles** (`style={{ alignItems: 'center' as const, marginTop: 32 }}`). Das ist ein Token-Leak und sollte in einen `StyleSheet.create`-Block.
- **Der Screen nutzt `EmptyState` nicht** (die Komponente existiert genau für diesen Fall), sondern baut seinen eigenen Empty-State inline mit `Ionicons + Text + Button`. Inkonsistent zu allen anderen Screens.
- **Kein visueller Trennbereich** wenn mehrere Info-Zeilen vorhanden sind — nur `gap` im Container. Ein leichter `borderTop` auf den infoRows würde klarer strukturieren.

**Priorität: Niedrig**

---

### 2.10 ProfileScreen

**Probleme:**
- **Settings-Items mit `disabled: true`** ("Datenschutz & Sicherheit", "Hilfe & Support") werden genauso dargestellt wie aktive Items. Kein visueller Hinweis dass diese nicht funktionieren — bis der User tippt und einen "Kommt bald"-Alert bekommt. Das ist frustrierend.
- **Profil bearbeiten** zeigt denselben Alert. Die Pencil-Icon-Button suggeriert echte Funktionalität.
- **Premium-Features-Liste** im Profil zeigt 4 Features (KI-Assistent, Symptom-Fotoanalyse, Gesundheitstrends, Intelligente Erinnerungen) — zwei davon (Symptom-Fotoanalyse, Gesundheitstrends) existieren nicht in der App. Das ist falsches Marketing.

**Priorität: Mittel** (falsche Feature-Versprechen vor Demo)

---

## 3. UX-Flows

### Navigation

**Gut:**
- 5-Tab-Navigation ist intuitiv und vollständig
- Deep-Links in den Stack-Screens funktionieren (PetDetail → EventDetail etc.)
- Profil als Stack-Screen (kein 6. Tab) ist die richtige Entscheidung

**Probleme:**
- **Tab-Labels sind gemischt Deutsch/Englisch** in `AppNavigator.tsx`: `'My Pets'`, `'AI'`, `'Vet Contact'` — während die Screen-Titel auf Deutsch sind ("Meine Tiere", "Tierarzt"). Tab-Labels erscheinen in der Tab-Bar — User sehen "My Pets" statt "Meine Tiere".
- **"Zurück"-Navigation** in AddPetScreen, AddEventScreen etc. nutzt einen eigenen Back-Button statt des nativen Stack-Back-Buttons. Das ist konsistent, aber der Header-Bereich (`paddingTop: 60`) verschwendet Platz.
- **EventDetail-Screen:** Von der Reminders-Liste gelangt man in den EventDetail-Screen, aber Erinnerungen sind technisch Reminders, keine MedicalEvents. Der Routing-Pfad (`navigate('EventDetail', { eventId: item.id })`) funktioniert — aber ist semantisch verwirrend.

### Feedback bei Aktionen

**Gut:**
- Alert-Dialoge bei Validierungsfehlern (einheitlich)
- ErrorBanner bei DB-Fehlern
- Loading-States mit SkeletonLoader

**Probleme:**
- **Kein Erfolgs-Feedback nach Speichern.** Nach "Tier speichern" springt der Screen einfach zurück. Kein Toast, kein kurzes Feedback. Der User weiß nicht ob etwas passiert ist.
- **Button-Doppelklick-Schutz** ist nicht überall implementiert. In `LoginScreen` fehlt `disabled={loading}` auf dem Button.

---

## 4. Accessibility

**Gut:**
- Button-Komponente hat `accessibilityRole="button"` und `accessibilityLabel={title}`
- InputField nutzt `accessibilityLabel={label}`
- RemindersScreen-Checkbox hat `accessibilityState` (gefixt in QA-031)

**Probleme (ergänzend zu QA-030):**

| Problem | Ort | Schwere |
|---|---|---|
| Kein `accessibilityLabel` auf PetListRow | F-030 bekannt | Niedrig |
| Kein `accessibilityLabel` auf TimelineItem | F-030 bekannt | Niedrig |
| `paddingTop: 60` ohne `useSafeAreaInsets` | Alle Screens mit eigenem Header | **Mittel** — auf Plus/Pro-Modellen mit größerem Notch kann Content hinter der Status-Bar verschwinden |
| Touch-Target Avatar in PetListRow | 42x42px — 2px unter Minimum | Niedrig |
| Tab-Labels auf Englisch | AppNavigator | Mittel — Screen-Reader liest "My Pets" statt "Meine Tiere" |
| Kontrast `colors.textLight` (#999999) auf `colors.background` (#FAF6F1) | Caption-Texte allgemein | 3.5:1 — unter WCAG AA (4.5:1) |

---

## 5. Mockup vs. Code — Delta

### Umgesetzt aus den Mockups

- Gradient-Header (mockup-dashboard-redesign.html): vollständig
- KI-Card (mockup-dashboard-v2.html): vollständig, mit Theme-Tokens
- Pet-Hero-Banner in PetDetailScreen: vollständig
- Slide-Out-Animation (animations-showcase.html): vollständig
- Überfällig-Banner mit Pulse: vollständig
- SkeletonLoader: vollständig

### Noch nicht umgesetzt

| Feature | Quelle | Status |
|---|---|---|
| Pet-Cards als horizontales Karussell (150x185px, Foto + Badge) | mockup-dashboard-v2.html | Nicht umgesetzt — vertikale Liste stattdessen |
| FAB (Floating Action Button) für schnelle Erfassung | mockup-dashboard-redesign.html, animations-showcase.html | Nicht umgesetzt (Backlog) |
| "Letzte Aktivität"-Sektion im HomeScreen | mockup-dashboard-v2.html | Nicht umgesetzt |
| Animiertes Einblenden der Timeline-Items (Stagger) | animations-showcase.html (Animation #3) | Nicht umgesetzt |
| Scale-Feedback auf Quick-Actions im AI-Screen | animations-showcase.html (Animation #6) | Teilweise: AnimatedPressable vorhanden, aber nicht auf Quick-Action-Chips |
| Konfetti/Success-Animation nach Event-Erstellung | animations-showcase.html (Animation #5) | Nicht umgesetzt |

---

## 6. Top-5 Design-Empfehlungen

### Empfehlung 1 — Tab-Labels auf Deutsch (Quick Win, Hoch)

**Problem:** Tab-Bar zeigt "My Pets", "AI", "Vet Contact" auf Deutsch-Geräten.
**Fix:** In `AppNavigator.tsx` die Tab-Namen auf Deutsch setzen: `'Meine Tiere'`, `'Assistent'` oder `'KI'`, `'Tierarzt'`. Gleichzeitig `tabBarLabel`-Prop nutzen falls der Route-Name aus anderen Gründen englisch bleiben muss.
**Aufwand:** 15 Minuten.
**Impact:** Professioneller Eindruck, korrekte Accessibility für deutsche Nutzer.

---

### Empfehlung 2 — SafeArea konsequent implementieren (Quick Win, Mittel)

**Problem:** Alle Screens mit eigenem Header nutzen hardcoded `paddingTop: 60`. Auf iPhones mit Dynamic Island (iPhone 15+) kann das zu wenig sein, auf kleineren Geräten zu viel.
**Fix:** `useSafeAreaInsets()` aus `react-native-safe-area-context` einsetzen. Muster:
```
const insets = useSafeAreaInsets();
// paddingTop: insets.top + spacing.md
```
Alternativ: eine `ScreenHeader`-Komponente erstellen die das zentral regelt.
**Aufwand:** 2–3 Stunden (alle betroffenen Screens).
**Impact:** Korrektes Layout auf allen Geräten, Accessibility.

---

### Empfehlung 3 — Datum-Eingabe verbessern (Mittlerer Aufwand, Hoch)

**Problem:** Freies Textfeld `tt.mm.jjjj` ist fehleranfällig und hat keine Live-Validierung. Häufigster Grund für Validierungs-Alerts.
**Optionen (Aufwand aufsteigend):**
- **A (Minimal):** Masked Input — automatisch Punkte einfügen nach Tag und Monat. Kein externes Package nötig, machbar mit `onChangeText`-Handler.
- **B (Standard):** Nativer DatePicker via `@react-native-community/datetimepicker` (bereits im Backlog notiert). Expo-kompatibel, kein Expo-eigenes Package nötig.
**Empfehlung:** Option A als Quick Fix jetzt, Option B in Phase 3.
**Aufwand:** Option A: 1 Tag. Option B: 2 Tage inkl. Testing.
**Impact:** Weniger Fehler-Alerts, bessere Completion-Rate beim Onboarding.

---

### Empfehlung 4 — Paywall vor Demo-Termin polieren (Mittlerer Aufwand, Hoch)

**Problem:** Falsches Feature-Versprechen im Profil-Screen, fehlender Preis-Kontext in der Paywall, Tab-Labels auf Englisch — alles zusammen schwächt den ersten Eindruck beim Kunden.
**Fix-Paket:**
1. Profil-Screen: Falsche Features ("Symptom-Fotoanalyse", "Gesundheitstrends") entfernen oder auf tatsächlich existierende ersetzen.
2. Paywall: Kurzen Free-vs-Pro-Vergleich als 2-Spalten-Tabelle oder Bullet-Liste ergänzen.
3. Deaktivierte Settings-Items visuell ausgrauen (`opacity: 0.4`) statt voll aktiv darstellen.
**Aufwand:** 3–4 Stunden.
**Impact:** Demo überzeugt, keine falschen Versprechen vor der Phase-2-Zahlung.

---

### Empfehlung 5 — Pet-Cards als Karussell umsetzen (Größerer Umbau, Mittel)

**Problem:** Die vertikale PetListRow ist funktional, aber das horizontale Karussell aus dem Mockup hat erheblich mehr visuelle Wirkung — besonders wenn man dem Kunden das Design vorstellt. Es zeigt das Tier-Foto prominent und schafft mehr "App-Gefühl".
**Vorgehensweise:**
1. `PetCard`-Komponente erstellen (150x185px, Foto oben 80px Circle, Name fett, Badge)
2. Im HomeScreen die PetListRow durch horizontales `ScrollView` mit `PetCard` ersetzen
3. Scroll-Hint: 2 volle + 1 angeschnittene Karte
**Aufwand:** 1 Tag (Designer: Komponente spezifizieren + Stitch-Referenz erstellen; Developer: Umsetzung)
**Impact:** Visuell stärkster Einzeleffekt. Bringt den Code näher an die Mockup-Vision.

---

## 7. Offene Punkte (Backlog-tauglich)

Diese Punkte sind bekannt oder wurden schon diskutiert, aber hier nochmals aus Design-Perspektive priorisiert:

| Punkt | Priorität | Aufwand |
|---|---|---|
| DatePicker statt Textfeld | Hoch | 2 Tage |
| FAB für schnelle Erinnerungs-/Event-Erfassung | Mittel | 1 Tag |
| Erfolgsfeedback nach Speichern (Toast-Komponente) | Mittel | 0.5 Tage |
| Markdown-Rendering in AI-Antworten | Mittel | 1 Tag |
| Custom Font (Inter) einbinden | Niedrig | 0.5 Tage |
| `colors.textLight` (#999999) Kontrast erhöhen auf #888 | Niedrig | 30 Min |
| Passwort-Sichtbarkeits-Toggle im Login | Mittel | 1 Stunde |
| "Passwort vergessen"-Flow | Hoch (Sackgasse) | 0.5 Tage |

---

## 8. Zusammenfassung

| Bereich | Note | Kommentar |
|---|---|---|
| Design-System | B+ | Solid, wenige Ausreißer, gut wartbar |
| Visuelle Konsistenz | B | 90%+ Token-Nutzung, Gradient/Header-Farben als Inline-Wert |
| Typografie-Hierarchie | B+ | Klar, lesbar — sectionHeader-Token noch untergenutzt |
| Spacing & Whitespace | B | HomeScreen atmet zu wenig zwischen Sektionen |
| UX-Flows | C+ | Tab-Labels auf Englisch, Datum-Eingabe, Sackgasse Passwort-Vergessen |
| Accessibility | C | SafeArea fehlt, Tab-Labels Englisch, textLight unter WCAG AA |
| Mockup-Umsetzungsgrad | 70% | Kern umgesetzt; Karussell, FAB, Stagger-Animationen fehlen |
| Demo-Readiness | B- | Falsche Feature-Versprechen im Profil vor Demo bereinigen |

**Kernaussage:** Die App hat ein klares, warmes Identitätsgefühl. Das Design-System trägt. Die größten Baustellen vor der Kunden-Demo sind die englischen Tab-Labels (5-Minuten-Fix), die falschen Feature-Versprechen im Profil und die SafeArea-Problematik. Für Phase 3 ist das Pet-Karussell der visuell wirkungsvollste Einzelschritt.

---

*Erstellt von Designer-Agent, 2026-04-05*
*Nächster Schritt: Brian priorisiert die 5 Empfehlungen und delegiert Quick Wins an Developer.*
