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
//const exchange = stockSymbol.split(':')[1];  // Extract the exchange part directly

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
  await page.waitForSelector('.P2Luy.ZYVHBb'); // Stock price_change
  await page.waitForSelector('.NydbP.tnNmPe'); // Stock percentage_change 

  // Extract the stock data
  const stockData = await page.evaluate(() => {
    let stockSymbol = document.querySelector('.PdOqHc').innerText; // Stock symbol
    let stockName = document.querySelector('.zzDege').innerText; // Stock name
    let stockPrice = document.querySelector('.YMlKec.fxKbKc').innerText; // Stock price
    let stockPriceChange = document.querySelector('.P2Luy.ZYVHBb').innerText; // Stock price_change
    let stockPercentageChange = document.querySelector('.NydbP.tnNmPe').innerText; // Stock percentage_change

    // Find elements for "Previous Close" and "Days Range"
    const infoDivs = document.querySelectorAll('.gyFHrc');
    let previousClose = '';
    let daysRange = '';
    let yearRange = '';
    let marketCap = '';
    let avgVolume = '';
    let peRatio = '';
    let dividendYield = '';
    let primaryExchange = '';

    infoDivs.forEach((div) => {
      const label = div.querySelector('.mfs7Fc')?.innerText.trim(); // Trim whitespace
      const value = div.querySelector('.P6K39c')?.innerText.trim(); // Trim whitespace

      if (label.toLowerCase() === 'previous close') {
        previousClose = value;
      }
      if (label.toLowerCase() === 'day range') { // Match regardless of case
        daysRange = value;
      }
      if (label.toLowerCase() === 'year range') {
        yearRange = value;
      }
      if (label.toLowerCase() === 'market cap') { // Match regardless of case
        marketCap = value;
      }
      if (label.toLowerCase() === 'avg volume') {
        avgVolume = value;
      }
      if (label.toLowerCase() === 'p/e ratio') { // Match regardless of case
        peRatio = value;
      }
      if (label.toLowerCase() === 'dividend yield') {
        dividendYield = value;
      }
      if (label.toLowerCase() === 'primary exchange') { // Match regardless of case
        primaryExchange = value;
      }
    });

    return {
      symbol: stockSymbol,  // Stock symbol
      name: stockName,      // Stock name
      price: stockPrice,    // Stock price
      priceChange: stockPriceChange,  // Stock price change
      percentageChange: stockPercentageChange, // Stock percentage change
      previousClose: previousClose, // Previous Close
      daysRange: daysRange,  // Days Range
      yearRange: yearRange, // Previous Close
      marketCap: marketCap,  // Days Range
      avgVolume: avgVolume, // Previous Close
      peRatio: peRatio,  // Days Range
      dividendYield: dividendYield, // Previous Close
      primaryExchange: primaryExchange  // Days Range
    };
  });

  //console.log(`Exchange: ${exchange}`);
  //console.log(`Symbol: ${stockData.symbol}`);
  console.log(`Stock: ${stockData.name}`);
  console.log(`Price: ${stockData.price}`);
  console.log(`Price Change: ${stockData.priceChange}`);
  console.log(`Percentage Change: ${stockData.percentageChange}`);
  console.log(`Previous Close: ${stockData.previousClose}`);
  console.log(`Days Range: ${stockData.daysRange}`);
  console.log(`Year Range: ${stockData.yearRange}`);
  console.log(`Market Cap: ${stockData.marketCap}`);
  console.log(`Avg Volume: ${stockData.avgVolume}`);
  console.log(`P/E Ratio: ${stockData.peRatio}`);
  console.log(`Dividend Yield: ${stockData.dividendYield}`);
  console.log(`Exchange: ${stockData.primaryExchange}`);


  // Now scrape news articles related to the stock
  const newsData = await page.evaluate(() => {
    const newsItems = document.querySelectorAll('div.nkXTJ'); // Example news selector

    return Array.from(newsItems).map(item => {
      const titleElement = item.querySelector('.Yfwt5'); // Title class
      const linkElement = item.querySelector('a'); // link
      const sourceElement = item.querySelector('.sfyJob'); // Source class
      const dateElement = item.querySelector('.Adak'); // Date class
      const imageElement = item.querySelector('img'); // image link

      return {
        title: titleElement ? titleElement.innerText : null,
        link: linkElement ? linkElement.href : null,
        source: sourceElement ? sourceElement.innerText : null,
        date: dateElement ? dateElement.innerText : null,
        imageUrl: imageElement ? imageElement.src : null
      };
    });
  });



  // Assuming 'newsData' contains the list of articles and show ALL THE NEWS ARTICLES

  if (newsData && newsData.length > 0) {
    console.log('Related News Articles:');
    newsData.forEach((article, index) => {
      if (article.title && article.link && article.source) {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Link: ${article.link}`);
        console.log(`   Source: ${article.source}`);
        console.log(`   Date: ${article.date}`);
        console.log(`   Image: ${article.imageUrl}`);
      }
    });
  } else {
    console.log('No related news articles found.');
  }


  // Close the browser
  await browser.close();
}

// Run the scraper only once
scrapeStockData(stockSymbol);

// Function to run the scraper every half minute
// function startScraping() {
//   scrapeStockData(stockSymbol);

//   // Set an interval to run the function every 30,000ms (1 minute)
//   setInterval(() => {
//     console.log(`Fetching data for ${stockSymbol} at ${new Date().toLocaleTimeString()}...`);
//     scrapeStockData(stockSymbol);
//   }, 30000); // 30,000 milliseconds = half minute
// }

// Start scraping
//startScraping();
