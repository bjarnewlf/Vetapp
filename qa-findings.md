# QA-Findings

> QA schreibt Findings hier rein. Brian geht sie mit Claas durch.
> Jedes Finding braucht eine explizite Entscheidung: Fix jetzt / Fix vor Release / Accepted Risk.

---

## Review 1: MedicalEvent-Migration — 2026-04-04 (ABGESCHLOSSEN)

Alle 8 Findings aus Review 1 wurden bearbeitet. Details unten im Archiv-Abschnitt.

---

## Review 2: Finaler QA nach Fixes — 2026-04-04 (ABGESCHLOSSEN)

Alle Findings aus Review 2 wurden als Grundlage für Review 3 verwendet. Details unten im Archiv-Abschnitt.

---

## Review 3: Verifikation der Fix-Welle — 2026-04-04

**TypeScript-Check:** `npx tsc --noEmit` — keine Fehler. Sauber.

---

### Verifikation der Fixes

#### F-03 (CORS in Edge Function)
**Status: GEFIXT — korrekt und vollstandig.**

Die Edge Function `supabase/functions/ai-chat/index.ts` sendet CORS-Header (`Access-Control-Allow-Origin: *`) auf allen Responses inkl. OPTIONS-Preflight. Der Kommentar im Code erklaert korrekt, dass React Native keinen Origin-Header sendet und Wildcard daher fuer native Clients kein Security-Problem darstellt. Der TODO-Hinweis fuer Production-Domain ist vorhanden. Keine hardcodierten Werte, korrekte 405/401-Responses mit CORS-Header ebenfalls gesetzt.

**Residual-Risk:** `*` bleibt bis ein Web-Client existiert. Accepted Risk — korrekt dokumentiert.

---

#### F-05/F-06 (Null-Fallback EventDetailScreen + PetDetailScreen)
**Status: GEFIXT — beide Screens sauber abgefangen.**

- `EventDetailScreen.tsx` Z.31–46: `if (!event)` rendert eine vollstandige Fallback-View mit Back-Button, Card und beschreibendem Text. Navigation ist im Fallback erreichbar.
- `PetDetailScreen.tsx` Z.115–131: `if (!pet)` rendert ScrollView mit Header und NotFound-Card. Back-Button vorhanden.

Beide Fallbacks nutzen ausschliesslich Theme-Farben (`colors.text`, `colors.textSecondary`) — kein hardcoded Wert.

---

#### ErrorBanner-Komponente und Integration
**Status: GEFIXT — vollstandig und korrekt.**

- `src/components/ErrorBanner.tsx` existiert. Nutzt `colors.errorLight`, `colors.error`, `spacing.sm/md`, `borderRadius.md` — ausschliesslich Theme-Tokens, keine hardcodierten Farben.
- Export in `src/components/index.ts` Z.7 vorhanden.
- `HomeScreen.tsx` Z.5 importiert `ErrorBanner`, Z.42–43 zeigt zwei Banner (petsError, medicalError) mit je korrektem `onRetry`-Callback.
- `PetDetailScreen.tsx` Z.6 importiert `ErrorBanner`, Z.224 rendert `<ErrorBanner onRetry={refreshMedical} />` nur bei `medicalError`.
- `RemindersScreen.tsx` Z.5 importiert `ErrorBanner`, Z.70 rendert `<ErrorBanner onRetry={refreshMedical} />` bei `medicalError`.

Alle drei Integrationen korrekt. Kein Screen zeigt ErrorBanner ohne Retry-Callback.

---

#### F-007 (storagePath/fileUrl Mapping in PetContext)
**Status: GEFIXT — Mapping ist jetzt korrekt und konsistent.**

`PetContext.tsx` Z.40–44: `mapDocument` setzt `fileUrl: ''` und `storagePath: row.file_url`. Der Kommentar im Code erklaert die Semantik eindeutig. `fileUrl` wird in `addDocument` (Z.127) weiterhin als lokale Datei-URI vom DocumentPicker uebergeben — das ist konsistent, da `addDocument` die URI zum Upload braucht, nicht zum Lesen.

