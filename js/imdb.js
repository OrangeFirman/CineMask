'use strict';

// IMDb content script — runs at document_end.
// Removes the early blanket style and replaces it with proper
// per-element handling (click-to-reveal, mode-aware).

(async () => {
  const settings = await HideRatings.getSettings();

  // Remove early blanket style regardless — main script takes over.
  const early = document.getElementById('hr-imdb-early');
  if (early) early.remove();

  if (!settings.imdb) return;

  const { mode } = settings;

  const selectors = [
    // ── Title pages ────────────────────────────────────────────────────
    '[data-testid="hero-rating-bar__aggregate-rating"]',
    '[data-testid="metacritic-score-chip"]',
    '[data-testid="aggregate-rating"]',

    // ── Search results, lists, title cards ────────────────────────────
    '.ipc-rating-star-group',

    // ── Older / alternate IMDb page layouts ───────────────────────────
    '.ratingValue',
    '.ratings-bar',
    '.imdb-rating',
  ];

  HideRatings.processElements(selectors, mode);
})();
