import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { api } from "./server/api";
export default defineConfig({
  plugins: [react(), {
    name: "demo-api",
    configureServer(server) { server.middlewares.use(api); },
    configurePreviewServer(server) { server.middlewares.use(api); },
  }],
  test: { include: ["tests/**/*.test.ts"] },
});
