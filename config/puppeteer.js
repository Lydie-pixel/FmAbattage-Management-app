const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium").default;

const isProd = process.env.NODE_ENV === "production";

module.exports = async function launchBrowser() {
  if (isProd) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // DEV (Windows)
  const puppeteerLocal = require("puppeteer");

  return puppeteerLocal.launch({
    headless: true,
  });
};