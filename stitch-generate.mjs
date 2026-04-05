import { stitch } from "@google/stitch-sdk";

const PROJECT_NAME = "VetApp — Redesign Prototypen";

const SCREENS = [
  {
    id: "home",
    label: "HomeScreen",
    prompt: `Mobile app screen for a German pet health app called "VetApp". Design language: warm, premium, trustworthy. Colors: primary teal #1B6B5A, accent orange #CC6B3D, background #FAF6F1 (warm off-white), cards white #FFFFFF.

Layout (top to bottom):
1. Hero header with teal gradient (#1B6B5A to #3AA08A), greeting "Hallo, Claas! 👋" bold white 28px, subtitle "Willkommen zurück" white 85% opacity, profile avatar circle button top-right 44px.
2. Horizontal scrollable pet cards — section label "Meine Tiere" h2 bold with "+ Hinzufügen" teal link right. Each card 150x180px white rounded-16 shadow: circular pet photo 80px, pet name bold, species badge, age text. Show 2 full cards + partial 3rd for scroll hint.
3. "Nächste Termine" section — 3 timeline rows. Each: colored left border (red=overdue, teal=upcoming), icon, title bold, pet name secondary, date right. First row red border + "Überfällig" red badge pill.
4. KI card — teal-tinted bg #E8F5F1 with teal border, sparkle icon in teal circle 44px, "KI-Gesundheitsassistent" bold, subtitle smaller, PRO pill badge + "Frage stellen →" right.
5. Bottom tab bar 5 tabs, active tab orange #CC6B3D.

Lots of whitespace, strong typographic hierarchy, premium health app feel.`,
  },
  {
    id: "pet-detail",
    label: "PetDetailScreen",
    prompt: `Mobile pet detail screen for a German pet health app "VetApp". Colors: teal #1B6B5A, orange #CC6B3D, background #FAF6F1.

Layout:
1. Hero 260px tall — teal gradient, blurred pet photo overlay 35% opacity, circular pet photo 100px centered-left, "Bella" white bold 32px bottom-left, "Golden Retriever · 3 Jahre" white 75% opacity below. Back arrow circle button top-left, edit icon top-right.
2. Quick stats row — 3 white pill cards: "3 Impfungen", "2 Erinnerungen", "1 Dokument". Icon + number bold + label.
3. Tab bar — "Gesundheit" active teal, "Dokumente" with lock Pro icon, "Tierarzt". Sliding indicator, white bg rounded-12.
4. Health tab: "Impfungen" header + "+ Event" teal button. 2 vaccination cards white with teal left accent bar, name bold, date, next date in teal. "Behandlungen" subsection with 1 orange-border card.
5. Floating action button teal circle "+" bottom-right.

Premium feel, strong hierarchy, breathing room.`,
  },
  {
    id: "reminders",
    label: "RemindersScreen",
    prompt: `Mobile reminders screen for a German pet health app "VetApp". Colors: teal #1B6B5A, orange #CC6B3D, red #D94040, background #FAF6F1.

Layout:
1. Simple header "Erinnerungen" h1 dark, no gradient.
2. Overdue banner — red-tinted card #FDEAEA with red left border 4px, warning icon, "2 Erinnerungen überfällig" bold red, subtitle in red-secondary.
3. Three reminder cards:
   a. Overdue: red left border, "Flohschutzmittel" bold, "Bella · Hund" secondary, "vor 3 Tagen" red right, checkbox 44px.
   b. Upcoming: teal left border, "Impfung Tollwut", "Max · Katze", "in 5 Tagen" teal.
   c. Future: "Vorsorge-Untersuchung", "Bella", "in 14 Tagen" muted.
4. Full-width teal "+ Erinnerung hinzufügen" button, 50px height, rounded-12.
5. Bottom tab bar, bell tab active orange.

Calm and functional. Urgency through color, not chaos. 44px touch targets.`,
  },
];

async function main() {
  console.log("🎨 VetApp Stitch Prototype Generator\n");
  console.log(`📁 Erstelle Projekt: "${PROJECT_NAME}"...`);

  const project = await stitch.createProject(PROJECT_NAME);
  console.log(`   ✓ Projekt-ID: ${project.id}\n`);

  const results = [];

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

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Fertig:\n");
  results.forEach(r => {
    console.log(`  ${r.label}`);
    console.log(`    HTML:  ${r.html}`);
    console.log(`    Image: ${r.image}\n`);
  });
}

main().catch(console.error);
