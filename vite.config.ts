import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { portalMockApi } from "./dev/portal-mock-api";

export default defineConfig({
  plugins: [react(), portalMockApi()],
  test: {
    environment: "node",
    include: ["api/**/*.test.ts", "src/**/*.test.ts"],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: "/",
  },
});
