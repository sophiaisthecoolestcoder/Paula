# Design system — paulaschierholt.com

The normative document for the visual design of the site. Specific enough to rebuild a
section from this file alone.

**Status: BUILT, 2026-09-08 — revised repeatedly after review in a real browser (rounds 2–10).**
Decisions (a)–(d) from `docs/design-audit.md` are approved and implemented, along with the
ranked defect list. Round 2 changed five things: label tracking, the icon stroke and glyph
sizes, the disclosure (motion, width, justification), and the Impressum. Round 3 changed four
more, all raised against the legal pages: the footer's share of a short page, section rhythm,
the legal-page rules, and the legal measure. Round 4 replaced the icon size scale with a single size, rebuilt the disclosure control and
its motion, added smooth scrolling inside the modal, and — after a second consistency
regression reached the artist — made the prose guarantee mechanical instead of a promise
(§17). Round 5 made the footer signature uppercase, put every footer value on the leading
scale, and replaced the "read more" control with the work title itself. Rounds 6–8 reworked
the legal pages, ending in a single full-width column (§2). Round 9 (2026-09-13) made the site
fit phones: a single-row header with a drop-down menu, touch-specific scrolling, a fixed footer
arrangement, and header clearance that no longer scrolls the page on focus (§7a). Round 10
(2026-09-13) gave the legal headings a visible hierarchy and added the timeline status note and
the link preview card (§2, §14a). Marked **R2**–**R10** below. `css/style.css`, `index.html`,
`impressum.html`, `datenschutz.html` and `js/main.js` match this document. Descriptions of
superseded builds were removed in R10; the reasons behind the current rules were kept.

This file and the code are updated in the same pass, never one after the other. Every rule
has a reason; a rule without a rationale gets broken later.

Changes are **not committed**. Everything is in the working tree.

---

## 0a. The governing rule: what is invariant, what flexes

Stated by the artist, and it resolves the tension that caused several rounds of churn:

> "The design should be consistent regarding font sizes, spacings, etc., but the length of the
> line doesn't apply here. The rules should be clear and defined, yes, but not rigid — we need
> flexibility. The basic things like font size, spacings, font design used for
> heading/subheading/text should remain the same, but since this section is so different from
> other text sections, we have to solve this differently."

**INVARIANT — identical in every context, no exceptions:**

- font family and the role each face plays
- font size, line-height, weight, case, tracking, colour
- the spacing scale
- the heading / subheading / body hierarchy

**CONTEXT-FLEXIBLE — may and should adapt to the content:**

- column width and measure (line length)
- layout: columns, rails, grids, how a block sits in its space

The distinction is the whole system in one line: **measure is not type.** When a context needs
to use more or less of its width, the answer is the measure or the layout — never the type
scale. Two regressions came from getting this backwards, reaching for a type-size change to
fix a width problem. The check in §17 enforces exactly this split: it compares the invariant
properties and merely *reports* the width.

## 0. What this site is

The portfolio of a Berlin artist working with the photographic image, found footage, archives
and translucent materials. It must read, to a first-time visitor, as the work of a serious
contemporary artist: **quiet, gallery-like, exact.**

Three consequences that override every other preference below:

1. **The work is the loudest thing on the page.** No interface element competes with an image
   or an artwork title.
2. **Restraint is the brief.** If a refinement makes the page busier or cleverer without
   making it clearer, it does not go in.
3. **Exactness is the whole claim.** A 2px overshoot, a rule 48px too long, two tracking
   values for one role — individually invisible, collectively the difference between
   "gallery" and "template". Nothing here is too small to specify.

**Technical constraints, held:** static HTML/CSS/JS, no build step, no framework, no npm, no
CSS preprocessor, no icon library, no webfont CDN. Nothing was added.

---

## 1. Typefaces and their roles

> **PP Pangaia speaks. Helvetica Neue labels.**
>
> Pangaia carries identity and voice — the artist's name, the titles of works, the material
> descriptions of works, the dates of her life and exhibitions. Helvetica carries everything
> that helps you get around — navigation, section labels, body copy, legal text.
>
> A visitor should be able to tell, without reading a word, which text *is* the site and
> which text is *about* the site.

### `--font-title` — PP Pangaia

| Weight | Style | File | Used for |
|---|---|---|---|
| 200 Ultralight | normal | `PPPangaia-Ultralight.otf` | cover name, work titles, modal title, legal page titles, **timeline years** |
| 200 Ultralight | italic | `PPPangaia-UltralightItalic.otf` | work specs; work-title hover |
| 500 Medium | normal | `PPPangaia-Medium.otf` | header wordmark, footer signature |

Medium Italic and Bold were declared but never used; their files and `@font-face` rules were
removed in R10.

**Rule: never declare a Pangaia weight that is not in that list.** CSS weight matching
substitutes silently — `300` walks *down* to 200 and `400` walks *up* to 500 — so a typo
renders a face nobody chose and reports no error. Two live instances of this were fixed:
`h1.section__title` and `.footer-contact__name`.

**Rule: Pangaia is never used at label sizes.** It is a display face; its thin strokes disappear
and its high contrast turns to noise when small. The one role below 1rem is the work spec
(`body/spec`), set at body size so that it matches the About text, as the artist asked. Every
other Pangaia role is 1.15rem or larger.

**Fallback:** `"Iowan Old Style", Georgia, "Times New Roman", serif` — materially wider than
Pangaia, so any Pangaia element must survive a ~15% width increase without clipping.

### `--font` — Helvetica Neue stack

`"Helvetica Neue", Helvetica, Arial, "Segoe UI", Roboto, sans-serif`

**Rule: only weights 400 and 500.** Helvetica Neue has Light (300) on macOS and nowhere else,
so declaring 300 renders one weight on Mac and another everywhere else. 600 maps to Bold and
is heavier than anything here should be.

**Rule: `button { font: inherit }` is global and mandatory.** Buttons do not inherit the
document font — they fall back to the UA default, which is Arial. That was the mechanical
cause of the old modal glyph controls looking foreign. Verified: `.wmodal__close` now
computes to `"Helvetica Neue"`.

---

## 2. Type scale

Sizes in `rem` against a 16px root. Every clamp given in full.

### Display — PP Pangaia

| Token | Size | Weight | LH | Tracking | Case | Colour | Used by |
|---|---|---|---|---|---|---|---|
| `display/cover` | `clamp(2.5rem, 10.5vw, 8rem)` | 200 | 1.02 | 0.05em | UPPER | `--ink` | `.cover__name` |
| `display/work` | `clamp(2.1rem, 6.5vw, 4.75rem)` | 200 | 1.08 | 0.06em | UPPER | `--ink` | `.worklist__title` |
| `display/page` | `clamp(2rem, 4.5vw, 3.25rem)` | 200 | **1.10** | 0.01em | Sentence | `--ink` | `h1.section__title` (legal pages) |
| `display/modal` | `clamp(1.5rem, 3vw, 2.25rem)` | 200 | 1.15 | 0.06em | UPPER | `--ink` | `.wmodal__title` |

**Line-height is declared on every one.** `body` sets 1.6 and it inherits; a 44px title in a
70px box floats loose and detaches from what follows, which is what both legal pages did.
Display type is set near-solid: 1.02–1.15.

**Why `10.5vw` on the cover, not `11vw`.** At 390px the old value filled the column edge to
edge with no air. Both clamp to 8rem well before 1440px, so the desktop result is unchanged.
Measured: the name now fits inside the gutters at every width from 390 to 1440, in EN and DE.

### Identity — PP Pangaia

| Token | Size | Weight | LH | Tracking | Case | Colour | Used by |
|---|---|---|---|---|---|---|---|
| `brand/header` | `clamp(0.86rem, 0.8rem + 0.3vw, 1rem)` | 500 | 1.2 | **0.08em** (`--track-brand`) | UPPER | `--ink` | `.site-title` |
| `brand/footer` | `1.15rem` | 500 | `--leading-tight` | **0.08em** (`--track-brand`) | **UPPER** | `--ink` | `.footer-contact__name` |

