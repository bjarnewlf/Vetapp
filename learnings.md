# Learnings

> Brians Langzeitgedaechtnis. Erkenntnisse die ueber eine einzelne Session hinaus relevant sind.
> Format: `### [Datum] — [Kurztitel]` + Beschreibung.
> Max 100 Zeilen. Alte irrelevante Eintraege entfernen.

---

### 2026-04-04 — Supabase Edge Functions JWT-Workaround
Supabase Gateway lehnt User-JWTs als "Invalid JWT" ab (ES256-Tokens). Loesung: Anon Key als `Authorization: Bearer` senden (wird vom Gateway akzeptiert), echten User-Token im Custom Header `x-user-token` mitschicken. Edge Function liest User-Token von dort. Zusaetzlich `x-user-token` in CORS Allow-Headers eintragen. Dashboard-Toggle "Verify JWT with legacy secret" auf OFF stellen.

### 2026-04-04 — Anthropic Modelle veralten
`claude-3-haiku-20240307` und `claude-3-5-haiku-20241022` sind nicht mehr verfuegbar (404). Aktuell funktioniert `claude-sonnet-4-6`. Fuer Kostenoptimierung spaeter guenstigeres Modell suchen (z.B. `claude-haiku-4-6` falls verfuegbar).

### 2026-04-03 — Nicht selbst machen, delegieren
Auch "kleine" technische Aufgaben wie SQL vorbereiten gehoeren an den Spezialisten, nicht an Brian. Mein Job ist planen und delegieren.

### 2026-04-03 — Team auch fuer Teilschritte nutzen
Nicht alles in einen grossen Auftrag packen. Kleine Rueckfragen an Spezialisten machen die Planung besser.

### 2026-04-03 — Learnings automatisch festhalten
Wenn in einer Session eine Erkenntnis entsteht, sofort in learnings.md schreiben. Nicht erst fragen.

### 2026-04-03 — tasks.md automatisch aktualisieren
Bei jedem Commit die tasks.md mitpflegen — erledigte Tasks abhaken, neue ergaenzen.

### 2026-04-03 — Grosse Umbauten in kleine Schritte splitten
Bei Datenmodell-Aenderungen: Jeden Schritt einzeln delegieren und vom QA pruefen lassen.

### 2026-04-03 — Supabase CLI auf Windows: npx statt global
`npm install -g supabase` funktioniert nicht auf Windows. Stattdessen `npx supabase` nutzen.

### 2026-04-03 — AI-Assistent Deployment: Claas braucht Anleitung
Deployment-Schritte muessen Schritt fuer Schritt erklaert werden. Kurze, klare Anweisungen.
