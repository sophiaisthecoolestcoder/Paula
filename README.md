# Paula Schierholt

Official website for the artist **Paula Schierholt** — a static, minimalist site.

> This repository currently contains the **foundation only**. Design and content
> will be added according to specifications provided later.

## Tech

Plain, dependency-free static site:

- **HTML** — a single semantic page with anchor navigation
- **CSS** — one custom stylesheet, CSS variables, no framework
- **JavaScript** — minimal vanilla JS (footer year + nav scrollspy);
  the site works fully without it
- **Typefaces** — body in Helvetica Neue; titles and large display text in
  **PP Pangaia** (licensed — add the font files, see
  [`assets/fonts/README.md`](assets/fonts/README.md))

No build step is required.

## Sections

- **About** (Über mich) — statement + portrait
- **Artwork** (Kunst) — *Fiction*, *Deepfake Diaries*, *ghost poem*;
  each work's description unfolds on click (native `<details>`)
- **Biography** (Biographie)
- **Exhibitions** (Ausstellungen)
- **Contact** (Kontakt)

## Structure

```
.
├── index.html              # The page
├── css/
│   └── style.css           # Stylesheet
├── js/
│   └── main.js             # Progressive-enhancement scripts
├── assets/
│   ├── favicon.svg
│   ├── img/                # Web-optimised images used by the site
│   └── originals/          # Full-resolution source images
├── .gitignore
├── .editorconfig
├── LICENSE
└── README.md
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

Open `index.html` directly in a browser, or serve the folder locally:

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

## Deployment

Being a static site, it can be hosted on any static host — GitHub Pages,
Netlify, Vercel, Cloudflare Pages, etc. No configuration is needed beyond
pointing the host at the repository root.

## License

See [LICENSE](LICENSE).
