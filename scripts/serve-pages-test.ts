// Deliberately static: no Vite fallback or API middleware, like GitHub Pages.
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import serveStatic from "serve-static";
const serve = serveStatic(fileURLToPath(new URL("../dist-pages", import.meta.url)));
createServer((req, res) => {
  const prefix = "/Netflix-test/";
  if (!req.url?.startsWith(prefix)) { res.writeHead(404); res.end(); return; }
  req.url = "/" + req.url.slice(prefix.length);
  serve(req, res, () => { res.writeHead(404); res.end(); });
}).listen(5175, "127.0.0.1");