**Why the wordmark is uppercase and tracked.** It used to be sentence-case Medium directly
above an uppercase Ultralight cover of the same six syllables — one name, two logos. Uppercase
and tracked, it reads as a *quiet echo* of the cover rather than a competing treatment.

**The copyright line is NOT uppercase — R8.** It sits below the footer rule and reads
"© 2026 Paula Schierholt" in sentence case at `--text-small`. The three **wordmark**
placements — cover, header, footer signature — are uppercase because they are the artist's
name used as *identity*. The copyright line is a legal notice that happens to contain the
name; a different category, so it takes plain small text. Do not conflate the two.

**The footer signature is uppercase, like the wordmark — R5.** An earlier build set it in
sentence case and defended it as "a signature, not a masthead". That was a distinction the
page does not make: the name appears three times — cover, header, footer — and it looked like
two different names. It now takes the same treatment as the header wordmark, PP Pangaia Medium
uppercase at `--track-brand`.

### Content — Helvetica Neue

| Token | Size | Weight | LH | Tracking | Colour | Used by |
|---|---|---|---|---|---|---|
| `body/base` | `0.875rem` (`--prose-size`) | 400 | 1.6 (`--prose-leading`) | normal | `--ink-soft` (`--prose-ink`) | `.prose` (About text, modal prose, legal pages), `.timeline__desc` |
| `body/small` | `0.78rem` (`--text-small`) | 400 | 1.45 (`--leading-snug`) | normal | `--ink-muted` | footer contact, footer links, copyright line |
| `body/spec` | `0.875rem` (`--text`) | 200 *italic* | 1.5 | 0.05em | `--ink-soft` | `.wmodal__spec` — **PP Pangaia** |

`body` itself sets `clamp(0.875rem, 0.84rem + 0.12vw, 0.95rem)` at 1.6 in `--ink`: the document
default for anything without a role of its own.

`body/spec` is the one deliberate Pangaia intrusion into content, and it is the model for how
the second face earns its place: it describes *the physical work*, which is the artist's
voice, not the site's chrome.

### Dates — PP Pangaia *(decision (a), built)*

| Token | Size | Weight | LH | Tracking | Colour | Used by |
|---|---|---|---|---|---|---|
| `date/timeline` | `1.15rem` | 200 | 1.35 | 0.01em | `--ink` | `.timeline__year` |

Column width `10.5rem`, `font-variant-numeric: tabular-nums`, collapsing to a single column
below 40rem.

**Status note — R10.** A date can carry a one-word status beneath it, "Upcoming" / "Demnächst",
as `.timeline__note`: `label/sm`, `display: block`, `--space-1` below the date. It sits in the
date column, so the date keeps the row's first baseline and the description is untouched.
Remove it once the event has happened.

**Titles in the timeline are quoted — R10.** Exhibition and project titles take “…” in English
and „…“ in German. Names of institutions, places and events are not quoted.

**Why.** A CV's left column is a list of numbers, which is exactly the material a
high-contrast display serif is for. It turns two flat Helvetica tables into typographic
spines and echoes the Artwork titles without repeating them. It also inverts the old reading
order: the year used to be *smaller and lighter* (12.48px muted) than its own description
(14px soft), so the eye read the description first. In a CV the date is the spine.

**Where Pangaia was considered and rejected:** section labels (they are wayfinding and should
recede; a serif at 0.8rem uppercase will not), and an italic pull-quote in About (the About
text is a single paragraph — pulling a line out leaves a hole, and it is decoration with no
content to justify it).

### Labels — Helvetica Neue

**One style, two sizes.** This replaced five near-miss specifications — two sizes, three
weights, four tracking values, two colours.

| Token | Size | Weight | LH | Tracking | Case | Colour | Used by |
|---|---|---|---|---|---|---|---|
| `label/md` | `0.8rem` | 400 | 1.5 | **0.06em** (`--track-label`) | UPPER | `--ink-soft` | `.section__title` |
| `label/sm` | `0.72rem` | 400 | 1.5 | **0.06em** (`--track-label`) | UPPER | `--ink-muted` | `.site-nav a`, `.lang-switch`, `.footer-nav__title`, `.timeline__note` (R10); `.wmodal__count` takes the size, tracking and colour for its numerals |

**Why 0.06em — R2.** The first build unified these at 0.12em, which was too open: seen in a
real browser the artist asked for the header specifically to be tighter and more elegant.
0.12em was also a large increase over what the live site used (0.06em on the nav and language
switch, 0.08em on the section labels), applied to every label at once.

0.06em is now the single value. It matches the tracking the live site already used on the
header nav — the setting the artist was comparing against and liked — and tightens the
section labels by one step. The wordmark sits one step more open at 0.08em, because it is
uppercase Pangaia at a smaller optical size than the cover and closes up faster than
Helvetica does.

Both live in tokens (`--track-label`, `--track-brand`) because this is the most subjective
judgement in the system and the one most likely to be revisited: it is a two-line change, not
a hunt through eight rules.

Cover (`0.05em`) and work titles (`0.06em`) are unchanged from the live site and were not
part of the complaint.

**Why one weight.** 300 renders Light on macOS and 400 elsewhere; 500 is what made
`.footer-nav__title` read as a heading rather than a label.

**Why hierarchy is size and colour, not weight or tracking.** `label/md` is one step larger
and one step darker than `label/sm`. That is enough to say "this is a section, that is a
link" without a third specification.

### Legal document headings — Helvetica Neue

| Token | Size | Weight | LH | Space above | Colour | Extra |
|---|---|---|---|---|---|---|
| `legal/h2` | `1.25rem` (`--step-3`) | 500 | 1.35 | `--space-8` between sections | `--ink` | opens each `.legal__section`; `--space-4` beneath; no rule |
| `legal/h3` | `1rem` (`--step-2`) | 500 | 1.4 | `--space-7` | `--ink` | `--space-5` when it directly follows an h2 |
| `legal/h4` | `0.875rem` (`--step-1`) | 500 | 1.4 | `--space-6` | `--ink` | `--space-5` when it directly follows an h3 |
| `legal/caps` | prose size | 400 | prose leading | — | prose ink | **0.06em tracking**, left-aligned, not hyphenated |

**R10 — the hierarchy is visible again.** Before R10 the h2 and the h3 were both 1.25rem at
weight 500, so a section heading and the subsection under it looked the same. The `--step-*`
tokens now carry exactly this table.

**One clean descent — 1.25 / 1 / 0.875rem, all at weight 500.** It replaced 16.32 / 14.72 /
14.00px in which h4 was set at weight **600** and therefore outweighed its own parent h3 at
500: the child heading looked more important than the section containing it. Level four is
now separated from body copy by weight and colour, since there is no size left below body.

> A note on a rejected refinement: an earlier draft set `legal/h4` as a tracked uppercase
> micro-label, reusing `label/sm`. It reads well for short labels — but these h4s are full
> questions of up to 90 characters, and uppercase at that length is hard work. Rendered and
> reverted. Case is a good subordination device only when the string is short.

### The legal layout — R8

**One column, using the full content width.** The artist was offered the choice and took it
explicitly: "widen the column and accept longer lines… the full text in each line should use
more space of the width from left to right side."

```css
.legal__body { --measure: none; }     /* prose fills the content column */
```

Measured on `datenschutz.html` at 1440: prose **768px**, left edge 336 — the same axis as the
page title, the headings and the footer rule, and the same axis the index page's sections use.
**91 characters per line in German.** That is long by the usual guidance; line length is
context-flexible per §0a and was released deliberately here. Type is untouched: 14px, 1.6
leading, identical to the About text and the modal.

`.legal__section` remains as the grouping hook that carries the rhythm between sections.

### Page titles are never capped at the measure — R6

`.section--legal .section__head` and the `<h1>` take the full column and are set
`hyphens: manual`. Capping the head at the prose measure is what broke
**"Datenschutzerklärung"** across two lines — the word is longer than the prose column was.
The soft hyphen inside that word in the markup was removed too, since `hyphens: manual` still
honours an explicit `&shy;`. Verified on one line at 1440, 768 and 390. (`text-wrap: balance`
is only on `.cover__name` and plays no part here.)

