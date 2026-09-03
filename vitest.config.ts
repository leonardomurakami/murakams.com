import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Next.js aliases this to an empty module during server builds; mirror
      // that here so server-only modules can be imported under vitest.
      "server-only": path.resolve(__dirname, "./tests/__mocks__/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
