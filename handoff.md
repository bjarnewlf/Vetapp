# Uebergabeprotokoll

> Wird von jedem Agent nach seiner Arbeit aktualisiert.
> Brian liest das bei Session-Start. Aeltere Eintraege werden nach Commit aufgeraeumt.

---

## Erinnerungen von Claas (Wissensmanager)

- **Duplikat loeschen:** `D:\Agency-Vault\Learnings\Alle Dokumente nach Arbeit aktualisieren.md` — Claas manuell loeschen
- **Entscheidung ausstehend:** Test-Strategie fuer VetApp — Option A (Unit-Tests), B (Integration-Tests) oder C (nichts) → `D:\Agency-Vault\Konzepte\Test-Strategie.md`

---

## Aktuelle Uebergabe

**Agent:** Developer
**Zeitpunkt:** 2026-04-04
**Session:** F-008 — Pet-Fotos in Supabase Storage

### Erledigt

- **`src/types/index.ts`** — `Pet` Interface um `photoStoragePath?: string` erweitert (kommentiert: signed URL in photo, Storage-Pfad in photoStoragePath)
- **`src/utils/fileUpload.ts`** — drei neue Funktionen: `uploadPetPhoto`, `getPetPhotoUrl`, `deletePetPhoto`. Bucket bleibt `pet-documents`, Pfad `pet-photos/{userId}/{petId}.jpg`. Upload mit `upsert: true` (Foto-Ersetzen erlaubt)
- **`src/context/PetContext.tsx`** — kompletter Storage-Flow integriert:
  - `mapPet()` erkennt Storage-Pfade (starts with `pet-photos/`) vs. alte lokale URIs
  - `refresh()` generiert signed URLs (1h gueltig) parallel fuer alle Pets mit Storage-Foto
  - `addPet(petData, photoUri?)` — Zwei-Schritt: Pet anlegen via `.select('id').single()`, dann Foto hochladen mit echter Pet-ID, dann Storage-Pfad in DB schreiben
  - `updatePet(id, data, photoUri?)` — altes Foto loeschen, neues hochladen, Storage-Pfad im Update-Batch
  - `deletePet(id)` — loescht Foto aus Storage (best effort) vor DB-Delete
- **`src/screens/AddPetScreen.tsx`** — vereinfacht: `photoPreviewUri` fuer Vorschau, `newPhotoUri` fuer neue Auswahl. Upload-Logik vollstaendig im Context. Kein useAuth/uploadPetPhoto Import mehr noetig

### Upload-Flow

Neues Pet mit Foto:
1. Supabase Insert (photo_url = null) → gibt ID zurueck
2. uploadPetPhoto(userId, petId, localUri) → Storage-Pfad
3. Supabase Update (photo_url = storagePath)
4. refresh() → mapPet → getPetPhotoUrl → signed URL in pet.photo

Bestehendes Pet Foto aendern:
1. deletePetPhoto(altes storagePath) (best effort)
2. uploadPetPhoto(userId, petId, localUri) → neuer Pfad
3. Supabase Update inkl. photo_url = neuer Pfad
4. refresh()

### Edge Cases abgedeckt
- Kein Foto → kein Upload, photo_url bleibt null
- Upload-Fehler bei neuem Pet → Pet wird trotzdem angelegt (Fehler geloggt)
- Upload-Fehler bei Edit → Update ohne Foto-Aenderung
- Storage-Loeschfehler → wird geloggt, Pet-Operation laeuft weiter
- Alte lokale URIs (Migration) → werden unveraendert in pet.photo weitergegeben

### TypeScript
0 Fehler

### Offen / Was noch fehlt
- **Supabase Storage Bucket-Policy:** Der Bucket `pet-documents` muss authenticated uploads fuer den Pfad `pet-photos/*` erlauben. Falls noch nicht konfiguriert: in Supabase Dashboard pruefen (Storage → Policies)
- **Keine Foto-Loeschen-UI:** Der User kann im AddPetScreen kein bestehendes Foto entfernen (nur ersetzen). Falls gewuenscht: "Foto entfernen"-Button einbauen, der `updatePet(id, { photo: undefined })` mit explizitem `photo_url = null` aufruft. updatePet behandelt photo=undefined aktuell nicht (nur photoUri wird ausgewertet)
- **Signed URL Ablauf:** URLs sind 1h gueltig. Bei langer App-Nutzung koennen sie ablaufen. Loesung: refresh() erneut aufrufen (z.B. bei app foreground). Noch nicht implementiert

