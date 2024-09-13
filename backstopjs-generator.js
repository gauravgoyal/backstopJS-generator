const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

const cache = new Map();

// Function to fetch data from a URL and cache it
const fetchData = async (url) => {
  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await axios.get(url);
    cache.set(url, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching the URL: ${error.message}`);
    throw error;
  }
};

// Helper function to generate text based on URL
const generateTextFromUrl = (url) => {
  return url.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '').replace(/[-_]/g, ' ').split('/').pop();
};

// Function to extract links from HTML content based on a selector
const extractLinksFromHtml = (html, selector) => {
  const $ = cheerio.load(html);
  const links = $(selector);
  const urls = [];

  links.each((index, element) => {
    let href = $(element).attr('href');
    if (!href || !href.includes(process.env.WEBSITE_URL)) {
      return;
    }

    let text = $(element).text();
    if (!href.startsWith('http')) {
      href = `${process.env.WEBSITE_URL}${href}`;
    }
    if (!text) {
      text = generateTextFromUrl(href);
    }
    urls.push({ href, text });
  });

  return urls;
};

// Function to extract links from XML content
const extractLinksFromXml = async (xml) => {
  const $ = cheerio.load(xml, { xmlMode: true });
  const links = $('loc');
  const urls = [];

  for (const element of links) {
    const href = $(element).text();
    let text = generateTextFromUrl(href);
    if (href.includes('.xml')) {
      const nestedUrls = await fetchInternalLinksFromSitemap(href);
      urls.push(...nestedUrls);
    } else {
      urls.push({ href, text });
    }
  }

  return urls;
};

// Function to scrap a website for all the internal links based on a HTML selector
const scrapWebsiteForLinks = async (url, selector) => {
  const html = await fetchData(url);
  return extractLinksFromHtml(html, selector);
};

// Function to fetch all internal links from sitemap of a website
const fetchInternalLinksFromSitemap = async (url) => {
  const xml = await fetchData(url);
  return extractLinksFromXml(xml);
};

// Main function to fetch links based on .env settings
const fetchLinks = async () => {
  try {
    let links;
    if (process.env.FETCH_INTERNAL_LINKS_FROM_SITEMAP === 'true') {
      links = await fetchInternalLinksFromSitemap(process.env.SITEMAP_URL);
    } else {
      links = await scrapWebsiteForLinks(process.env.WEBSITE_URL, process.env.LINK_SELECTOR);
    }
    return links;
  } catch (error) {
    console.error(`Error fetching links: ${error.message}`);
    return [];
  }
};

// Function to generate the backstop configuration
const generateBackstopConfig = async () => {
  const links = await fetchLinks();

  const backstopConfig = {
    id: "backstop_playwright",
    viewports: [
      {
        label: "phone",
        width: 320,
        height: 480
      },
      {
        label: "tablet",
        width: 1024,
        height: 768
      },
      {
        "label": "desktop",
        "width": 1366,
        "height": 768
      }
    ],
    onBeforeScript: "playwright/onBefore.js",
    onReadyScript: "playwright/onReady.js",
    scenarioDefaults: {
      cookiePath: "backstop_data/engine_scripts/cookies.json",
      url: process.env.WEBSITE_BASE_URL,
      readySelector: "",
      delay: parseInt(process.env.DELAY, 10) || 0,
      hideSelectors: process.env.HIDE_SELECTORS ? process.env.HIDE_SELECTORS.split(',') : [],
      removeSelectors: process.env.REMOVE_SELECTORS ? process.env.REMOVE_SELECTORS.split(',') : [],
      hoverSelector: "",
      clickSelector: "",
      postInteractionWait: parseInt(process.env.POST_INTERACTION_WAIT, 10) || 1000,
      selectors: [],
      selectorExpansion: true,
      misMatchThreshold: parseFloat(process.env.MISMATCH_THRESHOLD) || 0.1,
      requireSameDimensions: true
    },
    scenarios: links.map(link => {
      const path = new URL(link.href).pathname;
      const referenceUrl = `${process.env.REFERENCE_URL}${path}`;
      return {
        label: link.text || link.href,
        cookiePath: "backstop_data/engine_scripts/cookies.json",
        url: referenceUrl,
        referenceUrl: link.href,
        readyEvent: "",
      };
    }),
    paths: {
      bitmaps_reference: "backstop_data/bitmaps_reference",
      bitmaps_test: "backstop_data/bitmaps_test",
      engine_scripts: "backstop_data/engine_scripts",
      html_report: "backstop_data/html_report",
      ci_report: "backstop_data/ci_report"
    },
    report: ["browser"],
    engine: "playwright",
    engineOptions: {
      args: ["--no-sandbox"]
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false,
    debugWindow: false,
    archiveReport: true,
    scenarioLogsInReports: true
  };

  fs.writeFileSync('backstop.json', JSON.stringify(backstopConfig, null, 2));
  console.log('backstop.json has been generated.');
};

generateBackstopConfig();

module.exports = {
  fetchData,
  generateTextFromUrl,
  extractLinksFromHtml,
  extractLinksFromXml,
  scrapWebsiteForLinks,
  fetchInternalLinksFromSitemap,
  fetchLinks,
  generateBackstopConfig
};