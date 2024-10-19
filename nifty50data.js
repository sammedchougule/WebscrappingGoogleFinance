const puppeteer = require('puppeteer');

// List of all Nifty 50 stock symbols
const nifty50Stocks = [
  'RELIANCE:NSE', 'TCS:NSE', 'HDFCBANK:NSE', 'INFY:NSE', 'ICICIBANK:NSE', 
  'HINDUNILVR:NSE', 'ITC:NSE', 'KOTAKBANK:NSE', 'LT:NSE', 'SBIN:NSE', 
  'BAJFINANCE:NSE', 'AXISBANK:NSE', 'BHARTIARTL:NSE', 'HDFC:NSE', 'ASIANPAINT:NSE', 
  'MARUTI:NSE', 'DMART:NSE', 'NTPC:NSE', 'TATASTEEL:NSE', 'SUNPHARMA:NSE', 
  'ULTRACEMCO:NSE', 'WIPRO:NSE', 'POWERGRID:NSE', 'NESTLEIND:NSE', 'JSWSTEEL:NSE',
  'TITAN:NSE', 'M&M:NSE', 'BAJAJFINSV:NSE', 'HCLTECH:NSE', 'TECHM:NSE', 
  'INDUSINDBK:NSE', 'ONGC:NSE', 'COALINDIA:NSE', 'DRREDDY:NSE', 'BPCL:NSE', 
  'GRASIM:NSE', 'SBILIFE:NSE', 'ADANIPORTS:NSE', 'BRITANNIA:NSE', 'DIVISLAB:NSE',
  'HEROMOTOCO:NSE', 'CIPLA:NSE', 'SHREECEM:NSE', 'APOLLOHOSP:NSE', 'EICHERMOT:NSE',
  'BAJAJ-AUTO:NSE', 'TATAMOTORS:NSE', 'UPL:NSE', 'HDFCLIFE:NSE', 'VEDL:NSE'
];

// Function to scrape data for each stock
async function scrapeStockData(stockSymbol, page) {
  const url = `https://www.google.com/finance/quote/${stockSymbol}`;
  await page.goto(url);

  try {
    await page.waitForSelector('.PdOqHc'); // Stock symbol
    await page.waitForSelector('.zzDege'); // Stock name
    await page.waitForSelector('.YMlKec.fxKbKc'); // Stock price
    await page.waitForSelector('.P2Luy.Ez2Ioe.ZYVHBb'); // Stock price_change
    await page.waitForSelector('.NydbP.nZQ6l.tnNmPe'); // Stock privious close

    // Extract the stock data
    const stockData = await page.evaluate(() => {
      let stockSymbol = document.querySelector('.PdOqHc').innerText; // Stock symbol
      let stockName = document.querySelector('.zzDege').innerText; // Stock name
      let stockPrice = document.querySelector('.YMlKec.fxKbKc').innerText; // Stock price
      let stockPriceChange = document.querySelector('.P2Luy.Ez2Ioe.ZYVHBb').innerText; // Stock price change
      let stockPreviousClose = document.querySelector('.P6K39c').innerText; // Stock priious close
      let stockpercentagechange = document.querySelector('.NydbP.nZQ6l.tnNmPe').innerText; // Stock priious close


      return {
        symbol: stockSymbol,
        name: stockName,
        price: stockPrice,
        priceChange: stockPriceChange,
        previousClose: stockPreviousClose,
        percentageChange: stockpercentagechange
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

  // Array to store all stock data
  const allStockData = [];

  // Loop through each stock symbol and scrape the data
  for (const stockSymbol of nifty50Stocks) {
    console.log(`Fetching data for ${stockSymbol}...`);
    await scrapeStockData(stockSymbol, page);
  }

  // Close the browser
  await browser.close();

}


// Start the scraping process
scrapeAllNifty50Stocks();