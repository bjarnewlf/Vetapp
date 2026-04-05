# VetApp Roadmap

> Stand: 2026-04-04
> Phase 2 (MVP) inhaltlich fertig. Handy-Test laeuft. Go-Live noch offen.

---

## Phase 2 — MVP abschliessen (~ 3-5 Tage)

Ziel: Vorzeigbarer MVP auf dem Handy, Kunden-Demo, Zahlung ausloesen (2.160 EUR).

### Sofort — Handy-Test + Bugfixes (1-2 Tage)

- [ ] Restliche Flows testen (7 offen: Hero-Banner, Tier bearbeiten, Event bearbeiten/loeschen, Dokument, Tierarzt, Gradient, Slide-Out)
- [ ] Bugs sammeln und fixen
- [ ] notification_id Migration deployen (0,5 Tage)
- [ ] Alte Tabellen `vaccinations`/`treatments` droppen (0,5 Tage)

### Sicherheit — Release-Blocker (2-3 Tage)

| # | Finding | Schwere | Aufwand | Prioritaet |
|---|---|---|---|---|
| S-1 | Premium-Bypass (togglePro → IAP/RevenueCat) | KRITISCH | 3-4 Tage | VOR Go-Live |
| S-2 | Rate-Limit Fail-Closed | HOCH | 0,5 Tage | VOR Go-Live |
| S-3 | ai_usage-Tabelle + RLS im Schema | HOCH | 0,5 Tage | VOR Go-Live |
| S-4 | Auth-Header Bearer statt x-user-token | MITTEL | 0,5 Tage | VOR Go-Live |
| S-5 | Dokument-URLs on-demand (kurze TTL) | MITTEL | 0,5 Tage | VOR Go-Live |
| S-6 | Storage-Bucket-Policies im Schema | MITTEL | 0,25 Tage | VOR Go-Live |
| S-7 | E-Mail-Validierung RegisterScreen | NIEDRIG | 0,25 Tage | Kann nach Launch |
| S-8 | Auth-Logging hinter __DEV__ | NIEDRIG | 0,25 Tage | Kann nach Launch |

### Design-Polish — MVP-Qualitaet (3 Tage)

| Aufgabe | Aufwand | Warum |
|---|---|---|
| SafeAreaView systemisch (alle Screens) | 0,5 Tage | Content clippt auf neueren iPhones |
| Touch-Targets fixen (Icon-Buttons ≥ 44px) | 0,5 Tage | Accessibility-Minimum |
| Englische Error-Strings → Deutsch | 0,25 Tage | UI-Sprache ist Deutsch |
| EventDetailScreen: Button-Hierarchie | 0,5 Tage | UX-Klarheit |
| PaywallScreen: Gradient + emotionaler Header | 0,75 Tage | Konversion |
| Header-Komponente extrahieren (DRY) | 0,5 Tage | Konsistenz |

### Kunden-Demo + Zahlung

- [ ] MVP auf Handy vorfuehren
- [ ] Phase-2-Zahlung ausloesen (2.160 EUR)

---

## Phase 3 — Testing & Erweiterung (~ 2-4 Wochen)

Ziel: Go-Live-ready, erweiterte Features, Kundenwuensche.

### Kern-Features

| Feature | Aufwand | Status |
|---|---|---|
| KI-Assistent Tool Use (Variante B, Confirm First) | 2-3 Tage | Konzept liegt vor |
| PDF-Export | 2-4 Tage | Scope mit Kunde klaeren |
| Tierarztfinder | 2-4 Tage | Scope mit Kunde klaeren |
| Premium/IAP (RevenueCat) | 3-4 Tage | Release-Blocker (= S-1) |
| Restliche Animationen (5 von 8 offen) | 1-2 Tage | Konzept + Showcase vorhanden |

### Qualitaet

| Aufgabe | Aufwand | Empfehlung |
|---|---|---|
| Test-Strategie umsetzen | 1 Tag | Option A (Jest Unit-Tests) empfohlen — Claas entscheidet |
| RLS-Verifikation (is_premium nicht direkt setzbar) | 0,5 Tage | Nach IAP-Fix zwingend |
| Accessibility-Audit systematisch | 1 Tag | Labels, Rollen, Kontraste |

### Design

| Aufgabe | Aufwand |
|---|---|
| DatePicker-Komponente (statt Freitext) | 1 Tag |
| Design-Konzept v2 umsetzen (Semantic Tokens, Component-Upgrades) | 2-3 Tage |
| Inter Custom Font | 0,5 Tage |

### Go-Live

- [ ] Alle S-1 bis S-6 Findings gefixt
- [ ] IAP funktioniert (RevenueCat)
- [ ] Kunden-Feedback eingearbeitet
- [ ] Finale Version, Uebergabe
- [ ] Phase-3-Zahlung (1.620 EUR)

---

## Backlog — Nach Go-Live

| Feature | Aufwand | Notizen |
|---|---|---|
| Dark Mode (Semantic Tokens zuerst) | 3-4 Tage | Tokens teilweise vorbereitet |
| Bottom Sheets fuer Quick-Actions | 1,5 Tage | |
| Chat-Historie persistent | 1-2 Tage | |
| Guenstigeres KI-Modell evaluieren | 0,5 Tage | Aktuell teures Modell |
| SelectField: Tap-outside schliessen | 0,5 Tage | |
| Deno std Version aktualisieren | 0,25 Tage | |
| Pet-Fotos Neuinstallation ueberleben | 1 Tag | Aktuell: Fotos lokal? |

---

## Abhaengigkeiten

```
S-1 (IAP) ──→ Go-Live (blockiert Release)
S-2 + S-3 ──→ KI-Assistent sicher nutzbar
Handy-Test ──→ Alte Tabellen droppen
S-4 (Bearer) ──→ Client + Edge Function synchron deployen
Test-Strategie ──→ Claas entscheidet (A/B/C)
PDF-Export + Tierarztfinder ──→ Scope mit Kunde klaeren
```

---

## Offene Entscheidungen (Claas)

1. **Test-Strategie:** Option A (Jest minimal, 1 Tag), B (Integration) oder C (spaeter)?
2. **PDF-Export Scope:** Was genau exportieren? Welches Format?
3. **Tierarztfinder Scope:** API-Anbindung oder manuell?
4. **Guenstigeres KI-Modell:** Wann evaluieren?
5. **Pet-Fotos Persistenz:** Prioritaet?

---
Zuletzt aktualisiert: 2026-04-04
