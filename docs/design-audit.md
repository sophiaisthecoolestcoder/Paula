# Design audit — paulaschierholt.com

> **Status: this audit has been acted on.** Decisions D1–D5 and D7 were approved and built on
> 2026-09-08, together with findings F1–F13. D6 (the 44rem legal column) was **not** applied —
> see `docs/DESIGN-SYSTEM.md §16` for the measured reason. F14 (scroll-snap) is still open.
>
> This document is kept as the record of what was wrong and why. For what the site does *now*,
> read `docs/DESIGN-SYSTEM.md` — that is the source of truth. Before-and-after screenshots are
> in `docs/screenshots/`. One correction to F10 below, marked inline: the +23px hover reflow
> was a synthesised oblique, not the real italic face.

First-pass, fresh-eyes review. **Analysis only — no source files were changed.**
Date: 2026-09-08. Reviewed at 1440 / 768 / 390 px, EN and DE, on the local server.

**Method note.** The Claude-in-Chrome extension would not connect (three attempts), so the
site was rendered and measured with headless Chrome instead: real screenshots at each
breakpoint plus computed-style, geometry and text-metric dumps taken from the live DOM.
Every number below is measured, not estimated. Two things could not be verified this way and
are flagged in place: **hover** and **:focus-visible** appearance (measured, not seen), and
the **feel** of scroll-snap + parallax during real scrolling.

---

## 1. What a first-time visitor sees

The bones are right and should not be touched. The cover — a huge Ultralight PP Pangaia
name over a slow video — is genuinely good, and the Artwork section (three 76px uppercase
titles stacked on hairlines) is the strongest page on the site. The warm paper, the ragged
right, the restraint: all correct.

What undermines it is that the site gets *less* finished the further in you go. The cover is
art-directed; the Artwork list is art-directed; the Biography, Exhibitions, footer and legal
pages are default. And every interactive control — the ones a visitor touches — is the
weakest thing on the page. The impression is of a beautiful front page attached to an
unfinished site.

Three structural causes, all fixable:

1. **Nothing terminates.** Sections end in 88–168px of empty paper, and lists end in a rule
   that is 88px from the next rule. The page has no cadence, only gaps.
2. **Micro-typography is unmanaged.** The same role (a small uppercase label) is specified
   four different ways in four places. Nobody notices any one of them; everybody feels all
   four.
3. **The controls are not designed.** They are text characters in a font used nowhere else
   on the site, positioned against the viewport rather than against the content.

---

## 2. Findings, ranked by what each costs

### F1 — Modal body text is set justified at 143 characters per line · **critical**

`css/style.css:564-568` overrides the reading measure inside the modal:

```css
.wmodal .work__prose { max-width: none; text-align: justify; hyphens: auto; }
```

Measured with the Fiction modal open at 1440px: the paragraph renders **1024px wide**,
**5 lines**, **≈143 characters per line**, `text-align: justify`. The comfortable range is
45–75. At 14px Helvetica this is close to twice the upper bound, and justification at that
width opens visible rivers (see `read more` expanded — "some that have always existed" has
word gaps roughly double the others).

This is the single most damaging thing on the site, because it happens at the exact moment a
visitor decides to actually read about the work. `--measure: 56ch` already exists at
`css/style.css:61` and is applied correctly everywhere else, including `.work__prose` at
`css/style.css:434`. The modal simply opts out.

**Fix:** delete the override. Keep `--measure`, keep ragged-right (justification in a narrow
measure with German hyphenation will look worse, not better).

---

### F2 — The controls are Arial text glyphs, and there are three unrelated icon idioms · **critical**

The site currently draws its controls three different ways:

| Control | Idiom | Where |
|---|---|---|
| modal close `×`, prev `‹`, next `›` | text characters | `js/main.js:63-65` |
| "read more" toggle | CSS border-and-rotate square | `css/style.css:413-425` |
| cover scroll hint | real inline SVG | `index.html:41` |

