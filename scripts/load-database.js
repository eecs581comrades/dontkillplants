// Name of code artifact: All of them
// Description: Node.js setup script for configuring the local database
// Name(s): William Johnson
// Date Created: 10-25-24
// Dates Revised:
// Brief description of each revision & author:

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

console.log("Initializing Database Structures...");
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

async function load_data() {
  try {
    // Read JSON data from file
    const jsonData = JSON.parse(fs.readFileSync('./Artifacts/testdata.json', 'utf8'));
    
    // Iterate through each plant record
    for (const plant of jsonData) {
      const commonName = plant["Plant Common Name"];
      const scientificName = plant["Plant Scientific Name"];
      const wateringFrequency = plant["Plant Watering Schedule"]["Frequency"];
      const wateringAmount = plant["Plant Watering Schedule"]["Amount"];
      const sunlightType = plant["Plant Sunlight Schedule"]["Sunlight Type"];
      const sunlightDuration = plant["Plant Sunlight Schedule"]["Duration"];
      const soilConditions = plant["Plant Soil Conditions"];
      const lifecycleStage = plant["Plant Lifecycle Information"]["Lifecycle Stage"];
      const averageLifespan = plant["Plant Lifecycle Information"]["Average Lifespan"];
      const growthRate = plant["Plant Lifecycle Information"]["Growth Rate"];
      const temperatureRange = plant["Plant Temperature Conditions"]["Optimal Range"];
      const temperatureTolerance = plant["Plant Temperature Conditions"]["Tolerance"];
      const humidityOptimal = plant["Plant Humidity Conditions"]["Optimal Humidity"];
      const humidityTolerance = plant["Plant Humidity Conditions"]["Tolerance"];
      const importantInfo = JSON.stringify(plant["Important Plant Information"]);

      // SQL to check if the plant already exists
      const checkSQL = `SELECT COUNT(*) AS count FROM plants WHERE plant_common_name = '${commonName.replace(/'/g, "''")}';`;

      // Execute the SQL command to check if the plant exists
      const checkProcess = spawn('mysql', [...args, '-e', checkSQL]);

      let checkResult = '';
      for await (const chunk of checkProcess.stdout) {
        checkResult += chunk;
      }

      checkProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error(`Failed to check existence for plant ${commonName}`);
          return;
        }

        // Parse the result to get the count
        const count = parseInt(checkResult.match(/\d+/)[0], 10);

        if (count === 0) {
          // SQL to insert the plant if it doesn't exist
          const insertSQL = `
            INSERT INTO plants (
              plant_common_name, 
              plant_scientific_name, 
              watering_frequency, 
              watering_amount, 
              sunlight_type, 
              sunlight_duration, 
              soil_conditions, 
              lifecycle_stage, 
              average_lifespan, 
              growth_rate, 
              temperature_optimal_range, 
              temperature_tolerance, 
              humidity_optimal, 
              humidity_tolerance, 
              important_info
            ) VALUES (
              '${commonName.replace(/'/g, "''")}',
              '${scientificName.replace(/'/g, "''")}',
              '${wateringFrequency.replace(/'/g, "''")}',
              '${wateringAmount.replace(/'/g, "''")}',
              '${sunlightType.replace(/'/g, "''")}',
              '${sunlightDuration.replace(/'/g, "''")}',
              '${soilConditions.replace(/'/g, "''")}',
              '${lifecycleStage.replace(/'/g, "''")}',
              '${averageLifespan.replace(/'/g, "''")}',
              '${growthRate.replace(/'/g, "''")}',
              '${temperatureRange.replace(/'/g, "''")}',
              '${temperatureTolerance.replace(/'/g, "''")}',
              '${humidityOptimal.replace(/'/g, "''")}',
              '${humidityTolerance.replace(/'/g, "''")}',
              '${importantInfo.replace(/'/g, "''")}'
            );
          `;

          // Execute the insert command
          const insertProcess = spawn('mysql', [...args, '-e', insertSQL]);

          insertProcess.on('close', (insertCode) => {
            if (insertCode === 0) {
              console.log(`Inserted new plant: ${commonName}`);
            } else {
              console.error(`Failed to insert plant: ${commonName}`);
            }
          });
        } else {
          console.log(`Plant ${commonName} already exists, skipping.`);
        }
      });
    }

    console.log('Data loading complete.');
  } catch (err) {
    console.error('Error loading plant data:', err);
  }
}


load_data();