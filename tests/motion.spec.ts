import { test, expect } from "@playwright/test";
test("quick list actions work with keyboard and persist", async ({ page }) => {
  await page.goto("/");
  const add = page
    .getByRole("button", {
      name: "Adicionar Órbita à Minha Lista",
      exact: true,
    })
    .first();
  await add.focus();
  await page.keyboard.press("Enter");
  await expect(
    page
      .getByRole("button", {
        name: "Remover Órbita da Minha Lista",
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Minha Lista", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ver detalhes de Órbita", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remover Órbita da Minha Lista", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Sua lista começa com uma boa história."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explorar o catálogo", exact: true }),
  ).toBeFocused();
});
test("reduced motion disables decorative animation while keeping all content usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const animated = await page.evaluate(() =>
    Array.from(document.querySelectorAll("*"))
      .filter((el) => getComputedStyle(el).animationName !== "none")
      .map((el) => el.className),
  );
  expect(animated).toEqual([]);
  await expect(
    page.getByRole("heading", { name: "Além do Horizonte", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Trocar perfil" }).click();
  await expect(
    page.getByRole("heading", { name: "Quem está assistindo?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Filmes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Filmes para todos os momentos" }),
  ).toBeVisible();
});
test("local assets load and no browser errors occur during discovery", async ({
  page,
}) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (i) =>
              (i as HTMLImageElement).complete &&
              (i as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "Ver detalhes de Sintel", exact: true })
    .click();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});

test("more than 50 named effects run through real interface interactions", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const state = window as unknown as { observedMotion: string[] };
    state.observedMotion = [];
    document.addEventListener(
      "animationstart",
      (event) => {
        const name = (event as AnimationEvent).animationName;
        if (!state.observedMotion.includes(name))
          state.observedMotion.push(name);
      },
      true,
    );
  });
  await page.goto("/");
  await page.locator(".header .brand").hover();
  await page.getByRole("button", { name: "Séries", exact: true }).hover();
  await page.getByRole("button", { name: "Buscar títulos" }).hover();
  await page.getByRole("button", { name: "Buscar títulos" }).click();
  await page.getByRole("button", { name: "Fechar busca" }).hover();
  await page.getByRole("button", { name: "Fechar busca" }).click();
  await page.getByRole("button", { name: "Trocar perfil" }).hover();
  await page.getByRole("button", { name: "Trocar perfil" }).click();
  await page.getByRole("button", { name: "Selecionar perfil Cinema" }).hover();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Assistir agora", exact: true })
    .hover();
  await page
    .getByRole("button", { name: "Mais informações", exact: true })
    .hover();
  await page
    .getByRole("button", { name: "Mais informações", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Adicionar à Minha Lista", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await page.locator(".title-section").first().locator("h2").hover();
  await page
    .getByRole("button", { name: "Voltar em Sua próxima descoberta" })
    .hover();
  await page
    .getByRole("button", { name: "Avançar em Sua próxima descoberta" })
    .hover();
  await page.locator(".title-card").first().hover();
  await page.locator(".quick-play").first().hover();
  await page.locator(".quick-save").first().hover();
  await page.locator(".discovery-banner").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Explorar documentários" }).hover();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Buscar títulos" }).click();
  await page.getByRole("searchbox").fill("zzzzz");
  await expect(
    page.getByText("Nenhuma história por aqui. Ainda."),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { observedMotion: string[] }).observedMotion
            .length,
      ),
    )
    .toBeGreaterThan(50);
});
