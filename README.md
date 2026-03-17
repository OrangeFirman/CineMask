# CineMask

A Chrome extension that hides movie and TV ratings on the sites you use most. Watch blind. Judge for yourself.

## Supported Sites

- **IMDb** — rating widget, Metascore chip, star ratings in search results and title cards
- **Rotten Tomatoes** — Tomatometer and Audience Score on title pages and browse cards
- **Letterboxd** — community rating, score distribution histogram, film card ratings
- **Kinopoisk** — main rating, critic scores, card badges
- **Metacritic** — Metascore, User Score, browse card scores
- **Google Search** — IMDb score snippets and rating bars in search results

## Features

- **Blur or Hide** — blur keeps the layout intact with scores fogged out; hide replaces them with a neutral placeholder
- **Click to reveal** — click any hidden score on the page to uncover it without reloading
- **Per-site toggles** — enable or disable each site independently
- **Instant on IMDb** — ratings are masked before the page finishes loading, no flash of scores
- **SPA-aware** — works on dynamically loaded content and navigations within the same tab

## Installation

Chrome Web Store release coming soon. In the meantime, load it manually:

1. Download the latest release zip and extract it
2. Go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the extracted `cinemask` folder

To update, replace the folder contents and click the refresh icon on the extension card.

## Usage

Click the CineMask icon in your toolbar to open settings. Changes take effect on the next page load.

- Toggle individual sites on or off
- Switch between **Blur** (scores fogged, layout preserved) and **Hide** (scores replaced by a placeholder)
- On any page, click a blurred or hidden score to reveal it — no reload needed

## Roadmap

- [ ] Chrome Web Store release
- [ ] Firefox support

## Acknowledgements

Inspired by [hide-ratings-extension](https://github.com/ganigeorgiev/hide-ratings-extension) by ganigeorgiev.

## License

MIT
