// vitest.unit.config.ts
/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Include unit tests located in the "src/__tests__" folder and its subdirectories
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    // Exclude any files inside the "e2e" folder (assuming your E2E tests reside there)
    exclude: [...configDefaults.exclude, './test/e2e/**/*.{test,spec}.{js,ts}'],
  },
})
