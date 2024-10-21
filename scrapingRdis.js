const puppeteer = require('puppeteer');
const redis = require('redis');

const client = redis.createClient({
    host: 'localhost', // or '127.0.0.1'
    port: 6379
  });
  
  client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  await client.connect();
}

const nifty50Stocks = [
  'ADANIPORTS:NSE',
  'APOLLOHOSP:NSE',
  'ASIANPAINT:NSE',
  'AXISBANK:NSE',
  'BAJAJ-AUTO:NSE',
  'BAJAJFINSV:NSE',
  'BAJFINANCE:NSE',
  'BHARTIARTL:NSE',
  'BPCL:NSE',
  'CIPLA:NSE',
  'COALINDIA:NSE',
  'DIVISLAB:NSE',
  'DRREDDY:NSE',
  'EICHERMOT:NSE',
  'GRASIM:NSE',
  'HCLTECH:NSE',
  'HDFCBANK:NSE',
  'HDFCLIFE:NSE',
  'HEROMOTOCO:NSE',
  'HINDUNILVR:NSE',
  'ICICIBANK:NSE',
  'INDUSINDBK:NSE',
  'INFY:NSE',
  'ITC:NSE',
  'JSWSTEEL:NSE',
  'KOTAKBANK:NSE',
  'LT:NSE',
  'M&M:NSE',
  'MARUTI:NSE',
  'NESTLEIND:NSE',
  'NTPC:NSE',
  'ONGC:NSE',
  'POWERGRID:NSE',
  'RELIANCE:NSE',
  'SBILIFE:NSE',
  'SBIN:NSE',
  'SHREECEM:NSE',
  'SUNPHARMA:NSE',
  'TATACONSUM:NSE',
  'TATAMOTORS:NSE',
  'TATASTEEL:NSE',
  'TECHM:NSE',
  'TITAN:NSE',
  'TCS:NSE',
  'ULTRACEMCO:NSE',
  'UPL:NSE',
  'VEDL:NSE',
  'WIPRO:NSE'
];

async function scrapeStockData(stockSymbol, page) {
  const url = `https://www.google.com/finance/quote/${stockSymbol}`;
  await page.goto(url);

  try {
    await page.waitForSelector('.PdOqHc'); // Stock symbol
    await page.waitForSelector('.zzDege'); // Stock name
    await page.waitForSelector('.YMlKec.fxKbKc'); // Stock price
    await page.waitForSelector('.P2Luy.ZYVHBb'); // Stock price_change
    await page.waitForSelector('.NydbP.tnNmPe'); // Stock percentage_change

    const stockData = await page.evaluate(() => {
      let stockSymbol = document.querySelector('.PdOqHc').innerText; // Stock symbol
      let stockName = document.querySelector('.zzDege').innerText; // Stock name
      let stockPrice = document.querySelector('.YMlKec.fxKbKc').innerText; // Stock price
      let stockPriceChange = document.querySelector('.P2Luy.ZYVHBb').innerText; // Stock price_change
      let stockPercentageChange = document.querySelector('.NydbP.tnNmPe').innerText; // Stock percentage_change

      return {
        symbol: stockSymbol,
        name: stockName,
        price: stockPrice,
        priceChange: stockPriceChange,
        percentageChange: stockPercentageChange
      };
    });

    const additionalData = await page.evaluate(() => {
      const infoDivs = document.querySelectorAll('.gyFHrc');
      let data = {};

      infoDivs.forEach((div) => {
        const label = div.querySelector('.mfs7Fc')?.innerText.trim().toLowerCase();
        const value = div.querySelector('.P6K39c')?.innerText.trim();

        if (label) {
          data[label] = value;
        }
      });

      return data;
    });

    const combinedData = { ...stockData, ...additionalData };

    const newsData = await page.evaluate(() => {
      const newsItems = document.querySelectorAll('div.nkXTJ');

      return Array.from(newsItems).map(item => {
        const titleElement = item.querySelector('.Yfwt5');
        const linkElement = item.querySelector('a');
        const sourceElement = item.querySelector('.sfyJob');
        const dateElement = item.querySelector('.Adak');
        const imageElement = item.querySelector('img');

        const newsItem = {
          title: titleElement ? titleElement.innerText : null,
          link: linkElement ? linkElement.href : null,
          source: sourceElement ? sourceElement.innerText : null,
          date: dateElement ? dateElement.innerText : null,
          imageUrl: imageElement ? imageElement.src : null
        };

        return newsItem.title && newsItem.link ? newsItem : null;
      }).filter(item => item !== null);
    });

    combinedData.news = newsData;

    console.log(JSON.stringify(combinedData, null, 2)); // Pretty-print JSON
    await storeDataInRedis(stockSymbol, combinedData);

  } catch (error) {
    console.error(`Error fetching data for ${stockSymbol}:`, error);
  }
}

async function storeDataInRedis(stockSymbol, data) {
  if (data && Object.keys(data).length > 0) {
    await client.set(stockSymbol, JSON.stringify(data));
    console.log(`Data for ${stockSymbol} stored in Redis.`);
  } else {
    console.log(`No new data available for ${stockSymbol}, old data will remain unchanged.`);
  }
}

async function fetchData() {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const stockSymbol of nifty50Stocks) {
    console.log(`Fetching data for ${stockSymbol}...`);
    await scrapeStockData(stockSymbol, page);
  }

  await browser.close();
}

setInterval(() => {
  console.log(`Fetching data at ${new Date().toLocaleTimeString()}...`);
  fetchData();
}, 30000);

connectRedis();
