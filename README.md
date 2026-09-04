# TalwinderCSS

Utility CSS for building Indian-style websites. One file. No build step. No JavaScript.

Named colours (saffron, sindoor, mehndi, jamun, mor-pankh), background patterns (bandhani, brocade, warli), and prebuilt components (chai cup, ticket stub, classified card, truck-art button, rangoli spinner) that you use as classes in your HTML.

- Live site: [arihant25.github.io/talwindercss](https://arihant25.github.io/talwindercss)
- Docs: [arihant25.github.io/talwindercss/docs](https://arihant25.github.io/talwindercss/docs)
- Showcase: [arihant25.github.io/talwindercss/showcase](https://arihant25.github.io/talwindercss/showcase)

## Install

Add one link tag in your `<head>`:

```html
<link rel="stylesheet" href="https://arihant25.github.io/talwindercss/dist/talwinder.css">
```

Or download `dist/talwinder.css` and serve it yourself.

## Use it

```html
<button class="tw-btn tw-btn-truck">Book my seat</button>

<div class="tw-card-rangoli">
  <h3 class="tw-om">Namaste</h3>
  <p>Ornate corners without a single SVG.</p>
</div>

<div class="tw-ticket">
  <div>
    <div class="tw-text-sm tw-text-muted">MUM → BLR</div>
    <div class="tw-font-bold">Coach B4 · Seat 21</div>
  </div>
  <div class="tw-text-2xl tw-text-sindoor">₹ 1240</div>
</div>
```

Every class is prefixed with `tw-` so it won't collide with Tailwind, Bootstrap, or your existing stylesheet.

## What's in the box

- **15 named colours** with `tw-bg-*`, `tw-text-*`, and `tw-border-*` variants.
- **Layout utilities**: containers, flex, grid, spacing on a 4px scale.
- **Components**: buttons (default, sindoor, mehndi, peacock, jamun, brass, truck-art, horn-ok), cards (basic, rangoli, bandhani, arch, poster, classified), badges (including veg / non-veg), alerts, forms, tables, navbar.
- **Patterns as CSS backgrounds**: bandhani dots, rickshaw diagonal stripes, warli-inspired dots, brocade checks, tricolour, holi splash.
- **Ornamental dividers**: marigold garland (toran), paisley separator, double lines.
- **Specials**: chai cup, ticket stub, signboard, rangoli spinner, om / shri prefixes.
- **Dark theme**: set `data-tw-theme="raat"` on any element.
- **Motion**: three animations, all respecting `prefers-reduced-motion`.

## File size

- Uncompressed: ~25 KB
- Gzipped: ~6 KB
- No external dependencies. Google Fonts are optional.

## Local development

Everything is static. Open `index.html` in a browser or serve the folder with any static server:

```bash
python -m http.server 8000
# or
npx serve .
```

## Naming

The framework is named TalwinderCSS after a friend of the author. It rhymes with a well-known utility framework, which is a coincidence the author chose not to fight.

## License

MIT. See [LICENSE](LICENSE).

## Contributing

Pull requests welcome. Please keep the framework in a single file. Please don't add JavaScript.
