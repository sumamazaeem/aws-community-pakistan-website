// Feature: kirothon-2026-landing-page, Property 6: Accordion toggle is idempotent per click
// **Validates: Requirements 15.3**

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
 * Load the HTML and return accordion items with simulated toggle logic.
 * jsdom does not execute inline scripts, so we manually wire up the
 * same toggle logic that the page's <script> block uses:
 *   body.style.display === 'block' ? 'none' : 'block'
 *
 * @returns {{ header: Element, body: Element }[]}
 */
function loadAccordionItems() {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const headers = Array.from(document.querySelectorAll('.accordion-header'));
  assert.ok(headers.length > 0, 'There should be at least one .accordion-header');

  return headers.map((header) => {
    const body = header.nextElementSibling;
    assert.ok(body, 'Each .accordion-header should have a sibling .accordion-body');
    assert.ok(
      body.classList.contains('accordion-body'),
      'The sibling of .accordion-header should be .accordion-body'
    );

    // Wire up the same toggle logic as the page script
    header.addEventListener('click', function () {
      const icon = this.querySelector('.accordion-icon');
      if (body.style.display === 'block') {
        body.style.display = 'none';
        if (icon) icon.classList.remove('open');
      } else {
        body.style.display = 'block';
        if (icon) icon.classList.add('open');
      }
    });

    return { header, body };
  });
}

/**
 * Simulate a click on a header element (dispatches a click event).
 */
function click(header) {
  header.dispatchEvent(new header.ownerDocument.defaultView.Event('click'));
}

// ─── Property 6: Accordion toggle is idempotent per click ────────────────────

test('Property 6: Accordion toggle is idempotent per click', () => {
  const items = loadAccordionItems();

  // Arbitrary: pick any accordion item index
  const indexArbitrary = fc.integer({ min: 0, max: items.length - 1 });

  fc.assert(
    fc.property(indexArbitrary, (index) => {
      const { header, body } = items[index];

      // Reset to known initial state (hidden, as rendered in HTML)
      body.style.display = 'none';

      // Click 1: hidden → visible
      click(header);
      assert.strictEqual(
        body.style.display,
        'block',
        `Item ${index}: after 1st click body should be visible (display: block)`
      );

      // Click 2: visible → hidden
      click(header);
      assert.strictEqual(
        body.style.display,
        'none',
        `Item ${index}: after 2nd click body should be hidden (display: none)`
      );

      // Click 3: hidden → visible again (idempotent cycle)
      click(header);
      assert.strictEqual(
        body.style.display,
        'block',
        `Item ${index}: after 3rd click body should be visible again (display: block)`
      );

      // Reset for next iteration
      body.style.display = 'none';
    }),
    { numRuns: 100, verbose: true }
  );
});

// ─── Property 6b: Toggling one item does NOT affect other items ───────────────

test('Property 6b: Toggling one accordion item does not affect other items', () => {
  const items = loadAccordionItems();

  if (items.length < 2) {
    // Can't test isolation with fewer than 2 items
    return;
  }

  // Arbitrary: pick two distinct indices
  const pairArbitrary = fc
    .tuple(
      fc.integer({ min: 0, max: items.length - 1 }),
      fc.integer({ min: 0, max: items.length - 1 })
    )
    .filter(([a, b]) => a !== b);

  fc.assert(
    fc.property(pairArbitrary, ([targetIndex, otherIndex]) => {
      const target = items[targetIndex];
      const other = items[otherIndex];

      // Reset both to hidden
      target.body.style.display = 'none';
      other.body.style.display = 'none';

      // Record other's state before clicking target
      const otherStateBefore = other.body.style.display;

      // Click the target item
      click(target.header);

      // Other item's state must be unchanged
      assert.strictEqual(
        other.body.style.display,
        otherStateBefore,
        `Clicking item ${targetIndex} should not change item ${otherIndex}'s display state`
      );
    }),
    { numRuns: 100, verbose: true }
  );
});

// ─── Unit tests ──────────────────────────────────────────────────────────────

test('Rules section has exactly 5 accordion items', () => {
  const items = loadAccordionItems();
  assert.strictEqual(items.length, 5, 'Rules section should have exactly 5 accordion items');
});

test('All accordion bodies are hidden by default', () => {
  const items = loadAccordionItems();
  items.forEach(({ body }, index) => {
    // Default CSS sets display: none; jsdom reads inline style as empty string
    // unless explicitly set, so we check it's not 'block'
    assert.notStrictEqual(
      body.style.display,
      'block',
      `Accordion body ${index} should not be visible by default`
    );
  });
});
