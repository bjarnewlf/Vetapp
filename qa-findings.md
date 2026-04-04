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

## Review 5: Vollstaendiger Code-Review nach Feature-Session — 2026-04-04

**TypeScript-Check:** `npx tsc --noEmit` — 0 Fehler. Sauber.

**Geprueft:** fileUpload.ts, PetContext.tsx, AddPetScreen.tsx, OnboardingScreen.tsx, HomeScreen.tsx, PetDetailScreen.tsx, RemindersScreen.tsx, ReminderSettingsScreen.tsx, AddEventScreen.tsx, VetContactScreen.tsx, AIAssistantScreen.tsx, EmptyState.tsx, SkeletonLoader.tsx, Card.tsx, components/index.ts, theme/colors.ts, theme/typography.ts, hooks/useOverdueSettings.ts, services/notifications.ts, types/index.ts

---

### F-023: OnboardingScreen — Foto wird als petData-Feld statt als zweites Argument uebergeben — Schwere: Mittel

**Was:** `OnboardingScreen.tsx` Z.76-83 ruft `addPet({ ..., photo: photoUri || undefined })` auf. Das `photo`-Feld ist im ersten Parameter (`Omit<Pet, 'id' | 'createdAt'>`) zwar typseitig erlaubt, aber `addPet` in `PetContext.tsx` ignoriert `petData.photo` vollstaendig — es wird nirgends ausgewertet. Das zweite Argument `photoUri` (Z.117) wird nicht uebergeben.

**Wo:** `src/screens/OnboardingScreen.tsx` Z.76-83, `src/context/PetContext.tsx` Z.117-154

**Warum:** Wenn ein User beim Onboarding ein Foto auswaehlt, wird es zwar im State gehalten und in der Vorschau angezeigt, aber beim Speichern stillschweigend ignoriert. Das Tier wird ohne Foto angelegt. Kein Crash, kein Fehler — stiller Datenverlust.

**Fix:** Aufruf aendern auf: `addPet({ name, type, breed, birthDate, microchipCode: undefined }, photoUri ?? undefined)` — `photo` aus dem petData-Objekt entfernen, Foto als zweites Argument uebergeben.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-024: PetDetailScreen — `defaultType`-Param wird in AddEventScreen nicht ausgewertet — Schwere: Niedrig

**Was:** `PetDetailScreen.tsx` Z.340 navigiert zu `AddEvent` mit `{ petId: pet.id, defaultType: 'vaccination' }`. In `AddEventScreen.tsx` wird `route.params?.defaultType` nirgends gelesen. Der Param existiert nur als `route.params?.eventType` (Z.35). Der `defaultType`-Wert ist unbekannt.

**Wo:** `src/screens/PetDetailScreen.tsx` Z.340, `src/screens/AddEventScreen.tsx` Z.35

**Warum:** Der EmptyState-Action-Button "Impfung eintragen" oeffnet `AddEventScreen` mit `defaultType: 'vaccination'`. Da dieser Param nicht ausgewertet wird, landet der User auf dem Select-Pet-Schritt (oder Select-Type-Schritt), statt direkt im Config-Schritt mit vorausgewaehltem Typ. Keine Fehlfunktion, aber schlechte UX — der Button suggeriert einen direkten Einstieg.

**Fix:** Entweder in `PetDetailScreen` `defaultType` durch `eventType` ersetzen (korrekter Param-Name), oder in `AddEventScreen` `defaultType` als Alias fuer `eventType` auslesen.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-025: HomeScreen — tote Style-Definitionen (`emptyCard`, `emptyText`, `emptyLink`) — Schwere: Niedrig

**Was:** `HomeScreen.tsx` Z.244-246 definiert drei Styles (`emptyCard`, `emptyText`, `emptyLink`), die nach der Umstellung auf die `EmptyState`-Komponente (Z.107-113) nicht mehr referenziert werden.

**Wo:** `src/screens/HomeScreen.tsx` Z.244-246

**Warum:** Toter Code. Kein funktionaler Schaden, aber Unordnung. TypeScript meldet das nicht (StyleSheet-Properties werden nicht auf Nutzung geprueft).

**Fix:** Die drei Style-Definitionen loeschen.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-026: SkeletonLoader — `useNativeDriver: false` notwendig aber bewusst gesetzt, Anmerkung zur Performance — Schwere: Niedrig

**Was:** `SkeletonLoader.tsx` Z.21 und Z.26 setzen `useNativeDriver: false` fuer die Hintergrundfarben-Animation. Das ist korrekt, da `backgroundColor` nicht vom Native Driver unterstuetzt wird. Auf Low-End-Geraeten lauft die Animation auf dem JS-Thread und koennte bei gleichzeitig vielen Skeleton-Karten (z.B. 10+) zu Frame-Drops fuehren.