### The Art. 21 caps blocks

**Why `legal/caps` gets 0.06em.** The Art. 21 objection blocks are legally required in caps
and run to ~280px of solid uppercase. At the old 0.01em that is close to unreadable. 0.06em
matches the label tracking — enough to open it up, not so much that a paragraph falls apart.

---

## 3. Colour

### Ink

| Token | Value | Role | on `--paper-01` | on `--paper-02` | on `--paper-03` | on `--paper-modal` |
|---|---|---|---|---|---|---|
| `--ink` | `#1a1714` | titles, dates, hover state of every control | **15.81** | 15.02 | 13.97 | 13.69 |
| `--ink-soft` | `#4f4a44` | body copy, section labels | **7.77** | 7.38 | 6.86 | 6.72 |
| `--ink-muted` | `#645e56` | nav, micro-labels, controls at rest | **5.68** | 5.39 | 5.01 | **4.91** |
| `--line` | `rgba(26,23,20,0.16)` | hairlines only | 1.39 | 1.39 | 1.39 | 1.39 |

All measured in the browser against the actual rendered ground, not assumed. Full audit in §13.

**Why `--ink-muted` moved from `#6e6860` to `#645e56`.** The old value measured 4.88:1 on
paper — AA with 0.38 to spare, which meant it failed on *any* ground darker than paper. It
already did: the "read more" toggle inside the modal measured **4.10:1**. The new value clears
4.5:1 on every ground in this system, including the modal, with headroom for the tone steps
in §6. On paper the difference is imperceptible; the difference in robustness is the point.

**Why `--line` moved from `0.13` to `0.16` alpha.** Rules no longer do structural work (§5)
so there are fewer of them, and the ones that remain must be visible. 1.39:1 is still firmly
decorative.

**Rule: `--line` is never used for text or for an icon.** It is 1.39:1. It draws a hairline
and nothing else. (`.lang-switch__sep` previously used it for the "/" character, which was
effectively invisible; it now uses `--ink-muted` at 0.45 opacity.)

**Rule: every new ink/ground pairing is measured before it ships.** The failure mode is always
the same — a colour chosen against paper, then used on something darker.

### Cover

The one place the palette is not in control, because a video sits behind the type.

- **The scrim warms the video rather than merely lightening it.** `rgba(246,244,240,0.52)`.
  The old `rgba(243,241,236,0.42)` composited to a *cool* `#b7baba` butted directly against a
  warm paper header — the first thing a visitor saw was a seam between a warm strip and a cold
  field, on a site whose whole claim is warm archival paper.
- **The fallback ground passes AA on its own.** `.cover__bg` is `--paper-02` (15.02:1 under
  the black title). It was `#6b7379`, on which the title measured **3.7:1** — reachable
  whenever the poster failed, and under `prefers-reduced-motion` or `saveData` the video
  source is removed entirely, leaving only the poster between the title and that grey.

---

## 4. Spacing and rhythm

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | `0.25rem` | a status label under a date (`.timeline__note`, R10) |
| `--space-2` | `0.5rem` | tight stacks, spec lines |
| `--space-3` | `0.75rem` | list row padding |
| `--space-4` | `1rem` | paragraph spacing |
| `--space-5` | `1.5rem` | label to content |
| `--space-6` | `2.25rem` | inside a section head |
| `--space-7` | `3.5rem` | between blocks within a section |
| `--space-8` | `5.5rem` | footer lead-in |
| `--space-9` | `8rem` | tone-transition length |

### The leading scale — R5

Text blocks and labels take one of four line-heights, as tokens. Display type sets its own
near-solid value (§2), and the legal h3 and h4 sit at 1.4.

| Token | Value | Used by |
|---|---|---|
| `--leading-tight` | 1.35 | display type, timeline years, the footer signature |
| `--leading-snug` | 1.45 | address blocks — not running prose |
| `--leading-label` | 1.5 | uppercase micro-labels |
| `--prose-leading` | 1.6 | body copy (§ the prose rule) |

The footer contact block was at **1.85**, a value that appears nowhere else on the site, which
is why its line spacing visibly did not belong to the page. It is an `<address>`, so it now
takes `--leading-snug`, the same as the legal pages' address block.

| Layout token | Value | Note |
|---|---|---|
| `--measure` | `56ch` | reading width — About text, timeline, modal caption; released on the legal pages (§2) and replaced by the gallery width for modal prose (§16a) |
| `--max-width` | `54rem` | the one content column, on every page |
| `--gutter` | `clamp(1.25rem, 4vw, 3rem)` | |
| `--section-gap` | `clamp(2.5rem, 5vw, 4.5rem)` | **R3** — the gap you actually see between sections |
| `--pad-x` | `max(--gutter, (100% - --max-width)/2 + --gutter)` | sections, footer |
| `--pad-x-header` | `max(--gutter, (100% - --max-width)/2)` | header only — see §7 |
| `--header-h` | `2.7rem` / `2.75rem` below 60rem (**R9**, one row) | **measured**, not estimated |

**Why `100%` and not `100vw` in the padding formulas.** `100vw` includes the scrollbar, so a
full-bleed band built on it is half a scrollbar too wide and shifted. `100%` resolves against
the containing block and is exact. `.site-main` is now full-width and each band sets its own
padding, which also removed the `calc(50% - 50vw)` full-bleed trick the cover used.

**Why `--header-h` is measured.** The cover and the header clearance both derive from it. The
old hard-coded `3.75rem` against a real 62.05px header left a 2px sliver of the next section
permanently below the fold, and `scroll-padding-top: 4.5rem` (72px) against a 143px mobile
header dropped every anchor target *behind* the header. Verified: cover + header now sums to
897–900px in a 900px viewport at every width tested, and the clearance is
`--header-h + --space-4` at both breakpoints. **R9:** the clearance is now a `scroll-margin-top`
on what gets scrolled to, no longer `scroll-padding-top` on `<html>` — see §7a.

### Section rhythm is one number — R3

> **`--section-gap` is the gap between two sections. It is delivered as half from each side.**

```css
.section { padding-block: calc(var(--section-gap) / 2); }
```

The previous build set `--section-gap` as the padding on *each* side, which silently doubled
it: a 72px token produced a 144px gap. That was not a decision, it was an oversight, and it
is why the spacing read as arbitrary — it was. Now the token is the number on screen: **72px
between sections at 1440, 40px at 390**, and the same rule governs the legal pages. The one
addition is beneath the last section, which takes `--space-7`, so the eye settles before the
ground changes register into the footer.

**Consequence to watch:** tightening the rhythm exposed the scroll parallax. Uncapped, an
element far from the viewport centre drifts 70–100px out of its own box, and the About
portrait slid down over the ARTWORK label. The parallax travel is now capped at **±24px** in
`js/main.js` — under the 36px label gap above it and the 72px section gap below it, so the
effect stays visible and can never collide. Any future reduction in `--section-gap` has to be
checked against that cap.

### Justification and hyphenation — R2

> **Body prose is justified, with `hyphens: auto`, and never without it.**

This reverses the first build, which set everything ragged-right. The artist asked for
justified setting (Blocksatz) as the general rule and reaffirmed it. The original objection —
that justification produces rivers and gaping word-spaces, badly so in German — was only half
right: it is justification *without hyphenation* that does that. So the two ship together, and
the pairing is a rule rather than a preference.

Hyphenation has a hard dependency that fails silently: **it does nothing without a real `lang`
attribute in scope.** The `.lang-en` / `.lang-de` classes are CSS hooks and carry no language
information, so every prose block now also carries `lang="en"` / `lang="de"` on its language
wrapper. Verified working: a German test string in a 70px box wraps to 114px tall with
`hyphens: auto` and overflows to 183px with `hyphens: manual`.

Justification applies to **running prose only** — never to labels, dates, nav, the timeline,
address blocks, legal headings, or the all-caps Art. 21 paragraphs, each of which resets to
`text-align: left; hyphens: manual`.

One shared class, `.prose`, carries font, size, weight, line-height, colour, paragraph
spacing, alignment and hyphenation for the About text, the artwork modal and the legal pages,
so the three cannot drift apart. Verified: every one of those eight computed properties is
identical between About and the modal prose.

