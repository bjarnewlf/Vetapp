# Smoke-Test-Checkliste — VetApp

Manuelle Checkliste fuer QA-Reviews. Vor jedem Release-Kandidaten vollstaendig durchgehen.
Stand: 2026-04-04

---

## ST-01 — Auth-Flow (Login / Register / Logout)

**Prioritaet:** Kritisch — App nicht nutzbar ohne funktionierenden Auth

**Schritte:**
1. App starten — Login-Screen erscheint (kein eingeloggter Zustand)
2. Registrierung: neue E-Mail + Passwort eingeben, "Registrieren" tippen
3. Nach erfolgreichem Register: automatisch eingeloggt, Home-Tab sichtbar
4. Profil-Icon (Header auf Home-Tab) tippen — Profil-Screen oeffnen, "Abmelden" tippen
5. Login: bekannte E-Mail + Passwort eingeben, "Anmelden" tippen

**Erwartetes Ergebnis:**
- Register fuehrt direkt in die App (kein manueller Login danach noetig)
- Logout zeigt sofort den Login-Screen — keine Tab-Navigation mehr sichtbar
- Login mit korrekten Credentials: direkt auf Home-Tab
- Login mit falschem Passwort: Alert "Login fehlgeschlagen" mit Fehlermeldung
- Leere Felder beim Login/Register: Alert "Fehlende Angaben"

- [ ] Bestanden

---

## ST-02 — Haustier anlegen inkl. Foto-Upload

**Prioritaet:** Kritisch — Kern-Feature der App

**Schritte:**
1. Tab "Tiere" oeffnen — auf "Tier hinzufuegen" tippen
2. Foto-Bereich antippen — Bild aus Galerie auswaehlen (quadratischer Crop)
3. Name eingeben, Tierart auswaehlen (Dropdown), Geburtsdatum im Format tt.mm.jjjj eingeben
4. "Tier speichern" tippen
5. Zurueck auf Tier-Uebersicht — neues Tier mit Foto sichtbar

**Erwartetes Ergebnis:**
- Foto wird als Vorschau sofort angezeigt (lokale URI vor dem Speichern)
- Nach Speichern: Tier erscheint in der Liste mit hochgeladenem Foto (signed URL)
- Pflichtfeldvalidierung: Fehler-Alert wenn Name oder Tierart fehlt
- Ungueltigesm Datum (z.B. 32.01.2024): Alert "Ungultiges Datum"
- Free-Tier mit bereits 1 Tier: beim Versuch ein zweites anzulegen -> Paywall-Screen

- [ ] Bestanden

---

## ST-03 — Gesundheits-Event erstellen und bearbeiten

**Prioritaet:** Kritisch — medizinische Daten sind der Kernwert der App

**Schritte (Erstellen):**
1. Tier-Detailscreen oeffnen — "Event hinzufuegen" tippen
2. Stufenauswahl durchlaufen: Tier waehlen (falls kein Preselect), Typ "Impfung" waehlen
3. Titel, Datum (tt.mm.jjjj) und optionale Notizen eingeben, "Event speichern" tippen
4. Zurueck auf Tier-Detailscreen — Event in der Liste sichtbar

**Schritte (Bearbeiten):**
5. Event in der Liste antippen — EventDetail-Screen oeffnen
6. Bearbeiten-Button tippen — AddEventScreen im Edit-Modus oeffnet sich
7. Datum aendern, "Aktualisieren" tippen — zurueck, geaendertes Datum sichtbar

**Erwartetes Ergebnis:**
- 3-Schritt-Progress-Indikator zeigt korrekten Schritt
- Entwurmung / Vorsorge / Eigener Typ ohne Pro -> Paywall-Screen (Pro-Tag sichtbar auf Karte)
- Wiederholung != "Einmalig" ohne Pro -> Paywall beim Speichern
- Pflichtfelder fehlen: Alert "Fehlende Angaben"

- [ ] Bestanden

---

## ST-04 — Erinnerung erstellen und abhaken

**Prioritaet:** Kritisch — Erinnerungs-Feature und Slide-Out-Animation

**Schritte:**
1. Tab "Erinnerungen" oeffnen — "+ Erinnerung hinzufuegen" tippen
2. Titel eingeben, Datum in der Vergangenheit eingeben (fuer Ueberfaellig-Test), speichern
3. Zurueck auf Erinnerungs-Liste — Erinnerung erscheint mit rotem Rand und "Ueberfaellig"-Badge
4. Ueberfaellig-Banner oben pruefe: "X ueberfaellig" sichtbar
5. Checkbox rechts an der Erinnerung tippen — Slide-Out-Animation (translateX + Fade), Eintrag verschwindet