Measured facts, modal open at 1440px:

- **`.wmodal__close` computes to `font-family: Arial`.** The button sets `appearance: none`
  but never sets `font-family` (`css/style.css:479-492`), so it does not inherit the body
  stack — it falls back to the UA button font. The `×` is therefore drawn in a typeface used
  nowhere else on the site, at a weight nobody chose. Same for `.wmodal__nav`
  (`css/style.css:494-509`). This is the mechanical root of "the arrows look wrong".
- **Hit areas below target.** close `31 × 42px`, prev/next `42 × 56px`. WCAG 2.5.8 (AA)
  needs 24×24 so these pass, but 2.5.5 (AAA) and every touch guideline want 44×44. The close
  button is 31px wide on a phone.
- **They are pinned to the viewport, not the work.** `prev` sits at `left: 20px` while the
  image gallery starts at `x: 208`. The arrows are **188px away from the images they
  navigate**, floating in empty paper. On mobile the opposite happens: at 390px they sit *on
  top of* the artwork.
- **`opacity: 0.5`** (`css/style.css:506`) makes a thin glyph on a light ground look faded
  and broken rather than quiet.
- The cover SVG declares `stroke-width="1.4"` in markup (`index.html:41`) and is then
  overridden to `1.8` in CSS (`css/style.css:275`) — two stroke weights for one icon.

**No serious gallery site does this.** Fetched and inspected the live markup of three:

| Site | Controls | Text glyphs (`×` `‹` `›`) found |
|---|---|---|
| David Zwirner | 8 inline SVG, `fill="currentColor"`, `role="img"` | 0 |
| Sprüth Magers | 17 inline SVG; close is `aria-label="Close dialog"` | 0 |
| Serpentine Galleries | 26 inline SVG via `<use href="#icon-…">` sprite | 0 |

Sprüth Magers' chevron is instructive — a stroked polyline on a 20-unit grid:
`<svg viewBox="0 0 20 20"><polyline points="2,14 10,6 18,14" stroke-width="2" fill="none"/></svg>`.
That is the whole idea: one grid, one stroke, `fill: none`, `currentColor`.

**Fix:** one SVG family. Spec in `DESIGN-SYSTEM.md §7`.

---

### F3 — Section rhythm: rules that float, and 168px of dead paper before the footer · **high**

Measured at 1440px, between Biography and Exhibitions:

```
Biography last row bottom rule
    ↕ 88px of nothing
.section border-top (Exhibitions)
    ↕ 89px of nothing
"EXHIBITIONS" label
    ↕
Exhibitions first row top rule
```

Three 1px hairlines of identical colour and weight within ~230px, separated only by empty
space. The middle one belongs to nothing — it is `.section { border-top }`
(`css/style.css:215-219`) doing the job that space and tone should be doing. Visible clearly
in the 768px render: rules at y≈434, y≈490, y≈590.

Cause is doubled ownership: `.timeline__row:last-child { border-bottom }`
(`css/style.css:591`) closes the list, *and* the next `.section` opens with a `border-top`.
Neither knows about the other.

Then after the last exhibition:

- `_gap_exhLastRow_to_footerRule` = **168px** of empty paper
  (88px section padding-bottom + 80px `.site-main { margin-bottom }`, `css/style.css:211`).

Nothing marks the end of the content or the start of the footer except more of the same
paper. This is exactly the "unresolved" feeling in the brief, and it is why the tonal
background idea is the right instinct — the transition currently has nothing to do it with.

**Fix:** rules belong to *lists*, never to sections; sections are separated by space and a
tone step. See `DESIGN-SYSTEM.md §5–6`.

---

### F4 — The footer's rules are 96px wider than every rule above them · **high**

Measured at 1440px:

| Element | left | right | width |
|---|---|---|---|
| `#biography` box (and every section rule) | 336 | 1104 | **768** |
| `.site-footer` box / `.site-footer__rule` | 288 | 1152 | **864** |