### Section rhythm

```
[ section top ]
  --section-gap                ← space and tone, never a rule
  section label (label/md)
  --space-6
  section content
  --section-gap
[ next section ]
```

The last section uses `--space-7` at its foot and hands over to the footer, whose `--space-8`
lead-in completes the tonal transition — so the space before the footer is doing visible work
instead of being 168px of blank paper.

**Rule: no two horizontal rules within `--space-7` (3.5rem) of each other.** Verified: the
Biography and Exhibitions lists are 199px apart at 1440px, 178px at 1024px, 143px at 390px.

---

## 5. Rules (hairlines)

> **A rule belongs to a list. A rule never belongs to a section.**

- A list (`.worklist`, `.timeline`) draws a rule **above every row including the first, and
  below the last**, so it is a closed object with a visible top and bottom.
- A `.section` draws **no** border. Sections are separated by space and by tone (§6).
- The legal pages carry no rules at all (§2). The footer's one rule sets off the copyright line.
- Rules span the **content column** — the same left and right edges as the text above them.

**Why.** Section borders and list borders both existed, did the same job, and ended up 88px
apart: between Biography and Exhibitions three identical hairlines appeared within ~230px,
the middle one belonging to nothing. Giving rules exactly one owner makes that structurally
impossible rather than a thing to remember.

**Verified:** at 1440px every rule on the page — section content, timeline, worklist and both
footer rules — now runs 336 → 1104. The footer's used to run 288 → 1152, overhanging every
other rule by 48px on each side.

---

## 6. Section and footer backgrounds *(decision (b), built)*

A tonal drift down the page. **Not stacked colour blocks** — no edge is ever visible; the
change is only apparent if you scroll back up.

| Token | Value | Applied to | Δ from previous |
|---|---|---|---|
| `--paper-00` | `#f6f4f0` | header (at 88% over the page) | — |
| `--paper-01` | `#f3f1ec` | `html`, `body`, About, Artwork | 1.03:1 |
| `--paper-02` | `#efebe4` | Biography, Exhibitions, cover fallback | 1.05:1 |
| `--paper-03` | `#e8e3da` | footer | 1.08:1 |
| `--paper-modal` | `#e5e1d9` | artwork modal | — |

Cumulative `--paper-01` → `--paper-03` = **1.13:1**.

**Why these numbers.** Below roughly 1.10:1 a boundary between two large fields does not
resolve as an edge — you perceive the areas as different but cannot locate the transition.
Each adjacent step here is 1.03–1.08. The accumulated difference between content and footer is
1.13, which does register as "a different kind of place". That is the brief: tonal drift, with
the footer in a distinct register.

**Mechanism** — a gradient lead-in on the section itself, not a solid:

```css
.section--biography {
  background-image: linear-gradient(
    to bottom,
    var(--paper-01) 0,
    var(--paper-02) var(--space-9),   /* 8rem = the transition */
    var(--paper-02) 100%
  );
}
.section--exhibitions { background-color: var(--paper-02); }
.site-footer {
  background-image: linear-gradient(
    to bottom, var(--paper-02) 0, var(--paper-03) var(--space-8), var(--paper-03) 100%);
}
```

**Why a gradient and not a solid.** A solid produces a hard horizontal line at every section
boundary — precisely the stacked colour blocks the brief rejects. Over 128px of scrolling a
1.05:1 change is imperceptible per frame and invisible as an edge.

**Why anchored to each section's own top.** A single page-length gradient would need
percentage stops, which shift when the German copy runs longer. Anchoring to the section start
makes it independent of language and content length.

**The footer is placed by a sticky-footer layout, not by a background paint — R3.**

```css
body { display: flex; flex-direction: column; min-height: 100svh; }
.site-main { flex: 1 0 auto; }
```

An earlier build painted `html` with `--paper-03` so that a short page would not show base
paper under the footer. That cure was worse than the disease: on the Impressum the document
is exactly one viewport tall, so 64px of leftover height below the footer was painted in the
footer's own tone and read as *more footer* — about 442px of a 900px screen. The artist's
report, "the footer takes up half of the space of the site", was accurate.

Now the main column absorbs the leftover height, the footer sits at the bottom at its own
intrinsic height, and the space above it is base paper. `html` is painted `--paper-01`, which
now only shows during overscroll.

Measured, footer height: **294px at 1440 and 370px at 390 — identical on `index.html`,
`impressum.html` and `datenschutz.html`.** It was 378px before; the padding and internal rule
margins came down one step each so that a footer reads as a footer. On the shortest page it is
now 33% of the viewport rather than 49%.

**Degradation.** On a low-quality panel or in bright sunlight the steps may vanish and the
site looks exactly as it did before — a uniform warm paper. That is the correct failure mode
and the reason the steps are safe to make this subtle.

---

## 7. Header

Layout is `1fr auto 1fr` — wordmark, nav, language switch.

**The wordmark is revealed once the cover has left the view** *(decision (c), built)*. On
`index.html` only; the legal pages have no cover and keep it visible from the start. Driven by
an `IntersectionObserver` on `.cover` (hidden while `intersectionRatio > 0.25`).

```css
.site-title--hidden { opacity: 0; visibility: hidden; pointer-events: none; }
```

> **Rule: the wordmark is hidden with `opacity` + `visibility` only. Never `display:none`,
> `hidden`, or anything else that collapses the grid column.** The nav sits in the centre
> column of a three-column grid; if the first column collapses, the nav slides sideways when
> the name appears. `visibility: hidden` also removes it from the tab order and the
> accessibility tree, and JS additionally sets `tabindex="-1"` and `aria-hidden="true"` so
> the intent survives a future change of mechanism. The fade is `opacity 0.35s` and is
> cancelled by the `prefers-reduced-motion` block, leaving an instant swap.

**Verified — nav centring, the thing this constraint exists to protect:**

| Viewport | Nav centre, wordmark shown | Nav centre, wordmark hidden | Viewport centre |
|---|---|---|---|
| 1440 | 720 | 720 | 720 |
| 1200 | 600 | 600 | 600 |
| 1024 | 512 | 512 | 512 |
| 961 | 480.5 | 480.5 | 480.5 |

Identical in EN and DE, in both states, at every width. Delta 0.

**Why the header band is one gutter wider than the content column** (`--pad-x-header`). With
`1fr auto 1fr`, the nav is centred on the viewport only while the two outer columns stay
equal, which requires them to be wider than the wordmark's min-content **in German**. At the
content-column width they are not — measured, the German header needs 678px against 608px
available — and the nav drifts ~25px right of centre. The band is therefore 864px at 1440px
while section content is 768px, so the wordmark sits one gutter outside the content column.
That is the deliberate trade: **a viewport-centred nav beats aligning the wordmark to the
column**, because an off-centre nav is what a visitor actually notices. Do not narrow this
band without re-measuring all four states.

The centring table applies from 60rem up. Below it the nav lives in the drop-down (§7a).

---

## 7a. Phones and touch — R9

Reported by the artist on a phone: the header sat "strangely on two lines" and scrolling was
choppy. Measured on an emulated iPhone (390 × 844) before the change: header 92px on two rows,
the same at 768px; the cover video re-downloading mid-scroll; scroll snapping and parallax
active on touch.

### Header: one row, the menu in the top-right corner

Below **60rem** — the same breakpoint as before, where the single-row nav stops fitting in
German — the bar is `wordmark · EN / DE · menu`, and the five nav links move into a drop-down.

| | Value |
|---|---|
| Bar | one row, **44px** (`--header-h: 2.75rem`) — phone and tablet, EN and DE |
| Toggle | `.control.nav-toggle`; its 44 × 44 hit area reaches into the header padding (`margin-block: -0.75rem`) and its glyph sits flush with the gutter (`margin-inline-end: -13px`) |
| Glyph | `menu` (two strokes) ↔ `close`, 18px, 1.25px stroke — the §8 family |
| Panel | full width, `--paper-00`, hanging from the bar; the links keep the **nav label spec** (0.72rem, 0.06em, uppercase, `--ink-muted`, the current section in `--ink`) |
| Rows | 3rem (48px); a hairline above every row and below the last — a list owns its rules (§5) |
| Page behind | a paper veil, `--paper-01` at 72% — the same idea as the light filter over the cover video; no shadow, no dark scrim |
| Motion | opacity 0.2s, as the modal; nothing translates |
| EN / DE | stay in the bar; below 60rem each target is widened with padding and an equal negative margin (≈33 × 44px), so the type does not move |

