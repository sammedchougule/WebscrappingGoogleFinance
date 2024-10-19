const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Endpoint to fetch data
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, jsonData) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return res.status(500).json({ error: 'Error reading data' });
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json(JSON.parse(jsonData));
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
