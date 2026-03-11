// Unit tests for HTML structure and content
// **Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.6, 3.1, 3.2, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8,
//              5.2, 5.3, 6.1, 7.1, 9.2, 11.2, 12.3, 12.4, 13.1, 14.1, 15.1, 15.2, 16.3, 16.4**

import { test } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HTML_PATH = join(__dirname, '../../kirothon/index.html');

/**
 * Load and return the raw HTML string.
 */
function loadHTML() {
  return readFileSync(HTML_PATH, 'utf-8');
}

/**
 * Load and return the parsed JSDOM document.
 */
function loadDocument() {
  const html = loadHTML();
  const dom = new JSDOM(html);
  return dom.window.document;
}

// ─── Test 1: No external JS framework <script src> tags ──────────────────────

test('No external JS framework <script src> tags (no React, Vue, Angular, etc.)', () => {
  const document = loadDocument();
  const scripts = Array.from(document.querySelectorAll('script[src]'));

  const FRAMEWORK_PATTERNS = [
    /react/i, /vue/i, /angular/i, /ember/i, /backbone/i,
    /svelte/i, /jquery/i, /bootstrap\.js/i, /lodash/i,
  ];

  scripts.forEach((script) => {
    const src = script.getAttribute('src') || '';
    FRAMEWORK_PATTERNS.forEach((pattern) => {
      assert.ok(
        !pattern.test(src),
        `Found external JS framework script: src="${src}"`
      );
    });
  });
});

// ─── Test 2: Google Fonts <link> tag with Inter ───────────────────────────────

test('Google Fonts <link> tag present with Inter font', () => {
  const document = loadDocument();
  const links = Array.from(document.querySelectorAll('link[href]'));

  const interFontLink = links.find((link) => {
    const href = link.getAttribute('href') || '';
    return href.includes('fonts.googleapis.com') && href.includes('Inter');
  });

  assert.ok(
    interFontLink,
    'A <link> tag pointing to Google Fonts with the Inter family should be present'
  );
});

// ─── Test 3: scroll-behavior: smooth in CSS ──────────────────────────────────

test('scroll-behavior: smooth is present in CSS', () => {
  const html = loadHTML();
  assert.ok(
    html.includes('scroll-behavior: smooth'),
    'CSS should contain "scroll-behavior: smooth"'
  );
});

// ─── Test 4: const HACKATHON_STATUS is first declaration in <script> block ───

test('const HACKATHON_STATUS is the first declaration in the <script> block', () => {
  const html = loadHTML();

  // Find the opening <script> tag (the inline one at end of body)
  const scriptTagIndex = html.lastIndexOf('<script>');
  assert.ok(scriptTagIndex !== -1, 'An inline <script> block should exist');

  const scriptContent = html.slice(scriptTagIndex);

  // The first `const` or `var` or `let` declaration should be HACKATHON_STATUS
  const firstDeclMatch = scriptContent.match(/\b(const|let|var)\s+(\w+)/);
  assert.ok(firstDeclMatch, 'Script block should contain at least one variable declaration');
  assert.strictEqual(
    firstDeclMatch[2],
    'HACKATHON_STATUS',
    `First declaration in <script> block should be "HACKATHON_STATUS", got "${firstDeclMatch[2]}"`
  );
});

// ─── Test 5: Default value of HACKATHON_STATUS is "judging" ──────────────────

test('Default value of HACKATHON_STATUS is "judging"', () => {
  const html = loadHTML();
  assert.ok(
    html.includes('const HACKATHON_STATUS = "judging"'),
    'HACKATHON_STATUS should be initialized to "judging"'
  );
});

// ─── Test 6: Navbar contains "Kirothon 2026" and Slack link ──────────────────

test('Navbar contains "Kirothon 2026" text', () => {
  const document = loadDocument();
  const logo = document.querySelector('.navbar-logo');
  assert.ok(logo, 'Navbar should have a .navbar-logo element');
  assert.ok(
    logo.textContent.includes('Kirothon 2026'),
    `Navbar logo should contain "Kirothon 2026", got "${logo.textContent.trim()}"`
  );
});

