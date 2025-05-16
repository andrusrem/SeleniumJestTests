const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const HomePage = require("../pageobjects/homePage");
const SearchBar = require("../pageobjects/searchBar");

const TIMEOUT = 10000;

let driver;
let homePage;
let searchBar;
let resultsPage;

describe("Search products by keywords", () => {
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
    //   .setChromeOptions(new chrome.Options().addArguments("--headless"))
      .build();

    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: TIMEOUT });

    homePage = new HomePage(driver);
    await homePage.openUrl();
    await homePage.acceptCookies();

    searchBar = new SearchBar(driver);
  }, TIMEOUT);

  afterAll(async () => {
    await driver.quit();
  }, TIMEOUT);

  test("Test logo element is visible", async () => {
    await homePage.verifyLogo();
  }, TIMEOUT);

  test("Test if multiple results are shown when searching for 'Harry Potter'", async () => {
    resultsPage = await searchBar.search("Harry Potter");
    await resultsPage.verifyMinResultsCount(2);
  }, TIMEOUT);

  test("Test if all results contain the keyword 'Harry Potter'", async () => {
    await resultsPage.checkResultsForKeyword("Harry Potter");
  }, TIMEOUT);

  test("Test if filtering to hardback reduces amount of results", async () => {
    const initialResultsCount = await resultsPage.getResultsCount();
    await resultsPage.addFilter("Hardback");
    const newResultsCount = await resultsPage.getResultsCount();

    expect(Number(initialResultsCount)).toBeGreaterThan(
      Number(newResultsCount)
    );
  }, TIMEOUT);

  test("Test if filtered results match filter of Hardback", async () => {
    await resultsPage.verifyResultsFormatType("Hardback");
  }, TIMEOUT);

  test("Test if all results are in English", async () => {
    await searchBar.setLanguageToEnglish();
    resultsPage = await searchBar.search("");
    await resultsPage.verifyResultsAreInEnglish();
  }, TIMEOUT);
})