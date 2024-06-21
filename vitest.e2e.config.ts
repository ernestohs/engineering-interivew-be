// vitest.e2e.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.{test,spec}.ts'],
    testTimeout: 30000, // 30 seconds
  }
});