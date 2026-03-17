'use strict';

// Letterboxd content script.
// Rating histogram and weighted-average tooltip are ALWAYS fully
// hidden (display:none) regardless of blur/hide mode setting, because
// even blurred bars still reveal the score distribution shape.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.letterboxd) return;

  const { mode } = settings;

  // ── Always-hide: histogram + weighted average tooltip ──────────────

  function hideHistogram(root) {
    const histogramSelectors = [
      'ul.rating-histogram',
      '.rating-histogram',
      '#film-histogram',
      '.js-histogram',
      '[data-histogram]',
      '.ratings-histogram-chart',
      // Container holding the histogram on film pages
      '.film-ratings-histogram',
      '.section-heading + .rating-histogram',
    ];
    histogramSelectors.forEach((sel) => {
      try {
        root.querySelectorAll(sel).forEach((el) => {
          el.style.setProperty('display', 'none', 'important');
          el.dataset.hrHistogramHidden = '1';
        });
      } catch (_) {}
    });

    // Strip the "weighted average of X based on Y ratings" tooltip
    // It lives as a title attribute on the average-rating element
    const avgSelectors = [
      '.average-rating',
      '.display-rating',
      '[data-original-title*="average"]',
      '[title*="average"]',
      '[title*="weighted"]',
      '[title*="ratings"]',
    ];
    avgSelectors.forEach((sel) => {
      try {
        root.querySelectorAll(sel).forEach((el) => {
          el.removeAttribute('title');
          el.removeAttribute('data-original-title');
        });
      } catch (_) {}
    });
  }

  hideHistogram(document);

  // Watch for dynamically added histogram elements (SPA nav)
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        hideHistogram(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // ── Normal blur/hide: rating displays ──────────────────────────────

  const selectors = [
    // Film pages — average community rating (the green bar + number)
    '.average-rating',
    '#film-ratings',

    // Film cards in lists, search, home feed
    '.film-poster .rating',
    '.film-list-entry .rating',
    '.poster-list .rating',
    '.film-detail .rating',

    // Activity / diary entries
    '.activity-summary .rating',
    '.diary-entry-rating',

    // Older layouts
    '.rated-large',
    '.film-rating',
  ];

  HideRatings.processElements(selectors, mode);
})();