**Behaviour.** A disclosure, not a dialog: `aria-expanded` and `aria-controls` on the toggle,
focus stays on it, and the page stays live. It closes on the toggle, on choosing a link, on
Escape (focus returns to the toggle), on a tap outside, and when focus leaves the header.
**A tap outside only dismisses:** it is decided on `pointerdown` and its click is swallowed, so
it can never also open an artwork or follow a link that sat under the veil. (Deciding on
`click` does not work — the tap has already moved focus out of the header, which closed the
menu, so the click went through. Found in testing.) While the menu is open the header does not
hide on scroll, since the panel hangs below the bar and would be stranded.

**Without JavaScript** the toggle is not shown and the links wrap onto a second row, so they
stay reachable. `html.js` is set by a one-line script in `<head>`, before the stylesheet, so a
phone never paints the fallback header first.

**Why EN / DE stay in the bar** rather than moving into the menu: the language is the other
global choice on a bilingual site and should not be two taps away. Moving it into the panel is
a small change if the bar should be quieter still.

### Touch scrolling

Applied under `(hover: none) and (pointer: coarse)` — phones and tablets. Desktop keeps snap,
parallax and the italic hover exactly as before.

| Change | Why |
|---|---|
| `scroll-snap-type: none` | proximity snapping caught the end of a flick on sections shorter than the screen |
| parallax skipped (`js/main.js`) | a phone scrolls on the compositor; a transform written from a scroll event lands a frame late and judders |
| header hide/show ignores reversals under **8px** and overscroll bounce (all devices) | momentum and rubber-banding produced 1–3px reversals that made the header flicker |
| cover video re-picked only on a change of **width or orientation** (all devices) | the address bar collapsing changes only the height, which swapped 1280 ↔ 1920 and reloaded the video mid-scroll — measured at 430 × 740 → 430 × 830 |
| cover video **paused while off screen** (all devices) | a looping decode behind the rest of the page cost every scroll frame |
| `overscroll-behavior: contain` on the modal (all devices) | a scroll reaching the end of the modal carried on into the page beneath |
| work-title italic only under `(hover: hover)` | on touch `:hover` stuck after the tap, and the title stayed italic once the modal closed |

### Header clearance is scroll-margin, not scroll-padding

`scroll-padding-top` on `<html>` also applied to the header's *own* controls. Chrome took EN,
DE and the menu links to be under the header and scrolled the page whenever one received
keyboard focus: measured **−430px** on a phone, **−411px** at 1440 locally and **−518px on the
live site**, so the fault predates R9. With the padding at 0 the jump was 0. The same clearance
(`--header-h + --space-4`) is now a `scroll-margin-top` on what is scrolled *to* — the cover,
every `[id]` (the sections are anchors and snap points), and everything focusable in `main` and
the footer. The header is left out by construction.

### Footer on phones

Below **40rem** the footer columns are a fixed grid: contact across the top, *Pages* and
*Legal* side by side beneath it. `flex-wrap` used to leave *Legal* alone on a third row, at a
point that depended on the language.

---

## 8. Icons and controls *(decision (d), built)*

One family. The site previously had three unrelated idioms — Arial text glyphs in the modal, a
CSS border-and-rotate square on the disclosure toggle, and a real SVG on the cover.

### Construction

- **Grid:** 24 × 24 `viewBox`, always, at every optical size.
- **Stroke:** `stroke: currentColor; fill: none; stroke-width: 1.25; stroke-linecap: round;
  stroke-linejoin: round; vector-effect: non-scaling-stroke;`
- **Never** `fill`, never a text character, never an icon font, never a CSS border shape.
- `aria-hidden="true"` and `focusable="false"` on every `<svg>`; the accessible name lives on
  the button, **in both languages**, via a `.vh` span.

### Optical sizes

> **ONE SIZE. There is no optical size scale. — R4**
>
> Every arrow and control glyph on the site renders at **18 × 18 px**.

| Control | Rendered glyph |
|---|---|
| modal prev | **18 × 18** |
| modal next | **18 × 18** |
| modal close | **18 × 18** |
| cover scroll hint | **18 × 18** |
| header menu toggle — R9 | **18 × 18** |

(The disclosure chevron was removed entirely in R5 — see §9. The five that remain are all the
same size, which is checkable at a glance in
`docs/screenshots/13-arrow-family-detail.png` — taken before the R9 menu glyph existed.)

Two earlier builds got this wrong in the same way, and it is worth naming why. The first
defined "16 / 24 / 32 optical sizes"; the second narrowed it to 14 / 18 / 20. Both were still
*scales*, and a scale is exactly what the eye reads as inconsistent — in the artwork modal a
20px prev/next sat directly beside a 14px disclosure chevron, 43% apart, and the artist saw it
immediately. An optical scale is a reasonable idea in a large icon set used at very different
distances. This site has five shapes in five places at one distance; it does not need one.

The size is written in exactly **two** places: `ICON_SIZE` in `js/main.js`, and the
`width`/`height` on the cover chevron in `index.html`. Changing it means changing both.

**Rule: the rendered stroke is 1.25 CSS px at every size, enforced with
`vector-effect: non-scaling-stroke`. — R2**

This is the correction to the first build, and it is worth stating plainly because the rule
looked right and was wrong. `stroke-width` is measured in the viewBox's **user units**, so it
scales with the icon: "stroke 1.5 at every size" against a 24-unit viewBox rendered anywhere
from 1.00px to 2.00px, and the large modal arrows read as heavy and dominant — which is exactly
what the artist reported. `non-scaling-stroke` pins the stroke to the viewport coordinate
system, so it is 1.25px whatever the glyph size; with R4's single 18px size the glyph box is
constant too.

### The complete set — five paths

```
prev   M15 5l-7 7 7 7
next   M9 5l7 7-7 7
down   M5 9l7 7 7-7        (cover scroll hint)
close  M6 6l12 12M18 6L6 18
menu   M5 8.5h14M5 15.5h14 (R9 — header toggle below 60rem; swaps to close when open)
```

Five shapes is the whole system. `menu` is two strokes rather than three: the same 14-unit
width as the chevrons, and quieter. Defined once in `js/main.js` as `ICON`, and inline in
`index.html` for the cover hint. Duplicated paths were preferred over a `<symbol>` sprite at
this count, for readable markup.

**Precedent.** This is the construction serious gallery sites use. Live markup inspected:
David Zwirner (8 inline SVG, `fill="currentColor"`, `role="img"`), Sprüth Magers (17 inline
SVG; its chevron is a stroked polyline on a 20-unit grid with `fill="none"`), Serpentine
Galleries (26 inline SVG via `<use>`). **Zero text-glyph controls between the three of them.**
The V&A's published icon system works the same way at 16/24/96px optical sizes with governed
stroke relationships.

### Hit area

> **Every interactive control has a minimum 44 × 44px hit area, at every breakpoint.**

```css
.control {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 44px; min-height: 44px;
  appearance: none; background: none; border: 0; padding: 0;
  cursor: pointer; font: inherit;
  color: var(--ink-muted); transition: color 0.18s ease;
}
```

WCAG 2.5.8 (AA) sets the floor at 24×24 and 2.5.5 (AAA) at 44×44; the target is the region
that accepts the pointer, padding included, not the painted pixels. Verified: close, prev and
next are all **44 × 44** (they were 31 × 42 and 42 × 56), and so is the menu toggle (R9).

### States

| State | Treatment |
|---|---|
| rest | `color: var(--ink-muted)` |
| hover | `color: var(--ink)` |
| focus-visible | `outline: 2px solid var(--ink); outline-offset: 3px` (global) |
| active | `color: var(--ink)`, no transform |
| not applicable | element is `hidden`, never a faded control |

