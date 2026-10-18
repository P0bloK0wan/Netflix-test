import { test, expect } from "@playwright/test";
test("browse, search, details, list persistence and profile isolation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Além do Horizonte", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Buscar títulos" }).click();
  await page.getByRole("searchbox").fill("orbita");
  await page
    .getByRole("button", { name: "Ver detalhes de Órbita", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Órbita", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Adicionar à Minha Lista" }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Minha Lista", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Minha Lista", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Trocar perfil" }).click();
  await page.getByRole("button", { name: "Selecionar perfil Cinema" }).click();
  await page.getByRole("button", { name: "Minha Lista", exact: true }).click();
  await expect(
    page.getByText("Sua lista começa com uma boa história."),
  ).toBeVisible();
});
test("keyboard dialog focus and unavailable media", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Mais informações",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("dialog")?.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.route("**/media/*.mp4", (route) => route.abort());
  await page
    .getByRole("button", { name: "Assistir agora", exact: true })
    .click();
  await expect(
    page.getByText("Não foi possível carregar o vídeo."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Tentar novamente" }),
  ).toBeVisible();
});
test("video resumes and saves real playback progress", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Assistir agora", exact: true })
    .click();
  const video = page.locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  await video.evaluate(async (v: HTMLVideoElement) => {
    v.currentTime = 12;
    await v.play();
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(12.1);
  await page.getByRole("button", { name: "Fechar player" }).click();
  await expect(
    page.getByRole("heading", { name: "Continue de onde parou" }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Assistir agora", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(12);
});
test("mobile layout, empty search and film filter", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Filmes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Filmes para todos os momentos" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Buscar títulos" }).click();
  await page.getByRole("searchbox").fill("zzzzzz");
  await expect(
    page.getByText("Nenhuma história por aqui. Ainda."),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