**Erwartetes Ergebnis:**
- Vergangenes Datum -> Status "overdue", roter Rand, Banner zaehlt korrekt
- Checkbox-Tap: Animation laeuft vollstaendig vor Loeschung aus DB (kein sofortiges Verschwinden)
- Doppel-Tap auf Checkbox: zweiter Tap wird ignoriert (pendingIds-Guard)
- Netzwerkfehler beim Abschluss: Animation wird zurueckgesetzt, Alert "Speichern fehlgeschlagen"
- Leere Liste -> EmptyState mit "Keine Erinnerungen" und CTA-Button

- [ ] Bestanden

---

## ST-05 — Dokument hochladen (Pro-Funktion)

**Prioritaet:** Hoch — Storage-Integration und Pro-Gate

**Schritte:**
1. Free-Tier: Dokumente-Bereich eines Tiers oeffnen — Upload-Button antippen
2. Paywall-Screen erscheint (Feature: 'documents')
3. Pro aktivieren (via Paywall "Jetzt upgraden")
4. Dokument-Upload erneut versuchen — Datei aus Galerie/Dateisystem auswaehlen
5. Dokument erscheint in der Liste mit Dateiname und Datum

**Erwartetes Ergebnis:**
- Ohne Pro: Paywall blockiert, kein Upload moeglich
- Mit Pro: Upload-Flow erreichbar, Datei landet in Bucket pet-documents unter userId/petId/timestamp_name
- Datei mit Sonderzeichen im Namen: wird zu sicheren Zeichen sanitiert (safeName-Funktion)
- Doppelter Upload derselben Datei: zweiter Versuch schlaegt fehl (upsert: false), kein stilles Ueberschreiben

- [ ] Bestanden

---

## ST-06 — KI-Assistent Nachricht senden

**Prioritaet:** Hoch — Edge Function + Rate Limiting + Pro-Gate

**Schritte:**
1. Free-Tier: Tab "KI-Assistent" oeffnen -> Paywall-Screen erscheint automatisch
2. Pro aktivieren, KI-Tab erneut oeffnen — Empty-State mit Hero, Feature-Cards und Quick-Actions sichtbar
3. Quick-Action antippen (z.B. "Impfplan erklaeren") — Nachricht wird direkt gesendet
4. Waehrend Antwort laedt: Typing-Bubble (ActivityIndicator) sichtbar, Senden-Button deaktiviert
5. Antwort erscheint als KI-Bubble, Chat-Verlauf scrollbar

**Erwartetes Ergebnis:**
- Ohne Pro: sofortige Weiterleitung zur Paywall beim Betreten des Tabs
- Disclaimer-Strip "KI-Antworten sind keine tieraerztliche Beratung" stets sichtbar
- Netzwerkfehler: User-Bubble erhaelt Retry-Link "Fehler beim Senden. Erneut versuchen."
- Chat loeschen (Papierkorb-Icon): Verlauf wird geleert, Empty-State kehrt zurueck
- Leeres Eingabefeld: Senden-Button deaktiviert (grau)

- [ ] Bestanden

---

## ST-07 — Tierarzt-Kontakt anlegen und bearbeiten

**Prioritaet:** Mittel — einfache CRUD-Funktion, ein Datensatz pro User

**Schritte:**
1. Tab "Tierarzt" oeffnen — EmptyState mit "Tierarzt hinzufuegen" sichtbar
2. Button tippen — AddVetContact-Screen: Name, Praxis, Telefon, E-Mail, Adresse eingeben
3. "Tierarzt hinzufuegen" tippen — zurueck auf VetContact-Screen, Kontakt-Karte sichtbar
4. Bearbeiten-Button tippen — AddVetContact im Edit-Modus, Felder vorbelegt
5. Telefonnummer aendern, speichern — Karte zeigt aktualisierten Wert

**Erwartetes Ergebnis:**
- Kein Name: Alert "Fehlende Angabe"
- Nach Speichern: Karte zeigt alle eingegebenen Felder (nicht eingegebene Felder werden nicht angezeigt)
- Telefon-Link auf der Karte: tippen oeffnet Telefon-App (Linking.openURL)
- Zweiter Kontakt kann nicht angelegt werden (isEditing-Flag basiert auf vorhandenem vetContact)

