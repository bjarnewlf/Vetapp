import { stitch } from "@google/stitch-sdk";

// VetApp — Stitch Prototype Generator
// Generiert überarbeitete UI-Screens für Home, PetDetail und Reminders
// Farbpalette: Teal #1B6B5A, Orange-Akzent #CC6B3D, Hintergrund #FAF6F1

const PROJECT_NAME = "VetApp — Redesign Prototypen";

const SCREENS = [
  {
    id: "home",
    label: "HomeScreen",
    prompt: `
      Mobile app screen for a German pet health app called "VetApp".
      Design language: warm, premium, trustworthy.
      Colors: primary teal #1B6B5A, accent orange #CC6B3D, background #FAF6F1 (warm off-white), cards white #FFFFFF.

      Layout (top to bottom):
      1. Hero header with teal gradient (#1B6B5A → #3AA08A), shows greeting "Hallo, Claas! 👋" in bold white (28px), subtitle "Willkommen zurück" in white 85% opacity, profile avatar button top-right (44px circle).
      2. Horizontal scrollable pet cards section — label "Meine Tiere" (h2, dark) with "+ Hinzufügen" link in teal right-aligned. Each pet card (150×180px, white, rounded 16px, subtle shadow): circular pet photo (80px), pet name bold below, species badge (e.g. "Hund"), small age text. Show 2 cards + partial 3rd for scroll hint.
      3. "Nächste Termine" section — 3 timeline items as clean list rows. Each row: colored left border (teal=upcoming, red=overdue), event icon, title, pet name in secondary color, date right-aligned. First item has red border + "Überfällig" badge in red.
      4. KI-Assistent card — teal-tinted background (#E8F5F1), teal border, sparkle icon in teal circle, title "KI-Gesundheitsassistent", subtitle smaller, "PRO" badge pill + "Frage stellen →" CTA right-aligned.
      5. Bottom tab bar: 5 tabs (Haus, Pfote, Sparkle, Glocke, Herz+), active tab in orange #CC6B3D.

      Style: lots of breathing room (16-24px padding), no visual clutter, typography hierarchy is strong. Feels like a premium health app.
    `,
  },
  {
    id: "pet-detail",
    label: "PetDetailScreen",
    prompt: `
      Mobile pet detail screen for a German pet health app "VetApp".
      Colors: primary teal #1B6B5A, accent orange #CC6B3D, background #FAF6F1.

      Layout (top to bottom):
      1. Hero section (260px tall) — teal gradient background with the pet photo as blurred overlay (35% opacity). Large circular pet photo (100px) centered-left, name "Bella" in white bold 32px bottom-left, breed + age "Golden Retriever · 3 Jahre" in white 75% opacity. Back arrow (circle button, semi-transparent) top-left, edit icon top-right. Subtle paw icon watermark in hero background.
      2. Quick stats row — 3 white pill cards in a horizontal row: "3 Impfungen", "2 Erinnerungen", "1 Dokument". Each has a small icon, number bold, label below in secondary color.
      3. Tab bar — 3 tabs: "Gesundheit" (active, teal), "Dokumente" (lock icon for Pro), "Tierarzt". Animated indicator sliding underneath. White background, rounded 12px.
      4. Health tab content — two subsections:
         - "Impfungen" header with "+ Event" button (teal, small). 2 vaccination cards: white, left teal accent bar, vaccine name bold, date secondary, "Nächste: 12. Mai 2026" in teal small. Swipe-to-delete hint (red area peeking right).
         - "Behandlungen" header. 1 treatment card, slightly different style (orange left border).
      5. Floating action button: teal circle, "+" in white, bottom-right.

      Style: premium health app feel, strong visual hierarchy, generous whitespace. Cards breathe. No icon overload.
    `,
  },
  {
    id: "reminders",
    label: "RemindersScreen",
    prompt: `
      Mobile reminders screen for a German pet health app "VetApp".
      Colors: primary teal #1B6B5A, accent orange #CC6B3D, error red #D94040, background #FAF6F1.

      Layout (top to bottom):
      1. Simple header — "Erinnerungen" title (h1, dark), no gradient. Top padding for status bar.
      2. Overdue banner — red-tinted card (#FDEAEA, red left border 4px): warning icon, "2 Erinnerungen überfällig" bold red, subtitle "Bitte zeitnah erledigen" in red-secondary. Rounded 12px.
      3. Reminder list — 3 items:
         a. Overdue item: white card, red left border 4px, "Flohschutzmittel" bold, "Bella · Hund" secondary small below, "vor 3 Tagen" in red right, checkbox circle on far right (teal tint, unchecked).
         b. Upcoming item: white card, teal left border, "Impfung Tollwut" bold, "Max · Katze" secondary, "in 5 Tagen" in teal right, checkbox unchecked.
         c. Upcoming item: similar style, slightly faded (future date), "Vorsorge-Untersuchung", "Bella", "in 14 Tagen".
      4. "+ Erinnerung hinzufügen" button — full width, teal background, white text, 50px height, rounded 12px. Bottom of content.
      5. Bottom tab bar matching the other screens, "Glocke" tab active in orange.

      Style: functional and calm. Urgency is communicated through color (red) not chaos. Checkboxes are satisfying 44px touch targets. List has good rhythm.
    `,
  },
];

async function main() {
  console.log("🎨 VetApp Stitch Prototype Generator\n");

  console.log(`📁 Erstelle Projekt: "${PROJECT_NAME}"...`);
  const project = await stitch.createProject(PROJECT_NAME);
  console.log(`   ✓ Projekt-ID: ${project.id}\n`);

  const results: { label: string; html: string; image: string }[] = [];

  for (const screen of SCREENS) {
    console.log(`🖼  Generiere ${screen.label}...`);
    try {
      const generated = await project.generate(screen.prompt);
      console.log(`   ✓ Screen-ID: ${generated.id}`);

      const htmlUrl = await generated.getHtml();
      const imageUrl = await generated.getImage();

      console.log(`   HTML:  ${htmlUrl}`);
      console.log(`   Image: ${imageUrl}\n`);

      results.push({ label: screen.label, html: htmlUrl, image: imageUrl });
    } catch (err) {
      console.error(`   ✗ Fehler bei ${screen.label}:`, err);
    }
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Alle Screens generiert:\n");
  results.forEach(r => {
    console.log(`  ${r.label}`);
    console.log(`    HTML:  ${r.html}`);
    console.log(`    Image: ${r.image}`);
    console.log();
  });
}

main().catch(console.error);
