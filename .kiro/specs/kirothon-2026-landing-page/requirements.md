# Requirements Document

## Introduction

Kirothon 2026 is a hackathon landing page for "Kirothon 2026 Season 1", presented by AWS Community Pakistan. The page is a single self-contained HTML file (`kirothon/index.html`) with no external JS frameworks. It uses the Kiro IDE brand aesthetic: dark navy/purple background, vibrant purple and electric blue accents, glassmorphism cards, and Inter font. The page communicates hackathon details, timeline, judging criteria, rules, and community links — with a configurable status badge driven by a JS variable.

## Glossary

- **Landing_Page**: The single HTML file at `kirothon/index.html`
- **Status_Badge**: A pill-shaped badge in the hero section reflecting the current hackathon phase
- **HACKATHON_STATUS**: A JS constant at the top of the script block controlling the Status_Badge rendering
- **Glassmorphism_Card**: A semi-transparent card with `backdrop-filter: blur`, subtle purple border, and dark background
- **Accordion**: An expandable/collapsible section toggled via vanilla JS
- **CTA**: Call-to-action button
- **Timeline**: A horizontal (desktop) or stacked (mobile) sequence of milestone steps
- **AWS_Community_Pakistan**: The presenting organization for Kirothon 2026
- **Partner_Logo**: An actual image file from the `logos/` directory displayed inside a partner card

## Requirements

### Requirement 1: Self-Contained Single-File Architecture

**User Story:** As a developer maintaining the site, I want a single HTML file with no build step, so that I can deploy and update it without tooling.

#### Acceptance Criteria

1. THE Landing_Page SHALL be a single HTML file containing all CSS in a `<style>` tag and all JS in a `<script>` tag, with no external JS framework dependencies.
2. THE Landing_Page SHALL load the Inter font from Google Fonts via a `<link>` tag.
3. THE Landing_Page SHALL implement smooth scroll behavior via CSS `scroll-behavior: smooth`.
4. THE Landing_Page SHALL be fully responsive using mobile-first CSS, adapting layout for screens narrower than 768px.

---

### Requirement 2: Configurable Hackathon Status

**User Story:** As an organizer, I want to update the hackathon status with a single variable change, so that the hero badge reflects the current phase without editing HTML.

#### Acceptance Criteria

1. THE Landing_Page SHALL define `const HACKATHON_STATUS` as the first declaration in the `<script>` block, with an inline comment listing valid values: `"upcoming" | "active" | "judging" | "winners_announced"`.
2. WHEN `HACKATHON_STATUS` equals `"upcoming"`, THE Status_Badge SHALL display a blue pill with text "🗓 Registration Open".
3. WHEN `HACKATHON_STATUS` equals `"active"`, THE Status_Badge SHALL display a green glowing pill with text "🚀 Build Phase Active".
4. WHEN `HACKATHON_STATUS` equals `"judging"`, THE Status_Badge SHALL display an amber/yellow glowing pill with text "🏆 Judging to be started".
5. WHEN `HACKATHON_STATUS` equals `"winners_announced"`, THE Status_Badge SHALL display a gold glowing pill with text "🎉 Winners Announced".
6. THE Landing_Page SHALL set the initial value of `HACKATHON_STATUS` to `"judging"`.

---

### Requirement 3: Navigation Bar

**User Story:** As a visitor, I want a persistent navbar, so that I can identify the event and quickly join the community.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a fixed top navbar containing a left-aligned logo text "Kirothon 2026" styled with a purple gradient.
2. THE Landing_Page SHALL render a right-aligned "Join Community" button in the navbar that links to `https://awscommunity.pk/slack`.
3. WHILE the viewport width is less than 768px, THE Landing_Page SHALL stack or condense the navbar to remain usable without horizontal overflow.

---

### Requirement 4: Hero Section

