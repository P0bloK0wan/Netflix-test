import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import serveStatic from "serve-static";
import { api } from "./api.ts";

export function createApp(root = fileURLToPath(new URL("../dist", import.meta.url))) {
  const serve = serveStatic(root, { etag: true, maxAge: 0, fallthrough: false });
  const server = createServer((req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    api(req, res, () => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return;
      }
      serve(req, res, error => {
        if (res.headersSent) { res.destroy(); return; }
        const status = error && typeof error.status === "number" && error.status >= 400 && error.status < 600 ? error.status : 500;
        res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(status === 404 ? "Não encontrado" : "Não foi possível entregar o arquivo.");
      });
    });
  });
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  return server;
}
