const puppeteer = require("puppeteer");
const fs = require('fs');


// anounymous function
// we have to wait for this function to get data from the website. thats why this function async
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    // below using go to function in puppeteer
    await page.goto("https://www.helakuru.lk/esana/news/");
    // getting screenshot for test
    await page.screenshot({path: "screenshot.png"});

    const cancel = await page.$('.close');
    await cancel.click();

    await new Promise(function(resolve) { 
        setTimeout(resolve, 1000)
    });

    // create new function that can evaluate and grab data from web page
    const grab =  await page.evaluate(() => {
        if(document.querySelector("#news_item_container > div > div > div.col-8 > div") != null) {
        const news = document.querySelector("#news_item_container > div > div > div.col-8 > div");
        return news.innerHTML;
        }
    });

    // second function

    const news = await page.evaluate(() => {
        const results = Array.from(
          document.querySelectorAll('#news_item_container > div > div > div.col-8 > div > p'),
          p => p.innerText,
        );
  
        return [results];
      });

    //   const text = await news
    // console.log("Text is: " + text)

    console.log(news);
    await browser.close();
})();