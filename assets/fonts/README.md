# Fonts

**PP Pangaia** (Pangram Pangram Foundry) is used for titles and large display
text. Body text uses Helvetica Neue and does not depend on these files.

Included here (Free-for-Personal-Use edition):

```
PPPangaia-Ultralight.otf   (weight 200)
PPPangaia-Medium.otf       (weight 500)  ← used by titles
PPPangaia-Bold.otf         (weight 700)
EULA-PangramPangram-FreeForPersonalUse.pdf
```

The `@font-face` rules in [`css/style.css`](../../css/style.css) reference these
files. The browser only downloads the weight actually used in the CSS (Medium).

## Licensing note

These are the **Free for Personal Use** weights. Read the bundled EULA. If this
site is used commercially (e.g. selling work, brand promotion), a commercial
web licence from Pangram Pangram may be required. Swapping in licensed `.woff2`
files later is a drop-in replacement — just update the `src` URLs and `format`.