**User Story:** As a visitor, I want a compelling hero section, so that I immediately understand what Kirothon 2026 is and how to participate.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a hero section with a gradient background and a CSS-only animated glow or particle effect.
2. THE Landing_Page SHALL display a badge reading "Presented by AWS Community Pakistan" above the headline.
3. THE Landing_Page SHALL display the headline "Kirothon 2026" with a purple-to-blue gradient text effect.
4. THE Landing_Page SHALL display the subheadline "Build with Kiro — The Agentic AI IDE".
5. THE Landing_Page SHALL display the tagline "Turn your idea into a functional product using Kiro IDE and AWS".
6. THE Landing_Page SHALL render the Status_Badge prominently in the hero section, driven by `HACKATHON_STATUS`.
7. THE Landing_Page SHALL render two CTA buttons: "Join Slack Community" linking to `https://awscommunity.pk/slack`, and "View Rules & Guidelines" linking to the rules section via an anchor.
8. THE Landing_Page SHALL display a timeline pill below the CTAs reading "Build Phase: March 15 – March 28, 2026".

---

### Requirement 5: What Is Kiro Section

**User Story:** As a visitor unfamiliar with Kiro, I want an embedded video and description, so that I can quickly learn what the IDE is.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "What is Kiro?" containing a dark card styled as a YouTube embed placeholder.
2. THE Landing_Page SHALL include a play button icon and the label "Kiro IDE — Introduction & How to Use" inside the placeholder card.
3. THE Landing_Page SHALL include an HTML comment `<!-- REPLACE: YouTube video ID -->` adjacent to the embed placeholder to guide future updates.
4. THE Landing_Page SHALL display a two-line description: "Kiro is AWS's agentic AI IDE that turns prompts into specs, tasks, and working code. Built on VS Code, powered by Claude."

---

### Requirement 6: Hackathon Timeline

**User Story:** As a participant, I want to see all key dates in a visual timeline, so that I can plan my submission.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Timeline" with five milestones: "Registration Open — March 10, 2026", "Build Phase Begins — March 15, 2026", "Build Phase Ends — March 28, 2026", "Judging Period — March 29 – April 5, 2026", "Winners Announced — To Be Announced".
2. ALL five milestones SHALL have equal visual weight — no milestone SHALL be highlighted, marked as active, or styled differently from the others.
3. WHILE the viewport width is less than 768px, THE Landing_Page SHALL render the timeline as a vertically stacked list rather than a horizontal row.

---

### Requirement 7: What You Can Build Section

**User Story:** As a potential participant, I want to see project category examples, so that I can decide if my idea qualifies.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "What You Can Build" containing six Glassmorphism_Cards in a responsive grid.
2. THE Landing_Page SHALL include cards for: Web Applications, AI Agents, CLI Tools, APIs & Microservices, Automation Tools, and Mobile Applications.
3. Each card SHALL display a relevant emoji icon and a short description of the category.

---

### Requirement 8: Hackathon Tracks

**User Story:** As a potential participant, I want to know which track I belong to, so that I can register under the correct category.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Hackathon Tracks" containing three Glassmorphism_Cards in a responsive grid.
2. THE Landing_Page SHALL include the following tracks:
   - **Student Track** — for students currently enrolled in any educational institution, with emoji 🎓
   - **Professional Track** — for working professionals and developers, with emoji 💼
   - **Women in Tech Track** — for women in technology, with emoji 👩‍💻
3. Each track card SHALL display the track emoji, track name, and a short description of who the track is for.

---

### Requirement 9: Quick Start Section

**User Story:** As a registered participant, I want quick access to starter resources, so that I can begin building immediately.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Quick Start" containing a dark code-style card with the text "Get started with the official Kirothon starter template".
2. THE Landing_Page SHALL render a "View Starter Template on GitHub" button with `href="#"` and an HTML comment `<!-- REPLACE: GitHub repo URL -->`.
3. THE Landing_Page SHALL render four resource buttons in a 2×2 grid: "Kiro Documentation" → `https://kiro.dev/docs`, "Kiro Getting Started" → `https://kiro.dev/docs/getting-started`, "AWS Free Tier" → `https://aws.amazon.com/free`, "Rules & Guidelines" → `rules.html`.

---

### Requirement 10: Judging Criteria Section

**User Story:** As a participant, I want to understand how submissions are scored, so that I can focus my effort appropriately.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Judging Criteria" with subtitle "100 points total".
2. THE Landing_Page SHALL display five criteria cards: Application Quality (40 pts), Kiro Usage (20 pts), Documentation (20 pts), Innovation (15 pts), Presentation (5 pts).
3. Each criteria card SHALL list its sub-criteria with individual point values.
4. Each criteria card SHALL include a visual progress-bar proportional to its point weight out of 100.

