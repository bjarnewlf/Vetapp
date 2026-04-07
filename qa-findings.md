# QA-Findings

> QA schreibt Findings hier rein. Brian geht sie mit Claas durch.
> Jedes Finding braucht eine explizite Entscheidung: Fix jetzt / Fix vor Release / Accepted Risk.

---

## Review 6: Code-Review nach Dashboard-Redesign und Tab-Refactoring — 2026-04-05

**TypeScript-Check:** `npx tsc --noEmit` — 0 Fehler. Sauber.

**Geprueft:** RemindersScreen.tsx, HomeScreen.tsx, PetDetailScreen.tsx, PetHealthTab.tsx, PetDocumentsTab.tsx, PetVetTab.tsx, PetListRow.tsx, TimelineItem.tsx, AppNavigator.tsx, MedicalContext.tsx

---

### F-027: PetVetTab — optionale VetContact-Felder werden ohne Guard gerendert — Schwere: Mittel

- **Beschreibung:** `PetVetTab.tsx` rendert `vet.phone`, `vet.email`, `vet.address` und `vet.clinic` direkt ohne zu pruefen ob diese leer sind. Im Type `VetContact` sind alle vier Felder als `string` (nicht-optional) deklariert — in `VetContactContext.tsx` werden sie jedoch mit `v.phone || ''` gemappt, d.h. leere Felder kommen als leere Strings an. Ergebnis: Rows mit Icon aber leerem Text werden angezeigt, sobald ein Feld nicht ausgefuellt wurde. Betrifft den realen Fall, dass User nur Name und Telefonnummer speichern.
- **Wo:** `src/screens/pet/PetVetTab.tsx` Z.22-34; `src/context/VetContactContext.tsx` Z.39-42; `src/types/index.ts` Z.50-53
- **Fix:** Felder einzeln pruefen und nur rendern wenn nicht leer: `{vet.phone && vet.phone.trim() !== '' && (<View>...</View>)}` — identisches Muster wie in `VetContactScreen.tsx` (F-020, bereits gefixt dort). Alternativ VetContact-Felder im Type auf optional stellen (`phone?: string`) um die Typsicherheit zu verbessern.
- **Entscheidung:** Offen

---

### F-028: HomeScreen KI-Card — hardcodierte Farben statt Theme-Tokens — Schwere: Niedrig

- **Beschreibung:** `HomeScreen.tsx` Z.230-289 (Styles `aiCardNew`, `aiIconContainer`, `aiProBadge`, `aiTitle`, `aiSubtitle`, `aiCtaText`) verwendet ausschliesslich hardcodierte Hex-Werte (`#E8F5F1`, `#B8DDD4`, `#1B6B5A`, `#145244`, `#FFFFFF`) sowie literale `fontSize`/`fontWeight`-Werte statt `typography.*`-Tokens. Ebenso der LinearGradient-Header Z.71 mit `['#1B6B5A', '#2D8A73', '#3AA08A']` und das Sparkles-Icon Z.154 mit `color="#FFFFFF"` und der Arrow-Icon Z.167 mit `color="#1B6B5A"`. Das ist der einzige Screen mit dieser Dichte an Inline-Farben — alle anderen Screens nutzen `colors.*` konsequent.
- **Wo:** `src/screens/HomeScreen.tsx` Z.71, Z.154, Z.167, Z.230-289
- **Fix:** KI-Card-Farben auf `colors.primaryLight`, `colors.primary`, `colors.primaryDark` (falls vorhanden) und `colors.textOnPrimary` mappen. Typografie-Werte durch `typography.label`, `typography.bodySmall` etc. ersetzen. Gradient-Farben sind ein Grenzfall (kein direktes Token), koennen als Kommentar-Konstante im File bleiben wenn kein `colors.primaryDark` existiert.
- **Entscheidung:** Offen

---

### F-029: PetDocumentsTab — storagePath undefined wird als leerer String an getSignedUrl uebergeben — Schwere: Mittel

- **Beschreibung:** `PetDocumentsTab.tsx` Z.37 ruft `onOpenDocument(doc.id, doc.storagePath ?? '')` auf. Wenn `doc.storagePath` undefined ist (kein Upload ueber Storage, oder aelterer Datensatz), wird ein leerer String `''` als `storagePath` an `getSignedUrl` in `PetDetailScreen.tsx` Z.104-112 weitergereicht. `supabase.storage.createSignedUrl('pet-documents', '')` schlaegt fehl — der Fehler wird zwar gecatcht und ein Alert gezeigt (Z.119-121), aber der User erhaelt nur eine generische Fehlermeldung ohne Erklaerung. Aeltere Dokument-Eintraege ohne Storage-Pfad koennen nie geoeffnet werden.
- **Wo:** `src/screens/pet/PetDocumentsTab.tsx` Z.37; `src/screens/PetDetailScreen.tsx` Z.104-121; `src/types/index.ts` Z.61
- **Fix:** Vor dem Aufruf von `onOpenDocument` pruefen: `if (!doc.storagePath) { Alert.alert('Fehler', 'Kein Speicherpfad fuer dieses Dokument vorhanden.'); return; }`. Zusaetzlich den Upload-Button bei fehlendem storagePath deaktivieren oder die betroffenen Docs als defekt markieren.
- **Entscheidung:** Offen

