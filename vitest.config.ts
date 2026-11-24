import { defineConfig } from "vitest/config";

// vitest configuration for backend test suite
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 20000,
  },
});
