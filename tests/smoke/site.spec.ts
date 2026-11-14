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

async function assertHeroFullBleed(page: Page) {
  await expect(page.getByTestId("hero-stage")).toHaveCount(0);
  const blurLayers = page.locator('[data-testid="cinematic-hero"] [style*="blur("]');
  await expect(blurLayers).toHaveCount(0);

  const isMobile = await page.evaluate(() =>
    window.matchMedia("(max-width: 767px)").matches,
  );

  if (isMobile) {
    const mobileMedia = page.getByTestId("hero-media-mobile");
    const mobileOk = await mobileMedia.evaluate((root) => {
      const active = root.querySelector('[data-hero-slide-active="true"]');
      if (!active) return { single: false, edgeToEdge: false };
      const imgs = [...active.querySelectorAll("img")];
      const img = imgs[0];
      if (!img || imgs.length !== 1) return { single: false, edgeToEdge: false };
      const imgRect = img.getBoundingClientRect();
      return {
        single: true,
        edgeToEdge: Math.abs(imgRect.width - window.innerWidth) < 2,
      };
    });
    expect(mobileOk.single).toBe(true);
    expect(mobileOk.edgeToEdge).toBe(true);
    return;
  }

  const coversHero = await page.getByTestId("hero-media").evaluate((media) => {
    const hero = media.closest('[data-testid="cinematic-hero"]');
    if (!hero) return false;
    const heroRect = hero.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const activeSlide = media.querySelector('[data-hero-slide-active="true"]');
    if (!activeSlide) return false;
    const imgs = [...activeSlide.querySelectorAll("img")];
    const widthOk =
      Math.abs(mediaRect.width - heroRect.width) < 2 &&
      Math.abs(mediaRect.height - heroRect.height) < 2;
    const imgCovers = imgs.some((img) => {
      const imgRect = img.getBoundingClientRect();
      return (
        imgRect.width >= heroRect.width * 0.98 &&
        imgRect.height >= heroRect.height * 0.98
      );
    });
    return widthOk && imgCovers;
  });
  expect(coversHero).toBe(true);
  const slideCount = await page.getByTestId("hero-media").locator("[data-hero-slide]").count();
  await expect(page.locator('[data-testid="hero-media"] picture')).toHaveCount(
    slideCount,
  );
}

async function assertHeroCtasAboveContactBar(page: Page) {
  const hero = page.getByTestId("cinematic-hero");
  const bar = page.getByTestId("mobile-contact-bar");
  await expect(bar).toBeVisible();
  const stock = hero.getByRole("link", { name: /Ver estoque publicado/i });
  const search = hero.getByRole("button", { name: /Buscar veículo/i });
  await expect(stock).toBeVisible();
  await expect(search).toBeVisible();

  const layout = await hero.evaluate((heroEl) => {
    const barEl = document.querySelector('[data-testid="mobile-contact-bar"]');
    const stockEl = heroEl.querySelector('a[href*="estoque"]');
    const searchEl = [...heroEl.querySelectorAll("button")].find((node) =>
      /Buscar veículo/.test(node.textContent ?? ""),
    );
    if (!barEl || !stockEl || !searchEl) return null;
    const bar = barEl.getBoundingClientRect();
    const stockBox = stockEl.getBoundingClientRect();
    const searchBox = searchEl.getBoundingClientRect();
    return {
      barTop: bar.top,
      stockBottom: stockBox.bottom,
      searchBottom: searchBox.bottom,
    };
  });
  expect(layout).not.toBeNull();
  expect(layout!.barTop).toBeGreaterThanOrEqual(layout!.stockBottom - 1);
  expect(layout!.barTop).toBeGreaterThanOrEqual(layout!.searchBottom - 1);
}

async function captureHeroSlides(page: Page, artifactVp: string) {
  const isMobile = await page.evaluate(() =>
    window.matchMedia("(max-width: 767px)").matches,
  );
  const media = isMobile
    ? page.getByTestId("hero-media-mobile")
    : page.getByTestId("hero-media");
  const slideCount = await media.locator("[data-hero-slide]").count();
  expect(slideCount).toBeGreaterThanOrEqual(2);
  for (let slide = 1; slide <= slideCount; slide += 1) {
    if (slide > 1) {
      await page.waitForTimeout(10_500);
    }
    await assertHeroFullBleed(page);
    if (artifactVp === "390" || artifactVp === "360" || artifactVp === "375") {
      await assertHeroCtasAboveContactBar(page);
    }
    const saveShot =
      artifactVp === "390" || (artifactVp === "1280" && slide <= 2);
    if (saveShot) {
      await page.screenshot({
        path: `/opt/cursor/artifacts/hero-${artifactVp}-slide-${slide}.png`,
        fullPage: false,
      });
    }
  }
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
    const isMobile = testInfo.project.name === "mobile";
    test.setTimeout(isMobile ? 300_000 : 120_000);
    const errors = trackConsoleErrors(page);
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

    await assertHeroFullBleed(page);
    await captureHeroSlides(page, artifactVp);

    if (isMobile) {
      for (const viewport of [
        { width: 375, height: 667, tag: "375" },
        { width: 360, height: 740, tag: "360" },
      ]) {
        await page.setViewportSize(viewport);
        await page.goto("");
        await page.waitForLoadState("networkidle");
        await captureHeroSlides(page, viewport.tag);
      }
      await page.setViewportSize({ width: 390, height: 844 });
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