test('Navbar contains a link to https://awscommunity.pk/slack', () => {
  const document = loadDocument();
  const navbar = document.querySelector('.navbar');
  assert.ok(navbar, 'Navbar element should exist');

  const slackLink = Array.from(navbar.querySelectorAll('a')).find(
    (a) => a.getAttribute('href') === 'https://awscommunity.pk/slack'
  );
  assert.ok(slackLink, 'Navbar should contain a link to https://awscommunity.pk/slack');
});

// ─── Test 7: Hero section content ────────────────────────────────────────────

test('Hero contains presenter badge "Presented by AWS Community Pakistan"', () => {
  const document = loadDocument();
  const badge = document.querySelector('.presenter-badge');
  assert.ok(badge, 'Hero should have a .presenter-badge element');
  assert.ok(
    badge.textContent.includes('Presented by AWS Community Pakistan'),
    `Presenter badge should contain "Presented by AWS Community Pakistan", got "${badge.textContent.trim()}"`
  );
});

test('Hero contains headline "Kirothon 2026"', () => {
  const document = loadDocument();
  const headline = document.querySelector('.hero-headline');
  assert.ok(headline, 'Hero should have a .hero-headline element');
  assert.ok(
    headline.textContent.includes('Kirothon 2026'),
    `Hero headline should contain "Kirothon 2026", got "${headline.textContent.trim()}"`
  );
});

test('Hero contains subheadline "Build with Kiro"', () => {
  const document = loadDocument();
  const subheadline = document.querySelector('.hero-subheadline');
  assert.ok(subheadline, 'Hero should have a .hero-subheadline element');
  assert.ok(
    subheadline.textContent.includes('Build with Kiro'),
    `Hero subheadline should contain "Build with Kiro", got "${subheadline.textContent.trim()}"`
  );
});

test('Hero contains tagline starting with "Turn your idea"', () => {
  const document = loadDocument();
  const tagline = document.querySelector('.hero-tagline');
  assert.ok(tagline, 'Hero should have a .hero-tagline element');
  assert.ok(
    tagline.textContent.includes('Turn your idea'),
    `Hero tagline should contain "Turn your idea", got "${tagline.textContent.trim()}"`
  );
});

test('Hero contains timeline pill with "Build Phase: March 15"', () => {
  const document = loadDocument();
  const pills = Array.from(document.querySelectorAll('.timeline-pill'));
  assert.ok(pills.length > 0, 'Hero should have at least one .timeline-pill element');
  const hasBuildPhase = pills.some((p) => p.textContent.includes('Build Phase: March 15'));
  assert.ok(hasBuildPhase, 'A timeline pill should contain "Build Phase: March 15"');
});

// ─── Test 8: Hero CTA buttons ────────────────────────────────────────────────

test('Hero CTA "Join Slack Community" links to https://awscommunity.pk/slack', () => {
  const document = loadDocument();
  const hero = document.querySelector('.hero');
  assert.ok(hero, 'Hero section should exist');

  const slackLink = Array.from(hero.querySelectorAll('a')).find(
    (a) => a.getAttribute('href') === 'https://awscommunity.pk/slack'
  );
  assert.ok(slackLink, 'Hero should have a CTA linking to https://awscommunity.pk/slack');
});

test('Hero CTA "View Rules & Guidelines" links to #rules', () => {
  const document = loadDocument();
  const hero = document.querySelector('.hero');
  assert.ok(hero, 'Hero section should exist');

  const rulesLink = Array.from(hero.querySelectorAll('a')).find(
    (a) => a.getAttribute('href') === '#rules'
  );
  assert.ok(rulesLink, 'Hero should have a CTA linking to #rules');
});

// ─── Test 9: "What is Kiro?" section ─────────────────────────────────────────

test('"What is Kiro?" section contains play button label "Kiro IDE — Introduction & How to Use"', () => {
  const document = loadDocument();
  const label = document.querySelector('.video-label');
  assert.ok(label, 'Video placeholder should have a .video-label element');
  assert.ok(
    label.textContent.includes('Kiro IDE — Introduction & How to Use') ||
    label.textContent.includes('Kiro IDE \u2014 Introduction & How to Use'),
    `Video label should contain "Kiro IDE — Introduction & How to Use", got "${label.textContent.trim()}"`
  );
});

