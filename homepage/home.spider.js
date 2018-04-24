/**
 * 豆瓣首页爬虫,包括热映电影、热门电影、热门电视剧
 */

const pupprteer = require('puppeteer');
let scape = async () => {
  const browser = await pupprteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://movie.douban.com/'); // 进入豆瓣电影首页
  await page.waitFor(1000); // 等待页面加载完毕
  let screening = await page.evaluate(() => {
    let screeningArray = [];
    let elements = [...document.querySelectorAll('#screening > div.screening-bd > ul > li')];

    elements.splice(elements.length - 10, 10);
    for (let el of elements) {
      if(el.dataset.title) {
        screeningArray.push({
          title: el.dataset.title,
          actors: el.dataset.actors,
          director: el.dataset.director,
          duration: el.dataset.duration,
          rate: el.dataset.rate,
          region: el.dataset.region,
          img: el.querySelector('img').src
        });
      }
    }
    return screeningArray;
  });
  browser.close();
  return screening;
};


scape().then((value) => {
  console.log(value);
});