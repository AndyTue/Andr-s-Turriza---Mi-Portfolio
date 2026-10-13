import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("home", () => {
  test("loads in English with SEO alternates", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Andrés Turriza/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("I am Andrés");
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
    for (const id of ["about", "work", "experience", "services", "recognition", "how", "contact"]) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test("redirects / using Accept-Language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "es-MX", extraHTTPHeaders: { "Accept-Language": "es-MX,es;q=0.9" } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await context.close();
  });
});

test("language switch keeps the scroll position", async ({ page }) => {
  await page.goto("/en");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.getElementById("work")!.offsetTop + 200));
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole("button", { name: "Ver en español" }).first().click({ force: true });
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#work-title")).toHaveText("Los que más me han enseñado");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 80);
  const cookies = await page.context().cookies();
  expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("es");
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("dock navigates and highlights the section", async ({ page }) => {
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Sections" });
  await nav.getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator("#services-title")).toBeInViewport();
  await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute("aria-current", "location");
});

test("services accordion keeps one item open", async ({ page }) => {
  await page.goto("/en#services");
  const first = page.getByRole("button", { name: /Custom websites/ });
  const second = page.getByRole("button", { name: /Full-stack web apps/ });
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await second.click();
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "false");
});

test("contact wizard validates and builds the mailto", async ({ page }) => {
  await page.goto("/en#contact");
  const next = page.getByRole("button", { name: "Continue" });
  await expect(next).toBeDisabled();
  await page.getByText("Full-stack or AI project").click();
  await next.click();
  await page.getByRole("textbox", { name: "Name" }).fill("Ana");
  await page.getByRole("textbox", { name: "Email" }).fill("ana@");
  await next.click();
  await expect(page.getByText("That email doesn't look right")).toBeVisible();
  await page.getByRole("textbox", { name: "Email" }).fill("ana@company.com");
  await page.getByRole("textbox", { name: "Message" }).fill("We are hiring an applied AI engineer.");
  await next.click();
  const send = page.getByRole("link", { name: /Open email to send/ });
  await expect(send).toHaveAttribute("href", /^mailto:andres\.turrizae@hotmail\.com\?subject=Portfolio%20inquiry/);
});

test("project pages render in both languages", async ({ page }) => {
  await page.goto("/es/projects/ai-browser-agent");
  await expect(page.locator("h1")).toHaveText("AI Browser Agent");
  await expect(page.getByRole("link", { name: /Volver a proyectos/ })).toBeVisible();
  const res = await page.goto("/en/projects/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("has no WCAG 2.1 AA violations", async ({ page }) => {
  await page.goto("/en");
  // Reveal everything before scanning.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  // Wait until every on-scroll reveal has fired and its .5s fade has finished.
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.querySelectorAll("[data-reveal]:not([data-revealed])")].map(
          (e) => `${e.tagName} in #${e.closest("section, footer")?.id} @${Math.round(e.getBoundingClientRect().top + scrollY)}`,
        ),
      ),
    )
    .toEqual([]);
  await page.waitForTimeout(700);
  // The rotating hero word is aria-hidden decoration (the h1 carries the text); scanning it
  // mid-crossfade reports a transient contrast dip, so it's excluded.
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("#hero-title [lang]")
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} → ${v.nodes[0]?.target.join(" ")}`);
  expect(summary).toEqual([]);
});
