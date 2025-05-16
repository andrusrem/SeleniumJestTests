const { Builder, By } = require('selenium-webdriver');
const Homepage = require('../pageobjects/homePage');
const SearchResultsPage = require('../pageobjects/searchResultsPage');
const SearchBar = require('../pageobjects/searchBar');

let driver;
const TIMEOUT = 60000;

describe('Search workflow', () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome')
            // .setChromeOptions(new chrome.Options().addArguments('--headless'))
            .build()
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts({ implicit: TIMEOUT })
        home = new Homepage(driver);
        results = new SearchResultsPage(driver);
        searchBar = new SearchBar(driver);
        await home.openUrl();
        await home.acceptCookies();
    }, 20000);

    afterAll(async () => {
        await driver.quit();
    }, 10000);

    test("Test logo element is visible", async () => {
    await home.verifyLogo();
  }, 20000);

  test("Test if multiple results are shown when searching for 'Harry Potter'", async () => {
    resultsPage = await searchBar.search("Harry Potter");
    await resultsPage.verifyMinResultsCount(2);
  }, 20000);

  test("Test if all results contain the keyword 'Harry Potter'", async () => {
    await resultsPage.checkResultsForKeyword("Harry Potter");
  }, 20000);

  test("Test if filtering to hardback reduces amount of results", async () => {
    const initialResultsCount = await resultsPage.getResultsCount();
    await resultsPage.addFilter("Hardback");
    const newResultsCount = await resultsPage.getResultsCount();

    expect(Number(initialResultsCount)).toBeGreaterThan(
      Number(newResultsCount)
    );
  }, 20000);

  test("Test if filtered results match filter of Hardback", async () => {
    await resultsPage.verifyResultsFormatType("Hardback");
  }, 20000);

  test("Test if all results are in English", async () => {
    await searchBar.setLanguageToEnglish();
    resultsPage = await searchBar.search("");
    await resultsPage.verifyResultsAreInEnglish();
  }, 20000);
})