**Wo:** `src/components/SkeletonLoader.tsx` Z.21, Z.26

**Warum:** Nicht ein Bug, sondern eine Performance-Einschraenkung der RN-Animationsarchitektur. Relevant wenn SkeletonListItem in langen Listen eingesetzt wird (z.B. 20+ Tiere).

**Fix (optional):** Fuer Performance-kritische Stellen `react-native-reanimated` oder `Animated.interpolateColors` mit nativeDriver erwaegen. Fuer den aktuellen Use Case (kurze Ladelisten) kein Handlungsbedarf.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [x] Accepted Risk — aktueller Use Case unkritisch

---

### Verifikation der Fixes aus Review 4

#### F-015: CRUD-boolean-Returns
**Status: GEFIXT und korrekt.**
Alle drei Contexts (`PetContext`, `MedicalContext`, `VetContactContext`) geben `boolean` zurueck. `AddPetScreen.tsx` Z.88-121: `success` wird geprueft, `goBack()` nur bei `true`. `PetDetailScreen.tsx`: `handleDeleteDocument`, `handleDeleteVaccination`, `handleDeleteTreatment` pruefen alle korrekt auf `!success` und zeigen Alert.

#### F-016: Dropped Promise in RemindersScreen
**Status: GEFIXT.**
`RemindersScreen.tsx` Z.38-43: `handleToggle` ist `async`, `await completeReminder(reminder.id)` mit anschliessendem Alert bei Fehler. Korrekt.

#### F-017: Guard fuer leere petId in AddEventScreen
**Status: GEFIXT.**
`AddEventScreen.tsx` Z.92-95: `if (!selectedPetId) { Alert.alert(...); return; }` ist vorhanden.

#### F-018: OnboardingScreen Error-Handling
**Status: TEILWEISE GEFIXT.**
`OnboardingScreen.tsx` Z.86-90: `if (success)` Guard ist vorhanden, `onComplete()` nur bei Erfolg. Alert bei Fehler. Aber: neues Finding F-023 — das Foto wird trotzdem nicht hochgeladen (falscher Param-Pfad).

#### F-019: WelcomeScreen toter Code
**Status: GEFIXT.** Datei wurde geloescht (nicht mehr vorhanden).

#### F-020: VetContactScreen Anruf-Button
**Status: GEFIXT.**
`VetContactScreen.tsx` Z.86: `{vet.phone && vet.phone.trim() !== '' && <Button ... />}` — Guard vorhanden.

#### F-021: ReminderSettings werden nie angewendet
**Status: GEFIXT.**
`RemindersScreen.tsx` Z.17: `useOverdueSettings()` wird gelesen. Z.20-23: `useEffect` plant `scheduleOverdueNotifications(reminders, overdueRule)` sobald Settings geladen sind. `notifications.ts` wertet `rule` korrekt aus.

#### F-022: Unnoetige Signed URL in uploadFile
**Status: OFFEN.**
`fileUpload.ts` Z.83-92: `createSignedUrl`-Block ist noch vorhanden. `PetContext.addDocument` Z.214 destrukturiert weiterhin nur `{ path }`.

---

### Zusammenfassung Review 5

| ID | Schwere | Beschreibung | Status |
|---|---|---|---|
| F-023 | Mittel | OnboardingScreen: Foto-URI geht an falschen Parameter, wird ignoriert | NEU — Fix empfohlen |
| F-024 | Niedrig | PetDetailScreen: `defaultType`-Param unbekannt in AddEventScreen | NEU — Fix empfohlen |
| F-025 | Niedrig | HomeScreen: tote Styles nach EmptyState-Umstellung | NEU |
| F-026 | Niedrig | SkeletonLoader: `useNativeDriver: false` — JS-Thread-Animation, Accepted | NEU — Accepted Risk |
| F-022 | Niedrig | fileUpload: unnoetige Signed-URL-Generierung (aus Review 4, noch offen) | OFFEN |

**TypeScript-Check:** Bestanden — 0 Fehler.

**Naechster Schritt:** F-023 ist der einzige Mittel-Fund — ein 2-Zeilen-Fix im OnboardingScreen. Alle anderen Findings sind Niedrig oder Accepted Risk. Code ist bereit fuer Handy-Test.

---

## Review 4: Vollstaendiger Code-Review nach MedicalEvent-Migration — 2026-04-04

**TypeScript-Check:** `npx tsc --noEmit` — 0 Fehler. Sauber.

**Geprueft:** Alle 43 Source-Dateien in `src/` — 17 Screens, 5 Contexts, 2 Services, 3 Utils, Navigation, Theme, Types.

**Migrationscheck:** Kein Verweis auf `useData`, `DataContext`, `DataProvider`, `Vaccination`, `Treatment` in `src/`. Migration vollstaendig.

