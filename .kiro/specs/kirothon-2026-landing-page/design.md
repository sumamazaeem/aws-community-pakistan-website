# Design Document

## Overview

Kirothon 2026 is a static hackathon landing page delivered as a single self-contained HTML file (`kirothon/index.html`). It requires no build tooling, no JS framework, and no server-side rendering — just open the file in a browser. The page communicates event details, timeline, judging criteria, rules, and community links for the Kirothon 2026 Season 1 hackathon presented by AWS Community Pakistan.

The design follows the Kiro IDE brand aesthetic: dark navy/purple backgrounds, vibrant purple and electric blue accents, glassmorphism cards, and the Inter typeface. A single JS constant (`HACKATHON_STATUS`) at the top of the script block drives the hero status badge, making phase transitions a one-line edit.

## Architecture

The entire page is a single HTML document with three logical layers:

```
kirothon/
├── index.html          ← single file: HTML + <style> + <script>
└── logos/
    ├── islamabad.jpeg
    ├── karachi.jpg
    ├── peshawar.avif
    ├── wit-lahore.avif
    └── faisalabad.png
```

**Rendering model**: Pure static HTML. No client-side routing, no virtual DOM, no bundler. The browser parses the file once and renders it. The only runtime JS is:
1. Status badge rendering (reads `HACKATHON_STATUS`, writes badge HTML into a placeholder `<div>`)
2. Accordion toggle (event delegation on the rules section)

**Deployment**: Drop `kirothon/` directory onto any static host (S3, GitHub Pages, Netlify, etc.).

### Page Section Order

```
<nav>          Fixed navbar
<section#hero> Hero + status badge + CTAs
<section>      What is Kiro?
<section>      Timeline
<section>      What You Can Build
<section>      Hackathon Tracks
<section>      Quick Start
<section>      Judging Criteria
<section>      Guest Judges
<section>      Proud Partners
<section>      Hackathon Winners
<section>      Submission Requirements
<section#rules> Rules & Regulations
<footer>       Footer
```

## Components and Interfaces

### 1. Navbar

- Fixed position, `z-index: 1000`, full-width
- Dark semi-transparent background with `backdrop-filter: blur(10px)`
- Left: "Kirothon 2026" logo text with `background: linear-gradient(135deg, #7c3aed, #3b82f6)` applied via `-webkit-background-clip: text`
- Right: "Join Community" button — solid purple, links to `https://awscommunity.pk/slack`
- Mobile: flex-wrap or reduced padding to prevent overflow below 768px

### 2. Hero Section

- Full-viewport-height section with radial gradient background and CSS keyframe glow animation (pulsing radial gradient overlay, no JS)
- Stacked content (centered): presenter badge → headline → subheadline → tagline → status badge → CTA buttons → timeline pill
- Status badge rendered by JS into `<div id="status-badge-container">`
- Two CTA buttons side-by-side (stacked on mobile): "Join Slack Community" and "View Rules & Guidelines" (`href="#rules"`)

### 3. Status Badge (JS Component)

Interface: reads `const HACKATHON_STATUS` (string), writes HTML into `#status-badge-container`.

| Value | Text | Color |
|---|---|---|
| `"upcoming"` | 🗓 Registration Open | Blue (`#3b82f6`) |
| `"active"` | 🚀 Build Phase Active | Green (`#10b981`), glow |
| `"judging"` | 🏆 Judging to be started | Amber (`#f59e0b`), glow |
| `"winners_announced"` | 🎉 Winners Announced | Gold (`#fbbf24`), glow |

Default initial value: `"judging"`.

### 4. What is Kiro? Section

- Section heading + two-line description paragraph
- Dark glassmorphism card containing a YouTube embed placeholder:
  - Black background, 16:9 aspect ratio via `padding-bottom: 56.25%`
  - Centered play button icon (▶) and label text
  - HTML comment `<!-- REPLACE: YouTube video ID -->` inside the card

### 5. Timeline Section