### Wichtig fuer den Naechsten
- `Pet.photo` = signed URL (on-demand, 1h) oder alte lokale URI (Migration). Niemals direkt in DB schreiben
- `Pet.photoStoragePath` = echter Storage-Pfad, wird fuer Delete/URL-Generierung genutzt
- `addPet`/`updatePet` Interface hat optionalen `photoUri?: string` Parameter — alle bestehenden Aufrufe ohne photoUri funktionieren unveraendert
- Storage-Bucket: `pet-documents`, Pfad-Prefix: `pet-photos/`

---

## Vorherige Uebergabe (Developer — F-015)

**Agent:** Developer
**Zeitpunkt:** 2026-04-04
**Session:** F-015 — Error-Handling in Contexts fixen (Boolean-Return-Pattern)

### Erledigt
- **`src/context/PetContext.tsx`** — addPet, updatePet, deletePet, addDocument, deleteDocument: alle `Promise<void>` → `Promise<boolean>`. Bei Supabase-Fehler: setError + return false. Bei Erfolg: refresh + return true
- **`src/context/MedicalContext.tsx`** — addMedicalEvent, updateMedicalEvent, deleteMedicalEvent, addReminder, completeReminder, updateReminder, deleteReminder: alle auf `Promise<boolean>` umgestellt
- **`src/context/VetContactContext.tsx`** — saveVetContact: `Promise<void>` → `Promise<boolean>`
- **`src/screens/AddPetScreen.tsx`** — try/catch entfernt, Boolean-Check: nur bei success goBack(), sonst Alert
- **`src/screens/AddVetContactScreen.tsx`** — try/catch entfernt, Boolean-Check
- **`src/screens/AddEventScreen.tsx`** — try/catch entfernt, Boolean-Check fuer updateMedicalEvent, updateReminder, addMedicalEvent. addReminder-Fehler wird nicht als fataler Fehler behandelt (Event gespeichert, Reminder optional)
- **`src/screens/OnboardingScreen.tsx`** — try/catch auf Boolean-Pattern umgestellt (onComplete nur bei success)
- **`src/screens/PetDetailScreen.tsx`** — handleDeleteDocument, handleDeleteVaccination, handleDeleteTreatment: Alert-Callbacks auf async mit Boolean-Check. handlePickDocument: try/catch auf Boolean
- **`src/screens/AddReminderScreen.tsx`** — try/catch auf Boolean-Pattern
- **`src/screens/EventDetailScreen.tsx`** — handleComplete, handleReschedule: try/catch auf Boolean-Pattern
- **`src/screens/RemindersScreen.tsx`** — handleToggle: completeReminder Boolean-Check, Alert importiert

### CRUD-Aufrufe angepasst: 16 Stellen in 7 Screens

### TypeScript
0 Fehler

### Wichtig fuer den Naechsten
- Alle CRUD-Methoden in PetContext, MedicalContext, VetContactContext geben jetzt Promise<boolean> zurueck
- Screens prufen den Rueckgabewert — kein blindes goBack() mehr nach CRUD
- addDocument wirft keinen Fehler mehr (war throw e) — nur noch return false

---

## Vorherige Uebergabe (Developer — F-022)

**Agent:** Developer
**Zeitpunkt:** 2026-04-04
**Session:** F-022 — ReminderSettings funktionsfaehig machen

### Erledigt
- **`src/hooks/useOverdueSettings.ts`** (neu) — Hook kapselt AsyncStorage-Lesen der OverdueRule. Exportiert `OverdueRule` Typ, `OVERDUE_RULE_KEY`, `DEFAULT_OVERDUE_RULE` als Single Source of Truth
- **`src/services/notifications.ts`** — neue Funktion `scheduleOverdueNotifications(reminders, rule)` plant beim Oeffnen des RemindersScreens eine gebundelte Push-Notification: daily = morgen 9 Uhr, weekly = in 7 Tagen, never = keine Aktion
- **`src/screens/RemindersScreen.tsx`** — liest Setting via `useOverdueSettings`, plant Notifications im `useEffect`, blendet overdue-Banner bei Regel 'never' aus
- **`src/screens/ReminderSettingsScreen.tsx`** — importiert Typ/Konstanten aus Hook statt lokaler Duplikate