The footer's *content* aligns correctly at x=336, but both its rules overhang by 48px on
each side. `.site-main` puts `padding-inline: var(--gutter)` *inside* the max-width
(`css/style.css:207-213`) so its borders sit at 768; `.site-footer` puts padding inside too
but its `border-top` is on the box (`css/style.css:671-677`), and `.site-footer__rule`
then deliberately negative-margins itself back out to match it (`css/style.css:720-725`).
So the footer is internally consistent and externally wrong.

Only visible above ~960px viewport width (below that, both collapse to full width) — but
that is the width most desktop visitors use. Clearly visible in the desktop render.

---

### F5 — Legal pages: heading hierarchy collapsed, with a weight inversion · **high**

Measured on `datenschutz.html` at 1440px:

| Level | Size | Weight | Rendered face |
|---|---|---|---|
| `h1.section__title` | 44px | 300 → **200** | PP Pangaia **Ultralight** |
| `.legal__body h2` | 16.32px | 500 | Helvetica Neue Medium |
| `.legal__body h3` | 14.72px | 500 | Helvetica Neue Medium |
| `.legal__body h4` | **14.00px** | **600** | Helvetica Neue **Bold** |
| `.legal__body p` | 14.00px | 400 | Helvetica Neue |

Four problems in one table:

1. **h3, h4 and body are the same size.** 14.72 / 14.00 / 14.00. Three levels of structure
   carried by 0.72px.
2. **h4 is heavier than h3** (`css/style.css:652-656` sets 600; `647-651` sets 500). The
   *child* heading looks stronger than its *parent*. Plainly visible: "How do we record your
   data?" reads as more important than "Data recording on this website" above it.
3. **`font-weight: 300` on the page title picks the wrong face.** PP Pangaia ships 200 / 500
   / 700 (`css/style.css:12-46`). CSS weight matching for 300 walks *down* to 200, so the
   legal `<h1>` renders Ultralight — a face nobody chose. The same bug at
   `css/style.css:303`: `.section__title` asks for Helvetica Neue 300, which is Light on
   macOS and 400 everywhere else, so section labels are a different weight on Windows.
4. **`line-height: 1.6` on a 44px title.** The `<h1>` box measures 70.4px tall for one line
   of type. Inherited from `body` (`css/style.css:86`) and never overridden. Display type
   needs ~1.05–1.15.

Also on these pages:

- **The measure is a 435px ribbon in an 864px column** — for a 4,700px-tall document, with
  the right 330px empty the whole way down. It reads as an unstyled dump rather than a
  designed page.
- **`impressum.html` is German-only.** `impressum.html:37` wraps the entire body in
  `<div class="legal__body" lang="de">` with no `.lang-en` sibling, and the `<h1>` at
  `impressum.html:35` is the bare string `Impressum` with no language spans. Switch the site
  to EN and you get English chrome around a German document. `datenschutz.html:35` does this
  correctly — it is the one place with both.
- **`.legal__caps`** (`css/style.css:664-668`) sets the Art. 21 objection blocks in 12.48px
  all-caps with `letter-spacing: 0.01em` — effectively none. A 280px-tall block of untracked
  small caps is close to unreadable. All-caps needs tracking; that is not optional.
- Source formatting: headings and paragraphs are run together on single 6,000-character
  lines (`datenschutz.html:44`, `:66`, `:81`, `:103`). Renders fine, unmaintainable.

---

### F6 — The uppercase micro-label is specified four different ways · **high**

One role — "small uppercase label" — four specifications:

| Selector | Size | Weight | Tracking | Colour | Line |
|---|---|---|---|---|---|
| `.site-nav a` | 0.72rem | 400 | 0.06em | muted | `css/style.css:164-171` |
| `.lang-switch` | 0.72rem | 400 | 0.06em | muted | `css/style.css:180-189` |
| `.section__title` | 0.80rem | 300 | 0.08em | soft | `css/style.css:299-307` |
| `.footer-nav__title` | 0.72rem | 500 | **0.15em** | muted | `css/style.css:700-708` |
| `.site-footer__copy` | 0.72rem | 400 | 0.04em | muted | `css/style.css:726-730` |

Two sizes, three weights, **four tracking values**, two colours. The nav and the lang switch
agree (good — that pairing is deliberate and reads well). Everything else is a near-miss.

Rendered side by side (specimen), 0.06em is too tight for uppercase at this size and 0.15em
visibly gaps; **0.12em** is the value that holds together in both EN and DE
("AUSSTELLUNGEN" is the stress test).

---

### F7 — The mobile header is three rows tall and pushes anchors under itself · **high**

Measured at 390 × 844:

- `.site-header` height = **143.47px** — 17% of the viewport, permanently sticky.
- It renders as **three** rows, not the two the CSS intends. The media query
  (`css/style.css:144-149`) puts `.site-title` in column 1 and `.lang-switch` in column 2,
  but `.site-nav { grid-column: 1 / -1 }` sits between them in DOM order and forces a new
  row, so the language switch is pushed down to a third row of its own.
- The nav itself wraps 4 + 1, leaving **"CONTACT" orphaned and centred on its own line**.
  (Measured: nav children total 313.5px + 80px of gaps = 393.5px against 350px available.)
  In German it is worse — 352.4px of children before gaps.
- **`scroll-padding-top: 4.5rem`** = 72px (`css/style.css:75`) is *half* the mobile header
  height. Click any nav link on a phone and the section heading lands **71px underneath the
  header**.

---

### F8 — The name appears twice in the first viewport, in two unrelated treatments · **medium**

`index.html:16` (header) and `index.html:39` (cover) are the same six syllables, 62px apart:

| | Face | Size @1440 | Weight | Case | Tracking |
|---|---|---|---|---|---|
| `.site-title` | PP Pangaia | 20.8px | 500 Medium | Sentence | 0.01em |
| `.cover__name` | PP Pangaia | 128px | 200 Ultralight | UPPERCASE | 0.05em |

Same typeface, opposite everything else. It does not read as one identity used twice; it
reads as two different logos. And on the cover it is redundant — the name fills the screen
directly below it. (Discussion item — see D3.)

---

### F9 — Dead CSS, including an entire lightbox that does not exist · **medium**

`grep` across `js/` and all three HTML files finds **zero** references to `lightbox`:

- `css/style.css:732-786` — **55 lines** of `.lightbox`, `.lightbox__img`,
  `.lightbox__close`, `.lightbox__nav`, `.lightbox__prev/__next`. No markup, no JS creates
  it. The "image lightbox" in the brief **does not exist on the site**; clicking a modal
  image does nothing.
- `css/style.css:341-393` — `.work`, `.work__intro`, `.work__title`, `.work__gallery` as a
  *section* layout. Superseded by the `.worklist` + modal pattern. `.work__figure` still
  exists in markup but only inside the hidden `.workdata` block (`index.html:75`), so
  `cursor: zoom-in` (`css/style.css:386`) — commented as "subtle, native zoom affordance" —
  **never applies to anything a visitor can see**. The modal clones bare `<img>` elements
  without the class (`js/main.js:102-107`).
- `css/style.css:610-621` — `.contact` / `.contact__name`. Superseded by `.footer-contact`.
- `css/style.css:631` — `.legal__note`. Unused.

Roughly 120 of 795 lines are dead. Not visible to a visitor, but it is why the stylesheet is
hard to reason about, and it is the reason two of the brief's questions ("the lightbox", "the
zoom affordance") have no answer.

---

### F10 — Work titles reflow 23px on hover · **medium**

`css/style.css:461-462`:

```css
.worklist__title:hover, .worklist__title:focus-visible { font-style: italic; }
```

Measured: "GHOST STORIES" is **605.05px** roman and **628.47px** italic — the right edge
jumps **23.4px** on hover.

> **Correction, made during implementation.** That 628.47px was a *synthesised oblique* — the
> italic file had never been fetched at the moment of measurement, so the browser slanted the
> roman. PP Pangaia's real Ultralight Italic is ~19px **narrower** than the roman. The reflow
> was real either way, but it can go in either direction depending on whether the font has
> loaded, which is why the fix reserves both widths. See `DESIGN-SYSTEM.md §9`. The buttons are `text-align: left` and full-width, so the type
visibly stretches under the cursor. It also triggers the first load of
`PPPangaia-UltralightItalic.otf` (96KB) *on hover*, so the first hover flashes.

The idea (italic as the hover state) is good and very gallery-like. The execution needs to
not move the type — see `DESIGN-SYSTEM.md §9`.

---

### F11 — The cover reads cold and grey against warm paper, and overshoots by 2px · **medium**

- The scrim is `rgba(243, 241, 236, 0.42)` over a grey video (`css/style.css:256-262`).
  Measured composite over the video's mid grey: **#b7baba** — a cool neutral. It sits
  directly beneath a header painted in warm paper `#f3f1ec`, so the first thing on the page
  is a **hard horizontal seam between a warm strip and a cold field**. The site's whole
  claim is "warm archival paper"; the cover currently isn't.
- **The cover is 2px too tall.** `min-height: calc(100vh - 3.75rem)` (`css/style.css:225`)
  assumes a 60px header. Measured header height is **62.05px**. Total 902.05px in a 900px
  viewport — a 2px sliver of the next section is always visible under the fold, and the
  scroll-snap has something to argue with.
- **Fallback ground fails contrast.** Before the video paints, `.cover__bg` is `#6b7379`
  (`css/style.css:241`). Black title on that measures **3.7:1** — below AA. Reached whenever
  the poster fails, and on `prefers-reduced-motion` / `saveData` the video `src` is removed
  entirely (`js/paula-wallpaper.js:35`) so only the poster stands between the title and that
  grey.

---

### F12 — "read more" fails AA inside the modal · **medium (accessibility)**

`.work__text > summary` is `--color-muted` `#6e6860` (`css/style.css:409`). The modal ground
is `color-mix(in srgb, var(--color-bg) 92%, #000)` = **`#e0ded9`** (`css/style.css:472`).

Measured: **4.10:1**. WCAG AA for normal text is 4.5:1. It passes on the paper background
(4.88:1) and fails on the darker modal ground — i.e. exactly where it is actually used.

Full palette check on paper (all pass): fg `#1a1714` 15.81:1 · soft `#55504a` 7.07:1 ·
muted `#6e6860` 4.88:1. Muted has **no headroom** — any ground darker than paper breaks it.

---

### F13 — Modal accessibility and close behaviour · **medium**

- **No focus trap.** The dialog sets `role="dialog"` and `aria-modal="true"`
  (`js/main.js:60-61`) and focuses the close button on open, but Tab walks straight out into
  the page behind, which is neither `inert` nor `aria-hidden`. `aria-modal` alone does not
  contain focus.
- **Click-to-close is arbitrary.** `js/main.js:158-162` closes when the click target is
  `.wmodal`, the close button, `.wmodal__scroll` or `.wmodal__inner`. `.wmodal__inner` is
  the flex column *holding the content*, so clicking the empty paper beside the title closes
  the modal — but clicking the gap *between the two images* (inside `.wmodal__gallery`)
  does not. Same-looking empty space, two different outcomes. This is very likely part of
  what reads as "buggy".
- **`prev`/`next` are `hidden` when there is one work** (`js/main.js:87`) — correct, and
  worth keeping in whatever replaces them.