**Rule: never express a control's rest state with `opacity`.** The old prev/next sat at
`opacity: 0.5`, which makes a 1.5px stroke on a light ground look faded and broken and drops
it below the 3:1 non-text minimum. Colour is the axis.

### Placement

**Controls are positioned against the content, never against the viewport.** Modal prev/next
are a single row beneath the spec — `‹ 2 / 3 ›` — replacing two glyphs pinned to the viewport
edges, which sat 188px from the artwork on desktop and *on top of it* at 390px. The row also
supplies the "how many works are there" signal the modal previously lacked.

---

## 9. Links, focus, hover

| Context | Rest | Hover / focus-visible |
|---|---|---|
| Nav, footer nav | `--ink-muted`, no underline | `--ink`, no underline |
| Inline link in running text (legal) | `--ink`, underlined, offset `0.18em`, 1px | `--ink`, thickness 2px |
| Email / Instagram in footer | `--ink-muted`, no underline | `--ink`, underline appears |

**Why nav links never underline and inline links always do.** A nav is a list of destinations
in a fixed place — position and case already say "link", and underlines in a tracked uppercase
row read as noise. An inline link inside a paragraph has no such context and must be
identifiable without colour. The old global `a:hover { text-decoration: underline }` applied
to everything and was then switched off again in four places; it is gone.

**Focus:** `:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px }`, unchanged
and applying to every interactive element including the skip link. **`outline: none` never
appears in this stylesheet.**

### The artwork title is the disclosure — R5

Inside the modal, a work that has a description makes its **title** the control that reveals
it. The separate "read more / Mehr lesen" line is gone. The title is a real `<button>` inside
the `<h3>`, carrying `aria-expanded` and `aria-controls`, keyboard operable, and it inherits
the title's typography exactly.

**Discoverability was the risk and it is handled explicitly.** A hover underline tells mouse
users only — nothing on touch, nothing at rest, nothing at first glance. So the title carries
a **hairline underline at rest**, drawn in `--line` at 1px with a 0.22em offset. It reads as a
quiet affordance rather than as a link, and firms up to the ink colour on hover.
`:focus-visible` keeps the global outline, so the two states stay distinguishable.

> This is the one open judgement in the interaction. The rest-state underline is what makes it
> discoverable without a mouse; if it reads as too link-like under a large Ultralight title,
> the fallback is to restore a small text cue beneath the spec. Worth the artist's eye.

**Coherence with the index page.** Both places have a large Pangaia title that responds to
click, so they must not read as the same control:

| | index `.worklist__title` | modal `.wmodal__toggle` |
|---|---|---|
| does | opens the work | expands its description in place |
| at rest | no decoration | hairline underline |
| on hover | *italic*, no underline | underline firms to ink |

Different rest states and different hover gestures, so the two never look like the same
affordance — and the one that changes the page (index) is the one with no rest-state mark,
while the one that expands in place advertises itself.

### The work-title hover

Italic is the right gesture — it uses a face the site already loads — but the box must not
move.

```html
<span class="worklist__slot" data-text="Ghost Stories">
  <span class="worklist__text">Ghost Stories</span>
</span>
```

Two invisible twins (`::before` roman, `::after` italic, both `height: 0`) share the visible
text's grid cell, so the cell is always sized to whichever face is wider.

**Why both twins and not just one.** PP Pangaia Ultralight Italic is ~19px **narrower** than
the roman at this size, but a *synthesised oblique* — which is what the browser draws before
the italic file arrives — is ~23px **wider**. Reserving only one leaves a visible jump in the
other direction. The italic twin also forces that face to load with the page instead of
stalling the first hover on a 96KB fetch.

**Verified:** slot width and button height are identical in roman and italic for all three
titles (605.05, 305.22, 697.08 px; delta 0.00), and `PP Pangaia 200 italic` is loaded at page
load.

---

## 10. Motion

| Motion | Duration | Easing | Applies to |
|---|---|---|---|
| colour change | 0.18s | `ease` | links, controls |
| wordmark reveal | 0.35s | `ease` | `.site-title` opacity |
| overlay in/out | 0.2s | `ease` | modal opacity + visibility |
| **disclosure reveal — R8** | **0.7s** | **`cubic-bezier(0.16, 1, 0.3, 1)`** | **`grid-template-rows` 0fr ↔ 1fr; prose opacity 0.45s in, 0.2s out** |
| parallax travel cap — R3 | — | — | `[data-parallax]`, clamped to ±24px |
| cover scroll hint | 1.8s loop | `ease-in-out` | `scrollHint` |
| header hide/show | 0.3s | `ease` | `.site-header` transform; reversals under 8px ignored (R9) |
| menu panel — R9 | 0.2s | `ease` | `.site-nav` opacity + visibility, below 60rem |
| parallax | scroll-linked | — | `[data-parallax]`; **off on touch devices** (R9, §7a) |

**Rules:**

- **Nothing moves on hover.** Colour changes; geometry does not.
- **No two animations may act on the same element at the same time.** Opening "read more" used
  to run `proseIn` (translating the prose up 1rem) while `scrollIntoView({behavior:"smooth"})`
  scrolled the same element to centre — two motions fighting over one element. The
  `scrollIntoView` is removed; the reveal is enough.

**The scroll is slaved to the unfold, not sequenced after it — R8.** Fourth attempt, and the
first three are worth recording because each cured the previous one's symptom and created a new
fault. Attempt 1 fired the scroll 90ms into the 0.7s height animation and moved the modal
233px while it was still growing — two animations fighting. Attempt 2 waited for
`transitionend`, which removed the fight but introduced a ~0.7s dead pause before anything
moved toward the text. Attempt 3 slaved the scroll to the unfold with a
per-frame `requestAnimationFrame` loop that measured the panel and wrote the scroll position on
every frame — a forced layout per frame, and the remaining stutter. The build now measures once,
before the panel grows (the content's `scrollHeight` gives its final height), computes the target
scroll position up front, and the loop only *writes* `scrollTop` along the same 0.7s curve as the
CSS unfold. The scroll starts on the click frame and stays locked to the height without reading
layout. CSS smooth scrolling is suspended
for the duration, or every assignment would queue an animation of its own. `contain: paint` on
the panel keeps the per-frame repaint inside the box rather than inviting a full-modal repaint,
which is where the stutter came from.

**The disclosure opens on an eased height, not a snap — R2.** `<details>` cannot be
transitioned portably, because a closed `<details>` does not render its content, so there is
nothing to animate from. The disclosure is therefore a `<button aria-expanded>` plus a region,
and the height is animated with the `grid-template-rows: 0fr → 1fr` technique: no JS
measurement, no fixed `max-height` to guess, and it adapts to any length of text in either
language. The panel collapses to exactly **0px** — the grid item carries no padding, because
padding survives the collapse and would leave a ~10px sliver of the closed panel showing.
0.7s on a long-tailed ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) matches the register of the site's soft scroll. The global
reduced-motion block cancels it, leaving an instant open.
- **`prefers-reduced-motion` kills all of it.** The existing block covers transitions,
  animations, the parallax transform and `scroll-behavior`, and is unchanged. Any new motion
  is added to it in the same commit.

---

## 11. Bilingual constraints

- **Every translatable string ships both languages**, as sibling `.lang-en` / `.lang-de`
  spans toggled by CSS. This now includes accessible names: `aria-label` cannot hold two
  languages, so every icon-only control carries a `.vh` span with both. Verified: zero
  visually-hidden names missing a language.
- **Every prose block carries a real `lang` attribute — R2.** `.lang-en` / `.lang-de` are CSS
  hooks and carry no language information. Automatic hyphenation needs a language to pick a
  dictionary and fails **silently** without one, so `lang="en"` / `lang="de"` now sits on each
  language wrapper in the About text, the work descriptions and both legal pages. Verified in
  the DOM: the prose in each language reports the matching `lang` in scope.