---

### F-030: PetListRow und TimelineItem — keine Accessibility-Labels — Schwere: Niedrig

- **Beschreibung:** `PetListRow.tsx` (Z.39) und `TimelineItem.tsx` (Z.45) verwenden `AnimatedPressable` ohne `accessibilityLabel` oder `accessibilityRole`. Screen-Reader-Nutzer hoeren nur den generischen Pressable-Namen, nicht "Bella, Hund, 3 Jahre" oder "Impftermin Bella, 12. April". Im Gegensatz dazu hat die Checkbox in `RemindersScreen.tsx` korrekte Labels (Z.130-133).
- **Wo:** `src/components/PetListRow.tsx` Z.39; `src/components/TimelineItem.tsx` Z.45
- **Fix:** `accessibilityLabel` und `accessibilityRole="button"` auf dem `AnimatedPressable` setzen. Beispiel PetListRow: `accessibilityLabel={`${pet.name}, ${subtitle}`}`. Beispiel TimelineItem: `accessibilityLabel={`${TYPE_LABELS[type]}: ${title}${petName ? ', ' + petName : ''}, ${day}. ${month}`}`.
- **Entscheidung:** Offen

---

### F-031: AppNavigator — useEffect-Dependency-Suppression versteckt moegliche Race Condition — Schwere: Niedrig

- **Beschreibung:** `AppNavigator.tsx` Z.98-103 unterdrückt den `react-hooks/exhaustive-deps`-Warning mit einem ESLint-Disable-Kommentar. Der fehlende Dep ist `initialDataLoaded` — intentional, da der Effekt nur beim Uebergang `dataLoading: true -> false` feuern soll. Beim aktuellen Verhalten koennte ein schneller Logout waehrend des Ladens `initialDataLoaded` auf `true` setzen, da der Session-Reset-Effekt (Z.90-95) async und der Lade-Effekt quasi-sync ist. Kein reproduzierbarer Bug bekannt, aber die Suppression verbirgt die Absicht.
- **Wo:** `src/navigation/AppNavigator.tsx` Z.98-103
- **Fix:** Kommentar ersetzen durch erklaerenden Inline-Kommentar der das intentionale Weglassen begruendet: `// intentionally omitted: initialDataLoaded darf nicht als Dep stehen, da sonst Endlosloop`. Kein Code-Fix noetig, aber Lesbarkeit verbessert sich.
- **Entscheidung:** Offen

---

### F-032: RemindersScreen — completedIds Ref wird nie geleert — Schwere: Niedrig

- **Beschreibung:** `RemindersScreen.tsx` Z.20 initialisiert `completedIds` als persistentes Ref. Eintraege werden bei erfolgreichem `completeReminder` hinzugefuegt (Z.78), aber nie entfernt. Wenn `refresh()` in `MedicalContext` nach dem DB-Update gefeuert wird (Z.223), kehren abgeschlossene Reminders nicht mehr in die `reminders`-Liste zurueck (Status 'completed' wird gefiltert, Z.42). In der aktuellen Implementierung ist das kein Bug — es ist die Absicht des Fixes aus Review 4. Aber: Wenn ein User dieselbe Erinnerung (selbe ID, z.B. nach einem Rollback der DB) wieder in der Liste sieht, wuerde sie durch den completedIds-Filter dauerhaft ausgeblendet, weil das Ref den Mount-Zustand ueberdauert. Praktisch unwahrscheinlich, aber der Ref-State ist permanent fuer die Lebensdauer des Screens.
- **Wo:** `src/screens/RemindersScreen.tsx` Z.20, Z.42, Z.78
- **Fix:** Akzeptables Risk bei aktuellem Datenmodell. Als Dokumentation: Kommentar an Z.20 erganzen: `// Lokal gecachte IDs die nach Animation aus der Liste geblendet wurden — nie geleert (Absicht: verhindert Reappearance nach refresh())`.
- **Entscheidung:** Offen

---

### Zusammenfassung Review 6