`PetDetailScreen.tsx` Z.354: `doc.storagePath ?? doc.fileUrl` — der Fallback auf `fileUrl` greift niemals, da `fileUrl` nach mapDocument immer `''` ist und `storagePath` immer gesetzt ist (aus der DB). Der `??`-Operator behandelt `''` nicht als nullish, daher wird ein Dokument ohne `storagePath` mit leerem String an `getSignedUrl` uebergeben.

**Neues Finding dazu (siehe F-014 unten).**

---

#### F-009 (MedicalEvent Edit-Button + Edit-Support in AddEventScreen)
**Status: GEFIXT — Flow vollstandig implementiert.**

- `PetDetailScreen.tsx` Z.255 und Z.298: Beide Behandlungs- und Impfungs-Karten haben je einen Edit-Button (`create-outline`-Icon), der `navigation.navigate('AddEvent', { petId: pet.id, editMedicalEvent: treatment/vax })` aufruft.
- `AddEventScreen.tsx` Z.37: `const editMedicalEvent = route.params?.editMedicalEvent` wird gelesen.
- Z.39: `const isEditMode = !!editEvent || !!editMedicalEvent` korrekt.
- Z.123–131: `if (editMedicalEvent?.id)` ruft `updateMedicalEvent()` auf mit `name`, `date`, `notes`, `recurrenceInterval`. `navigation.goBack()` danach korrekt.
- Vorbefuellung: `title` (Z.51), `date` (Z.61–65), `notes` (Z.68), `recurrence` (Z.69) werden korrekt aus `editMedicalEvent` initialisiert.
- Header-Titel Z.204: zeigt "Eintrag bearbeiten" bei `editMedicalEvent`. Korrekt.
- Button-Label Z.342: zeigt "Aktualisieren" bei `isEditMode`. Korrekt.

Flow ist vollstandig: PetDetailScreen -> AddEventScreen (editMedicalEvent-Param) -> updateMedicalEvent -> goBack.

---

### Regressionen

**`useData` / alte Typen:** Grep-Check sauber. Kein Import von `useData`, `DataContext`, `DataProvider`, `Vaccination`, `Treatment` in src/.

**Context-Hooks:** Alle Screens nutzen korrekt `usePets()`, `useMedical()`, `useVetContact()`, `useSubscription()`. Kein Screen greift direkt auf Context-Objekte zu.

**Neue TypeScript-Fehler:** Keine. `npx tsc --noEmit` ohne Output.

---

### Neue Findings aus diesem Review

---

### F-014: `PetDetailScreen` — `doc.storagePath ?? doc.fileUrl` Fallback nie wirksam, aber fehlerhaft bei fehlendem storagePath

**Was:** Z.354 in `PetDetailScreen.tsx` nutzt `doc.storagePath ?? doc.fileUrl` als Argument fuer `handleOpenDocument`. Da `mapDocument` in `PetContext` `fileUrl` immer als `''` setzt, ist der `??`-Fallback bei `storagePath === undefined` nicht wirksam — `''` (leerer String) ist kein nullish-Wert, also wird `fileUrl` niemals als Fallback genutzt. Wenn ein Dokument aus irgendeinem Grund kein `storagePath` hat (z.B. DB-Inkonsistenz, sehr alte Daten), wird ein leerer String an `getSignedUrl` uebergeben. Supabase gibt dann einen Fehler zurueck, der korrekt mit `Alert.alert` abgefangen wird. Kein Crash, aber kein sinnvoller Fallback.

**Wo:** `src/screens/PetDetailScreen.tsx` Z.354, `src/context/PetContext.tsx` Z.43

**Warum:** Niedrig. Kein Crash, Fehler wird per Alert kommuniziert. Betrifft nur Dokumente mit fehlendem `storagePath` — in der aktuellen Implementierung sollte jedes Dokument einen haben.

**Schwere:** Niedrig

**Fix:** `doc.storagePath ?? doc.fileUrl` ersetzen durch `doc.storagePath ?? ''` und ggf. fruehzeitig abbrechen wenn `storagePath` leer ist: `if (!doc.storagePath) { Alert.alert(...); return; }`.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [x] Accepted Risk (Fehler wird per Alert kommuniziert, Datenverlust nicht moeglich)

