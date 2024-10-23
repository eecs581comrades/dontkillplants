const { exec } = require('child_process');

const user = 'root';
const password = 'PlantsAreCool24';
const host = 'localhost';
const database = 'dontkillplants';
const sqlFile = './db/initial_database.sql';

// Command to load the SQL file into the database
const command = `mysql -u ${user} -p ${password} -h ${host} ${database} < ${sqlFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error loading database: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log('Database loaded successfully.');
});
