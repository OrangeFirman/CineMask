'use strict';

// Google Search content script.
// Three distinct score UI patterns observed in the wild:
//
// 1. Star bar — span.z3HNkc wrapping span.gTPtFb (gradient bar)
// 2. Source cards — div.MPcMmb containing site logo + name + score (span.IcqUx)
// 3. Score row — span.KMdzJ (the number) inside anchor links in div.pJ9yHe

(async () => {
  const settings = await HideRatings.getSettings();
  if (!settings.google) return;

  const { mode } = settings;

  const selectors = [
    // ── Pattern 1: star/bar widget ─────────────────────────────────────
    // The outer wrapper that holds the gradient bar — blur this, not the
    // inner span, so the whole widget (stars + bar) gets masked together
    'span.z3HNkc',

    // ── Pattern 2: source score cards (IMDb / RT / Film.ru etc.) ───────
    // div.MPcMmb is the full card: logo + source name + score text
    // Blurring the whole card is cleaner than just the number
    'div.MPcMmb',

    // ── Pattern 3: inline score row ────────────────────────────────────
    // span.KMdzJ holds just the score number (e.g. "5.8/10", "32%")
    // inside the compact multi-source row
    'span.KMdzJ',

    // ── Fallback: any aria-labelled score snippet ──────────────────────
    // Catches the yi40Hd pattern from older layouts
    'span.yi40Hd',
  ];

  HideRatings.processElements(selectors, mode);
})();