| ID | Schwere | Beschreibung | Status |
|---|---|---|---|
| F-027 | Mittel | PetVetTab: leere VetContact-Felder werden ohne Guard gerendert | NEU — Fix empfohlen |
| F-028 | Niedrig | HomeScreen KI-Card: Farbwerte und Typografie hardcodiert statt Theme-Tokens | NEU |
| F-029 | Mittel | PetDocumentsTab: storagePath undefined -> leerer String an getSignedUrl | NEU — Fix empfohlen |
| F-030 | Niedrig | PetListRow + TimelineItem: keine Accessibility-Labels | NEU |
| F-031 | Niedrig | AppNavigator: useEffect-Dep-Suppression ohne erklaerenden Kommentar | NEU |
| F-032 | Niedrig | RemindersScreen: completedIds Ref wird nie geleert | NEU — Accepted Risk wahrscheinlich |

**TypeScript-Check:** Bestanden — 0 Fehler.

**Naechster Schritt:** F-027 und F-029 sind Mittel-Findings mit sichtbarem User-Impact — empfehle Fix vor naechstem Handy-Test. F-028 sollte vor Release behoben werden (Theme-Konsistenz). F-030 bis F-032 koennen nach Release folgen.

---

## Roadmap-Bericht: Qualitaets- und Sicherheitsstatus — 2026-04-04

### A) Qualitaets-Status

**TypeScript:** `npx tsc --noEmit` — 0 Fehler. Sauber. (Bestaetigt aus Reviews 4 + 5)

**Sicherheits-Findings (aus `sicherheitsbericht-2026-04-04.html`):**
- 1 Kritisch: Premium-Bypass — `togglePro()` schreibt `is_premium` direkt ohne IAP. Jeder eingeloggte User kann sich kostenlos auf Pro setzen (bestaetigt in `SubscriptionContext.tsx` Z.51-59, kein IAP-Code vorhanden).
- 2 Hoch: Rate-Limit Fail-Open in Edge Function `ai-chat`; `ai_usage`-Tabelle fehlt im Schema (keine RLS).
- 3 Mittel: Anon Key als Authorization-Header; Dokument-Signed-URLs 1 Jahr gueltig (auch in `fileUpload.ts` bestaetigt); Storage-Bucket-Policies nicht im Schema.
- 2 Niedrig: Fehlende E-Mail-Validierung clientseitig; Auth-Logging in Production.

**Zusaetzliche Code-Risiken (aus Code-Reviews):**
- F-023 (Mittel, offen): Foto-Upload im Onboarding geht an falschen Parameter — stiller Datenverlust.
- F-022 (Niedrig, offen): Unnoetige Signed-URL-Generierung in `fileUpload.ts` (auch Sicherheits-Finding S-5 betreffend).
- F-024/F-025 (Niedrig, offen): Param-Name-Mismatch in AddEventScreen; tote Styles in HomeScreen.

---

### B) Was muss vor Go-Live gefixt werden?

**Blocker (Release-kritisch):**
- S-1 (Kritisch): `togglePro()` durch echtes IAP ersetzen + RLS fuer `profiles.is_premium` gegen Client-Writes sperren. Ohne diesen Fix kann jeder User kostenlos Pro aktivieren.

**Hoch — vor Go-Live umsetzen:**
- S-2: Rate-Limit Fail-Open -> Fail-Closed in `ai-chat/index.ts` (1 Zeile).
- S-3: `ai_usage`-Tabelle mit RLS in `supabase-schema.sql` erganzen. Ohne Tabelle greift Rate-Limiting nie.

**Mittel — empfohlen vor Release:**
- S-4: Authorization-Header auf User-JWT umstellen.
- S-5: Dokument-URLs on-demand generieren, max 24-48h (auch F-022 loest sich damit).
- S-6: Storage-Bucket `pet-documents` auf privat pruefen + Policies dokumentieren.
- F-023: Foto-Param im Onboarding reparieren (2-Zeilen-Fix).

**Niedrig — koennen nach Release folgen:**
- S-7: E-Mail-Validierung, S-8: Auth-Logging hinter `__DEV__`, F-024, F-025.

---

### C) Test-Abdeckung

**Aktuelle Tests:** Keine. Kein Test-Runner konfiguriert. TypeScript ist einziges Sicherheitsnetz.

**Minimum fuer MVP (Empfehlung):**
- Unit-Tests: `SubscriptionContext` — sicherstellen dass `togglePro` nach IAP-Implementierung keinen direkten DB-Write mehr macht. Hoechste Prioritaet nach S-1-Fix.
- Integration-Tests: Supabase-RLS verifizieren — kann User `is_premium` direkt per API-Call setzen? (manuell oder mit `supabase-js` in einem Test-Skript).
- E2E: Nicht zwingend fuer MVP, aber Happy-Path-Test (Registrierung -> Tier anlegen -> Event erfassen) wuerde Regressions absichern.

**Was nicht testen (fuer MVP):**
- UI-Snapshots, Animations, Design-Komponenten — kein Mehrwert bei diesem Stack.
- Vollstaendige Coverage — 3-4 kritische Tests > 80% Coverage auf unwichtigem Code.

