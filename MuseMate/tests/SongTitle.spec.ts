import { test, expect } from "@playwright/test";

test.describe("SongTitle Component", () => {
  test("should render the title correctly", async ({ page }) => {
    await page.goto("http://localhost:3232"); 

    // Check that the initial title is "Untitled Song"
    const title = await page.locator("h1");
    await expect(title).toHaveText("Untitled Song");
  });

  test("should allow title editing on double-click", async ({ page }) => {
    await page.goto("http://localhost:3232"); 

    const title = await page.locator("h1");

    // Double click to enable editing
    await title.dblclick();

    // Check that the title is now an input
    const input = await page.locator('input[type="text"]');
    await expect(input).toBeVisible();
  });

  test("should change title when edited and save", async ({ page }) => {
    await page.goto("http://localhost:3000"); // Change to your app's URL

    const title = await page.locator("h1");

    // Double click to enable editing
    await title.dblclick();

    // Type a new title
    const input = await page.locator('input[type="text"]');
    await input.fill("New Song Title");

    // Click save button
    const saveButton = await page.locator("button");
    await saveButton.click();

    // Check that the title is updated
    await expect(title).toHaveText("New Song Title");
  });

  test("should change title color when a new color is selected", async ({
    page,
  }) => {
    await page.goto("http://localhost:3232"); 

    const title = await page.locator("h1");

    // Double click to enable editing
    await title.dblclick();

    // Select a color from the color picker
    const colorPicker = await page.locator('input[type="color"]');
    await colorPicker.setValue("#ff0000"); // Select red color

    // Click save button
    const saveButton = await page.locator("button");
    await saveButton.click();

    // Check that the title color has changed to red
    await expect(title).toHaveCSS("color", "rgb(255, 0, 0)"); // RGB value for red
  });
});
