import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/", label: "homepage" },
  { path: "/profiles", label: "profiles" },
  { path: "/profiles/walter-white", label: "walter-white" },
  { path: "/login", label: "login" },
  { path: "/signup", label: "signup" },
  { path: "/profiles/new", label: "profiles-new" },
];

test.describe("PersonaMap hosted smoke", () => {
  for (const pageInfo of publicPages) {
    test(`${pageInfo.label} loads`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      await page.goto(pageInfo.path, { waitUntil: "networkidle" });
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).toMatch(/PersonaMap|Typecast/);
      expect(bodyText).not.toContain("Application error: a client-side exception has occurred");
      expect(bodyText).not.toContain("404: This page could not be found");
      expect(bodyText).not.toContain("404 Not Found");
      expect(bodyText).not.toContain("500: Internal Server Error");

      const title = await page.title();
      expect(`${title} ${bodyText}`).toMatch(/PersonaMap|Typecast/);
      expect(errors).toEqual([]);
    });
  }

  test("pages avoid obvious fatal console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/", { waitUntil: "networkidle" });
    await page.goto("/profiles", { waitUntil: "networkidle" });
    await page.goto("/profiles/walter-white", { waitUntil: "networkidle" });
    await page.goto("/login", { waitUntil: "networkidle" });
    await page.goto("/signup", { waitUntil: "networkidle" });
    await page.goto("/profiles/new", { waitUntil: "networkidle" });

    expect(errors).toEqual([]);
  });

  test("optional auth and write flow", async ({ page }) => {
    const email = process.env.E2E_TEST_EMAIL;
    const password = process.env.E2E_TEST_PASSWORD;

    test.skip(!email || !password, "E2E_TEST_EMAIL and E2E_TEST_PASSWORD are not set");

    const unique = Date.now();
    const slug = `playwright-profile-${unique}`;
    const authEmail = email!.replace(/@gmail\.com$/i, `+personamap-${unique}@gmail.com`);

    await page.goto("/login", { waitUntil: "networkidle" });
    await page.getByLabel("Email").fill(authEmail);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Log in" }).click();
    const loginMessage = page.getByText(/Invalid login credentials|Email not confirmed|rate limit exceeded/i);
    if (await loginMessage.isVisible().catch(() => false)) {
      const message = (await loginMessage.innerText().catch(() => "")) || "";
      if (/rate limit exceeded/i.test(message)) {
        throw new Error(`Supabase rate limit exceeded during login: ${message}`);
      }

      await page.goto("/signup", { waitUntil: "networkidle" });
      await page.getByLabel("Email").fill(authEmail);
      await page.getByLabel("Password").fill(password!);
      await page.getByRole("button", { name: "Sign up" }).click();
      await expect
        .poll(
          async () => page.getByRole("link", { name: /Logout|Logout/i }).isVisible().catch(() => false),
          { timeout: 30_000 },
        )
        .toBe(true);
      await expect(page.getByRole("link", { name: /Logout|Logout/i })).toBeVisible();
      await page.getByRole("link", { name: /Logout|Logout/i }).click();
      await page.waitForURL("**/", { timeout: 30_000 });
      await expect(page.getByRole("link", { name: /Login/i })).toBeVisible();

      await page.goto("/login", { waitUntil: "networkidle" });
      await page.getByLabel("Email").fill(authEmail);
      await page.getByLabel("Password").fill(password!);
      await page.getByRole("button", { name: "Log in" }).click();
    }

    await expect
      .poll(
        async () => page.getByRole("link", { name: /Logout|Logout/i }).isVisible().catch(() => false),
        { timeout: 30_000 },
      )
      .toBe(true);
    await expect(page.getByRole("link", { name: /Logout|Logout/i })).toBeVisible();

    await page.goto("/profiles/new", { waitUntil: "networkidle" });
    await page.getByLabel("Name").fill(`Playwright Profile ${unique}`);
    await page.getByLabel("Slug").fill(slug);
    await page.getByLabel("Category").selectOption("fictional");
    await page.getByLabel("Source title").fill("Playwright Source");
    await page.getByLabel("Image URL").fill("https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80");
    await page.getByLabel("Description").fill("A test profile created by Playwright to verify hosted Supabase-backed writes.");
    await page.getByRole("button", { name: "Create profile" }).click();
    await page.waitForURL(`**/profiles/${slug}`, { timeout: 30_000 });
    await expect(page.getByText(`Playwright Profile ${unique}`)).toBeVisible();

    await page.goto("/profiles/walter-white", { waitUntil: "networkidle" });
    await expect(page.getByText("Cast a vote")).toBeVisible();
    await expect(page.getByText("Add evidence")).toBeVisible();
  });
});
