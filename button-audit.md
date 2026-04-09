# Button Audit — VetApp

Stand: 2026-04-07

## Referenz: Button-Komponente (Soll-Zustand)

`src/components/Button.tsx` — der etablierte Standard:

| Eigenschaft | Wert |
|---|---|
| Hoehe | `paddingVertical: 14` → ca. 14+22+14 = **50px** (kein festes `height`) |
| borderRadius | `borderRadius.xl` = **24** |
| Farbe Primary | `colors.accent` = `#CC6B3D` |
| Farbe Secondary | `colors.primaryDark` = `#145244` |
| Outline | transparent + `borderColor: colors.accent` |
| Font | `typography.button` = Inter 600 SemiBold, 16px |
| Text Primary | `colors.textOnAccent` = `#FFFFFF` |
| Touch-Target | mind. 50px durch paddingVertical |

---

## 1. Bestandsaufnahme — Screens mit eigenen Button-Styles

### Nutzt Button-Komponente korrekt

| Screen | Button-Komponente genutzt | Anmerkung |
|---|---|---|
| MyPetsScreen | Ja | Sauber |
| AddPetScreen | Ja | Sauber |
| EventDetailScreen | Ja (3x) | Sauber |
| AddEventScreen | Ja | Sauber |
| AddReminderScreen | Ja | Sauber |
| RemindersScreen | Ja | Sauber |
| PaywallScreen | Ja | Sauber — plus 1 eigener Text-Link (kein Button) |
| ProfileScreen | Ja — aber mit Override! | `upgradeButton`-Style setzt `backgroundColor: colors.accent` — das ueberschreibt `primary`-Variant. Technisch OK, aber redundant |
| LoginScreen | Ja | Sauber |
| RegisterScreen | Ja | Sauber |
| VetContactScreen | Ja | Sauber |
| AddVetContactScreen | Ja | Sauber |
| ReminderSettingsScreen | Kein CTA-Button | Nur Radio-Options, kein Speichern-Button noetig |

### Hat eigene inline Button-Styles (Abweichungen)

| Screen | Anzahl Custom-Buttons | Art der Abweichung |
|---|---|---|
| **OnboardingScreen** | 3 eigene Buttons | Komplett eigene Styles — kein Button-Import genutzt |
| **HomeScreen** | 4 quasi-Buttons (Bento-Cards) | TouchableOpacity als Karten, keine Buttons; plus 2 Text-Links |
| **AIAssistantScreen** | 2 | sendButton + quickActionChip |
| **PetDetailScreen** | Keine CTA-Buttons | Tab-Wechsel-Buttons + heroNavBtn — korrekt als Nav-Elemente |

---

## 2. Inkonsistenzen im Detail

### OnboardingScreen — die groessten Abweichungen

**p1.btn / p4.btn (Seiten 1, 2, 4):**
```
height: 52           → Soll: kein fixes height, paddingVertical: 14
borderRadius: full   → Soll: borderRadius.xl (24)
backgroundColor: colors.accent / colors.surface  → fuer Page 1+2 korrekt (accent)
```
- `borderRadius.full (999)` erzeugt eine Pille statt eines Rounded-Rechtecks
- Page 4 (`Los geht's`): `backgroundColor: colors.surface`, Text `color: colors.primary` — ist eine bewusste Inversion auf dem Gradient-Hintergrund. Kein direktes Mapping zur Button-Komponente moeglich
- `btnText` nutzt `typography.button` — Font-Token ist korrekt
- Kein `accessibilityRole="button"` — Accessibility-Problem

**Keine Haptic-Feedback Logik** — die Button-Komponente triggert `Haptics.impactAsync` bei Primary. Die Onboarding-Buttons tun das nicht.

### AIAssistantScreen — sendButton

