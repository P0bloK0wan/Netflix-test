import { afterAll, beforeAll, expect, it } from "vitest";
import { createServer, request } from "node:http";
import { api } from "../server/api";
import { parseBootstrap } from "../src/api";
const server = createServer((req, res) => api(req, res, () => { res.writeHead(404); res.end(); }));
let base: string;
beforeAll(async () => {
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test port");
  base = `http://127.0.0.1:${address.port}/api/v1`;
});
afterAll(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
it("serves a validated bootstrap and title detail over HTTP", async () => {
  const response = await fetch(`${base}/bootstrap`);
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("application/json");
  const data = parseBootstrap(await response.json());
  expect(data.titles.length).toBeGreaterThan(0);
  expect(data.profiles.length).toBe(3);
  const detail = await fetch(`${base}/titles/${data.titles[0].id}`).then(r => r.json());
  expect(detail.data).toEqual(data.titles[0]);
});
it("searches accented titles and filters/paginates without changing total", async () => {
  const search = await fetch(`${base}/catalog?q=orbita`).then(r => r.json());
  expect(search.data.items.map((i: {id:string}) => i.id)).toEqual(["orbit"]);
  const first = await fetch(`${base}/catalog?kind=film&limit=2`).then(r => r.json());
  const next = await fetch(`${base}/catalog?kind=film&limit=2&offset=2`).then(r => r.json());
  expect(first.data.items).toHaveLength(2);
  expect(first.data.total).toBe(next.data.total);
  expect(first.data.items.every((i: {kind:string}) => i.kind === "film")).toBe(true);
  expect(first.data.items[0].id).not.toBe(next.data.items[0].id);
});
it("rejects malformed, duplicated and unbounded query parameters", async () => {
  for (const q of ["kind=nope", "limit=101", "limit=0", "limit=2.5", "offset=-1", "offset=1e8", "q=a&q=b", "unknown=yes", `q=${"x".repeat(201)}`]) {
    const response = await fetch(`${base}/catalog?${q}`);
    expect(response.status, q).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_QUERY");
  }
});
it("returns useful not-found/method errors and a bodyless HEAD", async () => {
  for (const path of ["/titles/no-such-title", "/not-a-route"]) {
    const response = await fetch(base + path);
    expect(response.status).toBe(404);
    expect((await response.json()).error.code).toBeTruthy();
  }
  const post = await fetch(`${base}/bootstrap`, { method: "POST" });
  expect(post.status).toBe(405);
  expect(post.headers.get("allow")).toBe("GET, HEAD");
  const head = await fetch(`${base}/health`, { method: "HEAD" });
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
});
it("rejects an invalid absolute request URL without taking the server down", async () => {
  const status = await new Promise<number | undefined>((resolve, reject) => {
    const req = request(new URL(base), { path: "http://[" }, response => {
      response.resume(); resolve(response.statusCode);
    });
    req.on("error", reject); req.end();
  });
  expect(status).toBe(400);
  expect((await fetch(`${base}/health`)).status).toBe(200);
});
it("rejects empty/incompatible data, duplicate IDs and invalid asset URLs before rendering", async () => {
  const valid = await fetch(`${base}/bootstrap`).then(r => r.json());
  for (const mutate of [
    (d: typeof valid) => d.data.titles = [],
    (d: typeof valid) => d.data.profiles = [],
    (d: typeof valid) => d.meta.schemaVersion = 2,
    (d: typeof valid) => d.data.titles.push(d.data.titles[0]),
    (d: typeof valid) => d.data.titles[0].video = "https://untrusted.example/video.mp4",
    (d: typeof valid) => d.data.titles[0].video = "/media/horizon.jpg",
    (d: typeof valid) => d.data.titles[0].kind = ["film"],
  ]) {
    const bad = structuredClone(valid); mutate(bad);
    expect(() => parseBootstrap(bad)).toThrow();
  }
});
