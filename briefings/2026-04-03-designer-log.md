# Designer Session Log — 03.04.2026

## Status: Aktiv

---

## Erledigte Aufgaben

### Design-Konzept v2 erstellt
- Datei: `docs/design-konzept-v2.md`
- Inhalt: Vollständiges Konzept für Phase 2 — Farb-System, Typografie, Components, Screen-Konzepte, AI-Chat-Layout, Accessibility-Pflichtliste, Umsetzungsplan
- Fokus: Modern & aktuell, kein Redesign sondern Qualitätssprung auf bestehendem System

---

## Wichtige Änderung (Navigation)

Navigation wurde aktualisiert — wirkt sich auf das Design-Konzept aus:

**Alt:**
> 5 Tabs: Home, Pets, Reminders, Vet Contacts, Profile

**Neu:**
> 5 Tabs: Home, Pets, **AI Assistant**, Reminders, Vet Contacts  
> Profile: kein Tab mehr — erreichbar über Header-Button auf dem HomeScreen

**Konsequenzen für Design:**
- AI-Assistant-Tab braucht ein Icon (Vorschlag: `sparkles` oder `chatbubble-ellipses-outline`)
- HomeScreen-Header braucht einen Profil-Button (Avatar oder Person-Icon oben rechts)
- ProfileScreen-Design bleibt gleich, nur Einstiegspunkt ändert sich
- Tab-Bar hat jetzt AI als zentralen dritten Tab — gute Position, unterstreicht Premium-Feature

---

## Offene Fragen (warten auf Claas)

1. **Dark Mode:** Scope für Phase 2 oder Backlog?
2. **Custom Font (Inter):** Ja / Nein / Später?
3. **Micro-Animationen:** Ja für MVP oder schlank halten?
4. **Orange-Kontrast:** Button-Hintergrund abdunkeln (`#D4743E`) oder Text auf Dunkel?

---

## Nächste Schritte (noch nicht gestartet)

- Freigabe Konzept v2 durch Claas abwarten
- Danach: Theme-Tokens erweitern (`colors.ts`)
- Danach: Component-Upgrades (Button loading, Card pressable, InputField Error-State)
- Danach: Neue Components (EmptyState, ListItem, ChatBubble)
- Parallel zu Developer: AI-Chat-Screen-Design vorbereiten

---

## Kontext aus anderen Briefings

- Pakete 1, 2, 4, 5 laufen parallel (Developer)
- Paket 3 (AI-Assistent): Designer → Developer → QA
- Housekeeping (Push, Temp-Bild, Dev-Toggle) noch offen
- TypeScript: 0 Fehler im letzten Build