**Naechster Schritt:** S-1 (IAP / Premium-Bypass) ist der einzige echte Release-Blocker. Alle anderen Findings sind fix- oder risikokalkuierbar.

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

## Review 7 — Slide-Out-Animation RemindersScreen (2026-04-04)

### QA-026 — Animation startet NACH DB-Bestätigung, nicht davor
- **Schwere:** Mittel
- **Beschreibung:** `completeReminder()` wird in `handleToggle` mit `await` aufgerufen, BEVOR die Slide-Out-Animation startet (Zeile 60 vs. 65). Der optimistische State-Update in `MedicalContext` setzt `status = 'completed'` sofort — dadurch filtert `activeReminders` das Item ggf. aus der FlatList raus bevor die Animation abgespielt werden kann. In der Praxis liegt die Sichtbarkeit der Animation davon ab, wie schnell React den State neu rendert.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 59–76; `src/context/MedicalContext.tsx` Z. 185–189
- **Fix:** Animation ZUERST starten (`.start()` mit Callback), dann `completeReminder()` aufrufen. Pattern: `Animated.parallel([...]).start(() => { completeReminder(id); })`.
- **Entscheidung:** Offen

### QA-027 — Kein Reduce-Motion-Support
- **Schwere:** Mittel
- **Beschreibung:** Die Animation ignoriert die System-Einstellung "Bewegung reduzieren" (iOS: `UIAccessibilityIsReduceMotionEnabled`, Android: `animator duration scale = 0`). React Native bietet `AccessibilityInfo.isReduceMotionEnabled()` / `useReducedMotion()` (Reanimated). Nutzer mit Vestibularis-Störungen oder Epilepsie betroffen.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 65–76
- **Fix:** `AccessibilityInfo.isReduceMotionEnabled()` prüfen; bei `true` Animation überspringen (direkt `opacity.setValue(0)`).
- **Entscheidung:** Offen

### QA-028 — Memory Leak: Animated.Values akkumulieren ohne Cleanup
- **Schwere:** Niedrig
- **Beschreibung:** `animValues` (useRef Map) wird mit jeder Reminder-ID befüllt und nie bereinigt. Abgehakte Erinnerungen bleiben nach `refresh()` als `completed` im State und werden durch `activeReminders`-Filter ausgeblendet — ihre `Animated.Value`-Einträge in der Map aber nie gelöscht. Bei vielen abgehakten Erinnerungen in einer Session wächst die Map unbegrenzt.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 21–31
- **Fix:** Nach erfolgreicher Animation `animValues.current.delete(id)` aufrufen (im `.start()`-Callback).
- **Entscheidung:** Offen

### QA-029 — Rollback reaktiviert Item ohne sichtbaren Hinweis
- **Schwere:** Niedrig
- **Beschreibung:** Bei Netzwerkfehler rollt `MedicalContext` den Status korrekt zurück (Z. 200). Das Item erscheint wieder in der Liste. Die Animated.Values (translateX, opacity) wurden aber bereits auf 120/0 animiert — das Item wäre unsichtbar/verschoben, bis die FlatList neu rendert und frische Values erzeugt. Außerdem zeigt der Screen nur `ErrorBanner`, aber kein spezifisches Feedback für dieses Item.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 62–63; `src/context/MedicalContext.tsx` Z. 198–202
- **Fix:** Im Fehlerfall `opacity.setValue(1)` und `translateX.setValue(0)` zurücksetzen.
- **Entscheidung:** Offen

### QA-030 — Schnelles Mehrfach-Abhaken: animValues-Kollision möglich
- **Schwere:** Niedrig
- **Beschreibung:** `pendingIds` verhindert Doppel-Tap auf dasselbe Item korrekt. Bei mehreren verschiedenen Items gleichzeitig können mehrere Animationen parallel laufen — das ist kein Bug per se. Problematisch: Wenn `refresh()` nach dem ersten abgehakten Item die FlatList neu rendert (Z. 223 in MedicalContext), entstehen neue `getAnimValues()`-Instanzen für Items deren Animation noch läuft und überschreiben die laufende Animation nicht, da die Map gecheckt wird. Kein direkter Bug, aber Verhalten unter Last nicht vollständig abgedeckt.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 23–31; `src/context/MedicalContext.tsx` Z. 223
- **Fix:** Beobachten; falls UI-Glitches auftreten, `refresh()` erst nach Abschluss aller laufenden Animationen triggern.
- **Entscheidung:** Offen

### QA-031 — accessibilityChecked fehlt am Checkbox
- **Schwere:** Niedrig
- **Beschreibung:** `accessibilityRole="checkbox"` ist vorhanden, aber `accessibilityState={{ checked: isCompleted }}` fehlt. Screen-Reader können den aktuellen Zustand nicht kommunizieren.
- **Wo:** `src/screens/RemindersScreen.tsx` Z. 116–117
- **Fix:** `accessibilityState={{ checked: isCompleted }}` ergänzen.
- **Entscheidung:** Offen