- `impressum.html` was German-only — English chrome around a German document. It now carries
  both, with `lang="de"` / `lang="en"` on each block so screen readers pronounce each
  correctly. The German text is the legally binding version; its "Angaben gemäß § 5 TMG" heading was
  removed at the artist's request in R10, together with its English twin.
- **German is the layout stress test, not English.** Any new label, button or nav item is
  checked in DE at **390px** before it is considered done. The header breakpoint (§7) exists
  entirely because of German.
- **Never size a container to its English content.** Fixed widths, `white-space: nowrap` and
  single-line assumptions all break in German.
- Soft hyphens (`&shy;`) are permitted in German compounds and are already used in
  `datenschutz.html`.

---

## 12. Accessibility constraints

Non-negotiable. All verified against the live DOM (§13).

- **Skip link** — first focusable element, visible on focus. Present.
- **`:focus-visible` outline** — §9. Never removed.
- **Semantic heading order** — one `<h1>` per page, no level skipped for visual reasons. The
  legal `h4` change (§2) alters its appearance, not its level.
- **Contrast** — 4.5:1 floor for text, 3:1 for icon strokes. Measured, not assumed.
- **Target size** — 44 × 44px minimum. §8.
- **Modal** — `role="dialog"`, `aria-modal="true"`, focus moved in on open and restored on
  close. The rest of the page is marked `inert` (plus `aria-hidden`) while the dialog is open,
  and a Tab handler traps focus as a fallback for browsers without `inert`; `aria-modal` alone
  does not contain Tab. Verified: `.site-main` carries `inert` only while the modal is open.
  **R2:** focus now lands on the dialog itself (`tabindex="-1"`) rather than on the close
  button. That is the standard pattern — the dialog is announced as a whole — and it also
  stops a focus ring being painted on a control the visitor never chose, since a
  programmatically focused `tabindex="-1"` container does not match `:focus-visible`. Tab
  still reaches the close button first.
- **The disclosure is a real button — R2.** `aria-expanded` tracks its state and
  `aria-controls` points at the panel it opens.
- **Modal dismissal is uniform.** Clicking anything that is not content closes it. Previously
  the empty paper beside the title closed the modal but the identical-looking gap between two
  images did not.
- **Language switch** — `role="group"`, `aria-label`, `aria-pressed` maintained. Unchanged.
- **Images** — descriptive `alt` plus explicit `width`/`height` on every one.
- **Header clearance ≥ the tallest header**, derived from `--header-h` — a `scroll-margin-top`
  since R9, so focusing the header's own controls never scrolls the page (§7a).
- **Menu toggle — R9.** A real `<button>` with `aria-expanded`, `aria-controls` and a bilingual
  `.vh` name; Escape closes it and returns focus; tabbing out of the header closes it.

---

## 13. Verification record — 2026-09-08

Measured in the browser, not asserted.

**Contrast — 18 ink/ground pairings across index, modal and the legal pages. Zero failures.**
Worst case is `--ink-muted` on the modal ground at **4.91:1** (was 4.10:1, failing).

**Geometry**

| Check | Before | After |
|---|---|---|
| Modal close button font | `Arial` | `"Helvetica Neue"` |
| Modal close / prev / next hit area | 31×42, 42×56 | 44×44, 44×44 |
| Footer rules vs section rules @1440 | 864px vs 768px | 768px vs 768px |
| Header content vs section content @1440 | 288 vs 336 | 288 vs 336 *(deliberate, §7)* |
| Cover + header vs viewport @1440×900 | 902.05 (2px over) | 899.99 |
| Mobile header height @390 | 143.47px, 3 rows | **44px, 1 row** (R9) |
| Mobile nav | 4 + 1, last item orphaned | drop-down behind a menu control (R9) |
| Bio list → Exhibitions list gap | 3 hairlines within 230px | 2 list rules, 199px apart |
| Work-title hover, slot width delta | +23.42px | **0.00px** |
| Label tracking (R2) | 0.12em everywhere | 0.06em labels / 0.08em wordmark |
| Modal arrow glyph / rendered stroke | 32px / 2.00px | 18px / 1.25px (R4) |
| Icon stroke spread across the family | 1.00–2.00px | **1.25px, every icon** |
| Closed disclosure panel height | n/a (`<details>`, no motion) | **0px**, 0.7s eased open |
| Footer height (R3) | 378px, + 64px of footer-toned dead space on a short page | **294px @1440 / 370px @390 (R9 phone grid; was 285px), identical on all three pages** — re-measured R10 |
| Footer share of the shortest page (R3) | ~49% of the viewport | 33% |
| Gap between sections (R3) | 144px (token doubled by accident) | 72px @1440 / 40px @390 |
| Legal text block | 514px, 14px, left-set, rules above every h2 | full 768px column, 14px, no rules (R8) |
| Parallax travel (R3) | uncapped, 70–100px — portrait overlapped the ARTWORK label | **±24px**, 48px worst-case clearance |
| Nav centre vs viewport centre | +24.95px @1440 | **0** at 961/1024/1200/1440, EN + DE (below 60rem the nav is a drop-down) |

**Dead code removed:** the entire `.lightbox` block (55 lines, referenced by nothing), the
superseded `.work` / `.work__intro` / `.work__title` / `.work__gallery` / `.work__figure`
section layout, `.contact*`, `.legal__note`, and the `cursor: zoom-in` that promised a zoom
that did not exist. Zero occurrences remain.

**Round 2 additions.** All 17 ink/ground pairings still pass with zero failures after the
`.prose` refactor — including both arrow icons at 4.91:1 on the modal
ground. Hyphenation proven active in both languages. `.prose` computed properties verified
identical between About and the modal prose across all eight (font, size, weight, line-height,
colour, alignment, hyphens, letter-spacing). The modal screenshots in `docs/screenshots/` are
genuine captures this round, probed before saving (`opacity: 1`, `visibility: visible`,
`aria-hidden="false"`).

**Not verified — and why.** **Headless Chrome under `--virtual-time-budget` freezes the
rendering lifecycle after first paint**, so `requestAnimationFrame`, `IntersectionObserver`
delivery and CSS transitions never advance. Confirmed by control: the pre-existing scrollspy
observer, untouched by this work, also never fires there. Consequences:

- the scroll-linked wordmark reveal (§7) and the scrollspy need one look in a real browser —
  both end states are verified statically, but not the trigger;
- the disclosure's opening **animation** cannot be watched here. Its wiring is verified
  (`transition-property: grid-template-rows, opacity`; the correct curve; rows
  collapse to 0px and expand to content), but whether it *feels* right is a real-browser
  judgement;
- screenshots of any transitioned end state must be captured with transitions disabled. That
  is why the first round's modal shots were unusable: the modal was genuinely open but painted
  at `opacity: 0`, so the files showed the cover behind it. Now handled, and probed before
  each save.

Hover and `:focus-visible` appearance are likewise measured rather than seen.

---

## 14. Image slots (for the photographs still to come)

Defined now so images can drop in later without a rewrite. **No empty placeholders were
built.**

**Slot A — section opener.** A single full-bleed image directly beneath a section label,
before the list. `--space-6` below the label, `--space-7` above the list; height capped at
`min(60vh, 34rem)`; `object-fit: cover`. The section's tone (§6) continues above and below it,
so it reads as an inset in the page rather than a band across it.

**Slot B — timeline row image.** Inside a `.timeline__desc`, constrained to `--measure`,
`--space-3` above and below. The row grid handles it with no change.

**Slot C — portrait column.** What `.about__figure` already is: a `16rem` column beside the
text, collapsing to `15rem` above the text below `46rem`.

**Rules for all three:** descriptive `alt` in **both** languages; `loading="lazy"` except on
first paint; explicit `width`/`height` so nothing reflows. No decorative image without content
behind it — an empty slot beats a filler photograph. No captions unless the artist supplies
caption text; if she does, it is `body/spec`. No hover zoom, no overlay, no lightbox.

---

## 14a. Link preview card — R10

A link to the index page shared in WhatsApp, iMessage, Instagram, Signal or LinkedIn shows a
card: the title "Paula Schierholt", the site description, and `assets/og-image.jpg` — 1200 × 630,
the cover's poster frame (`assets/wallpaper/poster-land.jpg`) cropped to 1.91:1, the same motif
as the site icons. The image URL is absolute (`https://paulaschierholt.com/…`), which link
previews require; `paulaschierholt.de` serves the same file. The legal pages carry no card.

