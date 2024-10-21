const puppeteer = require('puppeteer');

// List of all Nifty 50 stock symbols
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

// Function to scrape data for each stock
async function scrapeStockData(stockSymbol, page) {
  const url = `https://www.google.com/finance/quote/${stockSymbol}`;
  await page.goto(url);

  try {
    await page.waitForSelector('.PdOqHc'); // Stock symbol
    await page.waitForSelector('.zzDege'); // Stock name
    await page.waitForSelector('.YMlKec.fxKbKc'); // Stock price
    await page.waitForSelector('.P2Luy.ZYVHBb'); // Stock price_change
    await page.waitForSelector('.NydbP.tnNmPe'); // Stock percentage_change

    // Extract the stock data
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

    // Scrape additional stock information
    const additionalData = await page.evaluate(() => {
      const infoDivs = document.querySelectorAll('.gyFHrc');
      let data = {};

      infoDivs.forEach((div) => {
        const label = div.querySelector('.mfs7Fc')?.innerText.trim().toLowerCase(); // Trim whitespace
        const value = div.querySelector('.P6K39c')?.innerText.trim(); // Trim whitespace

        if (label) {
          data[label] = value; // Store the data with label as key
        }
      });

      return data;
    });

    // Combine stock data and additional data
    const combinedData = { ...stockData, ...additionalData };

    // Scrape news articles related to the stock
    const newsData = await page.evaluate(() => {
      const newsItems = document.querySelectorAll('div.nkXTJ'); // Example news selector

      return Array.from(newsItems).map(item => {
        const titleElement = item.querySelector('.Yfwt5'); // Title class
        const linkElement = item.querySelector('a'); // link
        const sourceElement = item.querySelector('.sfyJob'); // Source class
        const dateElement = item.querySelector('.Adak'); // Date class
        const imageElement = item.querySelector('img'); // Image link

        const newsItem = {
          title: titleElement ? titleElement.innerText : null,
          link: linkElement ? linkElement.href : null,
          source: sourceElement ? sourceElement.innerText : null,
          date: dateElement ? dateElement.innerText : null,
          imageUrl: imageElement ? imageElement.src : null
        };    

        // Return the news item only if it has a title and link (not null)
        if (newsItem.title && newsItem.link) {
            return newsItem;
        }
        return null; // If it doesn't have title and link, return null
        }).filter(item => item !== null); // Filter out null values
    });

    // Combine stock data with news data
    combinedData.news = newsData;

    // Log the combined data as JSON
    console.log(JSON.stringify(combinedData, null, 2)); // Pretty-print JSON

  } catch (error) {
    console.error(`Error fetching data for ${stockSymbol}:`, error);
  }
}

async function scrapeAllNifty50Stocks() {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Loop through each stock symbol and scrape the data
  for (const stockSymbol of nifty50Stocks) {
    console.log(`Fetching data for ${stockSymbol}...`);
    await scrapeStockData(stockSymbol, page);
  }

  // Close the browser
  await browser.close();
}

// Start the scraping process
function startScraping() {
  scrapeAllNifty50Stocks();

  // Set an interval to run the function every 30,000ms (30 seconds)
  setInterval(() => {
    console.log(`Fetching data at ${new Date().toLocaleTimeString()}... `);
    scrapeAllNifty50Stocks();
  }, 100000);
}

startScraping();
