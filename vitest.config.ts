/**
 * vitest.config.ts — Vitest configuration with IndexedDB polyfill
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use jsdom for browser APIs (IndexedDB, etc.)
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
