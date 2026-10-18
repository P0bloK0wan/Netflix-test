import { test, expect } from "@playwright/test";

test("loads the compiled site and all assets under the GitHub Pages subpath", async ({ page }) => {
  const failed: string[] = [];
  page.on("pageerror", error => failed.push(error.message));
  page.on("response", response => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.goto("./");
  await expect(page.locator(".hero h1")).toContainText("Horizonte");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("img").evaluateAll(images => images.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].every(font => font.status === "loaded"))).toBe(true);
  expect(failed).toEqual([]);
});

test("search, list persistence and playback work without a Node API", async ({ page, request }) => {
  expect((await request.get("./api/v1/bootstrap")).status()).toBe(404);
  await page.goto("./");
  await page.getByRole("button", { name: "Buscar títulos" }).click();
  await page.getByRole("searchbox").fill("orbita");
  await page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true }).click();
  await page.getByRole("button", { name: "Adicionar à Minha Lista", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.reload();
  await page.getByRole("button", { name: "Minha Lista", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true }).click();
  await page.getByRole("button", { name: "Assistir demonstração", exact: true }).click();
  await expect.poll(() => page.locator("video").evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => page.locator("video").evaluate(video => (video as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  expect(await page.locator("video").evaluate(video => new URL((video as HTMLVideoElement).currentSrc).pathname)).toContain("/Netflix-test/media/");
});

test("static catalog failures offer retry and mobile layout fits the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/catalog.json", route => route.abort());
  await page.goto("./");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.unroute("**/catalog.json");
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.locator(".hero h1")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
