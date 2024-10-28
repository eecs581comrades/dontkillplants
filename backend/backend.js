
// Name of code artifact: all of them
// Description: Node.js server
// Name(s): Matthew Petillo, William Johnson
// Date Created: 10-23-24
// Dates Revised: 10-2-24
// Brief description of each revision & author:
//
// THE FOLLOWING APIs EXIST:
// /search/{plantName}, returns all plants found
// /account/pull/{username}/{password}, returns account if it exists
// /account/add/{username}/{password}, returns 201 if works
// /simulation/pull/{user_id}, returns all simulations found under that user Id
// /simulation/add/{user_id}/{plant_id}, creates a simulation under that user id with the plant id
// all APIs return 500 if there is an internal server error
// MySQL has no password, account accordingly
//

const express = require('express')
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path')

const app = express();
const port = 5100;
const localNetworkHost = '0.0.0.0';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/', 'home.html'));
})

app.get('/search/:plantName', (req, res) => { //accepts plant name, returns plant details
  const plantName = req.params.plantName;
  connection.query('SELECT * FROM plants WHERE plant_common_name LIKE ?', [plantName], (err, results) => {
    if (err) {
      console.error('Error fetching plant:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

app.get('/account/pull/:username/:password', (req, res) => { //returns account if it exists
  const username = req.params.username;
  const password = req.params.password;
  connection.query('SELECT user_id FROM user_pass_combo WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      console.log(results)
    } else {
      res.status(401).send('Invalid username or password');
  }});
});

app.post('/account/add/:username/:password', (req, res) => { //returns 200 if created, 400 if account already exists
  const username = req.params.username;
  const password = req.params.password;
  connection.query('SELECT * FROM user_pass_combo WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      res.status(400).send('Username already exists');
      return;
    }
    else {
      connection.query("INSERT INTO user_pass_combo (username, password) VALUES (?, ?)", [username, password], (err, results2) => {
        if (err) {
          console.error('Error adding user:', err);
          res.status(500).send('Server error');
          return;
        }
        connection.query('SELECT user_id FROM user_pass_combo WHERE username = ?', [username], (err, results3) => {
          if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Server error');
            return;
          }
          res.json(results3);
          return;
      });
    });
  };
})});

app.post('/simulations/add/:user_id/:plant_id', (req, res) => { //returns 201 for successful simulation add
  const user_id = req.params.user_id;
  const plant_id = req.params.plant_id;
  connection.query("INSERT INTO simulations (plant_id, user_id) VALUES (?, ?)" [plant_id, user_id], (err, results) => {
    if (err){
      console.error('Error adding simulation:', err);
      res.status(500).send('Server error');
      return;
    }
    res.status(201).send("Simulation created successfully");
  })
});

app.get('/simulations/pull/:user_id/', (req, res) => { //returns all simulations found under user ID
  const user_id = req.params.user_id;
  connection.query("SELECT * FROM simulations WHERE user_id = ?", [user_id], (err, results) => {
    if (err){
      console.error('Error fetching user simulations');
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/', (req, res) => {
    res.send('Got a POST request')
})
// Registers the app to use bodyParser to make our lives easier and avoid needing to decode json frequently.
app.use(bodyParser.json());