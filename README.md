<div align="center">

# TalwinderCSS

**Indian art traditions as a CSS framework.**

Nine art styles, from Kutch block print to Thanjavur gold leaf, each one an attribute you set on `<html>`.
Change it and the palette, ornaments, border weights and display face all move together. The markup never changes.

[Site](https://arihant25.github.io/talwindercss) · [Docs](https://arihant25.github.io/talwindercss/docs/) · [Showcase](https://arihant25.github.io/talwindercss/showcase/)

39 KB minified · 9 KB gzipped · no build step · no JavaScript · MIT

</div>

---

## Install

```html
<link rel="stylesheet" href="https://arihant25.github.io/talwindercss/dist/talwinder.min.css">
```

```html
<html lang="en" data-tw-art="ajrakh">
```

That is the whole setup. Without the attribute you get the default tokens, which follow `prefers-color-scheme` and darken to the `raat` palette at night.

## How it works

Three layers, and the middle one is the point.

1. **Pigments** are raw named colours: `--tw-haldi`, `--tw-sindoor`, `--tw-neel`. They never change.
2. **Semantic tokens** are roles: `--tw-primary`, `--tw-surface`, `--tw-orn-ink`, `--tw-border-w`. An art style is nothing but a block that reassigns these.
3. **Components** read semantic tokens only. Not one component rule names a colour.

Because of that indirection, nine visually unrelated looks need zero component overrides, and adding a tenth means writing one block of custom properties:

```css
[data-tw-art="kalamkari"] {
  --tw-bg: #efe3c8;
  --tw-surface: #f7eed9;
  --tw-ink: #33241a;
  --tw-primary: #7d2b1f;
  --tw-on-primary: #f7eed9;
  --tw-accent: #b8892f;
  --tw-line: #33241a;
  --tw-orn-ink: #7d2b1f;
}
```

Styles are plain attribute selectors, so they nest. A truck-art page can hold one chikankari section with no wrapper class and no specificity fight.

```html
<div class="tw-card" data-tw-art="chikankari">
  <button class="tw-btn tw-btn-primary">Quiet, inside a loud page</button>
</div>
```

## The nine styles

| Style | Where it comes from |
|---|---|
| `truck` | Painted tailgates on the Grand Trunk Road. Saturated, black keylines, heavy offset shadow. |
| `ajrakh` | Kutch block print, sixteen rounds of resist and dye. Madder red, indigo, undyed cloth. |
| `tanjore` | Thanjavur painting. Gesso relief under gold leaf on deep red. |
| `madhubani` | Mithila painting. Earth pigment on paper, and no area left empty. |
| `chikankari` | Lucknow shadow work. White thread on white cotton, hairline borders, soft shadows. |
| `warli` | Rice paste on a mud wall. Two colours, because a third would be an invention. |
| `pichwai` | Cloth hung behind the deity at Nathdwara. Lotus ponds and peacocks in green and gold. |
| `bollywood` | Hand-painted cinema hoardings, before vinyl printing ended the trade. |
| `raat` | A dhaba at two in the morning. Warm dark, not the usual blue-grey. |

## Ornaments

Every motif is an SVG alpha mask stored in a custom property. The framework paints `--tw-orn-ink` through it, so one asset serves all nine styles at any colour and any size without going blurry. Nothing is a raster image and nothing is fetched over the network.

```html
<div class="tw-pattern-kolam"></div>

<!-- recolour and resize per instance -->
<div class="tw-pattern-ajrakh"
     style="--tw-orn-ink: var(--tw-jamun); --tw-orn-scale: .6"></div>

<!-- or put it behind an element's own content -->
<div class="tw-card tw-orn-lotus">…</div>
```

Motifs: `kolam`, `jaali`, `warli`, `ajrakh`, `ikat`, `phulkari`, `bandhani`, `lotus`, `machhli`, `shisha`, plus `paisley`, `scallop` and `toran` as edge strips.

Structural masks stretch to any box: `tw-shape-gopuram`, `tw-shape-arch`, `tw-shape-dome`, `tw-shape-kite`.

## Components

Buttons, cards, badges, forms, tables, alerts and nav, plus a few that have no equivalent in a Western component library:

```html
<div class="tw-thali">          <!-- circular plate, bowls around the rim -->
  <div class="tw-katori">Dal</div>
  <div class="tw-katori">Sabzi</div>
  <div class="tw-thali-center">Roti</div>
</div>

<div class="tw-jharokha">…</div>  <!-- balcony under a real ogee arch -->
<div class="tw-frame tw-frame-rosette">…</div>
<div class="tw-chai">…</div>      <!-- the cutting-chai tumbler -->
<div class="tw-ticket">…</div>
<span class="tw-charkha"></span>  <!-- spinning wheel loader -->
<span class="tw-diya"></span>
```

`tw-mark-veg` and `tw-mark-nonveg` render the green dot and brown triangle that Indian food packaging is required to carry. They size in `em`, so they work inline at any font size.

## Notes worth knowing

**Indic scripts.** Devanagari, Tamil, Bengali and Gurmukhi hang glyph parts above and below the headline stroke, and a Latin-tuned line-height clips the matras. Anything matching `:lang(hi)`, `:lang(ta)`, `:lang(bn)` and the rest gets a taller line-height, so tagging your markup correctly is enough.

**Scroll-driven motion.** `tw-reveal` and `tw-draw-kolam` use `animation-timeline: view()` behind an `@supports` guard. No scroll listener, no observer, no JavaScript. Where it is unsupported the content is simply visible.

**Motion preferences.** Every animation stops under `prefers-reduced-motion: reduce`.

**Prefixing.** Every class starts with `tw-` and every custom property with `--tw-`. Drop it beside Bootstrap or Tailwind without a collision.

## Browser support

Needs custom properties, `mask-image` and `color-mix()`: Chrome 111, Edge 111, Safari 16.2, Firefox 113 and later. Scroll-driven animation and `@property` degrade rather than break.

## Repository layout

```
src/           source, in cascade order
  01-tokens.css      pigments, semantic tokens, @property registrations
  02-ornaments.css   every motif, as an SVG mask in a custom property
  03-art-styles.css  the nine styles
  04-base.css        reset
  05-patterns.css    classes that paint the masks
  06-components.css  components
  07-utilities.css   layout, type, colour, motion
dist/          built output, committed so the CDN link works
build.mjs      concatenates src/, writes dist/, no dependencies
docs/          documentation page
showcase/      six full pages built on the framework
```

## Build

The framework promises no build step to its users, so it does not impose one on itself either. `build.mjs` uses only the Node standard library.

```bash
node build.mjs
```

Edit files in `src/`, never `dist/`.

## Showcase

Six pages, all on the same stylesheet: a highway dhaba menu, a Sunday matrimonial column, a wedding invitation, a live cricket scoreboard, an auto rickshaw booking screen, and a broadsheet front page.

## Contributing

Pull requests welcome. Two rules: the built framework stays a single file, and it stays free of JavaScript.

If you are adding an art style or a motif, say in the PR where it comes from. These are living craft traditions and the attribution matters more than the code.

## License

MIT. See [LICENSE](LICENSE).
