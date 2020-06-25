require('dotenv').config();
const $ = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');

const referenceUrl = process.env.REFERENCE_URL;
const referredUrl = process.env.REFERRED_URL;
const delay = process.env.DELAY || 2000;
const selector = process.env.LINK_SELECTOR || 'a';

rp(referenceUrl).then(html => {
  const linkObjects = $(selector, html);
  const links = [];
  // we only need the "href" and "title" of each link

  linkObjects.each(function (index, element) {
    let title = $(element).text().replace(/(\r\n|\n|\r)/gm, "").trim();
    if (title !== undefined && title != '' &&  element.attribs.href != '#' && !links.some(el => el.href === element.attribs.href)) {
      links.push({
          href: element.attribs.href,
          title: title
      });
    }
  })

  const scenarios = [];

  links.forEach(function(element) {
    scenarios.push({
      "label": element.title,
      "url": referredUrl + element.href,
      "referenceUrl": referenceUrl + element.href,
      "cookiePath": "backstop_data/engine_scripts/cookies.json",
      "readyEvent": "",
      "readySelector": "",
      "delay": parseInt(delay),
      "hideSelectors": [],
      "removeSelectors": [],
      "hoverSelector": "",
      "clickSelector": "",
      "postInteractionWait": 0,
      "selectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold" : 0.1,
      "requireSameDimensions": true
    });
  })

  // Generate backstop.json file.
  var json = {
    "viewports": [
      {
        "label": "desktop",
        "width": 1368,
        "height": 1600
      }
    ],
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "scenarios": scenarios,
    "paths": {
      "bitmaps_reference": "backstop_data/bitmaps_reference",
      "bitmaps_test": "backstop_data/bitmaps_test",
      "engine_scripts": "backstop_data/engine_scripts",
      "html_report": "backstop_data/html_report",
      "ci_report": "backstop_data/ci_report"
    },
    "report": ["browser"],
    "engine": "puppeteer",
    "engineOptions": {
      "args": ["--no-sandbox"]
    },
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 50,
    "debug": true,
    "debugWindow": false,
  };
  let data = JSON.stringify(json);
  fs.writeFileSync('backstop.json', data);

})
.catch(err => {
    console.log(err);
})
