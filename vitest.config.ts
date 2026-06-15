import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Vitest does not auto-load .env. Integration (*.int.test.ts) suites need
  // DATABASE_URL (local billd_dev Postgres), so load every var from .env here —
  // the "" prefix opts out of Vite's default VITE_-only filter — without
  // clobbering anything already exported. Mirrors scripts/test-report.mjs so
  // plain `npm test` and CI pick up DATABASE_URL with no manual export.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react()],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
    },
  };
});
