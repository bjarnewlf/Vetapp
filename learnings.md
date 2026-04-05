# Learnings

> Index — Details im Agency-Vault (`D:\Agency-Vault\Learnings\`).
> Wissensmanager pflegt beides: Vault-Notiz + Einzeiler hier.

## 2026-04-05

- Autonomie Level 3 freigeschaltet — Brian delegiert Standard-Features eigenstaendig, nur bei Architektur/neuen Features Rueckfrage bei Claas
- Entscheidungen gebuendelt abarbeiten ist effizient — 10 Punkte in einer Runde statt ueber Wochen verteilt

### Stitch — Wie man wirklich gute Designs rausbekommt

**API & Setup:**
- Stitch SDK authentifiziert ueber `STITCH_API_KEY` als Env-Var — nicht ueber MCP-Config (die ist nur fuer Chat-Interface)
- Rate-Limit-Workaround: **ein Screen = ein eigenes Projekt** — mehrere Screens im selben Projekt schlagen ab Screen 2 fehl mit "Incomplete API response" (kein sinnvoller Fehlercode, einfach kaputt)
- API ist v0.1.0 — Breaking Changes einkalkulieren, nie versionspinnen ohne Changelogs zu pruefen

**Prompts — was den Unterschied macht:**
- **Pixelwerte fuer alles Kritische** — "Hero 260px", "FAB 56px", "Touch-Target 44px minimum" — Stitch nimmt das ernst
- **Farben als Hex, nie als Namen** — `#1B6B5A` statt "teal", `#FAF6F1` statt "warm off-white"
- **Layout von oben nach unten, Abschnitt fuer Abschnitt** — kein Fliesstext, sondern nummerierte Liste
- **Echten Content einsetzen** — "Bella", "Golden Retriever · 3 Jahre", "Flohschutzmittel" statt Placeholder. Stitch rendert was man reinschreibt.
- **Emotionale Design-Ziele am Anfang** — "warm, premium, trustworthy" VOR den technischen Specs. Beeinflusst den Gesamtstil spuerbar.
- **Hierarchie explizit beschreiben** — "h1 bold 28px", "grey caption 13px", "PRO pill badge" — Stitch rät sonst selbst und liegt meistens daneben
- **Whitespace ist ein Befehl** — "generous whitespace", "breathes", "16px between sections" — ohne Anweisung stapelt Stitch gerne alles zusammen

**Iterieren statt einmal perfekt prompten:**
- `edit_screens` ist der eigentliche Hebel — erst grob generieren, dann gezielt korrigieren: "Make the header gradient darker", "reduce card padding to 12px", "move the FAB 24px from edge"
- `generate_variants` fuer A/B — zwei Varianten mit unterschiedlicher Hierarchie oder Farbstimmung, dann entscheiden
- Design-System VOR Screens anlegen (`create_design_system`) — sonst generiert Stitch freie Farben die nicht zum Token-Set passen

**Output verwenden:**
- HTML-Dateien lokal speichern — Screenshot-URLs (Google CDN) laufen ab
- HTML ist Referenz fuer **Struktur und Proportionen**, nicht fuer Code — kein `div`, kein `box-shadow` in React Native
- Alle finalen Werte kommen aus `src/theme/` — nie aus dem Stitch-Output abschreiben

## 2026-04-04
- Google Stitch als MCP-Server fuer Design-Prototyping eingerichtet — generiert HTML + Screenshots aus Text-Prompts, Designer nutzt es fuer visuelle Referenzen vor der Developer-Delegation
- Doku-Updates sofort nach jedem Arbeitsschritt — nicht erst am Ende eines Blocks; Brian traegt jede Delegation, jeden Fix, jeden Fortschritt direkt in handoff.md und tasks.md ein; kleine haeufige Updates statt grosse seltene
- Mockup-Farben muessen echte App-Farben zeigen — Dark-Theme-Stil (#0f1117) gilt nur fuer Reports/Protokolle, NICHT fuer UI-Mockups; bei Delegation an Designer immer explizit den richtigen Stil angeben
- Agency Meeting mit allen Spezialisten bringt wertvolle Perspektiven — jeder sieht andere Schmerzpunkte
- Neue Teammitglieder (DevOps, Researcher) sehen Prozesse mit frischen Augen — sofort nutzbare Verbesserungsvorschlaege
- Research VOR Feature-Entwicklung spart Sackgassen — nicht reaktiv recherchieren
- Delegations-Kontext ist der groesste Hebel fuer Effizienz — Template mit Dateien, Rules, Kriterien, Risiko
- Optimistic-Update-Animation: Animation VOR State-Update starten — sonst verschwindet das Item bevor die Animation sichtbar ist
- Agency global statt projektspezifisch: Agents in ~/.claude/agents/ + projektspezifischer Kontext aus Repo-Rules — skaliert besser
- Projekt-Templates sparen Rollout-Zeit: Einheitliche tasks.md, status.md, handoff.md, learnings.md + QA-Rule ermoeglicht schnellen Start
- AsyncStorage v3 bricht Expo Go (SDK 54) — immer `npx expo install --check` vor Handy-Test, Fix: Downgrade auf v2.2.0
- Foto-Upload React Native: FormData mit `{ uri, name, type } as any` — fetch+blob funktioniert nicht mit lokalen file:// URIs auf echten Geraeten
- Storage-Policy Pfad-Segmente: `(storage.foldername(name))[1]` ist 1-basiert — tatsaechlichen Upload-Pfad im Dashboard pruefen bevor Policy geschrieben wird
- Package-Versionen vor jedem Handy-Test pruefen: `npx expo install --check` / `--fix` — Expo Go kennt nur bestimmte Native-Module
- Animationen mit built-in Animated API starten — kein Reanimated noetig fuer Fade-In, Scale, Spring
- useFadeIn als Hook extrahieren — einmal bauen, ueberall einsetzen
- AnimatedPressable statt TouchableOpacity — Scale-Feedback macht App sofort wertiger
- useNativeDriver: true nur fuer opacity und transform — backgroundColor geht nicht
- StyleSheet mit sehr vielen Keys: TypeScript kuerzt Typ-Inferenz ab — bei >50 Styles aufteilen
- Design-Umsetzung in Batches parallel delegieren spart viel Zeit
- Changelog am Ende eines produktiven Tages erstellen — sonst geht der Ueberblick verloren
- God-Object-Refactoring: Erst Fassade, dann schrittweise migrieren, dann Fassade loeschen
- QA parallel zum Cleanup laufen lassen fuehrt zu False Positives — besser sequentiell
- MedicalEvent: Ein einheitliches Modell ist flexibler als N separate Tabellen
- Custom-Events duerfen nicht nur Reminder sein — gehoeren auch in die Gesundheitshistorie
- Error-States in neuen Contexts von Anfang an einbauen — nachtraeglich ist teuer
- Edge Function bei Datenformat-Aenderungen sofort mitziehen — sonst KI-Assistent kaputt
- ALLE Dokumente am Ende aktualisieren (tasks, status, handoff, learnings)
- Learnings ohne Rueckfrage speichern
- Supabase Edge Functions sind stateless
- Rate Limiting fail-open bauen
- Supabase Edge Functions JWT-Workaround
- Anthropic Modelle veralten
- Parallele Delegation funktioniert gut
- QA nach jeder Delegation
- Edge Function nach Aenderungen deployen
- Pet-Fotos nicht in Storage
- SafeAreaView Inkonsistenz
- Backlog ist ein Friedhof — jedes Finding braucht explizite Entscheidung
- DataContext (M7) muss vor Release passieren, nicht im Backlog versauern
- 0 Tests — TypeScript allein faengt keine Logikfehler
- Design-Fragen blockieren wenn Claas nicht zeitnah entscheidet
- Vor Edge-Function-Arbeiten Vorab-Recherche (aktuelle Modell-IDs, bekannte Quirks)
- Vault: Tiefe vor Breite — breit aber stellenweise flach
- Nur dokumentieren was wirklich laeuft — keine Fiktion in Prompts
- Theme-Zustaendigkeit: Designer entscheidet WAS, Developer setzt um WO
- Angebot-Abgleich vor Phase-Abschluss — sonst gehen Features (PDF-Export, Tierarztfinder) fast vergessen
- Design-Recherche mit visuellen Mockups (HTML) ist ueberzeugender als Text — Claas konnte sich Aenderungen erst nach Sicht vorstellen
- Parallele Developer-Delegation fuer Design-Batches funktioniert gut — 4 Developer gleichzeitig, alle TypeScript clean
- QA nach jedem grossen Batch laufen lassen — Runde 5 fand 3 Findings die sonst unentdeckt geblieben waeren
- Storage-Policies nicht vergessen — Feature laeuft ohne Policy im Dashboard nicht
- expo-linear-gradient fuer Gradients in React Native — CSS background-gradient geht nicht, braucht eigenes Package
- Card-Varianten als Props formalisieren statt inline-backgroundColor — sauberer und konsistenter
- EmptyState-Komponente lohnt sich — einmal bauen, ueberall einsetzen, sofort professionellerer Look
- KI-Assistent mit Tool Use: Variante B (Confirm First) bevorzugen — Notifications nur auf dem Client planbar

## 2026-04-03
- Nicht selbst machen, delegieren
- Team auch fuer Teilschritte nutzen
- Learnings automatisch festhalten
- Tasks automatisch aktualisieren
- Grosse Umbauten in kleine Schritte splitten
- Supabase CLI auf Windows: npx statt global
- Festplatte voll blockiert alles
- AI-Assistent Deployment: Schritt-fuer-Schritt Anleitung
