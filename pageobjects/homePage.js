const { By } = require('selenium-webdriver');
const homePageUrl = 'https://www.kriso.ee/';
const Page = require('./basePage')

const acceptCookiesButton = By.className('cc-nb-okagree')
const logoItem = By.className('icon-kriso-logo')
module.exports = class Homepage extends Page {
    async openUrl() {
        await super.openUrl(homePageUrl)
    }

    async acceptCookies()
    {
        await super.findAndClick(acceptCookiesButton)
    }

    async verifyLogo() {
        const logo = await this.getElement(logoItem);
        expect(logo).toBeDefined();
    }
}