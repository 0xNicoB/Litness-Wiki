import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home, categories, copy IP and theme work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Litness Wiki.",
  );
  await page.locator(".hero-copy").click();
  await expect(page.locator(".hero-copy")).toContainText("Copiato!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "play.litness.gg",
  );
  await page.getByRole("button", { name: "Attiva modalità scura" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .locator(".category-grid")
    .getByRole("link")
    .filter({ hasText: "Economia" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Economia");
  await page
    .getByRole("link", { name: /Auction House/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Auction House",
  );
});
test("Pagefind returns real article links, highlights and keyboard closure", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const dialog = page.locator("#search-dialog");
  await expect(dialog).toBeVisible();
  const input = dialog.locator('input[type="text"]');
  await input.fill("villager");
  await expect(
    dialog.locator(".pagefind-ui__result-link").first(),
  ).toBeVisible();
  await expect(dialog.locator("mark").first()).toBeVisible();
  await expect(
    dialog.locator(".pagefind-ui__result-link").first(),
  ).toHaveAttribute("href", /\/wiki\/it\//);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.locator(".hero-search").click();
  await input.fill("dungeon");
  await expect(
    dialog.locator(".pagefind-ui__result-link").first(),
  ).toBeVisible();
  await dialog.locator(".pagefind-ui__result-link").first().click();
  await expect(page.locator("h1")).toBeVisible();
  expect(page.url()).toContain("/wiki/it/");
});
test("command copying, heading anchors and article sources work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/wiki/it/pve/dungeon/");
  const leave = page
    .locator(".command-block")
    .filter({ hasText: "/dungeon leave" });
  await leave.getByRole("button", { name: /Copia/ }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "/dungeon leave",
  );
  await expect(page.locator("#fonti")).toContainText("Changelog 8 ottobre");
  if (test.info().project.name === "mobile")
    await page.locator(".mobile-toc summary").click();
  const toc = page.locator(
    test.info().project.name === "mobile" ? ".mobile-toc" : ".article-toc",
  );
  await toc.getByRole("link", { name: "Lasciare la coda" }).click();
  await expect(page).toHaveURL(/#lasciare-la-coda$/);
});
test("mobile drawer restores focus and categories navigate", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Drawer is for narrow screens");
  await page.goto("/");
  const button = page.getByRole("button", { name: "Apri navigazione" });
  await button.click();
  await expect(page.locator("#navigation-dialog")).toBeVisible();
  await page.getByRole("button", { name: "Chiudi navigazione" }).click();
  await expect(button).toBeFocused();
  await button.click();
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page
    .locator("#navigation-dialog")
    .getByText("Economia", { exact: true })
    .click();
  await page
    .locator("#navigation-dialog")
    .getByRole("link", { name: "Auction House", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Auction House");
});
for (const route of [
  "/",
  "/wiki/it/informazioni/fonti/",
  "/wiki/it/economia/storico/",
  "/404.html",
])
  test(`layout, accessibility and screenshot ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const caption of await page.locator(".data-caption").all()) {
      const box = await caption.boundingBox();
      expect(box!.width).toBeGreaterThan(250);
      expect(box!.height).toBeLessThan(100);
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/visual-${test.info().project.name}-${route === "/" ? "home" : route.includes("storico") ? "table" : route.includes("404") ? "404" : "article"}.png`,
      fullPage: true,
    });
  });
test("search and drawer visual states", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.locator(".hero-search").click();
  await page.locator('#search-dialog input[type="text"]').fill("commissioni");
  await expect(page.locator(".pagefind-ui__result-link").first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({
    path: `test-results/visual-${test.info().project.name}-search.png`,
  });
  await page.keyboard.press("Escape");
  if (isMobile) {
    await page.getByRole("button", { name: "Apri navigazione" }).click();
    await page.screenshot({ path: "test-results/visual-mobile-drawer.png" });
  }
});

test("dark mode and reduced motion preserve readable layouts", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/wiki/it/economia/storico/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.screenshot({
    path: `test-results/visual-${test.info().project.name}-dark.png`,
    fullPage: true,
  });
});

test("narrow 320px viewport stays within the screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of ["/", "/wiki/it/economia/storico/"]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Cerca nella wiki" }).click();
  await expect(page.locator("#search-dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
