# Description
This is a fairly simple node js implementation and more of a boilerplate, which aims to automate the scenarios for and regenerates the backstop.json file with default configurations.

This generator automates the scenarios generation process. For e.g. if you want to run visual regression on all the links under main menu, this generator get all those links, and will generate the scenarios.

## Installation steps
* Install latest version of node.js. Download it from [here](https://nodejs.org/en/download/)
* Download this repository, and goto backstop-generator folder
* Run `npm install`
* Create a `.env` file inside the folder.
   * `REFERENCE_URL` - Give the absolute reference website URL. The screenshots from this URL will be used as base URL.
   * `REFERRED_URL` - Give the absolute referred website URL. If this url is behind a htaccess, pass the credentials in the URL.
   * `DELAY` - Give the delay in ms. This is the time the script wait to take the screenshot.
   * `LINK_SELECTOR` - Give a selector which will be used to grab all the href tests, to run visual regression tests. Keeping it empty would take all the anchor tags from the `REFERENCE_URL`.
* Run `npm run default` - it will generate the default configurations needed to run backstopJS.
* Run `npm run generate` - it will generate and update the `backstop.json` file with all the scenarios.
* Run `npm run reference` to generate the screenshots for reference websites.
* Run `npm run comparision` to generate a comparision report.

## Updating configurations
Once backstop js generates the configuration, its role is finished. If you want to change any of the configuration within scnearios, those should happen inside backstop.json or you can change backstopjs-generator.js.

## Credits
Thanks to [BackstopJS](https://github.com/garris/BackstopJS) for creating a wonderful tool visual regression tool.
