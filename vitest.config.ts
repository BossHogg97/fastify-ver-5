/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'

const timeout = 120000

import path, { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname)}/`,
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },

  test: {
    dir: './__tests__',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    includeSource: ['**/*.{test,spec}.ts'],
    testTimeout: timeout,
    hookTimeout: timeout,
    coverage: {
      provider: 'istanbul',
      all: true,
      include: ['src/**/*.ts'],
      reporter: ['text', 'json', 'html']
    },
    globals: true
  }
})
