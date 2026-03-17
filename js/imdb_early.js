'use strict';

// Runs at document_start — before any HTML is parsed.
// Injects a <style> that blurs IMDb rating elements the instant they
// appear in the DOM. The main imdb.js (document_end) takes over and
// adds click-to-reveal, then removes this blanket style.

chrome.storage.sync.get({ imdb: true }, (s) => {
  if (!s.imdb) return;

  const style = document.createElement('style');
  style.id = 'hr-imdb-early';
  style.textContent = `
    [data-testid="hero-rating-bar__aggregate-rating"],
    [data-testid="metacritic-score-chip"],
    [data-testid="aggregate-rating"],
    [data-testid="hero-rating-bar__aggregate-rating__score"],
    .ipc-rating-star-group,
    .ratingValue,
    .ratings-bar,
    .imdb-rating {
      filter: blur(7px) !important;
      cursor: pointer !important;
      user-select: none !important;
      border-radius: 3px;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
});
