# Dashboard Review — VetApp Bento HomeScreen
Stand: 2026-04-07

---

## Was funktioniert gut

**Animierter Header.** Der kollapsible Header mit Greeting-Fade und Border-Radius-Transition ist solide. Das gibt dem Screen Tiefe ohne Performance-Kosten (useNativeDriver: false ist ok hier, da height nicht mit Native Driver animierbar ist).

**Termin-Card mit Links-Border.** Die 4px-Border in `colors.error` oder `colors.primary` ist das stärkste visuelle Signal auf dem Screen — klar, schnell lesbar, gut umgesetzt.

**TimelineItem-Komponente.** Datum-Block links, Titel + Tiername in der Mitte, Typ-Badge rechts — klassisches drei-Spalten-Layout, funktioniert auf kleinem Screen. Die farbcodierten Badges nach Typ sind sinnvoll und konsistent mit dem Theme.

**Touch-Targets.** Profil-Button 44x44px, Quick-Action-Cards 140px hoch — alles im grünen Bereich.

---

## Was ist überflüssig oder zu komplex

### 1. Zwei Quick-Action-Cards im Bento-Grid

"Event hinzufügen" und "Erinnerung hinzufügen" als separate Bento-Cards — das ist Struktur um der Struktur willen. Der User braucht nicht zwei gleichgroße Buttons auf der Startseite. "Event" ist der Hauptflow, "Erinnerung" ist sekundär. Auf 375px konkurrieren beide visuell gleich stark.

Das Bento-Grid hat dadurch vier Cards in zwei Reihen: Termin (2/3) + Event (1/3) oben, Erinnerung (1/3) + KI (2/3) unten. Das ergibt ein diagonales Muster — oben links groß, unten rechts groß. Für Symmetrie okay, aber es versteckt die Hierarchie: was ist die primäre Aktion?

### 2. KI-Assistent-Card im Dashboard ist schwach gerechtfertigt

Der KI-Tab ist einen Tap entfernt. Die Card auf dem HomeScreen sagt lediglich "Frage stellen" — das ist kein kontextrelevanter Mehrwert. Wenn die Card personalisiert wäre ("Bella hat in 3 Tagen einen Termin — Fragen?") würde sie reinpassen. So ist sie hauptsächlich Upsell-Fläche für PRO.

Das ist nicht falsch, aber ehrlicher: Es ist Marketing, kein UX.

### 3. Aktivitäts-Sektion vs. Termin-Card — Datenredundanz

Die "Nächster Termin"-Card zeigt den frühesten offenen Eintrag. Die Aktivitäts-Sektion darunter zeigt die 3 frühesten offenen Einträge — inklusive des gleichen Eintrags der oben schon steht. Der erste Timeline-Eintrag und die Termin-Card zeigen zum großen Teil identische Daten. Das atmet nicht, das wiederholt sich.

### 4. PetListRow statt Card-Carousel

Die Referenz (stitch-bento-dashboard.html) nutzt ein horizontales Carousel mit 145x180px Pet-Cards — das zeigt Fotos, Namen und Art auf einen Blick und passt zur Bento-Ästhetik. Die Implementierung nutzt `PetListRow` — vertikale Liste. Das ist nicht falsch, aber es verbraucht deutlich mehr vertikalen Platz, drückt alles nach unten, und fühlt sich wie ein anderer Screen an als das Bento-Grid darunter. Ästhetisch inkonsistent.

### 5. Sectionsheader-Bezeichnung "Aktivität"

Der Sectionsheader heißt "Aktivität", zeigt aber ausschließlich zukünftige Termine und offene Erinnerungen — also keine Aktivität sondern einen Ausblick. Das ist eine falsche Beschriftung. "Nächste Termine" oder einfach "Anstehend" wäre präziser.

---

## Konkrete Vereinfachungsvorschläge

### A — Bento-Grid auf 3 Cards reduzieren (statt 4)

**Jetzt:** Reihe 1: Termin (2/3) + Event (1/3) | Reihe 2: Erinnerung (1/3) + KI (2/3)

