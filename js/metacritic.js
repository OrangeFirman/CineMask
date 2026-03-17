'use strict';

// Metacritic content script.
// Uses data-testid attributes from their Nuxt/Vue frontend — stable.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.metacritic) return;

  const { mode } = settings;

  const selectors = [
    // ── Title pages ────────────────────────────────────────────────────
    // Full score wrapper (score badge + number + sentiment + review count)
    '[data-testid="global-score-wrapper"]',

    // Just the score value badge if we ever want finer targeting
    '[data-testid="global-score-value-wrapper"]',

    // ── Browse / search cards ──────────────────────────────────────────
    '[data-testid="score"]',
    '[data-testid="critic-score"]',
    '[data-testid="user-score"]',

    // Score chip used in card listings
    '[class*="c-siteReviewScore"]',
    '[class*="metascore_w"]',
  ];

  HideRatings.processElements(selectors, mode);
})();
