import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('./dist');
const PKG = path.resolve('./package.json');

// Bundler-internal folders that must never become public subpaths.
const IGNORED_DIRS = ['_virtual', 'node_modules'];

// Subpaths that do not map 1:1 to a built module: the bundled stylesheet and the tailwind preset,
// which is shipped from the repo root instead of dist.
const STATIC_EXPORTS = {
  './style.css': './dist/plitzi-ui.css',
  './tailwind.config': './tailwind.config.js'
};

// Conditions are matched in declaration order, so `types` must lead (TypeScript takes the first condition it
// understands) and `default` must trail (it matches everything). The package is ESM-only, so `default` points at
// the same ESM file: without it the subpath resolves to nothing outside the `import` condition and Node answers
// ERR_PACKAGE_PATH_NOT_EXPORTED.
const buildEntry = (types, esm) => {
  const entry = {};
  if (types) {
    entry.types = types;
  }

  entry.import = esm;
  entry.default = esm;

  return entry;
};

const toExportPath = file => `./${path.relative(process.cwd(), file).replace(/\\/g, '/')}`;

const collect = (dir, exportsObj) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.includes(entry.name)) {
        continue;
      }

      const entryPath = path.join(dir, entry.name);
      const indexFile = path.join(entryPath, 'index.js');
      if (fs.existsSync(indexFile)) {
        const typesFile = path.join(entryPath, 'index.d.ts');
        exportsObj[`./${path.relative(DIST, entryPath).replace(/\\/g, '/')}`] = buildEntry(
          fs.existsSync(typesFile) ? toExportPath(typesFile) : undefined,
          toExportPath(indexFile)
        );
      }

      collect(entryPath, exportsObj);
      continue;
    }

    if (entry.name.endsWith('.scss')) {
      const entryPath = path.join(dir, entry.name);
      exportsObj[`./${path.relative(DIST, entryPath).replace(/\\/g, '/')}`] = toExportPath(entryPath);
    }
  }

  return exportsObj;
};

// Components are also reachable without the `components/` prefix (`@plitzi/plitzi-ui/Button`), which is how
// consumers import them everywhere.
const withComponentShortcuts = exportsObj => {
  const result = { ...exportsObj };
  for (const [key, value] of Object.entries(exportsObj)) {
    if (!key.startsWith('./components/')) {
      continue;
    }

    const shortcut = `./${key.slice('./components/'.length)}`;
    if (!result[shortcut]) {
      result[shortcut] = value;
    }
  }

  return result;
};

const sortExports = exportsObj =>
  Object.fromEntries(Object.entries(exportsObj).sort(([a], [b]) => (a === '.' ? -1 : b === '.' ? 1 : a.localeCompare(b))));

if (!fs.existsSync(path.join(DIST, 'index.js'))) {
  console.error('✖ dist/index.js not found — run the build before generating exports');
  process.exit(1);
}

const rootTypes = path.join(DIST, 'index.d.ts');
const generated = {
  '.': buildEntry(
    fs.existsSync(rootTypes) ? toExportPath(rootTypes) : undefined,
    toExportPath(path.join(DIST, 'index.js'))
  ),
  ...collect(DIST, {}),
  ...STATIC_EXPORTS
};

const pkg = JSON.parse(fs.readFileSync(PKG, 'utf-8'));
pkg.exports = sortExports(withComponentShortcuts(generated));
fs.writeFileSync(PKG, `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`✅ package.json updated with ${Object.keys(pkg.exports).length} generated exports`);