```
width: 44, height: 44     → Soll: kein fixes height (paddingVertical-basiert)
borderRadius: full (999)  → Soll: borderRadius.xl (24)
backgroundColor: colors.primary  → Soll (Primary): colors.accent (#CC6B3D)
```
- **Farbe kritisch**: `colors.primary` (#1B6B5A, Teal) statt `colors.accent` (#CC6B3D, Orange) — Primary-CTA faerbt sich falsch ein
- Icon-only Button hat kein `accessibilityLabel`
- `sendButtonDisabled`: `backgroundColor: colors.border` statt `opacity: 0.5` — inkonsistent mit Button-Komponente

**quickActionChip:**
```
borderRadius: borderRadius.lg (16)  → Soll: borderRadius.xl (24) fuer Buttons
paddingVertical: spacing.md (16)    → ergibt ~48px Hoehe — akzeptabel
backgroundColor: colors.surface    → kein accent-Hintergrund, ist aber ein Chip/Link, kein CTA
```
- QuickActionChip ist konzeptuell kein Button sondern ein Link-Chip — Abweichung ist vertretbar, aber borderRadius sollte einheitlich sein

### ProfileScreen — upgradeButton-Override

```
upgradeButton: {
  backgroundColor: colors.accent,   // ueberschreibt colors.accent (doppelt, weil primary-variant bereits accent nutzt)
}
```
- `<Button variant="primary" style={styles.upgradeButton} />` — der Style-Override setzt `backgroundColor: colors.accent` auf eine Variante die bereits `colors.accent` hat. Ist technisch funktional, aber unnoetig und kann zukuenftige Refactorings verwirren.
- Kein Bug, aber Cleanup noetig.

### PetDetailScreen — heroName Inline-Styles

```
heroName: {
  fontSize: 28,
  fontWeight: '800',       // PROBLEM: kein fontFamily gesetzt!
  color: '#FFFFFF',        // hartcodiert statt colors.textOnPrimary
  letterSpacing: -0.5,
}
heroMeta: {
  fontSize: 13,
  color: 'rgba(255,255,255,0.85)',  // kein Token
  marginTop: 4,
}
```
- `fontWeight: '800'` ohne `fontFamily` — auf Android faellt React Native in System-Default. DM Sans ist nicht eingebunden, der Text rendert in einer anderen Schrift. Soll: `fontFamily: fonts.heading.bold` (DMSans_700Bold)
- Kein direkter Button-Bezug, aber diese Styles betreffen die visuelle Hierarchie des Screens

### tabLabel in PetDetailScreen

```
tabLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' }
tabLabelActive: { color: colors.primary, fontWeight: '600' }
```
- `fontWeight` ohne `fontFamily` — diese Overrides werden auf Android ignoriert oder rendern falsch. Soll: `fontFamily: fonts.body.medium` bzw. `fonts.body.semiBold`.

### infoValue in PetDetailScreen

```
infoValue: { ...typography.bodySmall, color: colors.text, fontWeight: '500' }
```
- Gleiche Problematik: `fontWeight: '500'` ohne `fontFamily`. Soll: `fonts.body.medium` explizit setzen oder `typography.bodySmall` reicht (ist bereits Inter 400).

### LoginScreen / RegisterScreen — switchLink

```
switchLink: {
  ...typography.body,
  color: colors.primary,
  fontWeight: '600',      // PROBLEM: kein fontFamily
}
```
- `fontWeight: '600'` ohne `fontFamily` — auf Android kein SemiBold sondern System-Fallback. Soll: `fontFamily: fonts.body.semiBold`.

### AddEventScreen — forPetLabel

```
forPetLabel: {
  ...typography.bodySmall,
  color: colors.primary,
  fontWeight: '600',      // PROBLEM: kein fontFamily
}
```
- Gleiche Problematik. Soll: `fontFamily: fonts.body.semiBold` ersetzen.

### AddEventScreen / AddReminderScreen — proTagText

```
proTagText: {
  fontSize: 11,
  fontWeight: '600',    // PROBLEM: kein fontFamily
  color: colors.accent,
}
```
- Soll: `fontFamily: fonts.body.semiBold`.

---

## 3. Empfehlungen pro Screen

### OnboardingScreen — Prioritaet HOCH

**Problem:** Komplett eigene Button-Styles ohne Button-Komponente. Drei verschiedene visuelle Button-Typen:
1. `p1.btn` / verwendet auch in `p2`: "Weiter"-Button — Accent-Hintergrund, volle Breite
2. `p4.btn`: "Los geht's" — invertiert (weiss auf Gradient), gesonderte Behandlung noetig

**Empfehlung:**
- `p1.btn` und `p2`-Button-Wiederverwendung: Ersetzen durch `<Button title="Weiter" onPress={onNext} />` — Button-Komponente kennt accent-Hintergrund als primary
- `borderRadius.full` durch `borderRadius.xl` ersetzen fuer einheitliche Pille-vs-Rounded-Entscheidung. Wenn der "Pille"-Look fuer Onboarding gewuenscht bleibt, muss das explizit als Design-Entscheidung dokumentiert werden
- `height: 52` beibehalten? Groesse-Token beachten: 52px ist der "grosse Button" laut Briefing. Entweder die Button-Komponente kriegt eine `size`-Prop (large: paddingVertical 15, height 52) oder Onboarding bleibt eine bewusste Ausnahme
- `p4.btn` (weiss auf Gradient): Bleibt als Custom-Style — kein Mapping zur Button-Komponente moeglich ohne eine `variant="inverted"` hinzuzufuegen. Wenn die Variante oefters vorkommt, sollte sie ins System aufgenommen werden
- `accessibilityRole="button"` auf allen `TouchableOpacity`-Buttons ergaenzen

### AIAssistantScreen — Prioritaet HOCH (Farbe falsch)

**sendButton:**
- `backgroundColor: colors.primary` → auf `colors.accent` aendern — Primary-CTA muss orange sein, nicht teal
- `sendButtonDisabled`: `backgroundColor: colors.border` → auf `opacity: 0.5` aendern (konsistent mit Button-Komponente)
- `accessibilityLabel="Nachricht senden"` erganzen
- `borderRadius: full` → Kreis-Button (44x44) — hier ist `borderRadius.full` korrekt weil es ein quadratischer Icon-Button ist. Diese Ausnahme ist OK, aber dokumentieren.

**quickActionChip:**
- `borderRadius: borderRadius.lg (16)` → auf `borderRadius.xl (24)` erhoehen — konsistenter mit restlichen interaktiven Elementen
- Kein CTA-Button im klassischen Sinne — Chip-Pattern kann so bleiben, aber Radius angleichen

### ProfileScreen — Prioritaet NIEDRIG

- `upgradeButton`-Style entfernen: `backgroundColor: colors.accent` ist bereits der Default der primary-Variante. Style-Override ist redundant und erzeugt falschen Eindruck eines Overrides.

### PetDetailScreen — Prioritaet MITTEL (Font-Bugs)

- `heroName`: `fontWeight: '800'` → `fontFamily: fonts.heading.bold` ersetzen, `'#FFFFFF'` → `colors.textOnPrimary`
- `heroMeta`: `'rgba(255,255,255,0.85)'` → als Token fehlt dieser Wert. Entweder `colors.textOnPrimary` mit `opacity: 0.85` oder neuen Token `colors.textOnPrimaryMuted` erwaegen
- `tabLabel` / `tabLabelActive`: `fontWeight: '500'/'600'` → `fontFamily: fonts.body.medium` / `fonts.body.semiBold`
- `infoValue`: `fontWeight: '500'` entfernen oder durch `fontFamily: fonts.body.medium` ersetzen

### LoginScreen / RegisterScreen — Prioritaet MITTEL (Font-Bug)

- `switchLink`: `fontWeight: '600'` → `fontFamily: fonts.body.semiBold`

### AddEventScreen — Prioritaet NIEDRIG

- `forPetLabel`: `fontWeight: '600'` → `fontFamily: fonts.body.semiBold`
- `proTagText`: `fontWeight: '600'` → `fontFamily: fonts.body.semiBold`

### HomeScreen — keine Button-Anpassung noetig

Die Bento-Cards (`bentoCardQuickEvent`, `bentoCardReminder`, `bentoCardAI`) sind konzeptuell Navigation-Cards, keine Buttons — andere visuelle Sprache ist korrekt. `addLink`-Styles sind Text-Links, kein Button-Pattern. Kein Handlungsbedarf.

### Alle Screens mit korrekter Button-Komponente — kein Handlungsbedarf

MyPetsScreen, AddPetScreen, EventDetailScreen, AddEventScreen, AddReminderScreen, RemindersScreen, PaywallScreen, LoginScreen, RegisterScreen, VetContactScreen, AddVetContactScreen, ReminderSettingsScreen nutzen Button korrekt.

---

## 4. Zusammenfassung: Priorisierte To-do-Liste

| Prioritaet | Screen | Problem | Fix |
|---|---|---|---|
| HOCH | AIAssistantScreen | sendButton: `colors.primary` statt `colors.accent` | `backgroundColor` korrigieren |
| HOCH | OnboardingScreen | Eigene Buttons ohne Komponente, kein Accessibility | Button-Komponente nutzen oder explizit dokumentierte Ausnahme |
| MITTEL | PetDetailScreen | `fontWeight` ohne `fontFamily` (heroName, tabLabel, infoValue) | `fontFamily`-Token setzen |
| MITTEL | LoginScreen + RegisterScreen | `fontWeight: '600'` ohne `fontFamily` in switchLink | `fontFamily: fonts.body.semiBold` |
| NIEDRIG | AddEventScreen | `fontWeight` ohne `fontFamily` (forPetLabel, proTagText) | `fontFamily: fonts.body.semiBold` |
| NIEDRIG | ProfileScreen | Redundanter `backgroundColor`-Override in upgradeButton | Style-Override entfernen |
| NIEDRIG | AIAssistantScreen | quickActionChip: borderRadius 16 statt 24 | `borderRadius.xl` |

---

## 5. System-Empfehlung: Button-Groessen-Token fehlt

Die Button-Komponente hat keine `size`-Prop. Das Briefing definiert zwei Groessen:
- **Standard**: 44px — derzeit paddingVertical: 14 ergibt ~50px (leicht drueber)
- **Gross**: 52px — fuer Onboarding-CTAs und prominente Full-Width-Buttons

**Empfehlung fuer Developer**: `size?: 'default' | 'large'` zur Button-Komponente hinzufuegen:
- `default`: paddingVertical: 14 (aktuell)
- `large`: paddingVertical: 15 + minHeight: 52

Das loest die Onboarding-Situation sauber und macht das System explizit statt implizit.
