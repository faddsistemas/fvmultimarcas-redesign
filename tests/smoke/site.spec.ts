import { expect, test, type Page } from "@playwright/test";

const ignoreConsole = (text: string) =>
  text.includes("favicon") ||
  text.includes("Failed to load resource");

const MODAL_SLUG = "fiat-mobi-like-2025-branca";
const DETAIL_SLUG = "t-cross-2026";

async function assertNoHorizontalScroll(page: Page) {
  const fits = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth <= window.innerWidth + 1;
  });
  expect(fits, `scrollWidth ${await page.evaluate(() => document.documentElement.scrollWidth)} > innerWidth ${await page.evaluate(() => window.innerWidth)}`).toBe(true);
}

async function openModalFromQuery(page: Page) {
  await page.goto(`?veiculo=${MODAL_SLUG}`);
  await page.waitForLoadState("networkidle");
  const modal = page.locator(
    '[data-slot="dialog-content"], [data-slot="drawer-content"]',
  );
  await expect(modal).toBeVisible({ timeout: 15_000 });
  return modal;
}

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !ignoreConsole(msg.text())) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("FV Multimarcas smoke", () => {
  test("responsive layout, modal and navigation", async ({ page }, testInfo) => {
    const errors = trackConsoleErrors(page);
    const isMobile = testInfo.project.name === "mobile";
    const artifactVp = isMobile ? "390" : "1280";

    await page.goto("");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1").first()).toContainText("Seu próximo veículo", {
      timeout: 15_000,
    });
    await expect(page.locator('[data-slot="carousel"]')).toBeVisible();
    const hero = page.locator('section:has([data-slot="carousel"])');
    await expect(hero).toHaveAttribute("class", /CF1B1C|gradient|8B0000/i);
    await assertNoHorizontalScroll(page);

    await page.screenshot({
      path: `/opt/cursor/artifacts/hero-${artifactVp}.png`,
      fullPage: false,
    });

    await page.goto("estoque/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Estoque");
    await assertNoHorizontalScroll(page);
    await page.screenshot({
      path: `/opt/cursor/artifacts/estoque-${artifactVp}.png`,
      fullPage: false,
    });

    const modal = await openModalFromQuery(page);
    await assertNoHorizontalScroll(page);

    await expect(
      page.getByRole("link", { name: /Ver anúncio completo/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Chamar no WhatsApp/i }),
    ).toBeVisible();
    if (isMobile) {
      const close = page.getByRole("button", { name: "Fechar" });
      await expect(close).toBeVisible();
      const closeBox = await close.boundingBox();
      expect(closeBox?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(closeBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
    await expect(modal.getByText("Quilometragem", { exact: true })).toBeVisible();
    await expect(modal.getByText("Combustível", { exact: true })).toBeVisible();
    await expect(modal.getByText("Categoria", { exact: true })).toBeVisible();

    const thumb = modal.locator('button[aria-label^="Mostrar foto"]').first();
    await expect(thumb).toBeVisible();
    const thumbBox = await thumb.boundingBox();
    expect(thumbBox?.width ?? 0).toBeGreaterThan(8);
    expect(thumbBox?.height ?? 0).toBeGreaterThan(8);

    await page.screenshot({
      path: `/opt/cursor/artifacts/modal-${artifactVp}.png`,
      fullPage: false,
    });

    await page.getByRole("link", { name: /Ver anúncio completo/i }).click();
    await expect(modal).toBeHidden({ timeout: 10_000 });
    await expect(page).toHaveURL(new RegExp(`/veiculo/${MODAL_SLUG}`));
    await expect(page).not.toHaveURL(/[?&]veiculo=/);
    await assertNoHorizontalScroll(page);

    await page.goto(`veiculo/${DETAIL_SLUG}/`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /T.CROSS|Volkswagen/i,
    );
    await expect(
      page
        .locator(".rounded-xl.bg-secondary")
        .getByRole("link", { name: /Ligar \(37\) 3226/i }),
    ).toBeVisible();
    await assertNoHorizontalScroll(page);

    if (!isMobile) {
      await page.goto("");
      const carouselSlide = page
        .locator('[data-slot="carousel"] article button')
        .first();
      await carouselSlide.click();
      const opened = page.locator(
        '[data-slot="dialog-content"], [data-slot="drawer-content"]',
      );
      await expect(opened).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(opened).toBeHidden({ timeout: 5000 });
    }

    expect(errors, errors.join("\n")).toEqual([]);
  });
});
