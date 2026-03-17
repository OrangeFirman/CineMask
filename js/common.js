'use strict';

// Shared utilities injected before every site-specific script.
// Exposes a global `HideRatings` object.

const HideRatings = (() => {
  const DEFAULTS = {
    imdb: true,
    rottentomatoes: true,
    letterboxd: true,
    kinopoisk: true,
    metacritic: true,
    google: true,
    mode: 'blur',
  };

  let _settingsCache = null;

  // ------------------------------------------------------------------
  // Settings
  // ------------------------------------------------------------------

  function getSettings() {
    if (_settingsCache) return Promise.resolve(_settingsCache);
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULTS, (result) => {
        _settingsCache = { ...DEFAULTS, ...result };
        resolve(_settingsCache);
      });
    });
  }

  // ------------------------------------------------------------------
  // Core apply logic
  // ------------------------------------------------------------------

  function applyBlur(el) {
    el.classList.add('hr-blur');
    el.title = 'Rating hidden — click to reveal';

    el.addEventListener('click', function reveal(e) {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('hr-blur');
      el.title = '';
    }, { once: true, capture: true });
  }

  // eye-hidden SVG — grey, sized via CSS
  const EYE_HIDDEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="hr-eye-icon">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.586 4.716C11.533 3.376 15.129 3.916 17.556 6.343l3.002 3.002c.03.03.06.06.089.089.407.406.758.757.971 1.156.469.881.469 1.938 0 2.819-.213.4-.564.75-.971 1.157l-.089.089-.052.052a1 1 0 0 1-1.414-1.414l.052-.052c.548-.548.657-.672.71-.771a1 1 0 0 0 0-.932c-.053-.099-.162-.223-.71-.771L16.142 7.757C14.324 5.94 11.627 5.53 9.414 6.537a1 1 0 1 1-.838-1.82z" fill="#888"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.382 4.516a1 1 0 0 1 1.403.325l18 14a1 1 0 0 1-1.57 1.238l-3.96-3.083-.04.04c-3.124 3.125-8.19 3.125-11.314 0L4.074 15.49c-.627-.627-1.167-1.167-1.541-1.658C2.132 13.306 1.828 12.722 1.828 12s.304-1.306.705-1.832c.374-.491.914-1.031 1.541-1.658l.794-.794-2.311-1.797a1 1 0 0 1-.175-1.403zM12.757 13.852l1.688 1.314A4 4 0 0 1 8 12c0-.566.117-1.104.329-1.592l1.69 1.315A2 2 0 0 0 12 14c.268 0 .523-.053.757-.148z" fill="#888"/>
  </svg>`;

  function applyHide(el) {
    // Wrap the target element in a positioned container so the placeholder
    // overlays it exactly — this works regardless of the parent's layout
    // (flexbox, grid, inline, web components, etc.)
    const wrapper = document.createElement('span');
    wrapper.className = 'hr-wrapper';

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    const placeholder = document.createElement('span');
    placeholder.className = 'hr-placeholder';
    placeholder.setAttribute('role', 'button');
    placeholder.setAttribute('tabindex', '0');
    placeholder.setAttribute('title', 'Rating hidden — click to reveal');
    placeholder.innerHTML = EYE_HIDDEN_SVG;

    wrapper.appendChild(placeholder);
    el.classList.add('hr-hidden');

    const reveal = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('hr-hidden');
      placeholder.remove();
      // Unwrap: move el back out and remove the wrapper
      wrapper.parentNode.insertBefore(el, wrapper);
      wrapper.remove();
    };

    placeholder.addEventListener('click', reveal, { once: true });
    placeholder.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') reveal(e);
    }, { once: true });
  }

  /**
   * Apply blur or hide to a single element.
   * Idempotent — safe to call multiple times on the same element.
   */
  function apply(el, mode) {
    if (!el || el.dataset.hrDone) return;
    el.dataset.hrDone = '1';

    if (mode === 'blur') {
      applyBlur(el);
    } else {
      applyHide(el);
    }
  }

  // ------------------------------------------------------------------
  // DOM helper: process existing elements + watch for new ones via MO
  // ------------------------------------------------------------------

  function processElements(selectors, mode) {
    const selectorStr = Array.isArray(selectors) ? selectors.join(', ') : selectors;

    function processRoot(root) {
      try {
        root.querySelectorAll(selectorStr).forEach((el) => apply(el, mode));
      } catch (_) {}
    }

    processRoot(document);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          try {
            if (node.matches(selectorStr)) apply(node, mode);
          } catch (_) {}
          processRoot(node);
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    return observer;
  }

  return { getSettings, apply, processElements, DEFAULTS };
})();