test('"What is Kiro?" section contains HTML comment "REPLACE: YouTube video ID"', () => {
  const html = loadHTML();
  assert.ok(
    html.includes('REPLACE: YouTube video ID'),
    'HTML should contain the comment "REPLACE: YouTube video ID"'
  );
});

// ─── Test 10: Timeline section ───────────────────────────────────────────────

test('Timeline section contains all 5 milestones with correct text', () => {
  const document = loadDocument();
  const milestones = Array.from(document.querySelectorAll('.timeline-milestone'));
  assert.strictEqual(milestones.length, 5, 'Timeline should have exactly 5 milestones');

  const expectedNames = [
    'Registration Open',
    'Build Phase Begins',
    'Build Phase Ends',
    'Judging Period',
    'Winners Announced',
  ];

  expectedNames.forEach((name) => {
    const found = milestones.some((m) => m.textContent.includes(name));
    assert.ok(found, `Timeline should contain a milestone with text "${name}"`);
  });
});

// ─── Test 11: "What You Can Build" section ───────────────────────────────────

test('6 category cards present in "What You Can Build" section', () => {
  const document = loadDocument();
  const cards = document.querySelectorAll('.build-card');
  assert.strictEqual(cards.length, 6, '"What You Can Build" section should have exactly 6 cards');
});

// ─── Test 12: Quick Start section ────────────────────────────────────────────

test('Quick Start GitHub button has href="#"', () => {
  const document = loadDocument();
  const githubBtn = document.querySelector('.quick-start-github-btn');
  assert.ok(githubBtn, 'Quick Start section should have a .quick-start-github-btn element');
  assert.strictEqual(
    githubBtn.getAttribute('href'),
    '#',
    `GitHub button href should be "#", got "${githubBtn.getAttribute('href')}"`
  );
});

test('Quick Start section contains HTML comment "REPLACE: GitHub repo URL"', () => {
  const html = loadHTML();
  assert.ok(
    html.includes('REPLACE: GitHub repo URL'),
    'HTML should contain the comment "REPLACE: GitHub repo URL"'
  );
});

// ─── Test 13: Guest Judges section ───────────────────────────────────────────

test('Guest Judges section has 3 placeholder cards with "Name TBA" and "Role TBA"', () => {
  const document = loadDocument();
  const judgeCards = document.querySelectorAll('.judge-card');
  assert.strictEqual(judgeCards.length, 3, 'Guest Judges section should have exactly 3 judge cards');

  judgeCards.forEach((card, i) => {
    const name = card.querySelector('.judge-name');
    const role = card.querySelector('.judge-role');
    assert.ok(name, `Judge card ${i} should have a .judge-name element`);
    assert.ok(role, `Judge card ${i} should have a .judge-role element`);
    assert.strictEqual(name.textContent.trim(), 'Name TBA', `Judge card ${i} name should be "Name TBA"`);
    assert.strictEqual(role.textContent.trim(), 'Role TBA', `Judge card ${i} role should be "Role TBA"`);
  });
});

// ─── Test 14: Proud Partners section ─────────────────────────────────────────

const EXPECTED_PARTNERS = [
  { src: 'logos/islamabad.jpeg', alt: 'AWS User Group Islamabad' },
  { src: 'logos/karachi.jpg',    alt: 'AWS User Group Karachi' },
  { src: 'logos/peshawar.avif',  alt: 'AWS User Group Peshawar' },
  { src: 'logos/wit-lahore.avif', alt: 'AWS User Group Women in Tech Lahore' },
  { src: 'logos/faisalabad.png', alt: 'AWS User Group Faisalabad' },
];

test('Proud Partners section has 5 cards with correct src paths and alt text', () => {
  const document = loadDocument();
  const partnerLogos = Array.from(document.querySelectorAll('.partner-logo'));
  assert.strictEqual(partnerLogos.length, 5, 'Proud Partners section should have exactly 5 partner logos');

  EXPECTED_PARTNERS.forEach(({ src, alt }) => {
    const found = partnerLogos.find(
      (img) => img.getAttribute('src') === src && img.getAttribute('alt') === alt
    );
    assert.ok(
      found,
      `Partner logo with src="${src}" and alt="${alt}" should be present`
    );
  });
});

// ─── Test 15: Winners section ────────────────────────────────────────────────

