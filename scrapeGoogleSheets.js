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




// EXTRACT FIRST OBJECT FORM THE WHOLE JSON FILE

const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeData = async () => {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvDTIRMVVztLtR70Sqf2MPKNNm6rXbPDqAVnyC6jSM9ZnVmAF9HXItfkSYq3G2Eg/pubhtml?gid=1132232009&single=true';
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const headers = Array.from(rows[0].querySelectorAll('td')).map(header => header.innerText.trim());
    
    return rows.slice(1).map(row => {
      const columns = Array.from(row.querySelectorAll('td'));
      return headers.reduce((obj, header, index) => {
        const value = columns[index] ? columns[index].innerText.trim() : null;
        if (value) {
          obj[header] = value;  // Only add if value is not empty
        }
        return obj;
      }, {});
    });
  });

  // Get only the first object
  const firstObject = data[1];

  // Write first object to JSON file
  fs.writeFile('data.json', JSON.stringify(firstObject, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
    } else {
      console.log('First object fetched and saved to data.json');
      console.log(firstObject);
    }
  });

  await browser.close();
};

// Run the scraping function every 10 seconds
 setInterval(scrapeData, 100000);

// Run the scraping function One time
//  scrapeData();



