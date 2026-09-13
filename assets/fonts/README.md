# Fonts

**PP Pangaia** (Pangram Pangram Foundry) is used for the name, titles, work
specs and dates. Body text uses Helvetica Neue and does not depend on these
files.

Included here (Free-for-Personal-Use edition):

```
PPPangaia-Ultralight.otf         (200)          cover name, work titles, page titles, dates
PPPangaia-UltralightItalic.otf   (200 italic)   work specs, work-title hover
PPPangaia-Medium.otf             (500)          header wordmark, footer signature
EULA-PangramPangram-FreeForPersonalUse.pdf
```

The `@font-face` rules in [`css/style.css`](../../css/style.css) reference these
three files, and all three are published with the site. (Bold and Medium Italic
were never used and were removed on 2026-09-13.)

## Licensing note

These are the **Free for Personal Use** files.

- The bundled EULA (May 2021) excludes use "on a publicly available platform
  such as a website" (§2) and making the fonts available publicly (§2.6).
- Pangram Pangram's current FAQ lists "personal portfolios" as personal use,
  but also says a Web licence "is needed for any website, microsite and
  subdomain where the font is embedded"; the current EULA (§2.4) agrees.
  Treat this site as needing a Web licence.
- Font files must not sit in a public repository or other public storage
  (current EULA §3.7) — with or without a licence. Keep this repository
  private.

A purchase includes OTF, TTF, WOFF and WOFF2; swapping in the licensed `.woff2`
files means updating the `src` URLs and `format` in `css/style.css`.
