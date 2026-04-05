# Demo-Ready Checklist

> Was muss stehen, bevor wir dem Kunden die App zeigen (MVP-Demo)?
> Erstellt: 2026-04-04 | Status: Fast alles erledigt

---

## BLOCKER — erledigt!

### Infrastruktur ✅
- [x] **DB-Migrationen deployed** — medical_events + recurrence_check
- [x] **Edge Function deployed** — neues medicalHistory-Format
- [x] **Storage-Policy** — Pet-Fotos Upload funktionsfaehig
- [ ] **notification_id Migration** — reminders-Tabelle (noch offen)
- [ ] **App auf Handy testen** — Expo Go, alle Flows durchklicken

### Code-Fixes ✅
- [x] **F-015: Error-Handling** — CRUD boolean-Return, Screens pruefen
- [x] **F-017: Guard fuer leere petId**
- [x] **F-018: Onboarding Error-Handling**
- [x] **F-023: Onboarding Foto-Upload**

### UI-Fixes ✅
- [x] **Leerer Screen bei Nicht-Pro** — SkeletonLoader statt weisse Flaeche
- [x] **Card shadowColor** — Theme-Token
- [x] **Gesundheits-Sektionen** — visuell getrennt
- [x] **Inline-Styles** — in StyleSheet

## SOLLTE REIN ✅ (fast alles erledigt)

- [x] **Pet-Fotos in Storage** (F-08)
- [x] **Hero-Bild im PetDetail-Header**
- [x] **KI-Disclaimer dezenter**
- [x] **EmptyState-Komponenten** mit Persoenlichkeit
- [ ] **Demo-Daten vorbereiten** — Beispiel-Tier mit Events (optional)
- [ ] **DatePicker statt Textfeld** — noch offen, nice-to-have

## KANN FAKEN / WORKAROUND

- [x] **togglePro()** — Dev-Toggle fuer Demo reicht
- [x] **CORS** — native Demo, kein Problem
- [x] **Chat-Historie** — Session-basiert OK
- [x] **ReminderSettings** — funktioniert jetzt!

## NICHT NOETIG FUER DEMO

- IAP / echter Kaufprozess
- Dark Mode, Custom Font
- Animationen (Konzept steht, Umsetzung Phase 3)
- Accessibility-Audit
- Test-Suite

---

## Status: FAST DEMO-READY 🎉

Nur noch:
1. Handy-Test durchfuehren
2. Bugs fixen die dabei auffallen
3. notification_id Migration deployen

---
Zuletzt aktualisiert: 2026-04-04