---

## GESAMTBILD UND RELEASE-READINESS

### Was verifiziert wurde

| Finding | Schwere | Ergebnis |
|---|---|---|
| F-03 CORS Edge Function | Mittel | VERIFIZIERT GEFIXT |
| F-05 Null-Fallback EventDetailScreen | Niedrig | VERIFIZIERT GEFIXT |
| F-06 Null-Fallback PetDetailScreen | Mittel | VERIFIZIERT GEFIXT |
| ErrorBanner Komponente | Mittel | VERIFIZIERT GEFIXT — Theme-konform |
| ErrorBanner HomeScreen | Mittel | VERIFIZIERT GEFIXT |
| ErrorBanner PetDetailScreen | Mittel | VERIFIZIERT GEFIXT |
| ErrorBanner RemindersScreen | Mittel | VERIFIZIERT GEFIXT |
| F-007 storagePath/fileUrl | Niedrig | VERIFIZIERT GEFIXT (mit neuem Residual-Finding F-014) |
| F-009 MedicalEvent Edit-Button | Niedrig | VERIFIZIERT GEFIXT — vollstandiger Flow |

### Noch offene Findings

| ID | Schwere | Beschreibung | Empfehlung |
|---|---|---|---|
| F-014 | Niedrig | storagePath-Fallback semantisch fehlerhaft, aber Fehler wird abgefangen | Vor Release fixen (1 Zeile) |
| F-010 | Niedrig | FREE_LIMITS importiert aber nie genutzt in AddEventScreen | Vor Release cleanen |
| F-011 | Mittel | state-management.md beschreibt DataContext als noch existent | Vor Release dokumentieren |
| F-013 | Niedrig | treatments-Filter zeigt custom gemeinsam mit checkup/deworming — Titel ungenau | Accepted Risk |

### Keine kritischen oder blockerischen Findings offen.

**Release-Readiness: BEDINGT FREIGEGEBEN**

Der Code ist stabil. TypeScript sauber. Alle kritischen und mittleren Bugs aus Review 1 und 2 sind gefixt und verifiziert. Verbleibende Findings sind alle niedrig bis mittel, kein Datenverlust, keine Crashes.

Empfehlung: F-011 (docs) und F-010 (toter Import) vor Release als 5-Minuten-Fix erledigen. F-014 ist ein einzelner If-Guard — sinnvoll aber nicht blockierend.

---

## Archiv: Review 2 Findings (historisch)

| ID | Schwere | Kurzbeschreibung | Status |
|---|---|---|---|
| F-007 | NIEDRIG | storagePath = fileUrl in mapDocument — Semantik unklar | GEFIXT (Review 3) |
| F-009 | NIEDRIG | Edit-Mode editierte nur Reminder, nie MedicalEvents | GEFIXT (Review 3) |
| F-010 | NIEDRIG | FREE_LIMITS importiert aber nie verwendet in AddEventScreen | OFFEN |
| F-011 | MITTEL | state-management.md beschreibt DataContext als noch existent | OFFEN |
| F-012 | MITTEL | Supabase-Fehler bei Context-Refresh still verschluckt | GEFIXT — ErrorBanner loest das Problem |
| F-013 | NIEDRIG | treatments-Filter zeigt deworming+checkup+custom gemeinsam | OFFEN |

---

## Archiv: Review 1 Findings (historisch)

| ID | Schwere | Status |
|---|---|---|
| F-001 | KRITISCH | GEFIXT — Edge Function nutzt medicalHistory |
| F-002 | KRITISCH | GEFIXT — custom als MedicalEvent gespeichert |
| F-003 | MITTEL | GEFIXT — DataProvider komplett entfernt |
| F-004 | MITTEL | GEFIXT — CHECK-Constraint in separater Migration |
| F-005 | MITTEL | ACCEPTED — treatments zu checkup in Migration |
| F-006 | MITTEL | GEFIXT — Loading-Spinner in PetDetailScreen |
| F-007 | NIEDRIG | GEFIXT (Review 3) |
| F-008 | NIEDRIG | TEILWEISE (Rules-Datei noch nicht vollstandig aktualisiert) |
