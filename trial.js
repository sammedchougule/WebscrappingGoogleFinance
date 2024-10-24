// const puppeteer = require('puppeteer');

// // List of all Nifty 50 stock symbols
// const nifty50Stocks = [
//   'ADANIPORTS:NSE',
//   'APOLLOHOSP:NSE',
//   'ASIANPAINT:NSE',
//   'AXISBANK:NSE',
//   'BAJAJ-AUTO:NSE',
//   'BAJAJFINSV:NSE',
//   'BAJFINANCE:NSE',
//   'BHARTIARTL:NSE',
//   'BPCL:NSE',
//   'CIPLA:NSE',
//   'COALINDIA:NSE',
//   'DIVISLAB:NSE',
//   'DRREDDY:NSE',
//   'EICHERMOT:NSE',
//   'GRASIM:NSE',
//   'HCLTECH:NSE',
//   'HDFCBANK:NSE',
//   'HDFCLIFE:NSE',
//   'HEROMOTOCO:NSE',
//   'HINDUNILVR:NSE',
//   'ICICIBANK:NSE',
//   'INDUSINDBK:NSE',
//   'INFY:NSE',
//   'ITC:NSE',
//   'JSWSTEEL:NSE',
//   'KOTAKBANK:NSE',
//   'LT:NSE',
//   'M&M:NSE',
//   'MARUTI:NSE',
//   'NESTLEIND:NSE',
//   'NTPC:NSE',
//   'ONGC:NSE',
//   'POWERGRID:NSE',
//   'RELIANCE:NSE',
//   'SBILIFE:NSE',
//   'SBIN:NSE',
//   'SHREECEM:NSE',
//   'SUNPHARMA:NSE',
//   'TATACONSUM:NSE',
//   'TATAMOTORS:NSE',
//   'TATASTEEL:NSE',
//   'TECHM:NSE',
//   'TITAN:NSE',
//   'TCS:NSE',
//   'ULTRACEMCO:NSE',
//   'UPL:NSE',
//   'VEDL:NSE',
//   'WIPRO:NSE'
// ];

// // Function to scrape data for each stock
// async function scrapeStockData(stockSymbol, page) {
//   const url = `https://www.google.com/finance/quote/${stockSymbol}`;
//   await page.goto(url);

//   try {
//     await page.waitForSelector('.PdOqHc'); // Stock symbol
//     await page.waitForSelector('.zzDege'); // Stock name
//     await page.waitForSelector('.YMlKec.fxKbKc'); // Stock price
//     await page.waitForSelector('.P2Luy.ZYVHBb'); // Stock price_change
//     await page.waitForSelector('.NydbP.tnNmPe'); // Stock percentage_change

//     // Extract the stock data
//     const stockData = await page.evaluate(() => {
//       let stockSymbol = document.querySelector('.PdOqHc').innerText; // Stock symbol
//       let stockName = document.querySelector('.zzDege').innerText; // Stock name
//       let stockPrice = document.querySelector('.YMlKec.fxKbKc').innerText; // Stock price
//       let stockPriceChange = document.querySelector('.P2Luy.ZYVHBb').innerText; // Stock price_change
//       let stockPercentageChange = document.querySelector('.NydbP.tnNmPe').innerText; // Stock percentage_change

//       return {
//         symbol: stockSymbol,
//         name: stockName,
//         price: stockPrice,
//         priceChange: stockPriceChange,
//         percentageChange: stockPercentageChange
//       };
//     });

//     // Scrape additional stock information
//     const additionalData = await page.evaluate(() => {
//       const infoDivs = document.querySelectorAll('.gyFHrc');
//       let data = {};

//       infoDivs.forEach((div) => {
//         const label = div.querySelector('.mfs7Fc')?.innerText.trim().toLowerCase(); // Trim whitespace
//         const value = div.querySelector('.P6K39c')?.innerText.trim(); // Trim whitespace

//         if (label) {
//           data[label] = value; // Store the data with label as key
//         }
//       });

//       return data;
//     });

//     // Combine stock data and additional data
//     const combinedData = { ...stockData, ...additionalData };

//     // Scrape news articles related to the stock
//     const newsData = await page.evaluate(() => {
//       const newsItems = document.querySelectorAll('div.nkXTJ'); // Example news selector

