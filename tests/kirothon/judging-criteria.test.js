// Feature: kirothon-2026-landing-page, Property 4: Judging criteria points sum to 100
// Feature: kirothon-2026-landing-page, Property 5: Progress bar width matches point weight
// **Validates: Requirements 10.2, 10.4**

import { test } from 'node:test';
import assert from 'node:assert';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load and parse the HTML file, returning criteria card data.
 * Each entry has { title, points, progressBarWidth }.
 * @returns {{ title: string, points: number, progressBarWidth: number }[]}
 */
function getCriteriaCards() {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const section = document.querySelector('.judging-criteria');
  assert.ok(section, 'Judging Criteria section (.judging-criteria) should exist');

  const cards = Array.from(section.querySelectorAll('.criteria-card'));
  assert.ok(cards.length > 0, 'There should be at least one criteria card');

  return cards.map((card, i) => {
    const titleEl = card.querySelector('.criteria-card-title');
    assert.ok(titleEl, `Card ${i} should have a .criteria-card-title element`);
    const title = titleEl.textContent.trim();

    const pointsEl = card.querySelector('.criteria-card-points');
    assert.ok(pointsEl, `Card ${i} should have a .criteria-card-points element`);
    const pointsText = pointsEl.textContent.trim();
    const pointsMatch = pointsText.match(/(\d+)/);
    assert.ok(pointsMatch, `Card ${i} points text "${pointsText}" should contain a number`);
    const points = parseInt(pointsMatch[1], 10);

    const fillEl = card.querySelector('.progress-bar-fill');
    assert.ok(fillEl, `Card ${i} should have a .progress-bar-fill element`);
    const widthStyle = fillEl.getAttribute('style') || '';
    const widthMatch = widthStyle.match(/width:\s*([\d.]+)%/);
    assert.ok(widthMatch, `Card ${i} .progress-bar-fill should have an inline width% style, got: "${widthStyle}"`);
    const progressBarWidth = parseFloat(widthMatch[1]);

    return { title, points, progressBarWidth };
  });
}

// ─── Property 4: Points sum to 100 ───────────────────────────────────────────

test('Property 4: Judging criteria points sum to 100', () => {
  const cards = getCriteriaCards();

  // Arbitrary: pick any permutation index (we always use the same cards, so
  // we run 100 iterations over the fixed set to satisfy the minimum-runs rule)
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 99 }), (_iteration) => {
      const total = cards.reduce((sum, card) => sum + card.points, 0);
      assert.strictEqual(
        total,
        100,
        `Judging criteria points should sum to 100, got ${total}`
      );
    }),
    { numRuns: 100, verbose: true }
  );
});

// ─── Property 5: Progress bar width matches point weight ─────────────────────

test('Property 5: Progress bar width matches point weight', () => {
  const cards = getCriteriaCards();

  const cardIndexArbitrary = fc.integer({ min: 0, max: cards.length - 1 });

  fc.assert(
    fc.property(cardIndexArbitrary, (index) => {
      const { title, points, progressBarWidth } = cards[index];
      assert.strictEqual(
        progressBarWidth,
        points,
        `Card "${title}": progress bar width should be ${points}% (matching ${points} pts) but got ${progressBarWidth}%`
      );
    }),
    { numRuns: 100, verbose: true }
  );
});

// ─── Unit tests ──────────────────────────────────────────────────────────────

test('Judging Criteria section has exactly 5 cards', () => {
  const cards = getCriteriaCards();
  assert.strictEqual(cards.length, 5, 'Section should contain exactly 5 criteria cards');
});

test('Each criteria card has sub-criteria items', () => {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const cards = Array.from(document.querySelectorAll('.judging-criteria .criteria-card'));
  cards.forEach((card, i) => {
    const subItems = card.querySelectorAll('.criteria-sub-item');
    assert.ok(subItems.length > 0, `Card ${i} should have at least one .criteria-sub-item`);
  });
});

test('Section heading is "Judging Criteria" and subtitle is "100 points total"', () => {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const section = document.querySelector('.judging-criteria');
  const heading = section.querySelector('.section-heading');
  assert.ok(heading, 'Section should have a .section-heading element');
  assert.strictEqual(heading.textContent.trim(), 'Judging Criteria');

  const subtitle = section.querySelector('.section-subtitle');
  assert.ok(subtitle, 'Section should have a .section-subtitle element');
  assert.strictEqual(subtitle.textContent.trim(), '100 points total');
});
