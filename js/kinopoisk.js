'use strict';

// Kinopoisk content script.
// Kinopoisk uses a heavy React/Next.js frontend with partially-hashed
// class names. We use substring class matching ([class*="..."]) as a
// fallback, plus any stable data attributes we can find.
//
// If selectors break after a Kinopoisk redesign, open DevTools on a
// film page, inspect the gold rating number, and update accordingly.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.kinopoisk) return;

  const { mode } = settings;

  const selectors = [
    // ── Film pages ─────────────────────────────────────────────────────
    // KinoPoisk rating value (the gold number, e.g. "8.1")
    '[class*="filmRatingValue"]',
    '[class*="FilmRatingValue"]',
    '[class*="styles_filmRating"]',
    '[class*="FilmRating_filmRating"]',

    // The full rating widget container (score + vote count)
    '[class*="filmRatingWrap"]',
    '[class*="FilmRatingWrap"]',

    // IMDb / critics scores sometimes shown alongside the KP score
    '[class*="otherRating"]',
    '[class*="OtherRating"]',

    // ── Search results / cards ─────────────────────────────────────────
    '[class*="ratingValue"]',
    '[class*="RatingValue"]',
    '[class*="rating__value"]',
    '[class*="Rating__value"]',

    // Kinopoisk card rating badge
    '[class*="filmCard__rating"]',
    '[class*="FilmCard__rating"]',
    '[class*="filmCardRating"]',

    // ── Older Kinopoisk layouts ────────────────────────────────────────
    '.film-rating-value',
    '.rating-value',
    '#block_rating',
  ];

  HideRatings.processElements(selectors, mode);
})();
