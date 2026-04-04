# Projektstatus

> Wird automatisch vom Dokumentar aktualisiert, manuell von Brian bei Bedarf.

## Aktueller Stand

**VetApp** — React Native / Expo, TypeScript strict, Supabase Backend. UI-Sprache Deutsch.

### Was funktioniert (committed + gepusht)

- Auth (Supabase), Haustier-CRUD inkl. Bearbeiten, Dokumente mit Storage
- Impfungen + Behandlungen erfassen, Erinnerungen mit Ueberfaellig-Erkennung
- Tierarzt-Kontakte, Profil-Screen, Paywall-Screen
- KI-Gesundheitsassistent: Eigener Tab (Position 3, Mitte), Edge Function deployed
- KI-Chat abgesichert: Rate Limiting (20/h), Input-Validierung, Prompt-Injection-Schutz
- Accessibility: Button + InputField Labels/Roles, Checkbox 44px, Settings deaktiviert
- Design-System: Theme-Tokens durchgaengig, Accent WCAG-konform (#CC6B3D), Spacing smd:12

---

## Uncommittete Aenderungen

Keine. Working tree ist clean, alle Commits gepusht.

---

## Offene Punkte

### Sofort
- Gesundheits-UX: MedicalEvent Datenmodell + DataContext + Screens umbauen

### Vor Release
- F-02: togglePro() absichern (IAP), F-03: CORS einschraenken
- F-05/F-06: goBack() bei null, F-07: DB-Fehler in refresh()
- F-08: Pet-Fotos in Storage, F-11: notification_id Schema-Drift

### Phase 2
- Custom Font (Inter), Dark Mode (nach Semantic Tokens), Micro-Animationen

### Backlog
- M7: DataContext refactoren, Chat-Historie, SelectField tap-outside
- Guenstigeres KI-Modell, Deno std Update, Demo vorbereiten

---

## Architektur-Hinweise

- API-Keys nur serverseitig (Edge Function), nie im Client
- Storage: Pfade speichern, signed URLs on-demand generieren
- Premium-Gates via SubscriptionContext.isPro + isLoading
- Supabase CLI: npx supabase (Windows)
- KI-Assistent: Custom Header x-user-token (JWT-Workaround)
- Accent-Farbe: #CC6B3D (seit 04.04., vorher #E8895C)
- Theme-Aenderungen: Designer entscheidet WAS, Developer setzt um WO

---

## Vault

Agency-Vault in D:\Agency-Vault\ — 55+ vernetzte Notizen. Retro dokumentiert. Zuletzt inventarisiert 04.04.2026.

---
Zuletzt aktualisiert: 2026-04-04
