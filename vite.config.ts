/// <reference types="vite/client" />
/// <reference types="vitest" />

// Packages
import { rename } from 'fs/promises';
import path, { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      // entryRoot: 'src',
      // outDir: 'dist',
      rollupTypes: false,
      exclude: [
        '**/*.test.tsx',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        'vite.config.mts'
        // 'setupTests.ts',
        // 'node_modules'
      ],
      tsconfigPath: './tsconfig.app.json'
    }),
    {
      name: 'rename-node-modules',
      apply(_, { command }) {
        return command === 'build';
      },
      closeBundle: async () => {
        try {
          await rename('./dist/node_modules', './dist/vendor');
          console.log('Renamed "node_modules" folder to "vendor".');
        } catch (error) {
          console.error('Failed renaming "node_modules" folder to "vendor":', error);
        }
      }
    },
    {
      name: 'rewrite-node-modules-imports',
      generateBundle(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type === 'chunk') {
            file.code = file.code.replace(/node_modules\//g, 'vendor/');
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@icons': resolve(__dirname, './src/icons'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@': resolve(__dirname, './src')
    }
  },
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  build: {
    lib: {
      entry: [resolve(__dirname, './src/index.ts')],
      name: 'plitzi-ui',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // treeshake: false,
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'lodash/get',
        'lodash/omit',
        'lodash/debounce',
        'lodash/set',
        'classnames',
        'moment'
      ],
      output: {
        exports: 'named',
        preserveModules: true, // Keep module structure for tree-shaking
        // preserveModulesRoot: 'src', // Tell Rollup where to "root" the modules (under src)
        entryFileNames: '[name].[format]',
        chunkFileNames: '[name].[format]',
        assetFileNames: '[name].[ext]', // assetFileNames: 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime' // tailwindcss: "tailwindcss",
        }
      }
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
});
