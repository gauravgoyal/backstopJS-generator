const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const {
  fetchData,
  generateTextFromUrl,
  extractLinksFromHtml,
  extractLinksFromXml,
  scrapWebsiteForLinks,
  fetchInternalLinksFromSitemap,
  fetchLinks,
  generateBackstopConfig
} = require('./backstopjs-generator');

jest.mock('axios');
jest.mock('fs');

describe('backstopjs-generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchData', () => {
    it('should fetch and cache data', async () => {
      const url = 'https://example.com';
      const data = '<html></html>';
      axios.get.mockResolvedValue({ data });

      const result = await fetchData(url);
      expect(result).toBe(data);
      expect(axios.get).toHaveBeenCalledWith(url);

      // Fetch again to test cache
      const cachedResult = await fetchData(url);
      expect(cachedResult).toBe(data);
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

  });

  describe('generateTextFromUrl', () => {
    it('should generate text from URL', () => {
      const url = 'https://example.com/some-page';
      const result = generateTextFromUrl(url);
      expect(result).toBe('some page');
    });
  });

  describe('extractLinksFromHtml', () => {
    it('should extract links from HTML', () => {
      process.env.WEBSITE_URL = 'https://example.com';
      const html = '<a href="https://example.com/page1">Page 1</a>';
      const selector = 'a';
      const result = extractLinksFromHtml(html, selector);
      expect(result).toEqual([{ href: 'https://example.com/page1', text: 'Page 1' }]);
    });
  });

  describe('extractLinksFromXml', () => {
    it('should extract links from XML', async () => {
      process.env.WEBSITE_URL = 'https://example.com';
      const xml = '<urlset><url><loc>https://example.com/page1</loc></url></urlset>';
      const result = await extractLinksFromXml(xml);
      expect(result).toEqual([{ href: 'https://example.com/page1', text: 'page1' }]);
    });
  });

  describe('fetchInternalLinksFromSitemap', () => {
    it('should fetch internal links from sitemap', async () => {
      const url = 'https://example.com/sitemap.xml';
      const xml = '<urlset><url><loc>https://example.com/page1</loc></url></urlset>';
      axios.get.mockResolvedValue({ data: xml });

      const result = await fetchInternalLinksFromSitemap(url);
      expect(result).toEqual([{ href: 'https://example.com/page1', text: 'page1' }]);
    });
  });

  describe('fetchLinks', () => {
    it('should fetch links based on .env settings (sitemap)', async () => {
      process.env.FETCH_INTERNAL_LINKS_FROM_SITEMAP = 'true';
      process.env.SITEMAP_URL = 'https://example.com/sitemap.xml';
      const xml = '<urlset><url><loc>https://example.com/page1</loc></url></urlset>';
      axios.get.mockResolvedValue({ data: xml });

      const result = await fetchLinks();
      expect(result).toEqual([{ href: 'https://example.com/page1', text: 'page1' }]);
    });
  });
});