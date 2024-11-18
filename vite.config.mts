/// <reference types="vite/client" />
/// <reference types="vitest" />

// Packages
import { defineConfig } from 'vite';
import path, { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

const externalsRegex = new RegExp(`(node_modules|${Object.keys(pkg.dependencies || {}).join('|')})`, 'im');

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
    })
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
      entry: resolve(__dirname, './src/index.ts'),
      name: 'plitzi-ui',
      formats: ['es']
    },
    rollupOptions: {
      // external: [
      //   'react',
      //   'react-dom',
      //   'react/jsx-runtime' // , "tailwindcss"
      // ],
      external: (source: string, importer: string | undefined, isResolved: boolean) => {
        console.log(source, importer, isResolved);

        // return source.includes('node_modules');
        return externalsRegex.test(source);
      },
      output: {
        preserveModules: true, // Keep module structure for tree-shaking
        // preserveModulesRoot: 'src', // Tell Rollup where to "root" the modules (under src)
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
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
