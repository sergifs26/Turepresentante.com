import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const SCREENSHOT_PATH =
  'C:\\Users\\sergi\\OneDrive\\Documentos\\Turepresentante.com\\.superpowers\\brainstorm\\947-1781028862\\content\\boot-3d-compressed.png';

const consoleMessages = [];
const networkErrors = [];

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  // No cache by using a fresh context (default)
});

const page = await context.newPage();

// Capture console messages
page.on('console', (msg) => {
  consoleMessages.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
});

// Capture page errors
page.on('pageerror', (err) => {
  consoleMessages.push(`[PAGEERROR] ${err.message}`);
});

// Capture failed requests (404s, network errors)
page.on('requestfailed', (request) => {
  networkErrors.push(`[NET-FAIL] ${request.method()} ${request.url()} — ${request.failure()?.errorText}`);
});

page.on('response', async (response) => {
  if (response.status() === 404) {
    networkErrors.push(`[404] ${response.url()}`);
  }
});

console.log('Navigating to http://localhost:3000/ ...');
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 30000 });

console.log('Waiting 7 seconds for 3D model to load...');
await page.waitForTimeout(7000);

// Take screenshot
await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
console.log(`Screenshot saved to: ${SCREENSHOT_PATH}`);

// Collect all output
const report = {
  screenshotPath: SCREENSHOT_PATH,
  consoleMessages,
  networkErrors,
  pageTitle: await page.title(),
  pageUrl: page.url(),
};

console.log('\n=== REPORT ===');
console.log(JSON.stringify(report, null, 2));

await browser.close();
