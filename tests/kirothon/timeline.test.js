// Unit tests for Timeline section
// **Validates: Requirements 6.1, 6.2, 6.3**

import { test } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Expected milestones from requirements
const EXPECTED_MILESTONES = [
  { date: 'March 10', name: 'Registration Open' },
  { date: 'March 15', name: 'Build Phase Begins' },
  { date: 'March 28', name: 'Build Phase Ends' },
  { date: 'March 29 – April 5', name: 'Judging Period' },
  { date: 'TBA', name: 'Winners Announced' }
];

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

test('Timeline section exists with correct heading', () => {
  const document = loadHTML();
  
  // Find the timeline section by looking for the heading
  const headings = Array.from(document.querySelectorAll('.section-heading'));
  const timelineHeading = headings.find(h => h.textContent.trim() === 'Timeline');
  
  assert.ok(timelineHeading, 'Timeline section heading should exist');
});

test('Timeline contains all 5 milestones with correct dates and names', () => {
  const document = loadHTML();
  
  // Find all milestone elements
  const milestones = document.querySelectorAll('.timeline-milestone');
  
  assert.strictEqual(
    milestones.length,
    5,
    'Timeline should contain exactly 5 milestones'
  );
  
  // Verify each milestone has correct date and name
  milestones.forEach((milestone, index) => {
    const dateElement = milestone.querySelector('.milestone-date');
    const nameElement = milestone.querySelector('.milestone-name');
    
    assert.ok(dateElement, `Milestone ${index + 1} should have a date element`);
    assert.ok(nameElement, `Milestone ${index + 1} should have a name element`);
    
    const actualDate = dateElement.textContent.trim();
    const actualName = nameElement.textContent.trim();
    const expected = EXPECTED_MILESTONES[index];
    
    assert.strictEqual(
      actualDate,
      expected.date,
      `Milestone ${index + 1} date should be "${expected.date}" but got "${actualDate}"`
    );
    
    assert.strictEqual(
      actualName,
      expected.name,
      `Milestone ${index + 1} name should be "${expected.name}" but got "${actualName}"`
    );
  });
});

test('All milestones have equal visual weight (no special active class)', () => {
  const document = loadHTML();
  
  // Find all milestone elements
  const milestones = document.querySelectorAll('.timeline-milestone');
  
  // Check that no milestone has an "active" class or similar highlighting
  milestones.forEach((milestone, index) => {
    const hasActiveClass = milestone.classList.contains('active') ||
                          milestone.classList.contains('highlighted') ||
                          milestone.classList.contains('current');
    
    assert.strictEqual(
      hasActiveClass,
      false,
      `Milestone ${index + 1} should not have active/highlighted class (all should have equal visual weight)`
    );
  });
});

test('Each milestone has a circle indicator', () => {
  const document = loadHTML();
  
  const milestones = document.querySelectorAll('.timeline-milestone');
  
  milestones.forEach((milestone, index) => {
    const indicator = milestone.querySelector('.milestone-indicator');
    
    assert.ok(
      indicator,
      `Milestone ${index + 1} should have a circle indicator element`
    );
  });
});

test('Timeline container exists for layout', () => {
  const document = loadHTML();
  
  const container = document.querySelector('.timeline-container');
  
  assert.ok(container, 'Timeline container should exist for flex layout');
  
  // Verify it contains the milestones
  const milestonesInContainer = container.querySelectorAll('.timeline-milestone');
  assert.strictEqual(
    milestonesInContainer.length,
    5,
    'Timeline container should contain all 5 milestones'
  );
});