- Desktop: horizontal flex row, 5 milestone nodes connected by lines
- Mobile: vertical stacked list
- Each node: circle indicator + date label + milestone name
- "Judging Period" node gets `class="active"` with glowing purple ring (`box-shadow: 0 0 12px #7c3aed`)
- All other nodes: equal visual weight (no dimming, no opacity reduction)

### 6. What You Can Build Section

- 6-column responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- Each card: glassmorphism style, emoji icon (large), category name, short description

| Card | Emoji | Description |
|---|---|---|
| Web Applications | 🌐 | Full-stack web apps with modern UI |
| AI Agents | 🤖 | Autonomous agents powered by AWS AI |
| CLI Tools | ⚡ | Command-line utilities and developer tools |
| APIs & Microservices | 🔗 | RESTful APIs and serverless functions |
| Automation Tools | ⚙️ | Workflow automation and scripting |
| Mobile Applications | 📱 | Cross-platform mobile experiences |

### 7. Hackathon Tracks Section

- 3 track cards in a responsive grid
- Each card: glassmorphism, track emoji, track name, brief description

| Track | Emoji |
|---|---|
| Student | 🎓 |
| Professional | 💼 |
| Women in Tech | 👩‍💻 |

### 8. Quick Start Section

- Dark code-style card with monospace font flavor, containing starter template text
- "View Starter Template on GitHub" button (`href="#"`, with `<!-- REPLACE: GitHub repo URL -->` comment)
- 2×2 grid of resource link buttons:
  - Kiro Documentation → `https://kiro.dev/docs`
  - Kiro Getting Started → `https://kiro.dev/docs/getting-started`
  - AWS Free Tier → `https://aws.amazon.com/free`
  - Rules & Guidelines → `rules.html`

### 9. Judging Criteria Section

- Section heading + "100 points total" subtitle
- 5 glassmorphism cards in a responsive grid

| Criteria | Points | Sub-criteria |
|---|---|---|
| Application Quality | 40 | Functionality (15), UX/Design (10), Code Quality (10), AWS Integration (5) |
| Kiro Usage | 20 | Spec-driven dev (10), AI assistance (10) |
| Documentation | 20 | README (10), Dev logs (10) |
| Innovation | 15 | Originality (10), Impact (5) |
| Presentation | 5 | Demo video quality (5) |

Each card includes a progress bar: `width: {points}%` on a purple-filled inner div.

### 10. Guest Judges Section

- Section heading + "To Be Announced" subtitle
- 3 placeholder glassmorphism cards, each with:
  - Avatar placeholder circle (60px, purple border)
  - "Name TBA" text
  - "Role TBA" text

### 11. Proud Partners Section

- Section heading
- 5 partner cards in a responsive flex/grid row
- Each card: glassmorphism, real logo image + partner name

| Partner | Image | Name |
|---|---|---|
| AWS UG Islamabad | `logos/islamabad.jpeg` | AWS UG Islamabad |
| AWS UG Karachi | `logos/karachi.jpg` | AWS UG Karachi |
| AWS UG Peshawar | `logos/peshawar.avif` | AWS UG Peshawar |
| AWS UG Women in Tech Lahore | `logos/wit-lahore.avif` | AWS UG Women in Tech Lahore |
| AWS UG Faisalabad | `logos/faisalabad.png` | AWS UG Faisalabad |

Logo images use relative paths from `kirothon/index.html`. Each `<img>` has a descriptive `alt` attribute.

### 12. Winners Section

- Large centered glassmorphism card
- Trophy emoji (large), "Winners To Be Announced" heading
- Subtext: "Stay tuned — winners will be revealed after the judging period"
- "Join Slack for Updates" button → `https://awscommunity.pk/slack`
- No mention of prizes or prize pools anywhere on the page

### 13. Submission Requirements Section

- Section heading
- 3 requirement items (numbered list or cards):
  1. Source Code — GitHub repo link
  2. Demo Video — screen recording or YouTube
  3. Dev Logs — document your build process with Kiro

### 14. Rules & Regulations Section

- `<section id="rules">` so the hero CTA anchor resolves
- Section heading
- 5 accordion items implemented with vanilla JS toggle:
  1. Eligibility
  2. Original Work
  3. Intellectual Property
  4. Code of Conduct
  5. Disqualification
