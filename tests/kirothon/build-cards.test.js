// Feature: kirothon-2026-landing-page, Property 2: Every "What You Can Build" card has an emoji and description
// **Validates: Requirements 7.3**

import { test } from 'node:test';
import assert from 'node:assert';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Emoji detection regex — matches any Unicode emoji character
const EMOJI_REGEX = /\p{Emoji}/u;

/**
 * Helper function to load and parse the HTML file
 * @returns {Document} The parsed DOM document
 */
function loadHTML() {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  return dom.window.document;
}

/**
 * Returns all build cards from the "What You Can Build" section
 * @returns {Element[]} Array of card elements
 */
function getBuildCards() {
  const document = loadHTML();
  return Array.from(document.querySelectorAll('.build-card'));
}

test('Property 2: Every "What You Can Build" card has an emoji and description', async () => {
  const cards = getBuildCards();

  assert.ok(cards.length > 0, 'There should be at least one build card');

  // Create an arbitrary that picks a card index from the actual rendered cards
  const cardIndexArbitrary = fc.integer({ min: 0, max: cards.length - 1 });

  // Property: for any card in the section, it contains an emoji and a non-empty description
  await fc.assert(
    fc.property(cardIndexArbitrary, (index) => {
      const card = cards[index];

      // Check emoji icon element exists and contains an emoji character
      const iconEl = card.querySelector('.build-card-icon');
      assert.ok(iconEl, `Card ${index} should have a .build-card-icon element`);
      const iconText = iconEl.textContent.trim();
      assert.ok(
        EMOJI_REGEX.test(iconText),
        `Card ${index} icon should contain an emoji character, got: "${iconText}"`
      );

      // Check description element exists and is non-empty
      const descEl = card.querySelector('.build-card-description');
      assert.ok(descEl, `Card ${index} should have a .build-card-description element`);
      const descText = descEl.textContent.trim();
      assert.ok(
        descText.length > 0,
        `Card ${index} description should be non-empty`
      );
    }),
    {
      numRuns: 100, // Minimum 100 iterations as specified in design
      verbose: true
    }
  );
});

test('"What You Can Build" section has exactly 6 cards', () => {
  const cards = getBuildCards();
  assert.strictEqual(cards.length, 6, 'Section should contain exactly 6 build cards');
});

test('Each build card has a title', () => {
  const cards = getBuildCards();
  cards.forEach((card, index) => {
    const titleEl = card.querySelector('.build-card-title');
    assert.ok(titleEl, `Card ${index} should have a .build-card-title element`);
    assert.ok(
      titleEl.textContent.trim().length > 0,
      `Card ${index} title should be non-empty`
    );
  });
});
