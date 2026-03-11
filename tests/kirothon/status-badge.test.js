// Feature: kirothon-2026-landing-page, Property 1: Status badge renders correct text for every valid status
// **Validates: Requirements 2.2, 2.3, 2.4, 2.5**

import { test } from 'node:test';
import assert from 'node:assert';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Expected status configuration from requirements
const EXPECTED_STATUS_TEXT = {
  upcoming: "🗓 Registration Open",
  active: "🚀 Build Phase Active",
  judging: "🏆 Judging to be started",
  winners_announced: "🎉 Winners Announced"
};

/**
 * Helper function to render status badge in a JSDOM environment
 * @param {string} status - The HACKATHON_STATUS value
 * @returns {string} The inner text of the rendered badge
 */
function renderStatusBadgeInDOM(status) {
  // Read the HTML file
  const htmlPath = join(__dirname, '../../kirothon/index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Create a JSDOM instance
  const dom = new JSDOM(htmlContent, { runScripts: 'dangerously' });
  const { window } = dom;
  const { document } = window;
  
  // Override the HACKATHON_STATUS constant by injecting a script before the main script runs
  // We need to modify the HTML to set the status before the script executes
  const modifiedHtml = htmlContent.replace(
    'const HACKATHON_STATUS = "judging";',
    `const HACKATHON_STATUS = "${status}";`
  );
  
  // Create a new DOM with the modified HTML
  const modifiedDom = new JSDOM(modifiedHtml, { runScripts: 'dangerously' });
  const modifiedWindow = modifiedDom.window;
  const modifiedDocument = modifiedWindow.document;
  
  // Wait for the script to execute by checking if the container has content
  const container = modifiedDocument.getElementById('status-badge-container');
  
  if (!container) {
    throw new Error('Status badge container not found in DOM');
  }
  
  // Get the inner text of the badge
  const badgeElement = container.querySelector('div');
  
  if (!badgeElement) {
    throw new Error('Badge element not rendered');
  }
  
  return badgeElement.textContent.trim();
}

test('Property 1: Status badge renders correct text for every valid status', async () => {
  // Create an arbitrary that generates valid status values
  const validStatusArbitrary = fc.constantFrom(
    'upcoming',
    'active', 
    'judging',
    'winners_announced'
  );
  
  // Property: For any valid status, the rendered badge text matches the expected text
  await fc.assert(
    fc.property(validStatusArbitrary, (status) => {
      const renderedText = renderStatusBadgeInDOM(status);
      const expectedText = EXPECTED_STATUS_TEXT[status];
      
      // Assert that the rendered text exactly matches the expected text
      assert.strictEqual(
        renderedText,
        expectedText,
        `Status "${status}" should render "${expectedText}" but got "${renderedText}"`
      );
    }),
    {
      numRuns: 100, // Minimum 100 iterations as specified in design
      verbose: true
    }
  );
});