- **The toggle scroll-jumps.** Opening "read more" calls
  `prose.scrollIntoView({behavior:"smooth", block:"center"})` (`js/main.js:122-127`),
  which yanks the modal while the `proseIn` animation (`css/style.css:570-574`) is still
  translating the same element upward. Two motions fighting.

---

### F14 — Scroll-snap on variable-height sections · **low, but suspect**

`html { scroll-snap-type: y proximity }` with `scroll-snap-align: start` on every `.section`
(`css/style.css:77`, `:218`) plus `scroll-behavior: smooth` (`:74`) plus a JS parallax that
writes `transform` on scroll (`js/main.js:196-211`) plus a header that hides and shows on
direction change (`js/main.js:176-189`).

Sections here are 400–900px tall and *shorter than the viewport*, which is the case where
proximity snapping fights the user rather than helping. Combined with parallax transforms
that change element positions mid-scroll, this is the most likely remaining source of the
"buggy" feeling, and it is the one thing here that **could not be verified headlessly** —
it needs a real scroll on a real trackpad. Flagging as a hypothesis, not a finding.

---

### F15 — Smaller notes

- `.footer-contact__name` (`css/style.css:691-696`) sets PP Pangaia with no weight, so it
  inherits 400 and *matches up* to Medium 500. It looks right by accident. Declare it.
- `margin-bottom: 0.35rem !important` on the same rule — the only `!important` in the
  stylesheet, working around `.footer-contact p { margin: 0 }` two lines above.
- `.timeline__desc` is 435.89px wide inside a 604px column, so every row's rule runs 168px
  past its text. Defensible, but combined with F3 it is why the two list sections read loose.
- `.timeline__year` (12.48px, muted) is smaller *and* lighter than `.timeline__desc` (14px,
  soft), so the eye reads the description first and the year second. In a CV the year is the
  spine. (See D1.)
- **Fonts are 125KB `.otf` each, five faces, `font-display: swap`** (`css/style.css:12-46`).
  Three are used on first paint. Under a slow connection the fallback (Iowan Old Style /
  Georgia) is materially wider than Pangaia and the cover reflows on swap. Converting to
  `.woff2` would cut each to ~40KB with no licence change — same files, better container.
- The Impressum lacks the EU ODR / § 36 VSBG notice that commit `ddae42c` describes. Content,
  not design, but worth a look.

---

## 3. Open decisions

Each of these has two defensible answers. My recommendation and the tradeoff.

### D1 — Where else should PP Pangaia be used?

**Recommendation: the years in Biography and Exhibitions, at 1.15rem / Ultralight 200 —
and nothing else.**

I rendered this as a specimen against the current Helvetica years. It works, and for a
reason: the left column of a CV is a *list of numbers*, which is exactly the material a
high-contrast display serif is for. It turns two flat Helvetica tables into two typographic
spines, and it echoes the Artwork titles without repeating them. "Dezember 2026" holds up as
well as "December 2026", so it survives DE.

**Against:** it puts a display face at ~18px, well below its comfortable size, and Pangaia's
figures are not tabular — "2026" and "2021–2024" will not align on the decimal. In a
four-row list that is invisible; in a forty-row list it would not be.

**Argued and rejected:** Pangaia for the section labels (they are wayfinding, not voice —
they should recede, and a serif at 0.8rem uppercase will not); a Pangaia italic pull-quote in
About (the About text is one paragraph — pulling a line out of it leaves a hole, and it is
decoration with no content to justify it). The brief says restraint is the brief; I agree
with the brief here.

### D2 — Subtly differentiated section backgrounds

**Recommendation: yes — four tones, maximum 1.08:1 between neighbours, with gradient
lead-ins so no edge is ever visible.**

```
--paper-00  #f6f4f0   header, cover surround        (lightest)
--paper-01  #f3f1ec   About, Artwork                (today's base — unchanged)
--paper-02  #efebe4   Biography, Exhibitions
--paper-03  #e8e3da   footer                        (distinct register)
--paper-modal #e5e1d9 modal / any future lightbox
```

