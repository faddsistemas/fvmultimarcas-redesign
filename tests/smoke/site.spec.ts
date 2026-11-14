import { expect, test, type Page } from "@playwright/test";

const ignoreConsole = (text: string) =>
  text.includes("favicon") ||
  text.includes("Failed to load resource");

const MODAL_SLUG = "fiat-mobi-like-2025-branca";
const DETAIL_SLUG = "t-cross-2026";

async function assertModalFitsViewport(page: Page) {
  const shell = page.getByTestId("vehicle-preview-mobile-shell");
  await expect(shell).toBeVisible();
  const metrics = await shell.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(
    metrics.scrollHeight,
    `modal scrollHeight ${metrics.scrollHeight} > clientHeight ${metrics.clientHeight}`,
  ).toBeLessThanOrEqual(metrics.clientHeight + 1);
  expect(
    metrics.scrollWidth,
    `modal scrollWidth ${metrics.scrollWidth} > clientWidth ${metrics.clientWidth}`,
  ).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function assertNoHorizontalScroll(page: Page) {
  const fits = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth <= window.innerWidth + 1;
  });
  expect(
    fits,
    `scrollWidth ${await page.evaluate(() => document.documentElement.scrollWidth)} > innerWidth ${await page.evaluate(() => window.innerWidth)}`,
  ).toBe(true);
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
  test("hero and content visible with prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("");
    await page.waitForLoadState("domcontentloaded");
    const hero = page.getByTestId("cinematic-hero");
    await expect(hero).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("#busca-estoque")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Estoque publicado" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Chamar no WhatsApp/i }).first()).toBeVisible();
  });

  test("responsive layout, modal and navigation", async ({ page }, testInfo) => {
    const errors = trackConsoleErrors(page);
    const isMobile = testInfo.project.name === "mobile";
    const artifactVp = isMobile ? "390" : "1280";

    await page.goto("");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1").first()).toContainText("Seu próximo veículo", {
      timeout: 15_000,
    });
    await expect(page.getByTestId("cinematic-hero")).toBeVisible();
    await expect(page.locator('[data-site-header]')).toHaveAttribute("data-header-mode", "overlay");
    await assertNoHorizontalScroll(page);

    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.7, 320);
      const max = document.documentElement.scrollHeight;
      for (let y = 0; y < max; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
      window.scrollTo(0, max);
    });
    const sectionOpacity = await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll("main section, main [data-reveal]"),
      ];
      return nodes.map((node) => getComputedStyle(node).opacity);
    });
    expect(sectionOpacity.length).toBeGreaterThan(0);
    for (const opacity of sectionOpacity) {
      expect(Number(opacity)).toBeGreaterThanOrEqual(1);
    }
    await page.evaluate(() => window.scrollTo(0, 0));

    await page.screenshot({
      path: `/opt/cursor/artifacts/hero-${artifactVp}-slide-1.png`,
      fullPage: false,
    });
  if (await page.getByRole("button", { name: /Pausar movimento do destaque/i }).isVisible()) {
      await page.waitForTimeout(10_500);
      await page.screenshot({
        path: `/opt/cursor/artifacts/hero-${artifactVp}-slide-2.png`,
        fullPage: false,
      });
    }

    await page.screenshot({
      path: `/opt/cursor/artifacts/home-${artifactVp}.png`,
      fullPage: true,
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

    const photoControl = modal.locator('button[aria-label^="Mostrar foto"]').first();
    await expect(photoControl).toBeVisible();
    const photoControlBox = await photoControl.boundingBox();
    expect(photoControlBox?.width ?? 0).toBeGreaterThan(6);
    expect(photoControlBox?.height ?? 0).toBeGreaterThan(6);

    if (isMobile) {
      await assertModalFitsViewport(page);
      for (const viewport of [
        { width: 360, height: 740 },
        { width: 375, height: 667 },
      ]) {
        await page.setViewportSize(viewport);
        await page.goto(`?veiculo=${MODAL_SLUG}`);
        await page.waitForLoadState("networkidle");
        await assertModalFitsViewport(page);
        await page.screenshot({
          path: `/opt/cursor/artifacts/modal-${viewport.width}x${viewport.height}.png`,
          fullPage: false,
        });
      }
      await page.setViewportSize({ width: 390, height: 844 });
    }

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
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto("");
      await page.waitForLoadState("networkidle");
      await expect(page.getByTestId("cinematic-hero")).toBeVisible();
      await expect(page.locator("h1").first()).toBeVisible();
      await page.goto(`?veiculo=${MODAL_SLUG}`);
      await page.waitForLoadState("networkidle");
      const dialog1366 = page.locator('[data-slot="dialog-content"]');
      await expect(dialog1366).toBeVisible();
      await expect(
        dialog1366.getByRole("link", { name: /Ver anúncio completo/i }),
      ).toBeVisible();
      await expect(
        dialog1366.getByRole("link", { name: /Chamar no WhatsApp/i }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog1366).toBeHidden({ timeout: 5000 });

      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`?veiculo=${MODAL_SLUG}`);
      await page.waitForLoadState("networkidle");
      const dialog720 = page.locator('[data-slot="dialog-content"]');
      await expect(dialog720).toBeVisible();
      await expect(
        dialog720.getByRole("link", { name: /Ver anúncio completo/i }),
      ).toBeVisible();
      await expect(
        dialog720.getByRole("link", { name: /Chamar no WhatsApp/i }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog720).toBeHidden({ timeout: 5000 });
    }

    if (!isMobile) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("");
      const cardButton = page.locator('article button:has(h3)').first();
      await cardButton.click();
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