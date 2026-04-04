# Design-Briefing — VetApp, 04.04.2026

## Erstellt von: Designer

---

## Kontext

Vollständige Code-Analyse aller Screens, Components und des Themes.
Folgende 5 Aufgaben haben das beste Nutzen/Aufwand-Verhältnis und sind klar umsetzbar.

---

## Aufgaben (nach Priorität)

---

### D-A: Accessibility — `Button` + `InputField` ⭐⭐⭐
**Aufwand: ~30 Min | Dateien: 2 | Wirkung: global (jede Form, jeder Screen)**

**Button.tsx**
- `accessibilityRole="button"` hinzufügen
- `accessibilityLabel={title}` hinzufügen (title ist bereits vorhanden)
- `accessibilityState={{ disabled: !!disabled }}` hinzufügen

**InputField.tsx**
- `accessibilityLabel={label}` auf dem `TextInput` ergänzen
- Inline `fontSize: 16` → `...typography.body` (aus Theme)
- Inline `paddingHorizontal: 14` → `spacing.sm + spacing.xs` oder fester Wert aus Spacing — hier: `spacing.md - 2` ist ein Sonderfall, alternativ `paddingHorizontal: spacing.md` prüfen ob es visuell passt

---

### D-B: Touch-Target Checkbox — `RemindersScreen` ⭐⭐⭐
**Aufwand: ~10 Min | Datei: 1 | Wirkung: häufig genutzter Screen**

```
// Aktuell (Zeile ~134):
checkbox: { width: 28, height: 28, borderRadius: 14, ... }

// Fix:
checkbox: { width: 44, height: 44, borderRadius: 22, ... }
```

28px verletzt das Minimum von 44px klar. Icon innen bleibt gleich (16px).
Darauf achten dass die Checkbox weiterhin `alignSelf: 'center'` hat.

---

### D-C: Deaktivierte Settings-Items — `ProfileScreen` ⭐⭐
**Aufwand: ~15 Min | Datei: 1 | Wirkung: Demo-Qualität, Nutzervertrauen**

„Datenschutz & Sicherheit" und „Hilfe & Support" haben `onPress: () => {}` — sehen aktiv aus, tun aber nichts. Das ist im Demo-Kontext eine Enttäuschung.

Lösung für die beiden nicht-funktionalen Items:
- Textfarbe → `colors.textLight`
- Chevron-Icon entfernen oder Farbe → `colors.borderLight`
- Optional: kleines „Kommt bald"-Label (typography.caption, colors.textLight)
- `accessibilityState={{ disabled: true }}` setzen

Der `onPress` kann `() => {}` bleiben oder auf einen kurzen `Alert.alert('Kommt bald', '...')` geändert werden — das ist besser als stille Reaktionslosigkeit.

---

### D-D: Inline-Werte bereinigen — `Card` + `StatusBadge` ⭐
**Aufwand: ~15 Min | Dateien: 2 | Wirkung: Konsistenz Design-System**

**Card.tsx**
```
// Aktuell:
padding: 16

// Fix:
padding: spacing.md
```

**StatusBadge.tsx**
```
// Aktuell:
paddingHorizontal: 10,
paddingVertical: 3,
fontSize: 12,
fontWeight: '600',

// Fix:
paddingHorizontal: spacing.sm + 2  // 10 ist kein exakter Theme-Wert — hier spacing.sm (8) prüfen ob es passt, sonst spacing.md (16) zu groß
// Alternativ: paddingHorizontal: 10 belassen und nur die Typography fixen:
...typography.caption,  // fontSize: 12, lineHeight: 16 — passt!
fontWeight: '600',      // caption hat '400', muss überschrieben bleiben
```

---

### D-E: Inline-Farbe — `HomeScreen` ⭐
**Aufwand: ~5 Min | Datei: 1 | Wirkung: Konsistenz**

```
// Aktuell (Zeile ~205):
borderTopColor: '#F5C6C6'

// Fix:
borderTopColor: colors.errorLight  // #FDEAEA — nächster passender Theme-Wert
// oder neuen Token in colors.ts ergänzen wenn der genaue Rotton wichtig ist
```

---

## Reihenfolge

| # | Aufgabe | Dateien | Aufwand |
|---|---|---|---|
| 1 | D-A: Button + InputField Accessibility | `Button.tsx`, `InputField.tsx` | ~30 Min |
| 2 | D-B: Checkbox Touch-Target | `RemindersScreen.tsx` | ~10 Min |
| 3 | D-C: Tote Settings-Items | `ProfileScreen.tsx` | ~15 Min |
| 4 | D-D: Inline-Werte | `Card.tsx`, `StatusBadge.tsx` | ~15 Min |
| 5 | D-E: Hardcoded Farbe | `HomeScreen.tsx` | ~5 Min |

**Gesamt: ~75 Minuten**

---

## TypeScript

Nach jeder Änderung `npx tsc --noEmit` ausführen.
Accessibility-Props (`accessibilityRole`, `accessibilityState`) sind vollständig typisiert in React Native — keine externen Typen nötig.

---

## Nicht in diesem Plan

- Gesundheits-UX Overhaul (abhängig von Datenmodell-Umstrukturierung durch Dev)
- SelectField Tap-outside (separates QA-Finding, eigener Task)
- Neue Design-System-Token (nur bei konkretem Bedarf erweitern)