---

### Requirement 11: Guest Judges Section

**User Story:** As a visitor, I want to see who the judges are, so that I understand the credibility of the evaluation.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Guest Judges" with a subtitle "To Be Announced".
2. THE Landing_Page SHALL display three placeholder judge Glassmorphism_Cards, each showing an avatar placeholder circle, "Name TBA", and "Role TBA".

---

### Requirement 12: Proud Partners Section

**User Story:** As a visitor, I want to see which AWS User Groups are supporting this hackathon, so that I know the community backing behind the event.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Proud Partners" displaying four partner cards in a responsive grid.
2. Each partner card SHALL be a Glassmorphism_Card containing the Partner_Logo image and the group name as alt text.
3. THE Landing_Page SHALL use the following Partner_Logo files from the `logos/` directory relative to `index.html`:
   - AWS User Group Islamabad → `logos/islamabad.jpeg`
   - AWS User Group Karachi → `logos/karachi.jpg`
   - AWS User Group Peshawar → `logos/peshawar.avif`
   - AWS User Group Women in Tech Lahore → `logos/wit-lahore.avif`
4. Each Partner_Logo image SHALL have a descriptive `alt` attribute matching the group name.
5. Partner_Logo images SHALL be displayed at a consistent size (max-height ~80px) and SHALL be centered within their card.
6. THE Landing_Page SHALL also include `logos/faisalabad.png` as a fifth partner card for AWS User Group Faisalabad.

---

### Requirement 13: Winners Section

**User Story:** As a participant, I want to see where winners will be announced, so that I know where to check results.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Hackathon Winners" containing a large centered card with a trophy emoji and the text "Winners To Be Announced".
2. THE Landing_Page SHALL display subtext: "Stay tuned — winners will be revealed after the judging period".
3. THE Landing_Page SHALL render a "Join Slack for Updates" button linking to `https://awscommunity.pk/slack`.
4. THE Landing_Page SHALL NOT mention prizes or prize pools anywhere on the page.

---

### Requirement 14: Submission Requirements Section

**User Story:** As a participant, I want clear submission instructions, so that I don't miss required deliverables.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Submission Requirements" listing three items: Source Code (GitHub repo link), Demo Video (screen recording or YouTube), Dev Logs (document your build process with Kiro).

---

### Requirement 15: Rules & Regulations Section

**User Story:** As a participant, I want to read the rules in an organized format, so that I understand eligibility and conduct expectations.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a section titled "Rules & Regulations" with an `id` of `"rules"` so the hero CTA anchor link resolves correctly.
2. THE Landing_Page SHALL render five Accordion items: Eligibility, Original Work, Intellectual Property, Code of Conduct, Disqualification.
3. WHEN a visitor clicks an Accordion header, THE Landing_Page SHALL toggle the visibility of that Accordion's body content using vanilla JS.
4. THE Landing_Page SHALL use "AWS Community Pakistan" in all rules text and SHALL NOT reference "Dynamous" anywhere.
5. THE Eligibility accordion item SHALL state that Kirothon 2026 is a virtual hackathon open to all participants from Pakistan — anyone from Pakistan can register and attend regardless of their city or location within Pakistan.
6. THE Eligibility accordion item SHALL state that participants must be at least 18 years of age or have parental/guardian consent, teams may consist of 1–4 members, and members of the AWS Community Pakistan organizing team and judges are not eligible to participate.

---

### Requirement 16: Footer

**User Story:** As a visitor at the bottom of the page, I want quick navigation links and attribution, so that I can find key resources without scrolling back up.

#### Acceptance Criteria

1. THE Landing_Page SHALL render a footer with the text "Kirothon 2026 — Presented by AWS Community Pakistan".
2. THE Landing_Page SHALL render footer links: "Join Slack" → `https://awscommunity.pk/slack`, "Kiro Docs" → `https://kiro.dev/docs`, "Rules & Guidelines" → `#rules`.
3. THE Landing_Page SHALL display copyright text "© 2026 AWS Community Pakistan. All rights reserved."
4. THE Landing_Page SHALL list all collaborating user groups: AWS UG Karachi, AWS UG Islamabad, AWS UG Peshawar, AWS UG Faisalabad, AWS UG Women in Tech Lahore.