- Accordion JS: event listener on each `.accordion-header`, toggles `display: none/block` on sibling `.accordion-body`
- All text uses "AWS Community Pakistan" — no reference to "Dynamous"

### 15. Footer

- Dark background, centered content
- "Kirothon 2026 — Presented by AWS Community Pakistan"
- Nav links: Join Slack, Kiro Docs, Rules & Guidelines (`#rules`)
- Collaborators list: AWS UG Karachi, Islamabad, Peshawar, Faisalabad
- Copyright: "© 2026 AWS Community Pakistan. All rights reserved."

## Data Models

This is a static page with no persistent data store. The only runtime "state" is:

### HACKATHON_STATUS

```javascript
// Valid values: "upcoming" | "active" | "judging" | "winners_announced"
const HACKATHON_STATUS = "judging";
```

### Status Badge Config (internal JS object)

```javascript
const STATUS_CONFIG = {
  upcoming:            { text: "🗓 Registration Open",      color: "#3b82f6", glow: false },
  active:              { text: "🚀 Build Phase Active",     color: "#10b981", glow: true  },
  judging:             { text: "🏆 Judging to be started",  color: "#f59e0b", glow: true  },
  winners_announced:   { text: "🎉 Winners Announced",      color: "#fbbf24", glow: true  },
};
```

### Judging Criteria (inline HTML data)

```
[
  { name: "Application Quality", points: 40 },
  { name: "Kiro Usage",          points: 20 },
  { name: "Documentation",       points: 20 },
  { name: "Innovation",          points: 15 },
  { name: "Presentation",        points:  5 },
]
// Sum: 100
```

### CSS Design Tokens