---

### F-015: CRUD-Fehler in allen Contexts werden nicht an den Caller propagiert — Schwere: Mittel

**Was:** Alle CRUD-Mutations-Methoden in `MedicalContext`, `PetContext` und `VetContactContext` folgen dem Pattern `if (!error) await refresh()`. Bei einem Supabase-Fehler passiert nichts — kein `throw`, kein `setError`. Der Caller erhaelt keine Rueckmeldung.

**Wo:** `src/context/MedicalContext.tsx` Z.136, 149, 154, 174, 219, 228 — `src/context/PetContext.tsx` Z.103, 115, 120, 137, 154 — `src/context/VetContactContext.tsx` Z.70, 80

**Warum:** Screens wie `AddEventScreen.tsx` (Z.120) und `PetDetailScreen.tsx` (Z.104) wrappen Aufrufe in try/catch — der aber niemals anspringt, weil die Methode nie wirft. Konkret: User klickt "Speichern", Supabase gibt RLS-Fehler zurueck, `navigation.goBack()` passiert trotzdem, Eintrag ist nicht gespeichert. Stiller Datenverlust aus User-Sicht.

**Fix:** `if (error) throw new Error(error.message);` in jeder CRUD-Methode ergaenzen. Bestehende try/catch-Bloecke in den Screens funktionieren dann korrekt.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-016: `RemindersScreen` — `completeReminder()` wird ohne `await` aufgerufen — Schwere: Mittel

**Was:** `handleToggle` in `RemindersScreen.tsx` Z.26 ruft `completeReminder(reminder.id)` ohne `await` auf. Das Promise wird dropped, Fehler werden nicht abgefangen.

**Wo:** `src/screens/RemindersScreen.tsx` Z.24-28

**Warum:** Bei Netzwerkfehler gibt es kein User-Feedback. `EventDetailScreen.tsx` Z.53-57 implementiert den identischen Call korrekt mit `await` und try/catch — das Pattern ist bekannt, wurde hier uebersehen.

**Fix:** `handleToggle` als `async` deklarieren, `await completeReminder(reminder.id)` in try/catch wrappen mit `Alert.alert`.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-017: `AddEventScreen` — kein Guard fuer leere `selectedPetId` im Config-Schritt — Schwere: Mittel

**Was:** Wenn `AddEventScreen` mit `eventType`-Param (aber ohne `petId`) aufgerufen wird, startet der Screen direkt auf `'config'` (Z.42). In `handleSave` gibt es keine Validierung ob `selectedPetId` befuellt ist. Der Insert laeuft dann mit `pet_id: ''`.

**Wo:** `src/screens/AddEventScreen.tsx` Z.41-44 (`initialStep`), Z.91-100 (`handleSave`)

**Warum:** Ein leeres `petId` verletzt den Foreign-Key-Constraint der DB (oder schreibt ungueltige Daten). Der Fehler wird dann lautlos verschluckt (koppelt an F-015). Aufruf mit nur `eventType` ist z.B. aus `PetDetailScreen.tsx` Z.235 moeglich wenn `pet.id` als `petId` uebergeben wird — dort korrekt. Aber der Screen laesst sich theoretisch auch ohne `petId` oeffnen.

**Fix:** In `handleSave` frueh pruefen: `if (!selectedPetId) { Alert.alert('Fehlende Angabe', 'Bitte waehle zuerst ein Tier aus.'); return; }`

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-018: `OnboardingScreen` — `addPet`-Fehler wird ignoriert, `onComplete()` immer aufgerufen — Schwere: Mittel

**Was:** `handleSavePet` in `OnboardingScreen.tsx` Z.76-85 ruft `await addPet(...)` ohne try/catch auf. `onComplete()` (Z.85) wird immer aufgerufen, unabhaengig vom Erfolg.

**Wo:** `src/screens/OnboardingScreen.tsx` Z.76-85

**Warum:** Wenn `addPet` fehlschlaegt: User wird in den Hauptscreen weitergeleitet, Tier existiert nicht in DB, beim naechsten Refresh `pets.length === 0`, Onboarding startet neu. Potenzielle Endlos-Schleife. Auch kein `setSaving(false)` im Fehlerfall.

**Fix:** try/catch ergaenzen, `onComplete()` nur bei Erfolg aufrufen, `setSaving(false)` in finally.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-019: `WelcomeScreen` — toter Code, auf Englisch, nicht eingebunden — Schwere: Niedrig

**Was:** `src/screens/WelcomeScreen.tsx` existiert und ist implementiert, wird aber weder in `src/screens/index.ts` exportiert noch in `AppNavigator.tsx` referenziert. Der Screen-Text ist auf Englisch.

**Wo:** `src/screens/WelcomeScreen.tsx`