### Wie die Settings jetzt wirken
- **'never'** — kein overdue-Banner im RemindersScreen, keine zusaetzlichen Notifications
- **'daily'** — overdue-Banner sichtbar + beim Oeffnen des RemindersScreens wird eine Push-Notification fuer morgen frueh 9 Uhr geplant
- **'weekly'** — wie daily, Notification in 7 Tagen
- **'custom'** — verhalt sich wie 'daily' (Intervall-Eingabe fehlt noch, war auch vorher Stub)

### Offen / Nicht fertig
- **Custom-Intervall:** 'custom' hat noch kein Zahleneingabefeld — zeigt Hinweis "folgt" in der Description
- **Notification-Deduplication:** Jedes Oeffnen des RemindersScreens plant eine neue Notification ohne zu pruefen ob bereits eine existiert. Low Priority
- **Kein Hintergrund-Task:** Notifications werden nur beim Oeffnen geplant, nicht im Hintergrund. Fuer echten Background-Refresh: expo-task-manager (bewusst nicht eingebaut)
- Alle vorherigen offenen Punkte gelten weiterhin (DB-Migrationen, Edge Function deployen, etc.)

### TypeScript
0 Fehler

### Wichtig fuer den Naechsten
- `OverdueRule`, `OVERDUE_RULE_KEY`, `DEFAULT_OVERDUE_RULE` kommen aus `src/hooks/useOverdueSettings.ts` — nicht lokal definieren
- MedicalContext wurde NICHT angefasst (Auftrag-Constraint)

---

## Vorherige Uebergabe (Developer — UI-Blocker Fixes)

**Agent:** Developer
**Zeitpunkt:** 2026-04-04
**Session:** UI-Blocker Fixes (4 Findings)

### Erledigt
- Fix 1 (AIAssistantScreen): Leerer weisser Screen bei Nicht-Pro-User gefixt
- Fix 2 (Card.tsx): shadowColor auf colors.cardShadow, shadowOpacity: 1
- Fix 3 (PetDetailScreen): Visueller Separator zwischen Sections
- Fix 4 (AIAssistantScreen): Inline-Styles ins StyleSheet verschoben

### Wichtig fuer den Naechsten
- `colors.cardShadow` ist ein rgba-Wert — bei Shadow-Styles immer `shadowOpacity: 1` verwenden

---

## Vorherige Uebergabe

**Agent:** Agency Admin
**Zeitpunkt:** 2026-04-04 (Abendsession)
**Session:** Autonomie Level 2 + Dashboard v2

### Erledigt
- **Autonomie Level 2:** Brian darf SOFORT-Tasks, kleine QA-Fixes und Commits eigenstaendig machen. Drei Dateien angepasst: sidekick.md, agency-processes.md, session-end.md
- **Vault-Auftrag:** `einsatz: "[[VetApp]]"` in 5 Agent-Notizen ergaenzt (Developer, Designer, QA, Dokumentar, DB Expert). Auftrag in Inbox erledigt
- **Dashboard v2:** Komplett ueberarbeitet — KPI-Leiste, Handoff-Karte, QA-Findings, Vault-Stats mit Balkendiagramm, Learnings-Parser gefixt (neues Index-Format), Auto-Refresh 30s. Beide Dateien: dashboard-server.ps1 + generate-dashboard.ps1

### Offen / Nicht fertig
- Dashboard-Port auf 3333 zuruecksetzen (aktuell 3334, alter Prozess blockiert 3333 — loest sich nach Neustart)
- Remote-Zugriff (Brian vom Handy steuern) — Backlog, groesseres Projekt
- Dashboard: Platzhalter-Karte unten rechts noch leer

### Naechster Schritt
- Brian soll session-end Skill ausfuehren (Handoff, Tasks, Wissensmanager)
- Dashboard nach Neustart auf Port 3333 zuruecksetzen

### Wichtig fuer den Naechsten
- Brian hat jetzt Autonomie Level 2 — kann SOFORT-Tasks ohne Rueckfrage abarbeiten
- session-end.md hat neuen Abschnitt "Eigenstaendig erledigt" fuer Autonomie-Reporting
- Dashboard laeuft auf localhost:3334 (nicht 3333!)

