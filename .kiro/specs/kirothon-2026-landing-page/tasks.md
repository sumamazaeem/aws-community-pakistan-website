# Implementation Plan: Kirothon 2026 Landing Page

## Overview

This plan implements a single-file static HTML landing page for Kirothon 2026 hackathon. The page uses vanilla HTML, CSS, and JavaScript with no external frameworks. Implementation follows a bottom-up approach: core structure first, then sections, then interactive features, and finally testing.

## Tasks

- [x] 1. Set up project structure and HTML skeleton
  - Create `kirothon/` directory and `kirothon/index.html` file
  - Create `kirothon/logos/` directory for partner logo images
  - Add HTML5 doctype, head with meta tags, and Google Fonts link for Inter
  - Add CSS reset and root CSS variables for Kiro brand colors (dark navy/purple, glassmorphism tokens)
  - Add smooth scroll behavior via CSS `scroll-behavior: smooth`
  - Implement mobile-first responsive breakpoint at 768px
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement navbar component
  - Create fixed navbar with glassmorphism backdrop blur effect
  - Add left-aligned "Kirothon 2026" logo text with purple-to-blue gradient
  - Add right-aligned "Join Community" button linking to `https://awscommunity.pk/slack`
  - Implement mobile responsive layout (flex-wrap or condensed padding below 768px)
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Implement hero section
  - Create full-viewport-height hero section with radial gradient background
  - Add CSS keyframe animation for pulsing glow effect (no JS)
  - Add presenter badge "Presented by AWS Community Pakistan"
  - Add headline "Kirothon 2026" with gradient text effect
  - Add subheadline "Build with Kiro — The Agentic AI IDE"
  - Add tagline "Turn your idea into a functional product using Kiro IDE and AWS"
  - Add empty `<div id="status-badge-container"></div>` for JS-rendered badge
  - Add two CTA buttons: "Join Slack Community" and "View Rules & Guidelines" (anchor to `#rules`)
  - Add timeline pill "Build Phase: March 15 – March 28, 2026"
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 4. Implement status badge JavaScript component
  - Add `<script>` tag at end of body
  - Define `const HACKATHON_STATUS = "judging"` as first declaration with inline comment listing valid values
  - Create `STATUS_CONFIG` object mapping status values to text, color, and glow properties
  - Write `renderStatusBadge()` function that reads `HACKATHON_STATUS` and writes badge HTML into `#status-badge-container`
  - Implement fallback for invalid status values (render neutral "Status Unknown" pill)
  - Call `renderStatusBadge()` on page load
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 4.1 Write property test for status badge rendering
  - **Property 1: Status badge renders correct text for every valid status**
  - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

- [x] 5. Implement "What is Kiro?" section
  - Create section with heading "What is Kiro?"
  - Add two-line description paragraph about Kiro IDE
  - Create dark glassmorphism card with 16:9 aspect ratio (padding-bottom: 56.25%)
  - Add centered play button icon (▶) and label "Kiro IDE — Introduction & How to Use"
  - Add HTML comment `<!-- REPLACE: YouTube video ID -->` inside card
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6. Implement timeline section
  - Create section with heading "Timeline"
  - Add 5 milestone nodes: Registration Open (March 10), Build Phase Begins (March 15), Build Phase Ends (March 28), Judging Period (March 29 – April 5), Winners Announced (TBA)
  - Style all milestones with equal visual weight (no highlighting or dimming)
  - Implement horizontal flex layout for desktop
  - Implement vertical stacked layout for mobile (below 768px)
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. Implement "What You Can Build" section
  - Create section with heading "What You Can Build"
  - Create responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)
  - Add 6 glassmorphism cards: Web Applications 🌐, AI Agents 🤖, CLI Tools ⚡, APIs & Microservices 🔗, Automation Tools ⚙️, Mobile Applications 📱
  - Each card includes emoji icon, category name, and short description
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 7.1 Write property test for "What You Can Build" cards
  - **Property 2: Every "What You Can Build" card has an emoji and description**
  - **Validates: Requirements 7.3**

- [x] 8. Implement hackathon tracks section
  - Create section with heading "Hackathon Tracks"
  - Create responsive grid with 3 glassmorphism cards
  - Add Student Track 🎓, Professional Track 💼, Women in Tech Track 👩‍💻
  - Each card includes emoji, track name, and description
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 9. Implement Quick Start section
  - Create section with heading "Quick Start"
  - Add dark code-style card with monospace text "Get started with the official Kirothon starter template"
  - Add "View Starter Template on GitHub" button with `href="#"` and HTML comment `<!-- REPLACE: GitHub repo URL -->`
  - Create 2×2 grid of resource buttons: Kiro Documentation, Kiro Getting Started, AWS Free Tier, Rules & Guidelines
  - Link buttons to correct URLs: `https://kiro.dev/docs`, `https://kiro.dev/docs/getting-started`, `https://aws.amazon.com/free`, `rules.html`
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 9.1 Write property test for resource link hrefs
  - **Property 3: All resource links have non-empty, correct hrefs**
  - **Validates: Requirements 9.3**

