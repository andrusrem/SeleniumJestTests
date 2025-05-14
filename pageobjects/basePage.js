// parent page for all the functions

module.exports = class Page {

    constructor(driver) {
        this.driver = driver
    }
    async openUrl(url) {
        return await this.driver.get(url)
    }

    async getElement(locator)
    {
        await this.driver.findElement(locator)
    }
    async findAndClick(locator)
    {
        await this.driver.findElement(locator).click()
    }


}