'use strict';

const DEFAULTS = {
  imdb: true,
  rottentomatoes: true,
  letterboxd: true,
  kinopoisk: true,
  metacritic: true,
  google: true,
  mode: 'blur',
};

const MODE_HINTS = {
  blur: 'Scores are fogged out. The story stays intact.',
  hide: 'Scores are replaced by a placeholder. Click to uncover.',
};

const SITES = ['imdb', 'rottentomatoes', 'letterboxd', 'kinopoisk', 'metacritic', 'google'];

let toastTimer = null;

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

function save(changes) {
  chrome.storage.sync.set(changes, showToast);
}

function setModeUI(mode) {
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  document.getElementById('mode-hint').textContent = MODE_HINTS[mode] ?? '';
}

chrome.storage.sync.get(DEFAULTS, (settings) => {
  SITES.forEach((site) => {
    const input = document.getElementById(`toggle-${site}`);
    if (!input) return;
    input.checked = !!settings[site];
    input.addEventListener('change', () => save({ [site]: input.checked }));
  });

  setModeUI(settings.mode || 'blur');

  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      save({ mode: btn.dataset.mode });
      setModeUI(btn.dataset.mode);
    });
  });
});
