const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => {
    consoleLogs.push({ type: 'pageerror', text: err.message });
  });
  page.on('requestfailed', req => {
    consoleLogs.push({ type: 'requestfailed', text: `${req.failure().errorText} - ${req.url()}` });
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  console.log('Waiting 12 seconds for 3D model to load...');
  await page.waitForTimeout(12000);

  const screenshotPath = 'C:\\Users\\sergi\\OneDrive\\Documentos\\Turepresentante.com\\.superpowers\\brainstorm\\947-1781028862\\content\\boot-3d-v1.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);

  console.log('=== CONSOLE MESSAGES ===');
  consoleLogs.forEach(log => {
    console.log(`[${log.type.toUpperCase()}] ${log.text}`);
  });

  await browser.close();
})();
