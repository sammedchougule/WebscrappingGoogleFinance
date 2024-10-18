const puppeteer = require('puppeteer');

// Get stock symbol from user input (e.g., INFY, infy)
const stockSymbolInput = process.argv[2];

if (!stockSymbolInput) {
  console.log("Please provide a stock symbol (e.g., INFY).");
  process.exit(1);
}

// Convert the stock symbol to uppercase and add default exchange if not provided (e.g., infy becomes INFY:NSE)
const defaultExchange = 'NSE';
const stockSymbol = stockSymbolInput.toUpperCase().includes(':') 
  ? stockSymbolInput.toUpperCase() 
  : `${stockSymbolInput.toUpperCase()}:${defaultExchange}`;
const exchange = stockSymbol.split(':')[1];  // Extract the exchange part directly

async function scrapeStockData(stockSymbol) {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Construct the URL based on user input
  const url = `https://www.google.com/finance/quote/${stockSymbol}`;
  await page.goto(url);

  // Wait for the stock name, price, and stock symbol elements to load
  await page.waitForSelector('.PdOqHc'); // Stock symbol
  await page.waitForSelector('.zzDege'); // Stock name
  await page.waitForSelector('.YMlKec.fxKbKc'); // Stock price
  await page.waitForSelector('.P2Luy.Ez2Ioe.ZYVHBb'); // Stock price_change
  await page.waitForSelector('.NydbP.nZQ6l.tnNmPe'); // Stock percentage_change

  // Extract the stock data
  const stockData = await page.evaluate(() => {
    let stockSymbol = document.querySelector('.PdOqHc').innerText; // Stock symbol
    let stockName = document.querySelector('.zzDege').innerText; // Stock name
    let stockPrice = document.querySelector('.YMlKec.fxKbKc').innerText; // Stock price
    let stockPriceChange = document.querySelector('.P2Luy.Ez2Ioe.ZYVHBb').innerText; // Stock price_change
    let stockPercentageChange = document.querySelector('.NydbP.nZQ6l.tnNmPe').innerText; // Stock percentage_change

    return {
      symbol: stockSymbol,  // Stock symbol
      name: stockName,      // Stock name
      price: stockPrice,    // Stock price
      priceChange: stockPriceChange,  // Stock price change
      percentageChange: stockPercentageChange // Stock percentage change
    };
  });

  console.log(`Exchange: ${exchange}`);
  console.log(`Stock: ${stockData.name}`);
  console.log(`Price: ${stockData.price}`);
  console.log(`Price Change: ${stockData.priceChange}`);
  console.log(`Percentage Change: ${stockData.percentageChange}`);

  // Close the browser
  await browser.close();
}

// Function to run the scraper every 1 minute
function startScraping() {
  scrapeStockData(stockSymbol);

  // Set an interval to run the function every 60,000ms (1 minute)
  setInterval(() => {
    console.log(`Fetching data for ${stockSymbol} at ${new Date().toLocaleTimeString()}...`);
    scrapeStockData(stockSymbol);
  }, 10000); // 60,000 milliseconds = 1 minute
}

// Start scraping
startScraping();
