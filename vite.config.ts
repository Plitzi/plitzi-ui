/// <reference types="vite/client" />
/// <reference types="vitest" />

import path, { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import type { ConfigEnv } from 'vite';

const importedPackages = new Set<string>();

export default defineConfig((env: ConfigEnv) => ({
  plugins: [
    viteStaticCopy({
      targets: [{ src: 'src/**/*.scss', dest: '..' }],
      structured: true
    }),
    react(),
    tailwindcss(),
    dts({
      // entryRoot: 'src',
      outDir: 'dist',
      rollupTypes: false,
      exclude: [
        '**/*.test.tsx',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        'vite.config.ts'
        // 'setupTests.ts',
        // 'node_modules'
      ],
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
        if (!source.startsWith('.') && !path.isAbsolute(source)) {
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
    alias: {
      '@uiIcons': resolve(__dirname, './src/icons'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist/src',
    lib: {
      entry: [
        resolve(__dirname, './src/index.ts'),
        resolve(__dirname, './src/components/ContainerFloating/index.ts'),
        resolve(__dirname, './src/components/Form/index.ts'),
        resolve(__dirname, './src/components/Popup/index.ts')
      ],
      name: 'plitzi-ui'
    },
    rollupOptions: {
      treeshake: false,
      external: [],
      // output: {
      //   exports: 'named',
      //   preserveModules: true, // Keep module structure for tree-shaking
      //   // preserveModulesRoot: 'src', // Tell Rollup where to "root" the modules (under src)
      //   entryFileNames: '[name].[format]',
      //   chunkFileNames: '[name].[format]',
      //   assetFileNames: '[name].[ext]', // assetFileNames: 'assets/[name][extname]',
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //     'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
      //   }
      // }
      output: [
        // ESM -> .mjs
        {
          format: 'es',
          preserveModules: true,
          // preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
          assetFileNames: '[name][extname]',
          exports: 'named',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
          }
        },
        // CJS -> .cjs
        {
          format: 'cjs',
          preserveModules: true,
          // preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
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
