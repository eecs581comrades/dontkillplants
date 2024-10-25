const { spawn } = require('child_process');
const path = require('path');

// Replace backslashes with forward slashes for Windows compatibility
const user = 'root';
const password = '';
const host = 'localhost';
const database = 'dontkillplants';
let sqlFile = path.join(__dirname, '..', 'db', 'initial_database.sql').replace(/\\/g, '/'); // Ensure slashes

// Command options
const args = [
  '--binary-mode=1',
  `-u${user}`,
  `-p${password}`,
  `-h${host}`,
  `${database}`
];

// Spawn the MySQL process
const mysql = spawn('mysql', args, {
  stdio: ['pipe', process.stdout, process.stderr] // Use stdio to handle redirection
});

// Use file redirection in a cross-platform way
const fs = require('fs');
const fileStream = fs.createReadStream(sqlFile);

// Pipe the SQL file to MySQL's stdin
fileStream.pipe(mysql.stdin);

mysql.on('close', (code) => {
  if (code === 0) {
    console.log('Database loaded successfully.');
  } else {
    console.error(`Database loading process exited with code ${code}`);
  }
});
