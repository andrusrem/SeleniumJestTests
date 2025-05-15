const { Builder, By } = require('selenium-webdriver');
const Homepage = require('../pageobjects/homePage');
const SearchResultsPage = require('../pageobjects/searchResultsPage');

let driver;
const TIMEOUT = 60000;

describe('Shopping cart workflow', () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome')
            // .setChromeOptions(new chrome.Options().addArguments('--headless'))
            .build()
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts({ implicit: TIMEOUT })
        home = new Homepage(driver);
        results = new SearchResultsPage(driver);
        await home.openUrl();
        await home.acceptCookies();
    }, 20000);

    afterAll(async () => {
        await driver.quit();
    }, 10000);

    test('Search for "harry potter" shows multiple relevant results', async () => {
        await home.search('harry potter');

        const titles = await results.getProductTitles();
        expect(titles.length).toBeGreaterThan(1);

        titles.forEach(title => {
            expect(title.toLowerCase()).toMatch(/harry|potter/);
        });
    }, 20000);


    test('Filter by English language works', async () => {
        await results.filterByLanguage('Inglisekeelsed raamatud');

        const language = await results.getProductLanguage();
        
        expect(language.toLowerCase()).toContain('Otsingu tulemus - Ingliskeelsed raamatud');
        
    }, 20000);

    test('Filter by format "Kõvakaaneline" shows correct items', async () => {
        await results.filterByFormat('Hardback');

        const formats = await results.getProductFormats();
        expect(formats.length).toBeGreaterThan(0);
        formats.forEach(format => {
            expect(format.toLowerCase()).toContain('Hardback');
        });
    }, 20000);
})
