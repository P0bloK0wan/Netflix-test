import { test, expect } from "@playwright/test";

test("serves media ranges and keeps API and missing assets out of the HTML fallback", async ({ request }) => {
  const media = await request.get("/media/sintel-trailer.webm", { headers: { Range: "bytes=0-99" } });
  expect(media.status()).toBe(206);
  expect(media.headers()["content-type"]).toContain("video/webm");
  expect((await media.body()).byteLength).toBe(100);
  const api = await request.get("/api/v1/missing");
  expect(api.status()).toBe(404);
  expect(api.headers()["content-type"]).toContain("application/json");
  // Static production serving must never expose source or return HTML as a video.
  if (process.env.TEST_PRODUCTION === "1") {
    expect((await request.get("/media/missing.webm")).status()).toBe(404);
    expect((await request.get("/server/index.ts")).status()).toBe(404);
  }
});

test("shows loading, recovers from API failure and consumes the returned title", async ({ page }) => {
  let failed = true;
  await page.route("**/api/v1/bootstrap", async route => {
    if (failed) return route.fulfill({ status: 503, json: { error: "unavailable" } });
    const response = await route.fetch();
    const body = await response.json();
    body.data.titles[0].name = "História da API";
    body.data.titles[0].rating = "16";
    await route.fulfill({ response, json: body });
  });
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("Não foi possível");
  failed = false;
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.locator(".hero h1")).toContainText("História da");
  await expect(page.locator(".hero h1")).toContainText("API");
  await expect(page.locator(".hero .age-rating")).toHaveText("16");
  await page.getByRole("button", { name: "Mais informações", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("História da API");
});

test("handles empty responses and stalled requests without a blank screen", async ({ page }) => {
  await page.route("**/api/v1/bootstrap", route => route.fulfill({ json: {
    meta: { schemaVersion: 1 }, data: { titles: [], profiles: [] },
  } }));
  await page.goto("/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.unroute("**/api/v1/bootstrap");
  await page.route("**/api/v1/bootstrap", () => { /* intentionally unanswered */ });
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("status")).toContainText("Preparando");
  await expect(page.getByRole("alert")).toBeVisible({ timeout: 11000 });
});

test("list confirmation transitions to check and respects reduced motion", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mais informações", exact: true }).click();
  const add = page.getByRole("button", { name: "Adicionar à Minha Lista", exact: true });
  await add.click();
  const mark = page.locator(".details-dialog .list-mark");
  await expect(mark).toHaveAttribute("data-saved", "true");
  await expect(mark.locator(".list-mark-check")).toHaveCSS("stroke-dashoffset", "0px");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Remover da Minha Lista", exact: true }).click();
  await expect(mark).toHaveAttribute("data-saved", "false");
  await expect(mark.locator(".list-mark-plus")).toHaveCSS("transition-duration", "0s");
});