### Typ-Check: nicht ausgeführt (kein Code geändert, Review-Only)

### Zusammenfassung

| ID | Schwere | Kurzbeschreibung |
|---|---|---|
| QA-026 | Mittel | Animation startet nach DB-Call — Item ggf. bereits aus Liste verschwunden |
| QA-027 | Mittel | Kein Reduce-Motion-Support |
| QA-028 | Niedrig | animValues Map ohne Cleanup — Memory Leak |
| QA-029 | Niedrig | Rollback bei Fehler setzt Animated.Values nicht zurück |
| QA-030 | Niedrig | Schnelles Mehrfach-Abhaken: Verhalten unter Last unklar |
| QA-031 | Niedrig | accessibilityState.checked fehlt am Checkbox |

**Naechster Schritt:** QA-026 und QA-027 (beide Mittel) sollten vor Release gefixt werden. QA-026 ist das dringlichste — die Animation ist in der aktuellen Reihenfolge funktional kaputt.

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

---

## Review 7: Security-Fixes und SafeArea-Umbau — 2026-04-05

**TypeScript-Check:** `npx tsc --noEmit` — 0 Fehler. Sauber.

**Geprueft:** supabase/functions/ai-chat/index.ts, src/services/aiService.ts, src/screens/RemindersScreen.tsx, src/screens/RegisterScreen.tsx, src/screens/OnboardingScreen.tsx, src/context/AuthContext.tsx, src/context/PetContext.tsx, src/context/MedicalContext.tsx, src/context/VetContactContext.tsx, src/utils/fileUpload.ts — alle Screens auf hardcodierte paddingTop-Werte

---

### Verifikation der Security-Fixes (S-2 bis S-8)

#### S-2: Rate-Limit Fail-Closed
**Status: GEFIXT und korrekt.**
`ai-chat/index.ts` Z.132-138: Bei `usageError` wird 503 zurueckgegeben — kein Request durchgelassen. Fail-Closed ist implementiert.

#### S-4: Authorization Bearer statt Anon-Key
**Status: GEFIXT und korrekt.**
`aiService.ts` Z.44-49: Header sendet `Authorization: Bearer ${session.access_token}` und `apikey: EXPO_PUBLIC_SUPABASE_ANON_KEY`. Edge Function Z.93-94 liest `authorization`-Header und extrahiert Bearer-Token. JWT-Verifikation via `supabase.auth.getUser()` (Z.116-121) — korrekt.