//       return Array.from(newsItems).map(item => {
//         const titleElement = item.querySelector('.Yfwt5'); // Title class
//         const linkElement = item.querySelector('a'); // link
//         const sourceElement = item.querySelector('.sfyJob'); // Source class
//         const dateElement = item.querySelector('.Adak'); // Date class
//         const imageElement = item.querySelector('img'); // Image link

//         const newsItem = {
//           title: titleElement ? titleElement.innerText : null,
//           link: linkElement ? linkElement.href : null,
//           source: sourceElement ? sourceElement.innerText : null,
//           date: dateElement ? dateElement.innerText : null,
//           imageUrl: imageElement ? imageElement.src : null
//         };    

//         // Return the news item only if it has a title and link (not null)
//         if (newsItem.title && newsItem.link) {
//             return newsItem;
//         }
//         return null; // If it doesn't have title and link, return null
//         }).filter(item => item !== null); // Filter out null values
//     });

//     // Combine stock data with news data
//     combinedData.news = newsData;

//     // Log the combined data as JSON
//     console.log(JSON.stringify(combinedData, null, 2)); // Pretty-print JSON

//   } catch (error) {
//     console.error(`Error fetching data for ${stockSymbol}:`, error);
//   }
// }

// async function scrapeAllNifty50Stocks() {
//   // Launch the browser
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   // Loop through each stock symbol and scrape the data
//   for (const stockSymbol of nifty50Stocks) {
//     console.log(`Fetching data for ${stockSymbol}...`);
//     await scrapeStockData(stockSymbol, page);
//   }

//   // Close the browser
//   await browser.close();
// }

// // Start the scraping process
// function startScraping() {
//   scrapeAllNifty50Stocks();

//   // Set an interval to run the function every 30,000ms (30 seconds)
//   setInterval(() => {
//     console.log(`Fetching data at ${new Date().toLocaleTimeString()}... `);
//     scrapeAllNifty50Stocks();
//   }, 100000);
// }

// startScraping();



// TRYING TO GET ALL THE NSE STOCKS (1663) AND GETTING THE DATA VIA WEBSCRAPING

const puppeteer = require('puppeteer');
const fs = require('fs');

let lastFetchedData = null; // Variable to hold the last fetched data
let intervalId = null; // To store the interval ID

// Function to check if the current time is between 9:15 AM and 3:30 PM
const isMarketOpen = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  start.setHours(9, 15, 0);  // 9:15 AM
  end.setHours(15, 30, 0);   // 3:30 PM

  return now >= start && now <= end;
};

const scrapeData = async () => {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=137035160&single=true';
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const headers = Array.from(rows[0].querySelectorAll('td')).map(header => header.innerText.trim());
    
    return rows.slice(1).map(row => {
      const columns = Array.from(row.querySelectorAll('td'));
      return headers.reduce((obj, header, index) => {
        const value = columns[index] ? columns[index].innerText.trim() : null;
        if (value) obj[header] = value;  // Only add if value is not empty
        return obj;
      }, {});
    });
  });

  const firstObject = data; // Get the first object

  // Save the data to a JSON file
  fs.writeFileSync('data1.json', JSON.stringify(firstObject, null, 2), 'utf8');
  console.log(`Data fetched at ${new Date().toLocaleTimeString()} and saved to data1.json: `, firstObject);

  lastFetchedData = firstObject; // Store the last fetched data

  await browser.close();
};

// Function to fetch the last data if the market is closed
const fetchLastData = () => {
  if (fs.existsSync('data1.json')) {
    const data = fs.readFileSync('data1.json', 'utf8');
    lastFetchedData = JSON.parse(data);
    console.log('Market is closed. Showing last fetched data:', lastFetchedData);
  } else {
    console.log('No data available. Please run the script during market hours.');
  }
};

// Function to handle scraping at regular intervals during market hours
const startScraping = () => {
  if (intervalId) clearInterval(intervalId); // Clear any existing intervals

  intervalId = setInterval(() => {
    if (isMarketOpen()) {
      console.log('Market is open. Fetching new data...');
      scrapeData();
    } else {
      clearInterval(intervalId); // Stop scraping when the market is closed
      fetchLastData();  // Fetch the last data when the market is closed
      console.log('Market is closed. No further scraping will occur.');
    }
  }, 50000); // Run every 10 seconds during market hours
};

// Initial check when the script starts
if (isMarketOpen()) {
  console.log('Market is open. Starting the scraping process.');
  startScraping();
} else {
  fetchLastData();  // Fetch the last data when the market is closed
  console.log('Market is closed. Data fetched only once.');
};