test('Winners section contains trophy emoji 🏆', () => {
  const document = loadDocument();
  const trophy = document.querySelector('.winners-trophy');
  assert.ok(trophy, 'Winners section should have a .winners-trophy element');
  assert.ok(
    trophy.textContent.includes('🏆'),
    `Winners trophy element should contain 🏆, got "${trophy.textContent.trim()}"`
  );
});

test('Winners section contains "Winners To Be Announced" text', () => {
  const document = loadDocument();
  const title = document.querySelector('.winners-title');
  assert.ok(title, 'Winners section should have a .winners-title element');
  assert.ok(
    title.textContent.includes('Winners To Be Announced'),
    `Winners title should contain "Winners To Be Announced", got "${title.textContent.trim()}"`
  );
});

test('Winners section contains no prize mentions', () => {
  const document = loadDocument();
  const winnersSection = document.querySelector('.winners-section') ||
    (() => {
      // Fall back: find section containing .winners-card
      const card = document.querySelector('.winners-card');
      return card ? card.closest('section') : null;
    })();

  assert.ok(winnersSection, 'Winners section should exist');
  const text = winnersSection.textContent.toLowerCase();
  assert.ok(!text.includes('prize'), 'Winners section should not mention "prize"');
});

// ─── Test 16: Submission Requirements section ─────────────────────────────────

test('Submission Requirements lists 3 items (Source Code, Demo Video, Dev Logs)', () => {
  const document = loadDocument();
  const submissionCards = document.querySelectorAll('.submission-card');
  assert.strictEqual(submissionCards.length, 3, 'Submission Requirements should have exactly 3 items');

  const expectedTitles = ['Source Code', 'Demo Video', 'Dev Logs'];
  expectedTitles.forEach((title) => {
    const found = Array.from(submissionCards).some((card) => {
      const titleEl = card.querySelector('.submission-title');
      return titleEl && titleEl.textContent.trim() === title;
    });
    assert.ok(found, `Submission Requirements should contain an item titled "${title}"`);
  });
});

// ─── Test 17: Rules section ───────────────────────────────────────────────────

test('Rules section has id="rules"', () => {
  const document = loadDocument();
  const rulesSection = document.getElementById('rules');
  assert.ok(rulesSection, 'A section with id="rules" should exist');
});

test('Rules section has 5 accordion items (Eligibility, Original Work, Intellectual Property, Code of Conduct, Disqualification)', () => {
  const document = loadDocument();
  const rulesSection = document.getElementById('rules');
  assert.ok(rulesSection, 'Rules section with id="rules" should exist');

  const accordionHeaders = Array.from(rulesSection.querySelectorAll('.accordion-header'));
  assert.strictEqual(accordionHeaders.length, 5, 'Rules section should have exactly 5 accordion items');

  const expectedLabels = ['Eligibility', 'Original Work', 'Intellectual Property', 'Code of Conduct', 'Disqualification'];
  expectedLabels.forEach((label) => {
    const found = accordionHeaders.some((h) => h.textContent.includes(label));
    assert.ok(found, `Rules section should have an accordion item labeled "${label}"`);
  });
});

// ─── Test 18: Footer ──────────────────────────────────────────────────────────

test('Footer contains copyright text "© 2026 AWS Community Pakistan"', () => {
  const document = loadDocument();
  const copyright = document.querySelector('.footer-copyright');
  assert.ok(copyright, 'Footer should have a .footer-copyright element');
  assert.ok(
    copyright.textContent.includes('© 2026 AWS Community Pakistan'),
    `Footer copyright should contain "© 2026 AWS Community Pakistan", got "${copyright.textContent.trim()}"`
  );
});

test('Footer contains all 5 collaborating user groups', () => {
  const document = loadDocument();
  const collaborators = Array.from(document.querySelectorAll('.footer-collaborator'));
  assert.strictEqual(collaborators.length, 5, 'Footer should list exactly 5 collaborating user groups');

  const expectedGroups = [
    'AWS UG Karachi',
    'AWS UG Islamabad',
    'AWS UG Peshawar',
    'AWS UG Faisalabad',
    'AWS UG Women in Tech Lahore',
  ];
  expectedGroups.forEach((group) => {
    const found = collaborators.some((el) => el.textContent.trim() === group);
    assert.ok(found, `Footer should list collaborator "${group}"`);
  });
});
