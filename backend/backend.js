const express = require('express')
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5100;
const localNetworkHost = '0.0.0.0';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'PlantsAreCool24',
  database: 'dontkillplants'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/rose', (req, res) => {
  connection.query('SELECT * FROM plants WHERE plant_common_name="Rose"', (err, results) => {
    if (err) {
      console.error('Error fetching rose plant:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/', (req, res) => {
    res.send('Got a POST request')
})
// Registers the app to use bodyParser to make our lives easier and avoid needing to decode json frequently.
app.use(bodyParser.json());

// Server definition
