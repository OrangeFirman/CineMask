'use strict';

// Letterboxd content script.

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.letterboxd) return;

  const { mode } = settings;

  // ── Histogram: blur (not hide) — so bars are masked but restored on reveal
  // The tooltip is stored and restored when the rating is revealed.

  const HISTOGRAM_SEL = [
    'ul.rating-histogram',
    '.rating-histogram',
    '#film-histogram',
    '.js-histogram',
    '[data-histogram]',
    '.ratings-histogram-chart',
    '.film-ratings-histogram',
  ].join(', ');

  // Tooltip lives on .average-rating as title / data-original-title
  // We stash it in a data attribute so we can restore it on reveal.
  function stashTooltip(el) {
    const t = el.getAttribute('title') || el.getAttribute('data-original-title');
    if (t) {
      el.dataset.hrTooltip = t;
      el.removeAttribute('title');
      el.removeAttribute('data-original-title');
    }
  }

  function restoreTooltip(el) {
    const t = el.dataset.hrTooltip;
    if (t) {
      el.setAttribute('title', t);
      delete el.dataset.hrTooltip;
    }
  }

  function processHistogram(root) {
    try {
      root.querySelectorAll(HISTOGRAM_SEL).forEach((el) => {
        if (el.dataset.hrHistDone) return;
        el.dataset.hrHistDone = '1';
        el.classList.add('hr-blur');
        el.style.setProperty('cursor', 'default', 'important');
      });
    } catch (_) {}
  }

  function processTooltips(root) {
    try {
      root.querySelectorAll('.average-rating, [data-original-title*="average"], [title*="weighted"], [title*="ratings"]').forEach(stashTooltip);
    } catch (_) {}
  }

  processHistogram(document);
  processTooltips(document);

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        processHistogram(node);
        processTooltips(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  // ── Rating displays: blur/hide with reveal ─────────────────────────

  const ratingSelectors = [
    '.average-rating',
    '#film-ratings',
    '.film-poster .rating',
    '.film-list-entry .rating',
    '.poster-list .rating',
    '.film-detail .rating',
    '.activity-summary .rating',
    '.diary-entry-rating',
    '.rated-large',
    '.film-rating',
  ];

  // Custom processing so we can hook into reveal to restore histogram + tooltip
  const selectorStr = ratingSelectors.join(', ');

  function processRatings(root) {
    try {
      root.querySelectorAll(selectorStr).forEach((el) => {
        if (el.dataset.hrDone) return;
        el.dataset.hrDone = '1';

        if (mode === 'blur') {
          el.classList.add('hr-blur');
          el.title = 'Rating hidden — click to reveal';
          el.addEventListener('click', function reveal(e) {
            e.preventDefault();
            e.stopPropagation();
            el.classList.remove('hr-blur');
            el.title = '';
            // Unblur histogram
            document.querySelectorAll(HISTOGRAM_SEL).forEach((h) => {
              h.classList.remove('hr-blur');
              h.style.removeProperty('cursor');
            });
            // Restore tooltip
            restoreTooltip(el);
          }, { once: true, capture: true });

        } else {
          // hide mode — use the shared HideRatings helper
          HideRatings.apply(el, 'hide');

          // After the placeholder is clicked we also need to unblur histogram
          // The wrapper's placeholder is the next sibling after apply()
          // Use a MO to detect when hr-hidden is removed from el
          const observer = new MutationObserver(() => {
            if (!el.classList.contains('hr-hidden')) {
              observer.disconnect();
              document.querySelectorAll(HISTOGRAM_SEL).forEach((h) => {
                h.classList.remove('hr-blur');
                h.style.removeProperty('cursor');
              });
              restoreTooltip(el);
            }
          });
          observer.observe(el, { attributes: true, attributeFilter: ['class'] });
        }
      });
    } catch (_) {}
  }

  processRatings(document);

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        processRatings(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