---

## 15. Fonts: licence and delivery

- PP Pangaia is the **Free for Personal Use** edition; its EULA (May 2021) is in `assets/fonts/`.
  That EULA excludes use "on a publicly available platform such as a website" (§2) and making
  the font files publicly available (§2.6). Pangram Pangram's current FAQ is looser — it lists
  "personal portfolios" as personal use — but also says a Web licence "is needed for any
  website, microsite and subdomain where the font is embedded", and its current EULA (§2.4) says
  the same. **Treat the website as needing a Web licence.** Separately, the font files sit in a
  public GitHub repository, which both EULAs prohibit whatever licence is held (current §3.7).
  Status and actions: §16, item 3. (Corrected in R10 — this section used to call a personal
  portfolio "within scope" without qualification.)
- Only the three faces the site uses exist as files and are declared (§1).
- Ultralight and Medium are preloaded in `index.html`. The Ultralight Italic loads with the
  page via the hover twin (§9).
- **`.woff2`, measured in R10.** The three `.otf` files total 349KB; the same outlines as
  `.woff2` total 187KB (−46%). A Latin-only subset would be smaller still. Do it with licensed
  files — a purchase includes WOFF2 — not with the free ones, whose EULA grants no conversion
  (§2.7).

---

## 16. Open items for the user

Nothing here blocks the work above; each needs a judgement rather than a design decision.

| | Item | Note |
|---|---|---|
| 1 | **Impressum: missing ODR notice** | Commit `ddae42c` describes an EU ODR / dispute-resolution notice that is not in the file. Not invented here. Worth noting that the EU ODR platform shut down in July 2025, so the classic wording may be obsolete — a question for whoever advises on the imprint. |
| 2 | **`scroll-snap-type: y proximity`** | Off on touch devices since R9 (§7a), still on for mouse and trackpad. Sections are shorter than the viewport, which is the case where proximity snapping fights the reader, and it interacts with scroll-linked parallax. Needs one real trackpad to judge. |
| 3 | **Font licence and the public repository** | §15. A Web licence for the three faces in use; the GitHub repository made private (licensed or not, font files may not sit in a public repository); then the licensed `.woff2` files swapped in. |
| 4 | **Justified setting is now site-wide** | Applied as instructed, with hyphenation. It is the one place where the artist's preference and the usual typographic advice disagree; with `hyphens: auto` and a real `lang` in scope it holds up well in both languages — see `11-modal-readmore-de-1440.png`, where German breaks cleanly across lines. Worth a look at the About text in German, the narrowest justified block on the site at 63 characters per line. |
| 5 | **"Upcoming" on the December 2026 exhibition** | A manual note (R10). Remove it from `index.html` once the exhibition has opened. |

---

## 16a. The artwork-section contract — R8

One set of rules for the artwork modal, applying identically to Ghost Stories, Fiction,
Deepfake Diaries **and every artwork added later**. A new work inherits these; it must never
need CSS of its own.

| | Rule |
|---|---|
| Gallery | photographs centred, `max-height: 60vh` (44vh below 40rem), even gap from the spacing scale; one photo or two, no special case |
| Title | PP Pangaia Ultralight uppercase. If the work has a description the title **is** the disclosure control (§9); if it has none it is a plain heading |
| Spec | PP Pangaia Ultralight italic, the date on its own line |
| Pager | `‹ n / total ›`, hidden when there is only one work |
| Prose width | **spans the photographs exactly** — the same left and right edges, whether there are one or two. Driven by `--gallery-w`, published by JS from the images' rendered extent |
| Prose type | `.prose`, identical to the About text (§17). Never overridden |
| Space below | `--space-8` beneath the content, so the panel never ends flush with the modal edge |
| Reveal | eased height, scroll slaved to the unfold (§10) |

Verified across all three works at 1440 × 900: Fiction and Deepfake Diaries both render prose
at **835px, exactly the gallery width**, at 14px; Ghost Stories has one photograph (405px) and
no description, so it correctly shows no toggle and no prose. Line length that follows from
the width rule: **120 characters (Fiction, EN)**, 101 (Deepfake Diaries, EN). Long, and
deliberately so — the artist asked twice for the text to use more of the width, and line
length is context-flexible per §0a.

## 17. The prose guarantee — a mechanism, not a promise — R4

Body prose must look **identical** everywhere it appears: the About text, the artwork modal,
and both legal pages. This has now been promised twice and broken twice, so it is written here
as a hard constraint and enforced by a script rather than by care.

### The constraint

> **Prose typography is defined exactly once, in the `.prose` rule, from the
> `--prose-size` / `--prose-leading` / `--prose-ink` tokens. No page, section or component may
> restate or override `font-size`, `line-height`, `font-family` or `color` for prose.**
>
> If a layout problem seems to call for different prose type, the answer is to change the
> **measure**, the **layout**, or the **spacing** — never the type. Measure is not type: a
> column width may legitimately differ per context; the type may not.

**Why it exists.** Round 2 unified the three prose blocks and verified all eight computed
properties matched. Round 3 then widened the legal measure to 38rem, found the line length too
long, and bought it back with `font-size: 1rem; line-height: 1.65` on `.legal__body`. That one
change silently voided the guarantee — the legal pages ran at 16px/1.65 against 14px/1.6
everywhere else — and it reached the artist before anyone noticed. Later rounds solved the same
width problem through layout — a two-column rail in R6, a single full-width column in R8 —
and the type never moved.

### The check

```
node tools/check-prose-consistency.js
```

Vanilla Node plus headless Chrome, no dependencies. It serves the site on an ephemeral port,
loads `index.html` (About text and the artwork modal), `impressum.html` and `datenschutz.html`
in one browser, reads the **computed** style of a prose paragraph on each in **both
languages**, and compares `font-family`, `font-size`, `font-weight`, `font-style`,
`line-height`, `color`, `letter-spacing`, `text-align`, `hyphens` and paragraph
`margin-bottom`. Any difference is printed with both values and the script exits `1`.

Set `CHROME=/path/to/chrome` if Chrome is not in a default location. Run it after any change
that touches type, and before deploying.

**Deliberate exclusions**, because they are not running prose: `.legal__address` (address
blocks take `--leading-snug`) and `.legal__caps` (the legally-mandated all-caps blocks, which
carry their own tracking and are neither justified nor hyphenated). Both inherit prose size,
leading and colour; only their case-specific adjustments are their own.

### Everything else that declares shared typography

Swept after the regression. These are the only places `font-size`, `line-height`,
`font-family` or `color` are declared, and every one is a distinct role rather than a
restatement of prose:

| Where | Why it is legitimate |
|---|---|
| `body` | the document defaults everything else inherits from |
| `.prose` | **the single source of truth for prose** |
| `.label-sm`, and the rules that write the label spec out: `.section__title` (label/md), `.site-nav a`, `.lang-switch`, `.footer-nav__title`, `.wmodal__count` | the micro-label style (§2) |
| `.site-title`, `.cover__name`, `.worklist__title`, `.wmodal__title`, `h1.section__title` | display type, each its own scale entry |
| `.wmodal__spec`, `.timeline__year`, `.footer-contact__name` | PP Pangaia roles, each its own scale entry |
| `.legal__body h2/h3/h4` | the legal heading scale, `--step-1/2/3` |
| `.timeline__desc` | **not** `.prose` (the timeline is excluded from justification) but reads the same `--prose-*` tokens, so it cannot drift |
| `.legal__address`, `.footer-contact` | `<address>` blocks, `--leading-snug` |
| `.footer-nav a`, `.site-footer__copy` | small text, `--text-small` |
| `.legal__caps` | tracking only; size, leading and colour inherited |
| hover/focus colour rules | state changes, not type |

The two that were **not** legitimate and are now fixed: `.legal__body`'s `font-size`/
`line-height` (deleted), and `.footer-contact`'s `line-height: 1.85` (now `--leading-snug`).