**Vorschlag:** Reihe 1: Termin (2/3) + Event (1/3) | Reihe 2: KI-Card (Vollbreite)

Die Erinnerungs-Quick-Action fällt weg. "Erinnerung hinzufügen" ist über den Erinnerungs-Tab erreichbar — keine Redundanz nötig. Die KI-Card gewinnt Vollbreite und kann mehr aussagen (zB kontextueller Tipp). Das Grid atmet besser.

**Alternativ:** Eine einzige Quick-Action-Card die per Kontext entscheidet — "Termin eintragen" wenn kein nächster Termin vorhanden, "Erinnerung" wenn kein offener Reminder. Aber das ist Logik, keine reine Design-Entscheidung — Claas muss das abnicken.

### B — Aktivitäts-Sektion umbenennen + Duplikat entfernen

Umbenennung: "Aktivität" → "Anstehend". Logik: Den ersten Timeline-Eintrag überspringen wenn er identisch mit `nextAppointment` ist — oder die Sektion erst ab dem zweiten Eintrag beginnen. So zeigt der Screen: "Dein nächster Termin ist X" (Card) und darunter "Und dann kommen noch: Y, Z" (Timeline). Echte Hierarchie statt Wiederholung.

### C — Pet-Sektion auf Carousel umstellen

Dem Stitch-Referenzdesign folgen: horizontales Carousel mit Card-Format statt `PetListRow`. Das spart vertikalen Platz, macht die Fotos zum Blickfang, und passt zur Bento-Ästhetik des Grids darunter. `PetListRow` bleibt für den Tiere-Tab sinnvoll, ist aber auf dem HomeScreen fehl am Platz.

---

## Vergleich mit Stitch-Referenz — wesentliche Abweichungen

| Aspekt | Referenz | Implementierung |
|---|---|---|
| Pet-Sektion | Horizontales Card-Carousel | Vertikale PetListRow-Liste |
| Bento Row 2 | Health-Score-Card (1/3) + KI (2/3) | Erinnerungs-Quick-Action (1/3) + KI (2/3) |
| Countdown-Badge auf Termin-Card | Vorhanden ("3T" Badge unten rechts) | Fehlt — nur Datum als Text |
| Aktivitäts-Header | "Letzte Aktivität" | "Aktivität" |
| Subtitle im Header | "Alles im Blick." | "Willkommen zurück bei VetApp" |

Die Referenz hatte eine Health-Score-Card (Nummer "92", grüner Dot) — das ist in der Implementierung durch die Erinnerungs-Action ersetzt worden. Das ist eine bewusste Entscheidung, aber kein Upgrade: ein Health-Score wäre informativer als ein reiner Action-Button.

---

## Priorisierte Empfehlung

**Wenn ich nur eine Sache ändern würde:**

Die Aktivitäts-Sektion so filtern, dass sie nicht den gleichen Eintrag wiederholt wie die Termin-Card. Das kostet eine Zeile Code (Filter auf `timelineItems` der `nextAppointment.date` und `nextAppointment.title` ausschließt) und eliminiert sofort das auffälligste inhaltliche Problem: der Screen sagt dem User zweimal dasselbe.

Hintergrund: Alle anderen Probleme sind ästhetisch oder strukturell — lösbar, aber Aufwand. Dieses hier ist eine Datenfrage die den User aktiv verwirrt: "Hab ich das schon gesehen?" Ja, hast du. Zweimal.

---

## Offene Fragen für Claas

1. **Health-Score statt Erinnerungs-Quick-Action?** Der Stitch-Entwurf hatte dort eine Score-Zahl. Wäre das Features-technisch möglich oder ist kein Score-Algorithmus geplant?
2. **KI-Card Kontext?** Soll die Card immer "Frage stellen" zeigen oder kann sie einen personalisierten Hinweis zeigen (nächster Termin, letztes Event)?
3. **Pet-Carousel vs. List?** Soll `PetListRow` auf dem HomeScreen bleiben oder auf das Card-Format aus der Referenz umgestellt werden? Developer-Aufwand ist überschaubar, aber das ist eine Scope-Entscheidung.
