/// <reference types="vite/client" />
/// <reference types="vitest" />

// Packages
import { defineConfig } from 'vite';
import path, { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { rename } from 'fs/promises';

export default defineConfig({
  plugins: [
    react(),
    dts({
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
      '@assets': resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
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
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lodash/get', 'lodash/set', 'classnames'],
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
