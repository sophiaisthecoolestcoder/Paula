# Paula Schierholt

Official website for the artist **Paula Schierholt** — a static, minimalist site.

> This repository currently contains the **foundation only**. Design and content
> will be added according to specifications provided later.

## Tech

Plain, dependency-free static site:

- **HTML** — semantic markup
- **CSS** — a small custom stylesheet with CSS variables
- **JavaScript** — minimal vanilla JS

No build step is required.

## Structure

```
.
├── index.html          # Entry page
├── css/
│   └── style.css       # Base stylesheet
├── js/
│   └── main.js         # Site scripts
├── assets/             # Images, icons, media
│   └── favicon.svg
├── .gitignore
├── LICENSE
└── README.md
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
