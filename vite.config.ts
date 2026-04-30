/// <reference types="vite/client" />
/// <reference types="vitest" />

import path, { resolve } from 'node:path';
import fs from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import type { ConfigEnv } from 'vite';

const importedPackages = new Set<string>();

function getComponentEntries(dir: string): string[] {
  const entries: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...getComponentEntries(fullPath));
    } else if (item.isFile() && item.name === 'index.ts') {
      entries.push(fullPath);
    }
  }

  return entries;
}

export default defineConfig((env: ConfigEnv) => ({
  plugins: [
    viteStaticCopy({ targets: [{ src: 'src/**/*.scss', dest: '.' }] }),
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
      rollupTypes: false,
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
      '@uiIcons': resolve(__dirname, './src/icons'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: [
        resolve(__dirname, './src/index.ts'),
        resolve(__dirname, './src/tailwind/index.ts'),
        resolve(__dirname, './src/icons/index.ts'),
        resolve(__dirname, './src/helpers/index.ts'),
        resolve(__dirname, './src/helpers/lodash/index.ts'),
        ...getComponentEntries(resolve(__dirname, './src/components'))
      ],
      name: 'plitzi-ui'
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
