'use strict';

// Rotten Tomatoes content script.
// RT renders scores inside <rt-text> web component slots.
// We target those directly, plus the score-board wrapper on title pages.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.rottentomatoes) return;

  const { mode } = settings;

  const selectors = [
    // ── Score text elements (web components) ───────────────────────────
    // Title page + card scores — all observed slot names
    'rt-text[slot="criticsScore"]',
    'rt-text[slot="critics-score"]',
    'rt-text[slot="audienceScore"]',
    'rt-text[slot="audience-score"]',

    // Empty state placeholders ("- -") also reveal distribution info
    'rt-text.critics-score-empty',
    'rt-text.audience-score-empty',

    // ── Title page score board (wraps icon + score + label together) ───
    'score-board',
    'score-board-deprecated',

    // ── Fallback for any rt-text carrying a score-like slot ────────────
    // Catches future slot name variations without over-selecting
    'rt-text[slot*="Score"]',
    'rt-text[slot*="score"]',
  ];

  HideRatings.processElements(selectors, mode);
})();
