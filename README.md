# Paula Schierholt

Website of the artist Paula Schierholt — <https://paulaschierholt.com>.

## Tech

Plain, dependency-free static site. No build step, no framework.

- **HTML** — `index.html` (one page with anchor navigation), plus the legal
  pages `impressum.html` and `datenschutz.html`
- **CSS** — one stylesheet, `css/style.css`, following
  [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)
- **JavaScript** — progressive enhancement only: `js/main.js` (EN/DE switch,
  artwork modal, mobile menu, header, parallax, scrollspy, footer year) and
  `js/paula-wallpaper.js` (the cover video). Without JavaScript the site still
  works and shows English.
- **Typefaces** — body in Helvetica Neue; name, titles and dates in
  **PP Pangaia** (see [`assets/fonts/README.md`](assets/fonts/README.md))

## Sections

The site is bilingual — **English by default**, with an EN/DE switch in the
header. The choice is remembered in `localStorage`, and only once a visitor
clicks EN or DE. Each translatable element carries both languages
(`.lang-en` / `.lang-de`); CSS shows the active one.

- **About** (Über mich) — statement + portrait
- **Artwork** (Kunst) — *Ghost Stories*, *Fiction*, *Deepfake Diaries*
  (newest first); a title opens the work in a modal, where the title unfolds
  the description
- **Biography** (Biographie)
- **Exhibitions** (Ausstellungen)
- **Contact** (Kontakt) — in the footer

> **Translations:** the German artist statement / work descriptions and the
> English biography lines are drafts to review — refine the wording as needed.

## Structure

```
.
├── index.html              # The page
├── impressum.html          # Imprint
├── datenschutz.html        # Privacy policy
├── css/
│   └── style.css           # Stylesheet
├── js/
│   ├── main.js             # Progressive-enhancement scripts
│   └── paula-wallpaper.js  # Cover video
├── assets/
│   ├── img/                # Web-optimised images used by the site
│   ├── originals/          # Full-resolution source images (not published)
│   ├── wallpaper/          # Cover video and poster frames
│   ├── fonts/              # PP Pangaia
│   ├── icon-32.png, icon-180.png   # Site icons
│   └── og-image.jpg        # Link preview card (1200 × 630)
├── docs/                   # Design system and audit (not published)
├── tools/                  # Prose consistency check (not published)
├── wrangler.jsonc          # Cloudflare Worker configuration
└── .assetsignore           # Everything that is never published
```

## Images

`assets/img/` holds web-optimised versions (long edge ≤ 2000px) generated
from the full-resolution files kept in `assets/originals/`. Regenerate an
optimised image with macOS `sips`, e.g.:

```bash
sips -s format jpeg -s formatOptions 80 -Z 2000 \
  assets/originals/fiction-1.jpg --out assets/img/fiction-1.jpg
```

## Development

Serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

After any change to typography, run the prose check (needs Node and Chrome):

```bash
node tools/check-prose-consistency.js
```

## Deployment

The site is served by a Cloudflare Worker (`paula`, see `wrangler.jsonc`)
connected to this repository. **Every push to `main` goes live** on
paulaschierholt.com and paulaschierholt.de. Every file in the repository is
published except those listed in `.assetsignore`.

## License

See [LICENSE](LICENSE).
