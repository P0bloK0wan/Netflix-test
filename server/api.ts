import type { IncomingMessage, ServerResponse } from "node:http";
import { catalog, profiles } from "../src/data/catalog.ts";
import { filterTitles } from "../src/domain/catalog.ts";

export const API_PREFIX = "/api/v1";
const meta = { schemaVersion: 1, source: "demo" };
function json(res: ServerResponse, status: number, body: unknown, head: boolean) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(head ? undefined : JSON.stringify(body));
}

/** Shared by Vite development/preview and the production Node server. */
export function api(req: IncomingMessage, res: ServerResponse, next: () => void) {
  let url: URL;
  try { url = new URL(req.url ?? "/", "http://localhost"); }
  catch {
    return json(res, 400, { error: { code: "INVALID_URL", message: "URL inválida." } }, req.method === "HEAD");
  }
  if (url.pathname !== "/api" && !url.pathname.startsWith("/api/")) return next();
  const head = req.method === "HEAD";
  const fail = (status: number, code: string, message: string) =>
    json(res, status, { error: { code, message } }, head);
  if (req.method !== "GET" && !head) {
    res.setHeader("Allow", "GET, HEAD");
    return fail(405, "METHOD_NOT_ALLOWED", "Use GET ou HEAD.");
  }
  const send = (data: unknown) => json(res, 200, { data, meta }, head);
  if (url.pathname === `${API_PREFIX}/health`) return send({ status: "ok" });
  if (url.pathname === `${API_PREFIX}/bootstrap`) return send({ titles: catalog, profiles });
  if (url.pathname === `${API_PREFIX}/profiles`) return send(profiles);
  if (url.pathname === `${API_PREFIX}/catalog`) {
    const allowed = new Set(["q", "kind", "limit", "offset"]);
    for (const key of url.searchParams.keys()) {
      if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1)
        return fail(400, "INVALID_QUERY", "Parâmetro desconhecido ou repetido.");
    }
    const q = url.searchParams.get("q") ?? "";
    const kind = url.searchParams.get("kind");
    const limitText = url.searchParams.get("limit") ?? "100";
    const offsetText = url.searchParams.get("offset") ?? "0";
    const limit = Number(limitText), offset = Number(offsetText);
    if (q.length > 200 || (kind !== null && kind !== "film" && kind !== "series") ||
      !/^\d+$/.test(limitText) || !/^\d+$/.test(offsetText) ||
      !Number.isSafeInteger(limit) || !Number.isSafeInteger(offset) || limit < 1 || limit > 100) {
      return fail(400, "INVALID_QUERY", "Busca até 200 caracteres; kind film/series; limit 1–100; offset inteiro não negativo.");
    }
    const titles = filterTitles(catalog, q, kind ?? undefined);
    return send({ items: titles.slice(offset, offset + limit), total: titles.length, limit, offset });
  }
  const titlePath = `${API_PREFIX}/titles/`;
  if (url.pathname.startsWith(titlePath)) {
    const id = url.pathname.slice(titlePath.length);
    const title = catalog.find((item) => item.id === id);
    if (!title) return fail(404, "TITLE_NOT_FOUND", "Título não encontrado.");
    return send(title);
  }
  return fail(404, "NOT_FOUND", "Endpoint não encontrado.");
}
