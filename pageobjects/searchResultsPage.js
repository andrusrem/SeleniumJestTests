const { By } = require('selenium-webdriver');

class SearchResultsPage {
  constructor(driver) {
    this.driver = driver;
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