---

## Vorherige Uebergabe

**Agent:** Brian (Sidekick)
**Zeitpunkt:** 2026-04-04 (Session-Ende, Feierabend)
**Session:** MedicalEvent-Migration komplett + QA-Findings gefixt

### Erledigt
- **MedicalEvent-Migration (4 Phasen):**
  - Phase 1: Neues `MedicalEvent` Datenmodell + DB-Migration + Schema-Doku
  - Phase 2: DataContext (God-Object, 350 Zeilen) aufgeteilt in PetContext, MedicalContext, VetContactContext
  - Phase 3: Alle Screens auf neue Hooks migriert (kein useData() mehr)
  - Phase 4: Deprecated Code entfernt (DataContext.tsx geloescht, alte Typen weg), Rules aktualisiert
- **QA-Findings (2 Runden, 13 Findings total):**
  - F-001 Edge Function Format — gefixt
  - F-002 Custom-Events als MedicalEvent — gefixt
  - F-003 DataProvider entfernt — gefixt
  - F-004 CHECK-Constraint recurrence_interval — gefixt
  - F-005 treatments→checkup Migration — Accepted Risk
  - F-006 Loading-Spinner PetDetailScreen — gefixt
  - F-007 storagePath/fileUrl Mapping — gefixt
  - F-009 MedicalEvent Edit-Button + Edit-Support — gefixt
  - F-010 Ungenutzter FREE_LIMITS Import — gefixt
  - F-011 state-management.md aktualisiert — gefixt
  - F-012 Error-State in allen Contexts — gefixt
  - F-013 "Weitere Gesundheitseintraege" Label — gefixt
- **Vor-Release-Fixes:**
  - F-03 CORS dokumentiert (TODO fuer Web-Release)
  - F-05/F-06 Null-Fallbacks mit Zurueck-Button
  - F-07 ErrorBanner Komponente + Integration in 3 Screens
- **Edge Function** auf neues medicalHistory-Format angepasst
- **Vault dokumentiert:** Chronik, Entscheidung, State Management, DB-Schema aktualisiert
- **Abschlussbericht HTML** erstellt (briefing-medical-event-migration.html)
- **Alles committed + gepusht** (Commit 0018fba)

### Offen / Nicht fertig
- DB-Migrationen deployen (medical_events + recurrence_check)
- Edge Function neu deployen (medicalHistory-Format)
- Alte Tabellen vaccinations/treatments droppen (nach Deploy-Verifikation)
- notification_id DB-Migration fuer reminders (Schema-Doku ist da, Migration fehlt)
- CORS einschraenken vor Web-Release
- F-014 (Niedrig): storagePath ?? fileUrl Fallback greift nie (leerer String)
- F-02: togglePro/IAP — grosse Aufgabe, eigene Session
- F-08: Pet-Fotos in Storage — eigene Session

### Naechster Schritt
1. DB-Migrationen deployen + Edge Function deployen
2. Manuell testen: MedicalEvent CRUD, Edit-Flow, ErrorBanner
3. F-02 (IAP) oder F-08 (Pet-Fotos) als naechste Session

### Wichtig fuer den Naechsten
- `DataContext.tsx` existiert NICHT mehr — nur noch usePets(), useMedical(), useVetContact()
- Alle Contexts haben `error: string | null` + `refresh()`
- `Document.fileUrl` ist immer leer-String — Storage nur ueber storagePath
- MedicalEvent-Edit via route.params.editMedicalEvent (nicht editEvent)
- Accent-Farbe: #CC6B3D, Spacing smd: 12
- KI-Assistent: x-user-token Header, medicalHistory Format (nicht mehr vaccinations/treatments)
- Edge Function: Muss noch deployed werden (neues Format)
- Briefing-HTMLs im Root sind Arbeitsdokumente (nicht committed)

---

## Vorherige Uebergaben

### Developer — 2026-04-04
- MedicalEvent-Migration Phase 1-4, QA-Findings gefixt

### Brian — 2026-04-04 (frueher)
- KI-Chat abgesichert, Edge Function deployed, Migration ai_usage

### Agency Admin — 2026-04-04 ~09:00
- Uebergabeprotokoll-System eingefuehrt