- [x] 10. Implement judging criteria section
  - Create section with heading "Judging Criteria" and subtitle "100 points total"
  - Create 5 glassmorphism cards in responsive grid
  - Add Application Quality (40 pts), Kiro Usage (20 pts), Documentation (20 pts), Innovation (15 pts), Presentation (5 pts)
  - Each card lists sub-criteria with individual point values
  - Each card includes progress bar with width proportional to points (e.g., 40 pts → width: 40%)
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 10.1 Write property test for judging criteria point sum
  - **Property 4: Judging criteria points sum to 100**
  - **Validates: Requirements 10.2**

- [x] 10.2 Write property test for progress bar widths
  - **Property 5: Progress bar width matches point weight**
  - **Validates: Requirements 10.4**

- [x] 11. Implement guest judges section
  - Create section with heading "Guest Judges" and subtitle "To Be Announced"
  - Add 3 placeholder glassmorphism cards
  - Each card contains: avatar placeholder circle (60px, purple border), "Name TBA", "Role TBA"
  - _Requirements: 11.1, 11.2_

- [x] 12. Implement proud partners section
  - Create section with heading "Proud Partners"
  - Create responsive grid with 5 partner glassmorphism cards
  - Add partner logo images with relative paths: `logos/islamabad.jpeg`, `logos/karachi.jpg`, `logos/peshawar.avif`, `logos/wit-lahore.avif`, `logos/faisalabad.png`
  - Each `<img>` has descriptive `alt` attribute matching group name
  - Style logos with consistent max-height (~80px) and center alignment
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 13. Implement winners section
  - Create section with heading "Hackathon Winners"
  - Add large centered glassmorphism card with trophy emoji
  - Add text "Winners To Be Announced"
  - Add subtext "Stay tuned — winners will be revealed after the judging period"
  - Add "Join Slack for Updates" button linking to `https://awscommunity.pk/slack`
  - Ensure no mention of prizes or prize pools anywhere on page
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 14. Implement submission requirements section
  - Create section with heading "Submission Requirements"
  - Add 3 requirement items: Source Code (GitHub repo link), Demo Video (screen recording or YouTube), Dev Logs (document build process with Kiro)
  - _Requirements: 14.1_

- [x] 15. Implement rules & regulations section with accordion
  - Create section with `id="rules"` and heading "Rules & Regulations"
  - Add 5 accordion items: Eligibility, Original Work, Intellectual Property, Code of Conduct, Disqualification
  - Implement vanilla JS accordion toggle: event listener on `.accordion-header`, toggles visibility of `.accordion-body`
  - Eligibility text: virtual hackathon open to all from Pakistan, 18+ or parental consent, teams 1-4 members, organizers/judges not eligible
  - Use "AWS Community Pakistan" in all rules text (no "Dynamous" references)
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 15.1 Write property test for accordion toggle behavior
  - **Property 6: Accordion toggle is idempotent per click**
  - **Validates: Requirements 15.3**

- [x] 16. Implement footer
  - Create footer with text "Kirothon 2026 — Presented by AWS Community Pakistan"
  - Add footer links: Join Slack, Kiro Docs, Rules & Guidelines (`#rules`)
  - Add copyright text "© 2026 AWS Community Pakistan. All rights reserved."
  - List all collaborating user groups: AWS UG Karachi, Islamabad, Peshawar, Faisalabad, Women in Tech Lahore
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [x] 17. Checkpoint - Manual browser testing
  - Open `kirothon/index.html` in browser and verify all sections render correctly
  - Test responsive layout at mobile width (< 768px)
  - Test all links and buttons
  - Test accordion toggle functionality
  - Test status badge rendering with different `HACKATHON_STATUS` values
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Write property test for forbidden text
  - **Property 7: No forbidden text appears anywhere on the page**
  - **Validates: Requirements 13.4, 15.4**

- [x] 19. Write unit tests for HTML structure and content
  - Test single HTML file with no external JS framework `<script src>` tags
  - Test Google Fonts `<link>` tag present with Inter
  - Test `scroll-behavior: smooth` in CSS
  - Test `const HACKATHON_STATUS` is first declaration in `<script>` block
  - Test default value of `HACKATHON_STATUS` is `"judging"`
  - Test navbar contains "Kirothon 2026" and Slack link
  - Test hero contains all required elements (presenter badge, headline, subheadline, tagline, CTAs, timeline pill)
  - Test "What is Kiro?" section contains play button and HTML comment
  - Test timeline contains all 5 milestones with correct text
  - Test 6 category cards in "What You Can Build"
  - Test Quick Start GitHub button has `href="#"` and replace comment
  - Test Guest Judges has 3 placeholder cards
  - Test Proud Partners has 5 cards with correct `src` paths and `alt` text
  - Test Winners section contains trophy emoji, no prize mentions
  - Test Submission Requirements lists 3 items
  - Test Rules section has `id="rules"` and 5 accordion items
  - Test footer contains copyright and collaborator list

- [x] 20. Final checkpoint - Ensure all tests pass
  - Run all property-based tests (minimum 100 iterations each)
  - Run all unit tests
  - Verify HTML validates and renders correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific DOM structure and content
- The page is a single self-contained HTML file with no build step required
- All JavaScript is vanilla JS with no framework dependencies
- Glassmorphism styling uses `backdrop-filter: blur()` with semi-transparent backgrounds
