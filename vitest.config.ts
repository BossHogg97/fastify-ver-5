import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  // Path resolution aliases for cleaner imports
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // maps '@/...' to 'src/...'
      "~": resolve(__dirname, "."), // maps '~/...' to project root
    },
  },
  test: {
    env: {
      RABBITMQ_ENABLED: "false",
    },
    // Remove parallelism, execute multiple test file in sequence
    fileParallelism: false,
    // Enable global test APIs (describe, it, expect) without importing
    globals: true,
    // Simulate a Node.js environment for all tests
    environment: "node",
    // Global setup runs once before all tests, manages testcontainers lifecycle
    globalSetup: ["./tests/setup/globalSetup.ts"],
    // Run setup logic before each test file
    setupFiles: ["./tests/setup/setup.ts"],
    // Code coverage configuration
    coverage: {
      provider: "v8", // or 'istanbul'
      include: ["src/**/*.{ts,tsx}"], // only instrument source files
      exclude: ["packages/sharedbe/**"], // skip shared backend package
      reporter: ["text"],
    },
    testTimeout: 50000, // 50 seconds for integration tests
    hookTimeout: 50000, // 50 seconds for setup/teardown (testcontainers startup)
  },
});
