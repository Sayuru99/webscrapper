const puppeteer = require("puppeteer");
const fs = require('fs');


// anounymous function
// we have to wait for this function to get data from the website. thats why this function async
(async () => {
  const browser = await puppeteer.launch();
  // if you want to open browser insert these code line inside paranthesis `{headless: false}`  example - launch({headless: false})
  const page = await browser.newPage()
  // below using go to function in puppeteer
  await page.goto("https://www.helakuru.lk/esana/news/");
  // getting screenshot for test
  await page.screenshot({ path: "screenshot.png" });

  // clicking notification enable button
  const cancel = await page.$('.close');
  await cancel.click();

  await new Promise(function (resolve) {
    setTimeout(resolve, 1000)
  });

  // create new function that can evaluate and grab data from web page
  const grab = await page.evaluate(() => {
    if (document.querySelector("#news_item_container > div > div > div.col-8 > div") != null) {
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

  //console.log(news);

  // save news data into json file
  for (let i = 0; i < news.length; i++) {
    console.log(news[i]);
    fs.writeFile('./src/news.json', JSON.stringify(news[i]), err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  }
  //console.log(news[0][0]);

  await browser.close();
})();