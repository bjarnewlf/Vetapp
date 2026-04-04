# Learnings

> Index — Details im Agency-Vault (`D:\Agency-Vault\Learnings\`).
> Wissensmanager pflegt beides: Vault-Notiz + Einzeiler hier.

## 2026-04-04
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
