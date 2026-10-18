import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { api } from "./server/api";
import { catalog, profiles } from "./src/data/catalog";
export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/Netflix-test/" : "/",
  build: { outDir: mode === "pages" ? "dist-pages" : "dist" },
  plugins: [react(), {
    name: "demo-api",
    configureServer(server) { if (mode !== "pages") server.middlewares.use(api); },
    configurePreviewServer(server) { if (mode !== "pages") server.middlewares.use(api); },
    generateBundle() {
      if (mode !== "pages") return;
      this.emitFile({ type: "asset", fileName: "catalog.json", source: JSON.stringify({
        data: { titles: catalog, profiles }, meta: { schemaVersion: 1, source: "demo" },
      }) });
      this.emitFile({ type: "asset", fileName: ".nojekyll", source: "" });
    },
  }],
  test: { include: ["tests/**/*.test.ts"] },
}));
