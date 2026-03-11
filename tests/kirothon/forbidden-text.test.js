// Feature: kirothon-2026-landing-page, Property 7: No forbidden text appears anywhere on the page
// **Validates: Requirements 13.4, 15.4**

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
 * Load the HTML document and return the JSDOM document object.
 */
function loadDocument() {
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  return dom.window.document;
}

/**
 * Collect all text content from the document body (text nodes + attributes + comments).
 * Returns a single lowercased string for case-insensitive checks, plus the raw text
 * for case-sensitive checks.
 */
function collectAllText(document) {
  const parts = [];

  // Walk all nodes in the document
  const walker = document.createTreeWalker(
    document.documentElement,
    // NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT
    0x1 | 0x80 | 0x4,
    null
  );

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === 3 /* TEXT_NODE */) {
      parts.push(node.textContent);
    } else if (node.nodeType === 8 /* COMMENT_NODE */) {
      parts.push(node.textContent);
    } else if (node.nodeType === 1 /* ELEMENT_NODE */) {
      // Collect all attribute values
      for (const attr of node.attributes) {
        parts.push(attr.value);
      }
    }
  }

  return parts.join(' ');
}

// ─── Property 7: No forbidden text appears anywhere on the page ───────────────

test('Property 7: "Dynamous" does not appear anywhere in the document', () => {
  const document = loadDocument();
  const allText = collectAllText(document);

  // Use fast-check with a constant arbitrary (the document is static, so we
  // run 100 iterations over the same content to satisfy the minimum-runs requirement)
  fc.assert(
    fc.property(fc.constant(allText), (text) => {
      assert.ok(
        !text.includes('Dynamous'),
        'The string "Dynamous" must not appear anywhere on the page'
      );
    }),
    { numRuns: 100, verbose: true }
  );
});

test('Property 7: "prize" (case-insensitive) does not appear anywhere in the document', () => {
  const document = loadDocument();
  const allText = collectAllText(document);
  const allTextLower = allText.toLowerCase();

  fc.assert(
    fc.property(fc.constant(allTextLower), (text) => {
      assert.ok(
        !text.includes('prize'),
        'The string "prize" (case-insensitive) must not appear anywhere on the page'
      );
    }),
    { numRuns: 100, verbose: true }
  );
});

test('Property 7: "prize pool" (case-insensitive) does not appear anywhere in the document', () => {
  const document = loadDocument();
  const allText = collectAllText(document);
  const allTextLower = allText.toLowerCase();

  fc.assert(
    fc.property(fc.constant(allTextLower), (text) => {
      assert.ok(
        !text.includes('prize pool'),
        'The string "prize pool" (case-insensitive) must not appear anywhere on the page'
      );
    }),
    { numRuns: 100, verbose: true }
  );
});
