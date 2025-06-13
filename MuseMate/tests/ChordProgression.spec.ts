import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3232"); 
});

test("should render the ChordProgressionGenerator UI", async ({ page }) => {
  // Check that all the dropdowns and button exist
  await expect(page.locator('select[name="key"]')).toBeVisible();
  await expect(page.locator('select[name="style"]')).toBeVisible();
  await expect(page.locator('select[name="scale"]')).toBeVisible();
  await expect(
    page.locator('button:has-text("Generate Progression")')
  ).toBeVisible();
});

test("should generate chord progression on button click", async ({ page }) => {
  // Select a key, style, and scale
  await page.selectOption('select[name="key"]', { label: "C" });
  await page.selectOption('select[name="style"]', { label: "Pop" });
  await page.selectOption('select[name="scale"]', { label: "Major" });

  // Mocking the API response using Playwright's route interception
  await page.route("**/progression*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ progression: ["C", "G", "Am", "F"] }),
    })
  );

  // Click the button to generate progression
  await page.click('button:has-text("Generate Progression")');

  // Wait for the progression to be displayed
  await expect(page.locator("p")).toHaveText("C - G - Am - F");
});

test("should handle error when fetching chord progression fails", async ({
  page,
}) => {
  // Select a key, style, and scale
  await page.selectOption('select[name="key"]', { label: "D" });
  await page.selectOption('select[name="style"]', { label: "Jazz" });
  await page.selectOption('select[name="scale"]', { label: "Minor" });

  // Mock the failed API response
  await page.route("**/progression*", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Failed to fetch chord progression." }),
    })
  );

  // Click the button to generate progression
  await page.click('button:has-text("Generate Progression")');

  // Wait for the error message to appear
  await expect(page.locator("p")).toHaveText(
    "Failed to fetch chord progression."
  );
});

test("should show loading state while generating progression", async ({
  page,
}) => {
  // Select a key, style, and scale
  await page.selectOption('select[name="key"]', { label: "E" });
  await page.selectOption('select[name="style"]', { label: "Rock" });
  await page.selectOption('select[name="scale"]', { label: "Major" });

  // Mock a delayed API response to test loading state
  await page.route("**/progression*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ progression: ["E", "B", "C#m", "A"] }),
      delay: 2000, // Simulate a delay of 2 seconds
    })
  );

  // Click the button to generate progression
  await page.click('button:has-text("Generate Progression")');

  // Check that the button text changes to "Generating..."
  await expect(page.locator("button")).toHaveText("Generating...");

  // Wait for the result to show up
  await expect(page.locator("p")).toHaveText("E - B - C#m - A");
});

test("should display chord progression in the correct format", async ({
  page,
}) => {
  // Select a key, style, and scale
  await page.selectOption('select[name="key"]', { label: "G" });
  await page.selectOption('select[name="style"]', { label: "Blues" });
  await page.selectOption('select[name="scale"]', { label: "Minor" });

  // Mock the API response with a chord progression
  await page.route("**/progression*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ progression: ["Gm", "Cm", "D7", "Gm"] }),
    })
  );

  // Click the button to generate progression
  await page.click('button:has-text("Generate Progression")');

  // Check if the progression is displayed correctly
  await expect(page.locator("p")).toHaveText("Gm - Cm - D7 - Gm");
});
