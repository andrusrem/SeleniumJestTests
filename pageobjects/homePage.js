// has everything related to home page
const Page = require('./basePage')
const Cartpage = require('./cartPage')

const { By } = require('selenium-webdriver')

// move all the cliks and element locators here
const homePageUrl = 'https://www.kriso.ee/'

const acceptCookiesBtn = By.className('cc-nb-okagree')
const logoItem = By.className('icon-kriso-logo')
const offerBookLink = By.className('book-img-link')
const addToCartBtn = By.id('btn_addtocart')
const cartMessage = By.css('.item-messagebox')
const cartBackBtn = By.className('cartbtn-event back')
const cartForwardBtn = By.className('cartbtn-event forward')


module.exports = class Homepage extends Page  {

    async openUrl() {
        await super.openUrl(homePageUrl)
    }

    async search(keyword) {
        const searchBox = await this.driver.findElement(By.name('keyword'));
        await searchBox.sendKeys(keyword, '\n');
      }

    async acceptCookies() {
        await super.findAndClick(acceptCookiesBtn)
    }

    async verifyLogo() {
        const logo = await super.getElement(logoItem)
        expect(logo).toBeDefined()
    }

    async openBookPage(number) {
        const bookLinks = await super.getElements(offerBookLink)
        await super.click(bookLinks[number-1])
    }

    async addItemToShoppingCart() {
        await super.findAndClick(addToCartBtn)
    }

    async verifyItemAddedToCart() {
        await super.waitUntilElementText(cartMessage, 'Toode lisati ostukorvi')
    }

    async continueShopping() {
        await super.findAndClick(cartBackBtn)
        await super.findAndClick(logoItem)
    }

    async openShoppingCart() {
        await super.findAndClick(cartForwardBtn)
        return new Cartpage(super.getDriver())
    }
}