Measured, so this is checkable: adjacent steps are **1.03 / 1.05 / 1.08** — below the
threshold at which an edge reads as a line — while base→footer accumulates to **1.13**,
which does read as "a different kind of place". Every ink still clears AA on every tone
(worst case: muted on the modal ground, **4.91:1** — which also fixes F12).

The mechanism should be a **gradient lead-in, not a colour block**: each toned section
carries `linear-gradient(to bottom, <previous tone> 0, <own tone> 8rem, <own tone>)` on a
full-bleed background — the same `margin-inline: calc(50% - 50vw)` trick the cover already
uses at `css/style.css:227`, so no new technique enters the codebase. The tone arrives over
8rem of scrolling and you never see it happen. This also gives F3's dead 168px a job: it
becomes the transition into the footer instead of an accident.

**Against:** four backgrounds is four more things to keep in sync, and on a cheap panel or in
strong sunlight the steps may vanish entirely — in which case the site looks exactly as it
does today, which is the correct failure mode. The real risk is drift over time; that is what
`DESIGN-SYSTEM.md` is for.

### D3 — Does "Paula Schierholt" stay in the header?

**Recommendation: keep it in the DOM, but fade it in only after the cover leaves the
viewport.**

Removing it costs the wordmark on every scrolled screen and on both legal pages, where it is
the only branding. Keeping it as-is duplicates the name twice in one viewport in two
unrelated treatments (F8). The scroll-dependent option the brief already suggests is the
right one and is cheap: the header hide/show observer already exists at `js/main.js:176-189`
— add one `IntersectionObserver` on `.cover` and toggle `opacity` + `visibility` on
`.site-title`.

Two things must come with it: the header title should be **the same typographic idea as the
cover** (Pangaia, but small caps-ish uppercase at 0.86rem / 0.12em rather than a second,
sentence-case logo), and on the **legal pages, where there is no cover, it must be visible
from the start** — so the behaviour is scoped to `index.html`, not global.

**Against:** an element that appears from nothing is itself a motion effect, and it must be
`prefers-reduced-motion`-safe (fade only, no translate) and must never leave a keyboard user
tabbing to an invisible link. If that feels like too much machinery, the honest fallback is
to keep the header title always visible and simply restyle it to match the cover — that
alone resolves most of F8.

### D4 — Icon system direction

**Recommendation: one hand-drawn inline-SVG set — 24-unit grid, `stroke-width: 1.5`,
`fill: none`, `currentColor`, round caps and joins, three optical sizes (16 / 24 / 32), a
44×44 hit area on every control, colour change on hover (never opacity).**

This is what the three gallery sites I inspected all do (zero text glyphs between them), it
is what the V&A's published icon system does (24px screen size, defined stroke relationships,
consistent arrow angle), and it is five short `<path>` strings — no icon library, no
dependency, which the brief requires. Rendered side by side against today's Arial `× ‹ ›`,
the difference is not subtle.

The set is exactly four shapes: chevron (rotated for prev/next/down), close, and that is
genuinely it. Full spec in `DESIGN-SYSTEM.md §7`.

**Against:** inline SVG repeated in `js/main.js` and three HTML files means four copies of
each path. The alternative — one `<svg><symbol>` sprite at the top of `<body>` referenced by
`<use>` (the Serpentine pattern) — is DRYer but adds an invisible block of markup to every
page and complicates the JS-built modal. At five icons, I would take the duplication and keep
the markup readable. Worth a decision either way.

### D5 — Where do modal prev/next go?

**Recommendation: a single quiet row beneath the spec — `‹ 2 / 3 ›` — instead of two
glyphs pinned to the viewport edges.**

