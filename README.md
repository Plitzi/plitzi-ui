# plitzi-ui

Plitzi's React component library, styled with Tailwind CSS v4.

## Styles

```css
@import '@plitzi/plitzi-ui/style.css'; /* the components' own styles, tokens included */
```

## Design tokens

The components are drawn with Plitzi's design system — the one the Plitzi website and dashboard use: a deep violet
primary (`#5b3df5`, `#6e52f7` on dark), cool neutrals with a violet cast, and radii of 8 / 10 / 14px. The tokens are
CSS variables in `theme.css`; `primary`, `grayviolet`, `zinc` and `gray` are among them, so an app's own Tailwind
utilities read the same values when it imports the file after Tailwind:

```css
@import 'tailwindcss';
@import '@plitzi/plitzi-ui/theme.css';
```

Tailwind writes theme variables on `:root`. Import `theme.css` only into stylesheets that style Plitzi's own UI — never
into one that loads on a page whose look belongs to somebody else, where the tokens would change its colours and radii.

The file sets no font: an app sets `--font-sans` / `--font-mono` on its own root (Plitzi's is Geist and Geist Mono) and
loads the faces itself.