**Warum:** Toter Code aus einer frueheren Iteration. Keine Sicherheitsrelevanz, aber Unordnung im Codebase.

**Fix:** Datei loeschen oder auf Deutsch uebersetzen und in Navigation einbinden.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-020: `VetContactScreen` — kein Error-State sichtbar, "Tierarzt anrufen" bei leerer Nummer — Schwere: Niedrig

**Was (a):** `VetContactScreen` liest `error` aus `useVetContact()` nicht aus. Bei Ladefehler zeigt der Screen denselben State wie "noch kein Kontakt angelegt" — der User kann nicht unterscheiden ob ein Fehler vorliegt oder ob er noch nichts eingetragen hat.

**Was (b):** `handleCall` (Z.34-38) ruft `Linking.openURL('tel:' + vet.phone)` ohne Guard auf. `vet.phone` kann ein leerer String sein (gemappt mit `v.phone || ''` in VetContactContext Z.40). Bei leerem String oeffnet sich eine leere Telefon-App. `.catch()` ist vorhanden, also kein Crash.

**Wo:** `src/screens/VetContactScreen.tsx` Z.12-14, Z.34-38, Z.86

**Fix (a):** `error` aus `useVetContact()` lesen und `ErrorBanner` rendern wenn gesetzt.
**Fix (b):** `{vet.phone && <Button title="Tierarzt anrufen" ... />}` oder Guard in `handleCall`.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-021: `ReminderSettingsScreen` — Einstellungen werden nie angewendet — Schwere: Niedrig

**Was:** Die OverdueRule-Einstellung wird in AsyncStorage geschrieben (Key `vetapp_overdue_rule`), aber nirgends in der App ausgelesen. Weder `MedicalContext` noch `notifications.ts` lesen diesen Key.

**Wo:** `src/screens/ReminderSettingsScreen.tsx`

**Warum:** Der User kann eine Einstellung konfigurieren, die keine Wirkung hat. Irreführend.

**Fix:** AsyncStorage-Key in der Notification-Logik auswerten, oder Screen mit "Kommt bald"-Hinweis versehen.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### F-022: `fileUpload.ts` — Signed URL nach Upload generiert aber verworfen — Schwere: Niedrig

**Was:** `uploadFile` generiert nach jedem Upload eine 1-Jahr-Signed-URL (`createSignedUrl(path, 60*60*24*365)`). In `PetContext.addDocument` wird nur `path` destrukturiert, `url` wird verworfen. Zur Anzeige wird on-demand eine neue 1-Stunde-URL generiert. Der 1-Jahr-URL-Call ist ueberfluessig.

**Wo:** `src/utils/fileUpload.ts` Z.29-38, `src/context/PetContext.tsx` Z.126

**Fix:** `createSignedUrl`-Block in `uploadFile` entfernen. Rueckgabetyp auf `{ path: string }` vereinfachen.

**Entscheidung:** [ ] Fix jetzt / [ ] Fix vor Release / [ ] Accepted Risk

---

### Verifikation der noch offenen Findings aus Reviews 1-3

**F-010** (FREE_LIMITS ungenutzt importiert): In `AddEventScreen.tsx` nicht vorhanden — **ERLEDIGT**.

**F-011** (state-management.md beschreibt DataContext): Nicht neu geprueft — bleibt offen, ausserhalb Code-Review-Scope.

**F-013** (treatments-Filter Titel): Bleibt Accepted Risk.

**F-014** (storagePath-Fallback): Bleibt Accepted Risk.

---

### Zusammenfassung Review 4

| ID | Schwere | Beschreibung |
|---|---|---|
| F-015 | Mittel | CRUD-Fehler in Contexts werden nicht propagiert — Silent Failure |
| F-016 | Mittel | `completeReminder` ohne `await` in RemindersScreen |
| F-017 | Mittel | Kein Guard fuer leere `petId` im AddEventScreen Config-Schritt |
| F-018 | Mittel | OnboardingScreen: `addPet`-Fehler verschluckt, `onComplete` immer aufgerufen |
| F-019 | Niedrig | WelcomeScreen: toter Code, englischer Text |
| F-020 | Niedrig | VetContactScreen: kein Error-State, Anruf-Button bei leerer Nummer |
| F-021 | Niedrig | ReminderSettings-Einstellungen werden nie angewendet |
| F-022 | Niedrig | fileUpload: unnoetige Signed-URL-Generierung nach Upload |

**TypeScript-Check:** Bestanden — 0 Fehler.

**Naechster Schritt:** F-015 bis F-018 sind als Batch fixbar (ca. 15-20 Zeilen gesamt). F-015 ist Wurzel von F-016, F-017, F-018 — mit dem Fix von F-015 wird auch der Kontext der anderen Findings klarer.

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
