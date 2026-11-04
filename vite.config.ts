/// <reference types="vite/client" />
/// <reference types="vitest" />

import path, { resolve } from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import type { ConfigEnv } from 'vite';

const importedPackages = new Set<string>();

/** `@scope/name/sub/path` or `name/sub/path` → the package's name and the path inside it; nothing for a bare name. */
const deepSpecifier = (source: string): { name: string; subpath: string } | undefined => {
  const parts = source.split('/');
  const nameParts = source.startsWith('@') ? 2 : 1;
  if (parts.length <= nameParts) {
    return undefined;
  }

  return { name: parts.slice(0, nameParts).join('/'), subpath: parts.slice(nameParts).join('/') };
};

/** The `package.json` of the package a resolved file belongs to: the nearest one above it that names the package. */
const packageRootOf = (file: string, name: string): string | undefined => {
  for (let dir = path.dirname(file); dir !== path.dirname(dir); dir = path.dirname(dir)) {
    const manifest = path.join(dir, 'package.json');
    if (fs.existsSync(manifest)) {
      const { name: found } = JSON.parse(fs.readFileSync(manifest, 'utf-8')) as { name?: string };
      if (found === name) {
        return dir;
      }
    }
  }

  return undefined;
};

/**
 * The path an external import is written with in the build (`output.paths`). As written — except a deep import of a
 * package with no `exports` map that does not name its file (`react-syntax-highlighter/dist/esm/languages/prism/bash`),
 * written as the file it resolves to (`….js`): a bundler finds the file either way, Node only by its name, and a server
 * that renders with this library under Node itself (sdk-server in a project of the CLI) failed on it.
 */
const externalPath = (source: string): string => {
  const deep = deepSpecifier(source);
  if (!deep || path.extname(deep.subpath) !== '') {
    return source;
  }

  let file: string;
  try {
    file = createRequire(path.join(process.cwd(), 'package.json')).resolve(source);
  } catch {
    // Not resolvable from here (a peer the consumer brings): kept as written, as every other import is.
    return source;
  }

  const root = packageRootOf(file, deep.name);
  if (!root) {
    return source;
  }

  const { exports } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8')) as { exports?: unknown };

  return exports === undefined ? `${deep.name}/${path.relative(root, file).split(path.sep).join('/')}` : source;
};

function getEntries(dir: string): string[] {
  const entries: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...getEntries(fullPath));
    } else if (item.isFile() && /^index\.tsx?$/.test(item.name)) {
      entries.push(fullPath);
    }
  }

  return entries;
}

export default defineConfig((env: ConfigEnv) => ({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'src/**/*.scss', dest: '.', rename: { stripBase: 1 } },
        { src: 'src/tailwind/theme.css', dest: '.', rename: { stripBase: 1 } }
      ]
    }),
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
      bundleTypes: false,
      exclude: ['**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx', 'vite.config.ts'],
      tsconfigPath: './tsconfig.app.json'
    }),
    {
      name: 'debug-resolve',
      resolveId(/* source, importer */) {
        // console.log(`[VITE RESOLVE] Trying to resolve: ${source} from ${importer}`);
        return null; // Allow vite keep resolving
      }
    },
    {
      name: 'externalize-and-log',
      enforce: 'pre',
      resolveId(source, importer) {
        if (!importer || env.command === 'serve') {
          // Ignore main entries or runtime
          return null;
        }

        // Mark as external modules or sub-modules from node_modules
        if (!source.startsWith('.') && !path.isAbsolute(source) && !source.startsWith('@')) {
          importedPackages.add(source);

          return { id: source, external: true };
        }

        return null;
      },
      buildEnd() {
        if (env.mode === 'development') {
          console.log('Packages imported:', Array.from(importedPackages));
        }
      }
    }
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@uiIcons': resolve(import.meta.dirname, './src/icons'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@': resolve(import.meta.dirname, './src')
    }
  },
  build: {
    lib: {
      entry: getEntries(resolve(import.meta.dirname, './src')),
      // Without this Vite also runs a `cjs` pass, and both passes write `[name].js` — the CJS output would
      // silently overwrite the ESM one.
      formats: ['es']
    },
    rollupOptions: {
      treeshake: false,
      external: id => {
        if (id.startsWith('node:') || id.startsWith('node/')) {
          return true;
        }

        if (id === 'react' || id === 'react-dom' || id.startsWith('react-dom/') || id.startsWith('react/')) {
          return true;
        }

        // Treat only tsconfig alias "@" as internal, but keep node_modules external
        if (!id.startsWith('.') && !id.startsWith('/')) {
          // Keep all configured aliases internal
          const internalAliases = ['@/', '@components/', '@hooks/', '@uiIcons/'];
          if (internalAliases.some(alias => id.startsWith(alias)) || id === '@') {
            return false;
          }

          return true;
        }

        return false;
      },
      output: [
        {
          format: 'es',
          preserveModules: true,
          paths: externalPath,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name][extname]',
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
          }
        }
      ]
    },
    sourcemap: false,
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: 'tests',
      include: ['src'],
      exclude: ['**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'] // , 'src/index.ts'
    },
    reporters: ['default']
  }
}));
