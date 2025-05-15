const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let Homepage = require('../pageobjects/homePage');
require('@jest/globals');

let driver;
const TIMEOUT = 60000;

describe('Shopping cart workflow', () => {

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome')
        // .setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build()
        await driver.manage().window().maximize()
        await driver.manage().setTimeouts({implicit: TIMEOUT})
        Homepage = new Homepage(driver)
        await Homepage.openUrl();
        await Homepage.acceptCookies();
    }, TIMEOUT)

    afterAll(async () => {
        await driver.quit()
    })

    test('Test logo element is visible', async () => {
        await Homepage.verifyLogo();
    })

    test('Test add first item to shopping cart', async () => {
        await Homepage.openBookPage(1)
        await Homepage.addItemToShoppingCart()
        await Homepage.verifyItemAddedToCart()
      });
    
      test('Test continue shopping', async () => {
        await Homepage.continueShopping()
      });
    
      test('Test add second item to shopping cart', async () => {
        await Homepage.openBookPage(2)
        await Homepage.addItemToShoppingCart()
        await Homepage.verifyItemAddedToCart()
      });
    
      test('Test verify cart has two items', async () => {
        Cartpage = await Homepage.openShoppingCart()
        await Cartpage.verifyCartQuantity(2)
      });
    
      test('Test verify cart has correct sum of two', async () => {
        cartSumOfTwo = await Cartpage.verifyCartSumIsCorrect()
      });
    
      test('Test remove one item from the shopping cart', async () => {
        await Cartpage.removeItemFromCart(1)
        await Cartpage.verifyCartQuantity(1)
      });
    
      test('Test verify cart has correct sum of one', async () => {
        cartSumOfOne = await Cartpage.verifyCartSumIsCorrect()
        expect(cartSumOfOne).toBeLessThan(cartSumOfTwo)
      });
    
    });