import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Define the test directory (where your tests are located)
  testDir: "./tests", // Change this to match where your test files are located

  // Timeout for each test, set to 30 seconds (adjust as needed)
  timeout: 30000,

  // Global setup and teardown
  globalSetup: "./global-setup.ts", 

 
  use: {

    headless: process.env.CI ? true : false, 
    viewport: { width: 1280, height: 720 },
    userAgent: "Playwright",
    // Configure base URL
    baseURL: "http://localhost:3232", // Update with your app's URL
    // Enable tracing for debugging
    trace: "on-first-retry", // 'on' to always capture traces, 'on-first-retry' for retries
    screenshot: "on-failure", // Screenshot on failure
    video: "on-first-retry", // Video on first retry, 'on' to always capture video
  },

  // Configure test runner options
  reporter: [
    ["html", { open: "never" }],
    ["junit", { outputFile: "results.xml" }],
  ], // HTML report and JUnit results

  // Configure the browser context
  projects: [
    {
      name: "firefox", // Test against Firefox
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit", // Test against WebKit (Safari)
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "chromium", // Test against Chromium (Chrome)
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Specify test retries
  retries: process.env.CI ? 2 : 0, // Retry failed tests on CI

  // Reporter options for logging and video recording
  outputDir: "test-results", // Store test results in this folder

  // For CI configuration, you may set parallelization limits
  workers: process.env.CI ? 2 : 4, // Parallel test execution
});