```css
:root {
  --bg-primary:    #0d0d1a;
  --bg-secondary:  #1a1a2e;
  --purple-dark:   #7c3aed;
  --purple-mid:    #8b5cf6;
  --purple-light:  #a78bfa;
  --blue:          #3b82f6;
  --text-primary:  #f8fafc;
  --text-muted:    #94a3b8;
  --glass-bg:      rgba(255, 255, 255, 0.05);
  --glass-border:  rgba(139, 92, 246, 0.3);
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property Reflection**: Before listing properties, redundant criteria were consolidated. Requirements 2.2–2.5 all describe the same status-badge rendering rule for different input values — they are unified into a single property (Property 1). Requirements 7.3, 9.3, and 9.4 each describe a "for every card in a collection" rule and are kept as distinct properties because they validate different structural invariants. Requirements 13.4 and 11.4 both describe "no forbidden text" rules but target different forbidden strings and are kept separate.

---

### Property 1: Status badge renders correct text for every valid status

*For any* valid `HACKATHON_STATUS` value (`"upcoming"`, `"active"`, `"judging"`, `"winners_announced"`), setting that value and calling the badge render function should produce a badge element whose inner text exactly matches the specified label for that status.

**Validates: Requirements 2.2, 2.3, 2.4, 2.5**

---

### Property 2: Every "What You Can Build" card has an emoji and description

*For any* card rendered in the "What You Can Build" section, the card's HTML should contain at least one emoji character and a non-empty description string.

**Validates: Requirements 7.3**

---

### Property 3: All resource links have non-empty, correct hrefs

*For any* resource link button rendered in the Quick Start section, the `href` attribute should be a non-empty string matching the specified URL for that resource.

**Validates: Requirements 8.3**

---

### Property 4: Judging criteria points sum to 100

*For any* rendering of the Judging Criteria section, the sum of all displayed point values across the five criteria cards should equal exactly 100.

**Validates: Requirements 9.2**

---

### Property 5: Progress bar width matches point weight

*For any* judging criteria card, the progress bar's inline `width` style value (as a percentage) should equal the card's point value divided by 100, expressed as a percentage (e.g., 40 pts → `width: 40%`).

**Validates: Requirements 9.4**

---

### Property 6: Accordion toggle is idempotent per click

*For any* accordion item, clicking the header once should show the body; clicking it again should hide the body; clicking it a third time should show it again — the toggle is a pure state flip with no side effects on other accordion items.

**Validates: Requirements 13.3**

---

### Property 7: No forbidden text appears anywhere on the page

*For any* text node in the rendered document, the string "Dynamous" should not appear, and the strings "prize" or "prize pool" (case-insensitive) should not appear.

**Validates: Requirements 11.4, 13.4**

---

## Error Handling

Since this is a static HTML page with minimal JS, error surface is small:

**Invalid HACKATHON_STATUS value**: If `HACKATHON_STATUS` is set to an unrecognized string, the badge render function should fall back gracefully — either rendering nothing or rendering a neutral "Status Unknown" pill — rather than throwing a JS error or leaving a broken DOM node.

**Missing logo images**: If a `logos/*.jpeg/jpg/avif/png` file is missing, the `<img>` element's `alt` text provides a readable fallback. No JS error handling needed.

**Accordion JS errors**: The accordion toggle uses simple `classList.toggle` or `style.display` manipulation. If the DOM structure is intact, no errors can occur. The script should be placed at the end of `<body>` (or use `DOMContentLoaded`) to ensure elements exist before event listeners are attached.

**No network dependency at runtime**: The only external resource loaded at runtime is the Google Fonts stylesheet. If it fails to load, the browser falls back to system sans-serif fonts — the page remains fully functional.

---

## Testing Strategy

### Dual Testing Approach

Both unit/example tests and property-based tests are used. They are complementary:
- Example tests verify specific DOM structure, content, and link correctness
- Property tests verify universal rules that must hold across all inputs/states

### Unit / Example Tests

These verify concrete, specific facts about the rendered HTML:

- File structure: single HTML file, no external JS framework `<script src>` tags
- Google Fonts `<link>` tag present with Inter
- `scroll-behavior: smooth` in CSS
- `const HACKATHON_STATUS` is the first declaration in the `<script>` block
- Default value of `HACKATHON_STATUS` is `"judging"`
- Navbar contains "Kirothon 2026" text and a link to `https://awscommunity.pk/slack`
- Hero contains presenter badge, headline, subheadline, tagline, timeline pill
- Hero CTA buttons link to correct URLs
- "What is Kiro?" section contains play button label and HTML comment
- Timeline section contains all 5 milestones with correct text
- "Judging Period" milestone has `class="active"` or equivalent active indicator
- 6 category cards present in "What You Can Build"
- Quick Start section contains GitHub button with `href="#"` and replace comment
- Guest Judges section has 3 placeholder cards
- Proud Partners section has 5 cards with correct `src` paths and `alt` text
- Winners section contains trophy emoji and correct text, no prize mentions
- Submission Requirements lists 3 items
- Rules section has `id="rules"` and 5 accordion items
- Footer contains copyright text and collaborator list

### Property-Based Tests

Use a property-based testing library appropriate for the target environment. For a static HTML file, tests can be written in JavaScript using **fast-check** (Node.js) with a DOM parser (e.g., `jsdom`) to parse and query the HTML.

Minimum 100 iterations per property test.

**Property test tag format**: `// Feature: kirothon-2026-landing-page, Property {N}: {property_text}`

| Property | Test Description |
|---|---|
| Property 1 | For each of the 4 valid status strings, set `HACKATHON_STATUS`, call render, assert badge text matches spec |
| Property 2 | For each card in "What You Can Build", assert emoji present and description non-empty |
| Property 3 | For each resource link in Quick Start, assert `href` is non-empty and matches expected URL |
| Property 4 | Parse all point values from Judging Criteria cards, assert sum === 100 |
| Property 5 | For each criteria card, parse points and progress bar width, assert width% === points |
| Property 6 | Simulate click sequence on each accordion header, assert body visibility toggles correctly |
| Property 7 | Scan all text nodes for "Dynamous", "prize", "prize pool" (case-insensitive), assert none found |

**Property-based test configuration**:
- Each property test runs minimum 100 iterations (for Property 1, this means cycling through all 4 status values repeatedly with varied surrounding state)
- Each test file includes the tag comment referencing the design property number
- Property tests are in a separate `tests/` directory alongside `kirothon/`

