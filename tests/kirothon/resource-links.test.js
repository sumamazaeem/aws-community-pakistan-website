// Feature: kirothon-2026-landing-page, Property 3: All resource links have non-empty, correct hrefs
// **Validates: Requirements 9.3**

import { test } from 'node:test';
import assert from 'node:assert';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Expected resource links from requirements
const EXPECTED_RESOURCE_LINKS = [
  { text: 'Kiro Documentation',   href: 'https://kiro.dev/docs' },
  { text: 'Kiro Getting Started', href: 'https://kiro.dev/docs/getting-started' },
  { text: 'AWS Free Tier',        href: 'https://aws.amazon.com/free' },
  { text: 'Rules & Guidelines',   href: 'rules.html' },
];

/**
 * Load and parse the HTML file, returning all resource link elements
 * from the Quick Start section.
 * @returns {{ text: string, href: string }[]}
 */
function getResourceLinks() {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const quickStart = document.querySelector('.quick-start');
  assert.ok(quickStart, 'Quick Start section (.quick-start) should exist');

  const linkEls = Array.from(quickStart.querySelectorAll('.resource-btn'));
  return linkEls.map(el => ({
    text: el.textContent.trim(),
    href: el.getAttribute('href') || '',
  }));
}

test('Property 3: All resource links have non-empty, correct hrefs', async () => {
  const links = getResourceLinks();

  assert.ok(links.length > 0, 'There should be at least one resource link');

  // Arbitrary: pick any index into the actual rendered resource links
  const indexArbitrary = fc.integer({ min: 0, max: links.length - 1 });

  await fc.assert(
    fc.property(indexArbitrary, (index) => {
      const { text, href } = links[index];

      // href must be non-empty
      assert.ok(
        href.length > 0,
        `Resource link "${text}" (index ${index}) should have a non-empty href`
      );

      // href must match the expected URL for this link
      const expected = EXPECTED_RESOURCE_LINKS.find(r => r.text === text);
      assert.ok(
        expected,
        `Resource link text "${text}" was not found in the expected list`
      );
      assert.strictEqual(
        href,
        expected.href,
        `Resource link "${text}" href should be "${expected.href}" but got "${href}"`
      );
    }),
    {
      numRuns: 100, // Minimum 100 iterations as specified in design
      verbose: true,
    }
  );
});

test('Quick Start section has exactly 4 resource links', () => {
  const links = getResourceLinks();
  assert.strictEqual(links.length, 4, 'Quick Start section should have exactly 4 resource links');
});

test('Each resource link text matches the expected label', () => {
  const links = getResourceLinks();
  const expectedTexts = EXPECTED_RESOURCE_LINKS.map(r => r.text);
  const actualTexts = links.map(l => l.text);
  assert.deepStrictEqual(actualTexts, expectedTexts, 'Resource link labels should match expected order and text');
});
