import { defineConfig } from "tsup";

export default defineConfig({
  name: "fastify-api",
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  splitting: true,
  sourcemap: "inline",
  target: "es2022",
  minify: true,
  clean: true,
  publicDir: true,
});
