import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'authservice',
  entry: ['src/**/*.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: 'inline',
  target: 'es2022',
  minify: true,
  clean: true,
  publicDir: true
})
