# Description
This project is a Node.js implementation designed to automate the generation of scenarios for BackstopJS and regenerate the `backstop.config.json` file with default configurations. It serves as a boilerplate to streamline the process of setting up visual regression tests.

The generator automates the scenario generation process. For example, if you want to run visual regression tests on all the links under the main menu, this generator fetches all those links and generates the necessary scenarios.

## Installation Steps
1. **Install Node.js**:
   - Download and install the latest version of Node.js from [here](https://nodejs.org/en/download/).

2. **Clone the Repository**:
   - Clone this repository and navigate to the `backstop-generator` folder:
     ```sh
     git clone <repository-url>
     cd backstop-generator
     ```

3. **Install Dependencies**:
   - Run the following command to install the required dependencies:
     ```sh
     yarn install
     ```

4. **Create a `.env` File**:
   - Create a `.env` file in the root directory of the project with the following variables:
     - `REFERENCE_URL`: The absolute reference website URL. Screenshots from this URL will be used as the base for comparison.
     - `WEBSITE_URL`: The absolute website URL to be tested. If this URL is behind htaccess, include the credentials in the URL.
     - `DELAY`: The delay in milliseconds before taking the screenshot.
     - `LINK_SELECTOR`: The CSS selector used to grab all the href links for visual regression tests. If left empty, it will select all anchor tags from the `WEBSITE_URL`.
     - `HIDE_SELECTORS`: A comma-separated list of CSS selectors for elements to hide before capturing screenshots.
     - `REMOVE_SELECTORS`: A comma-separated list of CSS selectors for elements to remove before capturing screenshots.
     - `POST_INTERACTION_WAIT`: The wait time in milliseconds after interactions (like clicks) before capturing screenshots.
     - `MISMATCH_THRESHOLD`: The mismatch threshold for image comparisons, determining the acceptable percentage of pixel differences between the reference and test images.
     - `FETCH_INTERNAL_LINKS_FROM_SITEMAP`: Set to `true` to fetch links from the sitemap, or `false` to scrape the website for links using the specified HTML selector.
     - `SITEMAP_URL`: The URL of the sitemap to fetch internal links from.

### Example `.env` File:

```env
REFERENCE_URL=https://reference.example.com
WEBSITE_URL=https://example.com
DELAY=500
LINK_SELECTOR=a
HIDE_SELECTORS=.getItBlock,.anotherSelector
REMOVE_SELECTORS=.logoBlock,.anotherRemoveSelector
POST_INTERACTION_WAIT=2000
MISMATCH_THRESHOLD=0.05
FETCH_INTERNAL_LINKS_FROM_SITEMAP=true
SITEMAP_URL=https://example.com/sitemap.xml
```

## Usage
* Run `npm run generate-config` - This will initialize BackstopJS and generate the `backstop.config.json` file with all the scenarios.
* Run `npm run reference-backstop` - This will generate the reference screenshots for the reference website.
* Run `npm run test-backstop` - This will run the visual regression tests.
* Run `npm run approve-backstop` - This will approve the test results.

## Updating configurations
Once BackstopJS generates the configuration, its role is finished. If you want to change any of the configurations within scenarios, those should happen inside `backstop.config.json` or you can change `generateBackstopConfig.js`.

## Credits
Thanks to [BackstopJS](https://github.com/garris/BackstopJS) for creating a wonderful visual regression tool.