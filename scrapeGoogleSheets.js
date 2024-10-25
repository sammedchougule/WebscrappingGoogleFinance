// // SCRIPT RUNDS ONETIME WHEN CALL THE FUNCTION

// const puppeteer = require('puppeteer');

// (async () => {
//   const url = 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=282818576&single=true';
  
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     return rows.map(row => {
//       const columns = row.querySelectorAll('td');
//       return Array.from(columns)
//         .map(column => column.innerText.trim()) // Trim whitespace
//         .filter(text => text !== ''); // Exclude empty values
//     }).filter(row => row.length > 0); // Exclude empty rows
//   });

//   console.log(data);
//   await browser.close();
// })();




// // IN THIS LINE WILL CALL THE "scrapeData" FUNCTION EVERY 30 SECONDS.

// const puppeteer = require('puppeteer');

// const scrapeData = async () => {
//   const url = 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=282818576&single=true';
  
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     return rows.map(row => {
//       const columns = row.querySelectorAll('td');
//       return Array.from(columns)
//         .map(column => column.innerText.trim())
//         .filter(text => text !== '');
//     }).filter(row => row.length > 0);
//   });

//   console.log("Here's the stock data:",data);
//   await browser.close();
// };

// // Run the scraping function every 30 seconds
// setInterval(scrapeData, 30000);




// THE DATA IS STORED IN A STRUCTURED "JSON" FORMAT

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const scrapeData = async () => {
//   const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=1132232009&single=true';
  
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     return rows.map(row => {
//       const columns = row.querySelectorAll('td');
//       return Array.from(columns)
//         .map(column => column.innerText.trim())
//         .filter(text => text !== '');
//     }).filter(row => row.length > 0);
//   });

//   // Write data to JSON file, overwriting any existing content
//   fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', err => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('Data fetched and saved to data.json');
//       console.log(data);
//     }
//   });

//   await browser.close();
// };

// // Run the scraping function every 30 seconds
// setInterval(scrapeData, 10000);




// FIRST ROW IS TRANSFORMED INTO AN OBJECT's KEY AND SUBSEQUENT ROWS AS VALUES

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const scrapeData = async () => {
//   const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=1132232009&single=true';
  
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     const headers = Array.from(rows[0].querySelectorAll('td')).map(header => header.innerText.trim());
    
//     return rows.slice(1).map(row => {
//       const columns = Array.from(row.querySelectorAll('td'));
//       return headers.reduce((obj, header, index) => {
//         const value = columns[index] ? columns[index].innerText.trim() : null;
//         if (value) {
//           obj[header] = value;  // Only add if value is not empty
//         }
//         return obj;
//       }, {});
//     });
//   });

//   // Write data to JSON file, overwriting any existing content
//   fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8', err => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('Data fetched and saved to data.json');
//       console.log(data);
//     }
//   });

//   await browser.close();
// };

// // Run the scraping function every 10 seconds
// setInterval(scrapeData, 10000);




// // EXTRACT FIRST OBJECT FORM THE WHOLE JSON FILE

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// // Function to check if the current time is between 9:15 AM and 3:30 PM
// const isMarketOpen = () => {
//   const now = new Date();
//   const start = new Date(now);
//   const end = new Date(now);

//   start.setHours(9, 15, 0);  // Set time to 9:15 AM
//   end.setHours(15, 30, 0);   // Set time to 3:30 PM

//   return now >= start && now <= end;
// };

// const scrapeData = async () => {
//   const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=1132232009&single=true';
  
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     const headers = Array.from(rows[0].querySelectorAll('td')).map(header => header.innerText.trim());
    
//     return rows.slice(1).map(row => {
//       const columns = Array.from(row.querySelectorAll('td'));
//       return headers.reduce((obj, header, index) => {
//         const value = columns[index] ? columns[index].innerText.trim() : null;
//         if (value) {
//           obj[header] = value;  // Only add if value is not empty
//         }
//         return obj;
//       }, {});
//     });
//   });

//   // Get only the first object
//   const firstObject = data[1];

//   // Write first object to JSON file
//   fs.writeFile('data.json', JSON.stringify(firstObject, null, 2), 'utf8', err => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log('First object fetched and saved to data.json');
//       console.log(firstObject);
//     }
//   });

//   await browser.close();
// };

// // Run the scraping function every 10 seconds
//  setInterval(scrapeData, 10000);

// // Run the scraping function One time
// //  scrapeData();




// // RUNS IN THE MARKET HOURS IF NOT IT WILL FETCH LAST FETCHED DATA

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// let lastFetchedData = null; // Variable to hold the last fetched data
// let intervalId = null; // To store the interval ID

// // Function to check if the current time is between 9:15 AM and 3:30 PM
// const isMarketOpen = () => {
//   const now = new Date();
//   const start = new Date(now);
//   const end = new Date(now);

//   start.setHours(9, 15, 0);  // 9:15 AM
//   end.setHours(15, 30, 0);   // 3:30 PM

//   return now >= start && now <= end;
// };

// const scrapeData = async () => {
//   const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=1132232009&single=true';
  
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const data = await page.evaluate(() => {
//     const rows = Array.from(document.querySelectorAll('table tbody tr'));
//     const headers = Array.from(rows[0].querySelectorAll('td')).map(header => header.innerText.trim());
    
//     return rows.slice(1).map(row => {
//       const columns = Array.from(row.querySelectorAll('td'));
//       return headers.reduce((obj, header, index) => {
//         const value = columns[index] ? columns[index].innerText.trim() : null;
//         if (value) obj[header] = value;  // Only add if value is not empty
//         return obj;
//       }, {});
//     });
//   });

//   const firstObject = data[58]; // Get the first object

//   // Save the data to a JSON file
//   fs.writeFileSync('data.json', JSON.stringify(firstObject, null, 2), 'utf8');
//   console.log('Data fetched and saved to data.json:', firstObject);

//   lastFetchedData = firstObject; // Store the last fetched data

//   await browser.close();
// };

// // Function to fetch the last data if the market is closed
// const fetchLastData = () => {
//   if (fs.existsSync('data.json')) {
//     const data = fs.readFileSync('data.json', 'utf8');
//     lastFetchedData = JSON.parse(data);
//     console.log('Market is closed. Showing last fetched data:', lastFetchedData);
//   } else {
//     console.log('No data available. Please run the script during market hours.');
//   }
// };

// // Function to handle scraping at regular intervals during market hours
// const startScraping = () => {
//   if (intervalId) clearInterval(intervalId); // Clear any existing intervals

//   intervalId = setInterval(() => {
//     if (isMarketOpen()) {
//       console.log('Market is open. Fetching new data...');
//       scrapeData();
//     } else {
//       clearInterval(intervalId); // Stop scraping when the market is closed
//       fetchLastData();  // Fetch the last data when the market is closed
//       console.log('Market is closed. No further scraping will occur.');
//     }
//   }, 100000); // Run every 10 seconds during market hours
// };

// // Initial check when the script starts
// if (isMarketOpen()) {
//   console.log('Market is open. Starting the scraping process.');
//   startScraping();
// } else {
//   fetchLastData();  // Fetch the last data when the market is closed
//   console.log('Market is closed. Data fetched only once.');
// }




// GETTING ALL THE NSE STOCKS (1663) AND GETTING THE DATA VIA WEBSCRAPING

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
  fs.writeFileSync('data.json', JSON.stringify(firstObject, null, 2), 'utf8');
  console.log(`Data fetched at ${new Date().toLocaleTimeString()} and saved to data.json: `, firstObject);

  lastFetchedData = firstObject; // Store the last fetched data

  await browser.close();
};

// Function to fetch the last data if the market is closed
const fetchLastData = () => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json', 'utf8');
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