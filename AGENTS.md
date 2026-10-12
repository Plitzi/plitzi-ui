# @plitzi/plitzi-ui

Plitzi's React component library (Tailwind CSS v4) and the design tokens of Plitzi's own UI: the builder, the
dev tools, the desktop app and the dashboard all draw with it. Open source (Apache-2.0). This file is for any agent
working here (Claude Code, OpenCode, Codex…); `CLAUDE.md` only imports it.

## Where this repo sits

Plitzi is five repos under `/Users/Carlos/htdocs/`; the map is in `plitzi-workspace/AGENTS.md` § What Plitzi is.
plitzi-ui is consumed by almost every app and package of `plitzi-workspace` (builder, sdk, desktop, sdk-style,
sdk-dev-tools, sdk-shared…), from npm — or, while an unpublished change is tried, through
`"@plitzi/plitzi-ui": "portal:../plitzi-ui"` in the workspace's root `resolutions` (check, never assume). To see a
change there: `yarn build:dev` here, then restart the builder with `yarn start --force` (Vite's optimizeDeps serves
the old dist otherwise). When Carlos publishes, the workspace raises its ranges and drops the portal.

The builder is used all day, so "UI/UX and design must be impeccable" applies here more than anywhere: a change in a
component lands in every panel of the builder at once.

## How we work

Owned by `plitzi-workspace/AGENTS.md` § How we work (read it when you can); in a line each:

- Talk to Carlos in **Spanish**; code, comments, docs and commits in **English**. Report failures and skipped steps
  as they are.
- **Quality and zero tech debt first**; type-safe (no `any`/`as` without a reason in a comment); **one source of
  truth**; no legacy shims unless asked.
- **Light and dark from the first commit**: every class that sets a colour has its `dark:` pair.
- **The library stays generic**: no builder-specific behaviour in a component; what the builder needs becomes a
  general prop or stays in the builder.
- **Never lose functionality in a redesign**: inventory what a component does (props, keyboard, focus, states) before
  changing it and check the inventory after.
- Shared working tree: never `git stash`/`checkout --`/`restore`/`reset --hard`/`clean`; temp scripts outside the
  repo. **Confirm before deleting** — every component and hook is public API (one subpath each).
- Commit/push/publish only when asked; **Carlos publishes** (a GitHub release `vX.Y.Z` runs the publish workflow).
  No sub-agents unless he authorizes them.

## Commands

```bash
yarn start             # Storybook on :6006
yarn test              # vitest run
yarn typecheck         # tsc -p tsconfig.app.json --noEmit (tests included)
yarn lint              # eslint ./src
yarn lint-style        # stylelint for the .scss
yarn build:dev         # vite build + scripts/generate-exports.mjs (one exports subpath per component)
yarn build:prod
```

## Layout and conventions

```
src/
  components/<Name>/   # Name.tsx, Name.styles.ts, Name.test.tsx, Name.stories.tsx, index.ts (+ components/ for parts)
  hooks/               # useTheme, useOverlayEscape, useDisclosure, useStorage…
  tailwind/theme.css   # the design tokens (@theme static) → @plitzi/plitzi-ui/theme.css
  icons/ helpers/ utils/ assets/scss/
```

- A component's look lives in `Name.styles.ts`: `cva` slots plus `variantKeys` (intent, size, …) consumed through
  `useTheme`, so a consumer can restyle a slot by `className` or a theme. No colours hard-coded in `Name.tsx`.
- Every component has a story and tests beside it; `index.ts` exports the default, `export *`, and its theme.
- Folder-per-component, at most two levels of `components/`, `NameProps` exported, no inline arrow handlers in JSX
  (`useCallback`), no helpers in component files, no complex JSX ternaries, `clsx` with the object syntax, no Tailwind
  class-string constants — the full rules are in `plitzi-workspace/AGENTS.md` § Component Rules.
- Aliases: `@components/*`, `@hooks/*`, `@uiIcons/*`, `@/*`.

## Rules that go wrong most

- **Tokens:** `theme.css` defines `primary-*` (#5b3df5 / #6e52f7 on dark), `grayviolet-*`, `zinc-*` (dark neutrals),
  `gray-*` (light neutrals) and radii (sm 6 / md 8 / lg 10 / xl 14). It sets no font (apps set `--font-sans` /
  `--font-mono`, Plitzi's is Geist). Import it only into stylesheets of Plitzi's own UI — never into one that loads on
  a customer's page.
- `grayviolet-*` has no dark variant: pair `border-gray-200 dark:border-zinc-700`, `text-gray-500 dark:text-zinc-400`.
- `Alert` is soft by default (`solid: false`); consumers use `size="xs"`.
- **Overlays share one Escape stack** (`hooks/useOverlayEscape`): Esc closes only the top layer (`Modal`,
  `ContainerFloating`), in capture, and never reaches the builder's canvas. A new overlay joins that stack.
- `Modal` takes focus when it opens; keyboard and focus behaviour are part of a component's contract and tested.
- **CodeMirror:** an external `value` write is annotated (`external`) and the change listener reads `onChange` from a
  ref — otherwise switching documents writes one document's text into another. An editor that shows several documents
  is mounted with `key={document}`.
- Consumers that use the portal need `resolve.dedupe` for react, `@codemirror/*` and `@lezer/*`, or they get "multiple
  instances of @codemirror/state" / a null React. A new heavy dependency here affects every consumer's dedupe list —
  say so.
- The builder loads Font Awesome 7: FA6-only icon names render empty.

## Finishing a change

`yarn typecheck`, `yarn lint`, `yarn test` green; the story shows the new state; checked in light and dark; and, when
the change is for the builder, tried there through the portal before Carlos publishes. Releases are `vX.Y.Z` commits
with the version bumped in `package.json`.

## Code style

Same conventions as `plitzi-workspace` (`AGENTS.md` § Code Style there): Prettier 120 columns, single quotes, no
trailing commas, `arrowParens: avoid`; strict type-checked ESLint; `import type` for types; braces always; a blank
line after an `if` block, before `return`, and around every `useCallback`; comments only for a non-obvious WHY.
