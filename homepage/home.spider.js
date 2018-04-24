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
  let screening = await page.evaluate(getScreeningInfo);
  let hotMovie = await page.evaluate(getHotMovieInfo);
  browser.close();
  return {
    hotMovie
  };
};

function getScreeningInfo() { // 获取热映电影信息
  let screeningArray = [];
  let elements = [...document.querySelectorAll('#screening > div.screening-bd > ul > li')];
  elements.splice(elements.length - 10, 10);

  for (let el of elements) {
    if (el.dataset.title) {
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
}

function getHotMovieInfo() { // 获取热门电影
  let hotMovieArray = [];
  let elements = [...document.querySelectorAll('.gaia-movie .slide-page')];
  elements.splice(0, 1).splice(elements.length - 1, 1);
  for(let el of elements) {
    let itemArray = [];
    for(let child of el.children) {
      let titleArray = (child.innerText.replace(/[\r\n]/g, '')).split(' ');
      itemArray.push({
        title: titleArray[0],
        rate: titleArray[1],
        img: child.querySelector('img').src
      });
    }
    hotMovieArray.push(itemArray);
  }
  return JSON.stringify(hotMovieArray);
}

scape().then((value) => {
  console.log(value);
});