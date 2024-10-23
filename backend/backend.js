const express = require('express')
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const port = 5100;
const localNetworkHost = '0.0.0.0';

http.createServer(app);

app.get('/', (req, res) => {
  res.send('Server is Working');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/', (req, res) => {
    res.send('Got a POST request')
})
// Registers the app to use bodyParser to make our lives easier and avoid needing to decode json frequently.
app.use(bodyParser.json());

// Server definition
