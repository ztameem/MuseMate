import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Visit the main page before each test
  await page.goto("http://localhost:3232");
});

test("shows sign-in prompt when not signed in", async ({ page }) => {
  // Test that the MuseMate sign-in prompt is visible when not signed in
  await expect(page.locator("div.not-signed-in")).toBeVisible();
  await expect(page.locator("h1")).toHaveText("MuseMate");
  await expect(page.locator("p")).toHaveText("Sign in to continue!");
});

test("shows song title input when signed in", async ({ page }) => {
  // Assuming you mock the user or have a way to simulate being signed in
  await page.locator('button[data-testid="sign-in-button"]').click();

  await page.goto("http://localhost:8000");

  // Verify that the signed-in user's song title input field is visible
  await expect(page.locator('input[name="song-title"]')).toBeVisible();
  await expect(page.locator("h1")).toHaveText("MuseMate");
});

test("should render rhyme dropdown", async ({ page }) => {
  // Test that the RhymeDropdown is visible after signing in
  await page.locator('button[data-testid="sign-in-button"]').click();
  await page.goto("http://localhost:8000");

  await expect(page.locator(".rhyme-section")).toBeVisible();
  await expect(page.locator('select[name="rhyme-dropdown"]')).toBeVisible();
});

test("should render dynamic text boxes and save functionality", async ({
  page,
}) => {
  // Mock signed-in user
  await page.locator('button[data-testid="sign-in-button"]').click();
  await page.goto("http://localhost:8000");

  const initialChords = "C G Am F";
  const initialLyrics = "Verse 1 lyrics";

  // Check if the ChordProgressionGenerator is visible
  await expect(page.locator(".dynamic-text-boxes-section")).toBeVisible();

  // Assuming you have text input elements for chords and lyrics
  await page.fill('textarea[name="chords"]', initialChords);
  await page.fill('textarea[name="lyrics"]', initialLyrics);

  // Save song
  await page.click('button:has-text("Save Song")');

  // Check for success alert
  await expect(page.locator("div.alert")).toHaveText(
    "Song saved successfully!"
  );
});

test("should render voice memo section", async ({ page }) => {
  // Test that the voice memo section is visible when signed in
  await page.locator('button[data-testid="sign-in-button"]').click();
  await page.goto("http://localhost:8000");

  const voiceMemoSection = page.locator(".voice-memo-footer");
  await expect(voiceMemoSection).toBeVisible();
  await expect(voiceMemoSection.locator("h4")).toHaveText("Record your song!");

  // Check if the VoiceMemo component is available
  await expect(
    page.locator('button[aria-label="Record Voice Memo"]')
  ).toBeVisible();
});

test("should save song with correct data", async ({ page }) => {
  // Mock signed-in user and fill song data
  await page.locator('button[data-testid="sign-in-button"]').click();
  await page.goto("http://localhost:8000");

  const songTitle = "My New Song";
  const chords = "C G Am F";
  const lyrics = "These are the lyrics";

  // Fill out the form
  await page.fill('input[name="song-title"]', songTitle);
  await page.fill('textarea[name="chords"]', chords);
  await page.fill('textarea[name="lyrics"]', lyrics);

  // Submit the form (save song)
  await page.click('button:has-text("Save Song")');

  // Validate the success message
  await expect(page.locator("div.alert")).toHaveText(
    "Song saved successfully!"
  );
});