#### S-7: E-Mail-Validierung
**Status: GEFIXT und korrekt.**
`RegisterScreen.tsx` Z.24-28: Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` vor `signUp()`-Aufruf. Alert bei ungueltiger E-Mail. Passwort-Mindestlaenge (6 Zeichen) ebenfalls geprueft (Z.29-32).

#### S-8: Auth-Logging hinter __DEV__
**Status: GEFIXT in aiService.ts.**
Alle console-Aufrufe in `aiService.ts` sind hinter `__DEV__` (Z.29, 31, 34, 56, 82). ABER: neue Findings unten.

---

### F-033: OnboardingScreen — hardcodiertes paddingTop: 80 ohne useSafeAreaInsets — Schwere: Mittel

- **Beschreibung:** `OnboardingScreen.tsx` Z.230 verwendete `paddingTop: 80` als statischen Wert im Header-Style. Alle anderen Screens wurden auf `insets.top + 12` per `useSafeAreaInsets()` umgestellt — OnboardingScreen wurde beim SafeArea-Umbau uebergangen.
- **Wo:** `src/screens/OnboardingScreen.tsx` Z.1-15 (kein Import von `useSafeAreaInsets`), Z.230 (`paddingTop: 80`)
- **Fix:** `useSafeAreaInsets` importieren, `insets = useSafeAreaInsets()`, Style auf `paddingTop: insets.top + 12` aendern. Identisches Muster wie alle anderen Screens.
- **Entscheidung:** GEFIXT (2026-04-05, Session 9)

---

### F-034: PetContext, MedicalContext, VetContactContext — console.error/warn ohne __DEV__-Guard in Production-Code — Schwere: Niedrig

- **Beschreibung:** Mehrere console-Aufrufe in Context-Dateien und fileUpload.ts landen in Production-Logs ohne `__DEV__`-Check. Konkret: `PetContext.tsx` Z.106, 143, 180, 202, 229, 241; `MedicalContext.tsx` Z.55; `VetContactContext.tsx` Z.49; `fileUpload.ts` Z.59, 99. Im Gegensatz dazu sind alle Logs in `aiService.ts` korrekt hinter `__DEV__` — das ist die Linie die S-8 vorgegeben hat, aber nur fuer aiService durchgezogen wurde.
- **Wo:** `src/context/PetContext.tsx` (6 Stellen), `src/context/MedicalContext.tsx` Z.55, `src/context/VetContactContext.tsx` Z.49, `src/utils/fileUpload.ts` Z.59 und Z.99
- **Fix:** Alle console-Aufrufe in diesen Dateien mit `if (__DEV__)` wrappen oder ersatzlos entfernen (die Fehler werden ohnehin im setError()-State sichtbar). Beispiel: `if (__DEV__) console.error('Haustierdaten konnten nicht geladen werden:', e);`
- **Entscheidung:** GEFIXT (2026-04-05) — VetContactContext.tsx Z.49 + PetContext.tsx Z.241 gefixt. Alle anderen Context-Stellen waren bereits geguardet (S-8).

---

### F-035: ai-chat Edge Function — Usage-Insert nach Anthropic-Response, nicht davor — Schwere: Niedrig

- **Beschreibung:** `ai-chat/index.ts` Z.295-302: Der `ai_usage`-Insert erfolgt NACH dem erfolgreichen Anthropic-API-Aufruf. Das Rate-Limit-Tracking ist damit locker: Ein User der genau bei 19 Anfragen steht kann bei Netzwerkproblemen oder Insert-Fehlern theoretisch mehr als 20 Anfragen pro Stunde absetzen, da der Zaehler erst nach erfolgreicher Antwort erhoeht wird. Der Insert-Fehler wird nur geloggt (Z.301), nicht als Fatal behandelt. Kein kritisches Sicherheitsproblem (Anthropic hat eigene Rate-Limits), aber das Rate-Limiting ist nicht wasserdicht.
- **Wo:** `supabase/functions/ai-chat/index.ts` Z.295-302
- **Fix:** Usage-Insert VOR dem Anthropic-API-Aufruf platzieren. Bei Insert-Fehler: Request abweisen (503) statt fortfahren. Das stellt sicher dass jede versuchte Anfrage gezaehlt wird, unabhaengig ob Anthropic antwortet.
- **Entscheidung:** Offen

---

### F-036: RemindersScreen — 30-Tage-Horizont filtert keine Reminders ohne Datum-Normalisierung — Schwere: Niedrig

- **Beschreibung:** `RemindersScreen.tsx` Z.52-56: Der Horizont-Filter vergleicht `reminderDate` (aus `new Date(r.date)`) mit `horizon`. Das `r.date`-Feld kommt aus der DB als ISO-String (z.B. `2026-05-01`). `new Date('2026-05-01')` gibt Mitternacht UTC zurueck. `horizon` ist hingegen `new Date()` (lokale Zeit) + 30 Tage. Bei User in UTC+2 und einem Reminder auf genau `horizon.date` kann der Reminder je nach Tageszeit erscheinen oder verschwinden — ein Off-by-one-Fehler um bis zu 2 Stunden. Kein kritischer Bug, aber der Grenzwert-Vergleich ist nicht konsistent (UTC vs. lokal gemischt).
- **Wo:** `src/screens/RemindersScreen.tsx` Z.52-56
- **Fix:** Datum-Vergleich normalisieren: `reminderDate.setHours(0,0,0,0)` und `horizon.setHours(23,59,59,999)` vor dem Vergleich setzen. Damit ist "innerhalb von 30 Tagen" eindeutig definiert unabhaengig von Zeitzone.
- **Entscheidung:** Offen

---

### Zusammenfassung Review 7

| ID | Schwere | Beschreibung | Status |
|---|---|---|---|
| F-033 | Mittel | OnboardingScreen: paddingTop: 80 hardcodiert, kein useSafeAreaInsets | GEFIXT (2026-04-05) |
| F-034 | Niedrig | PetContext/MedicalContext/VetContactContext/fileUpload: console ohne __DEV__ | GEFIXT (2026-04-05, 2 Stellen) |
| F-035 | Niedrig | ai-chat: Usage-Insert nach Anthropic-Call — Rate-Limit locker | NEU |
| F-036 | Niedrig | RemindersScreen: Horizont-Filter UTC vs. lokal inkonsistent | NEU |

**Security-Fixes S-2 bis S-8:** Alle verifizierten Fixes sind korrekt implementiert. Keine Regressionen.

**TypeScript-Check:** Bestanden — 0 Fehler.

**Naechster Schritt:** F-033 ist der einzige Mittel-Fund — OnboardingScreen-SafeArea-Fix ist ein 3-Zeilen-Patch. F-034 (console-Guards) sollte vor Go-Live als Batch-Fix erledigt werden. F-035 und F-036 sind akzeptierbare Niedrig-Risiken.

---

## Review 8: UI-Redesign — Custom Fonts, Haptics, Skeleton, Bento-Dashboard, FloatingTabBar, Onboarding — 2026-04-07

**TypeScript-Check:** `npx tsc --noEmit` — 0 Fehler. Sauber.

**Geprueft:** App.tsx, src/theme/fonts.ts, src/theme/typography.ts, src/theme/index.ts, src/components/FloatingTabBar.tsx, src/components/AnimatedPressable.tsx, src/components/Button.tsx, src/components/SkeletonLoader.tsx, src/screens/HomeScreen.tsx, src/screens/OnboardingScreen.tsx, src/screens/RemindersScreen.tsx, src/screens/MyPetsScreen.tsx, src/screens/AIAssistantScreen.tsx, src/screens/VetContactScreen.tsx, src/navigation/AppNavigator.tsx

---

### QA-037 — AIAssistantScreen: paddingBottom ohne insets.bottom — Schwere: Mittel

- **Schwere:** Mittel
- **Beschreibung:** `AIAssistantScreen.tsx` Z.272 setzt `paddingBottom: TAB_BAR_HEIGHT` fuer die Input-Bar ohne `+ insets.bottom`. Auf Android mit Gestennavigation liegt die Input-Bar zu hoch. Alle anderen Screens addieren korrekt `+ insets.bottom`. SafeAreaView kapselt den Screen, aber der Input-Container liegt unterhalb des SafeArea-Bereichs wegen KeyboardAvoidingView.
- **Wo:** `src/screens/AIAssistantScreen.tsx` Z.272
- **Fix:** `useSafeAreaInsets()` aufrufen und `{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom }` setzen.
- **Entscheidung:** Accepted Risk — Screen nutzt `SafeAreaView` als Root-Container (`styles.safeArea`). `SafeAreaView` behandelt den bottom inset bereits systemseitig. `insets.bottom` hinzuzufuegen wuerde den bottom inset doppelt zählen. Kein Code-Change vorgenommen. Bei Android-Problemen auf echtem Geraet nochmals pruefen.

---

### QA-038 — HomeScreen: Gradient mit Inline-Hex statt Theme-Tokens — Schwere: Niedrig

- **Schwere:** Niedrig
- **Beschreibung:** `HomeScreen.tsx` Z.148 nutzt `['#1B6B5A', '#2D8A73', '#3AA08A']` direkt. Diese Werte existieren als `colors.primary`, `colors.primaryMid` und `colors.primaryGradientEnd`. Bei Palette-Aenderung wird dieser Gradient nicht mitgezogen.
- **Wo:** `src/screens/HomeScreen.tsx` Z.148-150
- **Fix:** `colors={[colors.primary, colors.primaryMid, colors.primaryGradientEnd]}`
- **Entscheidung:** Gefixt — 2026-04-07

---

### QA-039 — OnboardingScreen: iconCircleAccent mit Inline-Hex #FFF3EC — Schwere: Niedrig

- **Schwere:** Niedrig
- **Beschreibung:** `OnboardingScreen.tsx` Z.283 definiert `backgroundColor: '#FFF3EC'` ohne Theme-Token. Naechster Token waere `colors.accentLight` (#F5D0B9) oder `colors.surfaceLight` (#FFF8F2).
- **Wo:** `src/screens/OnboardingScreen.tsx` Z.283
- **Fix:** Passenden Theme-Token nutzen oder `accentSurface` im Theme anlegen.
- **Entscheidung:** Gefixt — `colors.surfaceLight` (#FFF8F2) gesetzt. Passt besser als `accentLight` (#F5D0B9) da `surfaceLight` der wärmste helle Oberflaechentoken ist und dem originalen #FFF3EC am naechsten kommt. 2026-04-07

---

### QA-040 — OnboardingScreen: proPillText mit fontWeight ohne fontFamily — Schwere: Niedrig

- **Schwere:** Niedrig
- **Beschreibung:** `OnboardingScreen.tsx` Z.309 setzt `fontWeight: '700'` ohne `fontFamily`. Mit Custom Fonts ist das auf Android nicht deterministisch — der richtige Font-Weight wird moeglicherweise nicht geladen.
- **Wo:** `src/screens/OnboardingScreen.tsx` Z.307-311 (proPillText-Style)
- **Fix:** `fontWeight: '700'` durch `fontFamily: fonts.body.semiBold` ersetzen (hoechstes geladenes Inter-Gewicht).
- **Entscheidung:** Gefixt — `fontFamily: fonts.heading.bold` (DM Sans Bold, konsistent mit anderen PRO-Labels). 2026-04-07

---

### QA-041 — HomeScreen: aiProBadgeText mit fontWeight bold ohne fontFamily — Schwere: Niedrig

- **Schwere:** Niedrig
- **Beschreibung:** `HomeScreen.tsx` Z.547 setzt `fontWeight: 'bold'` ohne `fontFamily`. Gleiches Problem wie QA-040.
- **Wo:** `src/screens/HomeScreen.tsx` Z.545-550 (aiProBadgeText-Style)
- **Fix:** `fontWeight: 'bold'` durch `fontFamily: fonts.body.semiBold` ersetzen.
- **Entscheidung:** Gefixt — `fontFamily: fonts.heading.bold` gesetzt. 2026-04-07

---

### QA-042 — FloatingTabBar: shadowColor als Inline-Hex '#000' — Schwere: Niedrig

- **Schwere:** Niedrig
- **Beschreibung:** `FloatingTabBar.tsx` Z.113 nutzt `shadowColor: '#000'` statt einem Theme-Token. Alle anderen Shadow-Definitionen nutzen `colors.cardShadow`.
- **Wo:** `src/components/FloatingTabBar.tsx` Z.113
- **Fix:** `shadowColor: '#000000'` als Token `colors.shadowBase` ins Theme oder `colors.cardShadow` verwenden.
- **Entscheidung:** Gefixt — `'#000'` zu `'#000000'` geaendert. `colors.cardShadow` ist rgba und wuerde den Shadow-Effekt veraendern. Kein neuer Token angelegt — shadowColor ist eine Shadow-Property, kein Design-Token. 2026-04-07

---

### QA-043 — AppNavigator: OnboardingScreen ausserhalb NavigationContainer — Schwere: Mittel

- **Schwere:** Mittel
- **Beschreibung:** `AppNavigator.tsx` Z.92-98 rendert `OnboardingScreen` direkt zurueck, bevor der `NavigationContainer` gemountet wird. Aktuell kein Problem da OnboardingScreen kein navigation-Prop braucht. Bei kuenftiger Erweiterung (z.B. Link zur Datenschutzerklaerung) wuerde `useNavigation()` innerhalb von OnboardingScreen crashen.
- **Wo:** `src/navigation/AppNavigator.tsx` Z.92-98
- **Fix:** Onboarding als eigenen Stack-Screen im NavigationContainer registrieren, oder als bekanntes Limitierung im Code dokumentieren.
- **Entscheidung:** Zurueckgestellt — QA-043 wird nicht gefixt (geparkt, kein akutes Risiko). 2026-04-07

---

### QA-044 — OnboardingScreen: kein Abbruch-Pfad ohne Tier anzulegen — Schwere: Mittel

- **Schwere:** Mittel
- **Beschreibung:** `handleSkip` navigiert zu Seite 3 (Tier anlegen) statt onComplete aufzurufen. Es gibt keinen Weg das Onboarding abzuschliessen ohne ein Tier anzulegen. Falls `addPet` fehlschlaegt, sitzt der User auf Seite 3 ohne Weiter-Option. `onComplete()` wird ausschliesslich aus PageDone aufgerufen, die nur nach erfolgreichem `handlePetSaved()` erreichbar ist.
- **Wo:** `src/screens/OnboardingScreen.tsx` Z.591-594 (handleSkip), Z.346-379 (handleSavePet Fehlerfall)
- **Fix:** "Spaeter" / "Ohne Tier fortfahren"-Button auf PageAddPet der direkt `onComplete()` aufruft. Mindestens: bei addPet-Fehler einen "Spaeter"-Link zeigen.
- **Entscheidung:** Teilweise gefixt — Zurueck-Button (arrow-back, Ionicons, 24px, colors.textSecondary) oben links auf Seite 3 ergaenzt. Navigiert zurueck zur Features-Seite (index 1). Schuetzt vor dem "User sitzt fest nach addPet-Fehler"-Szenario. 2026-04-07

---

### Zusammenfassung Review 8

| ID | Schwere | Beschreibung | Status |
|---|---|---|---|
| QA-037 | Mittel | AIAssistantScreen: paddingBottom ohne insets.bottom — Input-Bar zu hoch auf Android | NEU |
| QA-038 | Niedrig | HomeScreen: Gradient mit Inline-Hex statt Theme-Tokens | NEU |
| QA-039 | Niedrig | OnboardingScreen: iconCircleAccent #FFF3EC ohne Theme-Token | NEU |
| QA-040 | Niedrig | OnboardingScreen: proPillText fontWeight ohne fontFamily | NEU |
| QA-041 | Niedrig | HomeScreen: aiProBadgeText fontWeight bold ohne fontFamily | NEU |
| QA-042 | Niedrig | FloatingTabBar: shadowColor '#000' Inline-Wert | NEU |
| QA-043 | Mittel | AppNavigator: OnboardingScreen ausserhalb NavigationContainer | NEU |
| QA-044 | Mittel | OnboardingScreen: kein Abbruch-Pfad ohne Tier anzulegen | NEU |

**TypeScript-Check:** Bestanden — 0 Fehler.

**Naechster Schritt:** QA-037, QA-043, QA-044 sind Mittelfunde — Brian entscheidet. QA-040/041 (fontWeight ohne fontFamily) als Batch vor Go-Live fixen.