- [ ] Bestanden

---

## ST-08 — Navigation zwischen allen Tabs

**Prioritaet:** Mittel — Grundfunktion der App

**Schritte:**
1. Alle 5 Tabs der unteren Tab-Bar nacheinander antippen: Home, Tiere, KI-Assistent, Erinnerungen, Tierarzt
2. Von einem Tab aus in einen Stack-Screen navigieren (z.B. Tier-Detail), dann zurueck
3. Profil-Screen ueber Header-Button auf Home-Tab oeffnen und schliessen
4. Tab wechseln waehrend ein Stack-Screen offen ist

**Erwartetes Ergebnis:**
- Jeder Tab-Wechsel zeigt den korrekten Screen ohne Flackern
- Zurueck-Navigation aus Stack-Screens funktioniert (goBack, Pfeil-Icon)
- Profil ist kein Tab, sondern ein Stack-Screen (kein Tab-Icon dafuer)
- KI-Tab ohne Pro: Paywall erscheint (nur einmal pro Tab-Besuch, nicht bei Tab-Wechsel zurueck)

- [ ] Bestanden

---

## ST-09 — Paywall und Premium-Gate

**Prioritaet:** Mittel — Revenue-kritisch, korrekte Feature-Sperrung

**Schritte:**
1. Free-Tier sicherstellen (nach Neuinstallation oder Logout/Login ohne Pro)
2. Zweites Tier anlegen versuchen -> Paywall mit feature='pets'
3. Auf Paywall: Feature-Liste, Preis (4,99 EUR/Monat, 39,99 EUR/Jahr), "Jetzt upgraden" tippen
4. Pro ist jetzt aktiv (togglePro) — zurueck, zweites Tier kann angelegt werden
5. Paywall erneut oeffnen, "Vielleicht spaeter" oder X tippen -> schliesst ohne Aktion

**Erwartetes Ergebnis:**
- Paywall zeigt korrekte Feature-Liste (5 Eintraege: Tiere, Ereignistypen, Wiederholungen, Dokumente, PDF-Export)
- "Jetzt upgraden" aktiviert Pro und schliesst Paywall (goBack)
- "Vielleicht spaeter" und X schliessen Paywall ohne Pro zu aktivieren
- Nach Pro-Aktivierung: gesperrte Event-Typen (Entwurmung, Vorsorge) ohne Pro-Tag sichtbar

- [ ] Bestanden

---

## ST-10 — Fehler-Zustaende und Edge Cases

**Prioritaet:** Niedrig — Stabilitaet bei schlechten Bedingungen

**Schritte:**
1. Netzwerk deaktivieren, App starten — Login-Versuch
2. Netzwerk deaktivieren, waehrend Tier-Liste geladen wird
3. Tier ohne Foto anlegen (kein Pflichtfeld)
4. Erinnerungs-Tab oeffnen ohne vorhandene Erinnerungen
5. Tierarzt-Tab oeffnen ohne gespeicherten Kontakt

**Erwartetes Ergebnis:**
- Offline-Login: Alert mit Fehlermeldung (kein leerer Screen, kein App-Crash)
- Offline-Datenladen: ErrorBanner mit Retry-Button sichtbar (nicht leere Liste)
- Tier ohne Foto: Platzhalter-Icon statt Foto, kein Fehler
- Leere Erinnerungsliste: EmptyState-Komponente mit CTA "Erinnerung erstellen"
- Leerer Tierarzt-Tab: EmptyState-Karte mit "Tierarzt hinzufuegen"-Button

- [ ] Bestanden

---

## Durchfuehrungs-Hinweise

- Jeden Flow auf einem **echten Geraet** testen (iOS oder Android), nicht nur im Simulator
- Free-Tier und Pro-Zustand separat testen (ST-02, ST-03, ST-05, ST-06, ST-09)
- Foto-Upload (ST-02, ST-05) benoetigt aktive Supabase-Verbindung zum Bucket `pet-documents`
- Datum-Eingaben immer im Format `tt.mm.jjjj` — andere Formate sollen Fehler-Alerts ausloesen
- KI-Assistent (ST-06) benoetigt aktive Edge Function — Rate-Limit-Verhalten bei Bedarf separat testen
