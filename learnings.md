# Learnings

> Brians Langzeitgedaechtnis. Erkenntnisse die ueber eine einzelne Session hinaus relevant sind.
> Format: `### [Datum] — [Kurztitel]` + Beschreibung.
> Max 100 Zeilen. Alte irrelevante Eintraege entfernen.

---

### 2026-04-04 — ALLE Dokumente am Ende aktualisieren, nicht nur tasks.md
tasks.md, status.md, handoff.md, learnings.md — alle vier gehoeren zum Abschluss-Ritual nach jeder Arbeit. Nicht nur tasks.md. Beim letzten Mal status.md vergessen und Claas musste nachfragen. Nie wieder.

### 2026-04-04 — Learnings ohne Rueckfrage speichern
Wenn etwas offensichtlich ein Learning ist (Erkenntnis, Praeferenz, Fehler-Vermeidung), direkt speichern — nicht erst fragen. Die Rueckfrage selbst ist schon ein Zeichen, dass es gespeichert gehoert.

### 2026-04-04 — Supabase Edge Functions sind stateless
In-Memory-State (Maps, Variablen) ueberlebt nicht zuverlaessig zwischen Requests. Fuer persistenten State (Rate Limiting etc.) immer Supabase-Tabelle nutzen. Deno Deploy Isolates koennen jederzeit neu starten.

### 2026-04-04 — Rate Limiting fail-open bauen
Wenn die DB-Abfrage fuer Rate Limiting fehlschlaegt, Request trotzdem durchlassen und nur loggen. Lieber ein paar Requests zu viel als den ganzen Dienst lahmlegen.

### 2026-04-04 — Supabase Edge Functions JWT-Workaround
Supabase Gateway lehnt User-JWTs als "Invalid JWT" ab (ES256-Tokens). Loesung: Anon Key als `Authorization: Bearer` senden (wird vom Gateway akzeptiert), echten User-Token im Custom Header `x-user-token` mitschicken. Edge Function liest User-Token von dort. Zusaetzlich `x-user-token` in CORS Allow-Headers eintragen. Dashboard-Toggle "Verify JWT with legacy secret" auf OFF stellen.

### 2026-04-04 — Anthropic Modelle veralten
`claude-3-haiku-20240307` und `claude-3-5-haiku-20241022` sind nicht mehr verfuegbar (404). Aktuell funktioniert `claude-sonnet-4-6`. Fuer Kostenoptimierung spaeter guenstigeres Modell suchen.

### 2026-04-04 — Parallele Delegation funktioniert gut
Drei unabhaengige Quick-Win-Auftraege parallel an Developer delegiert, dann QA drueber. Effizient und sauber. Bei unabhaengigen Aenderungen immer parallel delegieren.

### 2026-04-04 — QA nach jeder Delegation
QA-Review nach Delegationen findet zuverlaessig Reste (toter Code, vergessene Stellen). Immer QA drueberlaeufen lassen bevor committet wird.

### 2026-04-04 — Edge Function nach Aenderungen deployen
Edge Function laeuft remote auf Supabase — lokale Aenderungen haben keinen Effekt ohne `npx supabase functions deploy ai-chat`. Claas daran erinnern.

### 2026-04-04 — Pet-Fotos nicht in Storage
Pet-Fotos werden als lokale `file://`-URI gespeichert. Nach Neuinstall oder Geraetewechsel weg. Fix: in Supabase Storage hochladen, Pfad in DB speichern — analog zum Dokument-Upload.

### 2026-04-04 — SafeAreaView Inkonsistenz
Nur AIAssistantScreen nutzt SafeAreaView korrekt. Alle anderen Screens hardcoden `paddingTop: 60`. Korrekt: `SafeAreaView` oder `useSafeAreaInsets()` aus `react-native-safe-area-context`.

### 2026-04-04 — Festplatte voll blockiert alles
C:-Laufwerk voll (0 Bytes) blockiert npm, Caching und Builds vollstaendig. Vor laengeren Sessions kurz pruefen.

### 2026-04-03 — Team auch fuer Teilschritte nutzen
Nicht alles alleine durchdenken. Ein kurzer Auftrag an Developer oder DB Expert fuer Machbarkeitsanalyse macht die Planung besser.

### 2026-04-03 — Nicht selbst machen, delegieren
Auch "kleine" technische Aufgaben gehoeren an den Spezialisten, nicht an Brian. Mein Job ist planen und delegieren.

### 2026-04-03 — Grosse Umbauten in kleine Schritte splitten
Bei Datenmodell-Aenderungen: Jeden Schritt einzeln delegieren und vom QA pruefen lassen.

### 2026-04-03 — Supabase CLI auf Windows: npx statt global
`npm install -g supabase` funktioniert nicht auf Windows. Stattdessen `npx supabase` nutzen.