It fixes three things at once: the 188px disconnection from the artwork on desktop, the
overlap *on top of* the artwork at 390px, and the missing "how many works are there"
signal. It is also the convention in gallery viewing rooms.

**Against:** edge arrows are the more familiar lightbox idiom and keep the vertical space
free. If you prefer to keep them at the edges, they must at minimum move inside the
`.wmodal__inner` 64rem column and get the 44px hit area — the current position is not
defensible either way.

### D6 — Legal page column

**Recommendation: give the legal pages their own narrower centred column
(`max-width: 44rem` instead of 54rem).** The 435px measure is correct and should not change;
what is wrong is that it sits in an 864px frame. Narrowing the frame makes the ribbon look
intentional without touching a single type size.

**Against:** it makes the legal pages a different width from the rest of the site. Given they
are `noindex` documents with a different job, I think that is right, but it is a real
inconsistency and you may prefer one column width everywhere.

### D7 — Delete the dead lightbox CSS, or build the lightbox?

**Recommendation: delete it now (`css/style.css:732-786`), and if a full-screen image view is
wanted later, build it against the icon system rather than restoring 55 lines that were
written for a different design.** The `cursor: zoom-in` at `css/style.css:386` promises a
zoom that does not exist — that promise should go too.

**Against:** clicking a work image to see it full-bleed is a genuinely useful thing on an
artist site and the CSS is already written. If you want it, say so and it gets built
properly — but it should not sit in the stylesheet in the meantime pretending to exist.

---

## 4. What is fine as it is

Stated explicitly, because the brief asks for it:

- The **cover concept** — huge Ultralight uppercase name over slow video. Keep exactly.
- **`.worklist`** — 76px Pangaia titles on hairlines. The best thing on the site.
- The **`--measure: 56ch` reading width** everywhere except the modal. Correct value,
  correctly applied.
- **`.work__spec`** in Pangaia italic. A precise, well-judged use of the second face — this
  is the model for how Pangaia should earn its place elsewhere.
- The **nav / lang-switch pairing** (0.72rem, 400, 0.06em, muted, `css/style.css:164`,
  `:180`) — the one micro-label pairing that already agrees with itself. Its *tracking* needs
  to change with the rest, but its logic is right.
- The **`prefers-reduced-motion` block** (`css/style.css:791-795`) — comprehensive, correctly
  covers transitions, animations and the parallax transform.
- The **bilingual `.lang-en` / `.lang-de` mechanism** — simple, JS-free at render time,
  correct. Only `impressum.html` fails to use it.
- **`applyLang` not writing to storage on load** (`js/main.js:21-38`) — the TDDDG reasoning
  in that comment is right and rare.
- The **skip link** and the global `:focus-visible` outline (`css/style.css:103-106`).

---

## 5. Sources consulted

- [V&A Museum icon system — Hicks Design](https://hicks.design/work/victoria-and-albert-museum-icon-system)
  — 16/24/96px optical sizes, two contrasting stroke widths, consistent arrow angle, 217 base
  icons governed by one written style guide.
- [PhotoSwipe — Styling](https://photoswipe.com/styling/) — SVG-only icon model
  (`arrowPrevSVG`, `closeSVG`), `viewBox` + `aria-hidden="true"` required on every icon,
  colour driven by `--pswp-icon-color`.
- [WCAG 2.5.5 Target Size (Enhanced) — 44px](https://accessibility.build/wcag/2-5-5) and
  [WCAG 2.5.8 Target Size (Minimum)](https://testparty.ai/blog/wcag-target-size-guide) —
  24×24 is the AA floor; the target is the region accepting the pointer action including
  padding, not the painted pixels.
- Live markup inspected: [David Zwirner](https://www.davidzwirner.com/exhibitions),
  [Sprüth Magers](https://www.spruethmagers.com/),
  [Serpentine Galleries](https://www.serpentinegalleries.org/) — SVG counts and text-glyph
  counts in the table under F2 are from those fetched pages.
