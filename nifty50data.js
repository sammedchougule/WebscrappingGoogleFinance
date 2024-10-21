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
        //symbol: stockSymbol,
        name: stockName,
        price: stockPrice,
        priceChange: stockPriceChange,
        percentageChange: stockPercentageChange
      };
    });

    // Log each stock data in table format
    console.table([stockData]); // Wrap stockData in an array to log as a table

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
//scrapeAllNifty50Stocks();


// Function tor run the scrapper every 30 seconds
function startScraping() {
  scrapeAllNifty50Stocks();

    // Set an interval to run the function every 30,000ms (1 minute)
  setInterval(() => {
    console.log(`Fetching data at ${new Date().toLocaleTimeString()}... `)
    scrapeAllNifty50Stocks();
  }, 30000);
}

startScraping();