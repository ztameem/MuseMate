import { test, expect } from "@playwright/test";

test.describe("RhymeDropdown Component", () => {
  const baseUrl = "http://localhost:3232"; 

  test("should render and display correct default text", async ({ page }) => {
    await page.goto(baseUrl);

    // Ensure the dropdown renders and shows the default message
    const dropdown = await page.locator("select");
    await expect(dropdown).toBeVisible();

    const placeholderOption = await dropdown.locator("option:disabled");
    await expect(placeholderOption).toHaveText("Enter lyrics to get rhymes");
  });

  test("should fetch and display rhyming options when word is provided", async ({
    page,
  }) => {
    await page.goto(baseUrl);

    // Type a word into a field that triggers the dropdown
    const inputField = await page.locator("input"); // Find the field triggering the fetch (if it's tied to one)
    await inputField.fill("rain"); // Simulate typing 'rain'

    // Wait for the dropdown to update (the debounce delay is handled)
    await page.waitForTimeout(500);

    const dropdown = await page.locator("select");
    const options = await dropdown.locator("option");

    // Check if the dropdown contains options (after fetching)
    await expect(options).toHaveCountGreaterThan(0); // Expecting at least 1 rhyme option
  });

  test("should select an option from the dropdown", async ({ page }) => {
    await page.goto(baseUrl);

    // Trigger fetch by typing in a word
    const inputField = await page.locator("input");
    await inputField.fill("star");

    await page.waitForTimeout(500);

    // Select an option from the dropdown
    const dropdown = await page.locator("select");
    await dropdown.selectOption({ index: 1 }); // Select the first option (assuming it's a rhyme)

    const selectedOption = await dropdown.locator("option:checked");
    await expect(selectedOption).toHaveText("far"); // Assuming 'far' is a valid rhyme
  });

  test('should allow entering a custom rhyme word when "Other" is selected', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    // Trigger fetch by typing a word
    const inputField = await page.locator("input");
    await inputField.fill("cat");

    await page.waitForTimeout(500);

    // Select 'Other' option from the dropdown
    const dropdown = await page.locator("select");
    await dropdown.selectOption({ value: "other" });

    // Check if the input for a custom word appears
    const customInput = await page.locator('input[type="text"]');
    await expect(customInput).toBeVisible();

    // Type a custom word into the input
    await customInput.fill("bat");
    await expect(customInput).toHaveValue("bat");
  });

  test('should clear custom input when a non-"Other" option is selected', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    // Trigger fetch by typing a word
    const inputField = await page.locator("input");
    await inputField.fill("hat");

    await page.waitForTimeout(500);

    // Select 'Other' option from the dropdown
    const dropdown = await page.locator("select");
    await dropdown.selectOption({ value: "other" });

    // Fill in custom word
    const customInput = await page.locator('input[type="text"]');
    await customInput.fill("bat");

    // Select another option (not 'Other')
    await dropdown.selectOption({ index: 0 }); // Assume index 0 is a valid rhyme option

    // Check if the custom input was cleared
    await expect(customInput).toHaveValue("");
  });
});
