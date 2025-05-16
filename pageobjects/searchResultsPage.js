const { By, until } = require('selenium-webdriver');
const BasePage = require("./basePage");

const result = By.css(".book-list > .list-item");
const title = By.css(".book-title");
const description = By.css(".book-desc-short > span");
const bookFeatures = By.className("book-features");
const categoryName = By.css(".catbrowser > h2 > span");

const englishRegex =
  /^[\p{L}\p{N}\s.,!?'"():;\-–—&/\\[\]{}@#%*+=<>_|~`’™…®]*$/u;

class SearchResultsPage extends BasePage {
  constructor(driver) {
    super();
    this.driver = driver;
  }

  async verifyMinResultsCount(count) {
    const elements = await super.findElements(result);
    expect(elements.length).toBeGreaterThan(count);
  }

  async getProductTitles() {
    const elements = await this.driver.findElements(By.className('book-list clearfix'));
    const titles = [];
    for (const el of elements) {
      const text = await el.getText();
      titles.push(text.trim());
    }
    return titles;
  }

  async verifyResultsAreInEnglish() {
    await this.driver.wait(until.elementLocated(result), 5000);

    const elements = await super.findElements(result);
    for (const el of elements) {
      const titleText = await super.getChildText(el, title);
      const descText = await super.getChildText(el, description);

      const isTitleEnglish = englishRegex.test(titleText);
      const isDescEnglish = englishRegex.test(descText);

      expect(isTitleEnglish && isDescEnglish).toBe(true);
    }
  }

  async getResultsCount() {
    const headerText = await super.findElement(
      By.xpath(`//i[normalize-space()='Otsingu tulemused']`),
    );

    const header = await headerText.findElement(By.xpath("./ancestor::h2[1]"));
    const resultsContainer = await header.findElement(
      By.xpath("following-sibling::div[1]"),
    );

    const resultsCount = await resultsContainer.findElement(
      By.className("sb-results-total"),
    );

    return await resultsCount.getText();
  }

  async addFilter(filter) {
    await super.findAndClick(By.xpath(`//a[contains(string(), "${filter}")]`));
  }

  async verifyResultsFormatType(formatType) {
    const elements = await super.findElements(result);
    for (const el of elements) {
      const features = await super.getChildText(el, bookFeatures);
      expect(features.toLowerCase()).toContain(formatType.toLowerCase());
    }
  }

  async navigateToSubCategory(subcategory) {
    await super.findAndClick(
      By.xpath(`//i[contains(string(), "${subcategory}")]`),
    );
  }

  async getCurrentCategoryName() {
    return await super.getElementText(categoryName);
  }

  async getProductPrices() {
    const priceElements = await this.driver.findElements(By.css('.book-price'));
    const prices = await Promise.all(
      priceElements.map(async el => {
        const text = await el.getText();
        return parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));
      })
    );
    return prices.filter(p => !isNaN(p));
  }

  async sortBy(optionText) {
    const dropdown = await this.driver.findElement(By.css('select[name="sort"]'));
    await dropdown.sendKeys(optionText); // e.g. "Hind: odavam enne"
  }

  async filterByLanguage(language) {
    //  await this.driver.findElement(By.css('select[name="database"]')).click();

    await this.driver.findElement(
      By.xpath(`//*[@id="top-csel"]/option[contains(text(), "${language}")]`)
    ).click();
    
  }

  async filterByFormat(format) {
    const formatFilter = await this.driver.findElement(By.xpath(`//*[@id="section-wrap"]/div/div[2]/div[2]/div[7]/div/ul[1]/li[contains(text(),"${format}")]`));
    await formatFilter.click();
  }
  async getProductLanguage() {
    const langs = await this.driver.findElement(By.className('pb-loc-last'));
    return Promise.all(langs.getText());
  }

  async getProductFormats() {
    const formats = await this.driver.findElements(By.css('.book-list .clearfix'));
    return Promise.all(formats.map(async el => await el.getText()));
  }
}

module.exports = SearchResultsPage;
