'use strict';

// Kinopoisk content script.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.kinopoisk) return;

  const { mode } = settings;

  const selectors = [
    // ── Film pages — main rating widget ───────────────────────────────
    // Stable data-tid on the rating value element
    '[data-tid="kp-movie-rating.rating-value"]',

    // The value container div (wraps number + vote count)
    '[class*="ratingValue"][class*="styles_ratingValue"]',

    // Full rating block (number + sub-ratings like IMDb score beneath)
    '[class*="styles_ratingContainer"]',

    // IMDb / critics sub-rating shown below the KP score
    '[class*="styles_valueSection"]',

    // ── Film cards / lists ─────────────────────────────────────────────
    '[class*="filmCard__rating"]',
    '[class*="FilmCard__rating"]',
    '[class*="filmCardRating"]',
    '[class*="styles_filmRating"]',

    // ── Search autocomplete dropdown ───────────────────────────────────
    // The suggest item rating sits inside elements with these data-tids
    '[data-tid="search-film-item-rating"]',
    '[data-tid="search-suggest-rating"]',
    // Fallback: rating spans directly inside suggest list items
    // Uses specific suggest/header ancestor to avoid catching other UI
    '[class*="styles_suggest"] [class*="styles_rating"]',
    '[class*="Header_search"] [class*="styles_rating"]',

    // ── Older Kinopoisk layouts ────────────────────────────────────────
    '.film-rating-value',
    '#block_rating',
  ];

  HideRatings.processElements(selectors, mode);
})();
