
// Name(s): Matthew Petillo, William Johnson
// Date Created: 10-23-24
// Dates Revised: 10-2-24
// Brief description of each revision & author: added several more apis, MP 12/8/24
//
// THE FOLLOWING APIs EXIST:
// /search/{plantName}, returns all plants found
// /search/{plantId}, returns all plants found
// /account/pull/{username}/{password}, returns account if it exists
// /account/add/{username}/{password}, returns 201 if works
// /account/change/{username}/{oldpassword}/{newpassword}, changes password
// /simulations/{user_id}, returns all simulations found under that user Id
// /simulations/delete/{simulation_id}, deletes simulation
// /simulations/add/{user_id}/{plant_id}, creates a simulation under that user id with the plant id
// /account/darkMode/{userId}/{darkMode}, updates user's darkmode preference
// /account/guy/{userId}/{guyPreference}, updates guy preference
// /account/pull_preference/darkMode/{userId}, returns preference for user of darkmode
// /account/pull_preference/guy/{userId}, returns preference for user of guy
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

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for hashing

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
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/', 'home.html'));
})

app.get('/search/:plantName', (req, res) => { //accepts plant name, returns plant details
  const plantName = req.params.plantName;
  connection.query('SELECT * FROM plants WHERE plant_common_name LIKE ?', [`%${plantName}%`], (err, results) => {
    if (err) {
      console.error('Error fetching plant:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
    return;
  });
});

app.get('/search/id/:plantId', (req, res) => {
  const plantId = req.params.plantId; // Retrieve plant ID from request
  connection.query('SELECT * FROM plants WHERE plant_id = ?', [plantId], (err, results) => {
    if (err) {
      console.error('Error fetching plant:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
    return;
  });
});

app.post('/search/:plantInfoPartial', async (req, res) => {
  const plantInfoPartial = "%" + req.params.plantInfoPartial + "%";
  const {
    wateringFrequency,
    sunlightType,
    soilCondition,
    growthRate,
    tempTolerance,
    humidityTolerance,
  } = req.body || {};

  try {
    // Simplified search query without a subquery
    let searchQuery = `
      SELECT plant_id, plant_common_name, plant_scientific_name
      FROM plants
      WHERE (plant_common_name LIKE ? OR plant_scientific_name LIKE ?)
    `;

    const queryParams = [plantInfoPartial, plantInfoPartial];

    // Add additional filters based on request body
    if (wateringFrequency) {
      searchQuery += ' AND watering_frequency = ?';
      queryParams.push(wateringFrequency);
    }
    if (sunlightType) {
      searchQuery += ' AND sunlight_type = ?';
      queryParams.push(sunlightType);
    }
    if (soilCondition) {
      searchQuery += ' AND soil_conditions = ?';
      queryParams.push(soilCondition);
    }
    if (growthRate) {
      searchQuery += ' AND growth_rate = ?';
      queryParams.push(growthRate);
    }
    if (tempTolerance) {
      searchQuery += ' AND temperature_tolerance = ?';
      queryParams.push(tempTolerance);
    }

    // Append limiting
    searchQuery += ' LIMIT 10';

    // Execute the query and log the response
    const [results] = await connection.promise().query(searchQuery, queryParams);

    // Prepare response data
    const plantList = results.map(result => ({
      id: result.plant_id,
      commonName: result.plant_common_name,
      scientificName: result.plant_scientific_name,
      relevance: result.relevance
    }));

    res.status(200).json({ success: true, plants: plantList });
  } catch (error) {
    console.error('Error executing search query:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});



app.get('/account/pull/:username/:password', (req, res) => { //returns account if it exists
  const username = req.params.username;
  const password = req.params.password;
  connection.query('SELECT user_id, password, darkMode FROM user_pass_combo WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length > 0) {
      bcrypt.compare(password, results[0].password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.status(500).send('Server error');
          return;
        }
        if (result) {
          res.status(200).json({ user_id: results[0].user_id });
        }
        else {
          res.status(401).send('Invalid username or password');
        }
      });
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
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error hasing password:', err);
          res.status(500).send('Server error');
          return;
        }
        connection.query("INSERT INTO user_pass_combo (username, password) VALUES (?, ?)", [username, hashedPassword], (err, results2) => {
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
            res.status(200).json(results3)
            return;
        });
      });
      });
  };
})});

app.post('/account/change/:username/:oldpassword/:newpassword', (req, res) => { //returns 200 if created, 400 if account already exists
  const username = req.params.username;
  const oldpassword = req.params.oldpassword;
  const newpassword = req.params.newpassword
  connection.query('SELECT user_id, password FROM user_pass_combo WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error checking for user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(400).send('Username or Password is incorrect');
      return;
    }
    else {
      bcrypt.compare(oldpassword, results[0].password, (err, results2) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.status(500).send('Server error');
          return;
        }
        else{
          if (results2) {
            bcrypt.hash(newpassword, saltRounds, (err, saltedPassword) => {
              connection.query('UPDATE user_pass_combo SET password = ? WHERE user_id = ?', [saltedPassword, results[0].user_id], (err, results3) => {
                if (err) {
                  console.error('Error updating password:', err);
                  res.status(500).send('Server error');
                  return;
                }
                else {
                  res.status(200).send('Password Updated Successfully');
                }
              })
            });
          }
          else {
            res.status(400).send('Username or Password is incorrect');
            return
          }
        }
    });
  }
});
});

app.post('/simulations/add/:user_id/:plant_id', (req, res) => { 
  const user_id = parseInt(req.params.user_id, 10); 
  const plant_id = parseInt(req.params.plant_id, 10); 

  // Check if the simulation already exists for this user and plant
  const checkQuery = "SELECT COUNT(*) AS count FROM simulations WHERE plant_id = ? AND user_id = ?";
  connection.query(checkQuery, [plant_id, user_id], (err, results) => {
    if (err) {
      console.error('Error checking existing simulation:', err.message); // Log detailed error
      res.status(500).send(`Server error: ${err.message}`);             // Return error message to client
      return;
    }

    const simulationExists = results[0].count > 0;

    if (simulationExists) {
      res.status(200).send("Simulation already exists for this plant and user.");
    } else {
      // Insert the simulation if it does not exist
      const insertQuery = "INSERT INTO simulations (plant_id, user_id) VALUES (?, ?)";
      connection.query(insertQuery, [plant_id, user_id], (err, results) => {
        if (err) {
          console.error('Error adding simulation:', err.message);      // Log detailed error
          res.status(500).send(`Server error: ${err.message}`);        // Return error message to client
          return;
        }
        res.status(201).send("Simulation created successfully");
      });
    }
  });
});

app.delete('/simulations/delete/:simulation_id', (req, res) => {
  const simulationId = parseInt(req.params.simulation_id, 10);

  if (isNaN(simulationId)) {
      return res.status(400).send('Invalid simulation ID');
  }

  const deleteQuery = 'DELETE FROM simulations WHERE simulation_id = ?';
  connection.query(deleteQuery, [simulationId], (err, results) => {
      if (err) {
          console.error('Error deleting simulation:', err);
          return res.status(500).send('Server error');
      }

      if (results.affectedRows === 0) {
          return res.status(404).send('Simulation not found');
      }

      res.status(200).send('Simulation deleted successfully');
  });
});

app.get('/simulations/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  console.log(`Fetching simulations for userId: ${userId}`); // Log userId

  // Sample query to check database response
  connection.query('SELECT * FROM simulations WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          res.status(500).send('Database query failed');
          return;
      }
      console.log('Database results:', results); // Log results
      res.json(results);
  });
});

app.post('/account/darkMode/:userId/:darkMode', (req, res) => { //returns 200 if created, 400 if account already exists
  const userId = parseInt(req.params.userId);
  const darkMode = req.params.darkMode;
  connection.query('UPDATE user_pass_combo SET darkMode = ? WHERE user_id = ?', [darkMode, userId], (err, results) => {
    if (err) {
      console.error('Error checking for user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(400).send('Something is wrong');
      return;
    }
    else {
      res.status(200).send('Dark Mode Updated Successfully');
      return;
        }
      });
      
    });

app.post('/account/guy/:userId/:guyPreference', (req, res) => { //returns 200 if created, 400 if account already exists
  const userId = parseInt(req.params.userId);
  const guyPreference = req.params.guyPreference;
  connection.query('UPDATE user_pass_combo SET guy = ? WHERE user_id = ?', [guyPreference, userId], (err, results) => {
    if (err) {
      console.error('Error checking for user:', err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(400).send('Something is wrong');
      return;
    }
    else {
      res.status(200).send('Guy Preference Updated Successfully');
      return;
    }
  });
});

app.get('/account/pull_preference/darkMode/:userId', (req, res) => {
  const userId = parseInt(req.params.userId)
  connection.query('SELECT darkMode FROM user_pass_combo WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking for user:', err);
      res.status(500).send('Server error');
      return;
    }
    else {
      res.status(200).json(results)
    }
  })
})

app.get('/account/pull_preference/guy/:userId', (req, res) => {
  const userId = parseInt(req.params.userId)
  connection.query('SELECT guy FROM user_pass_combo WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking for user:', err);
      res.status(500).send('Server error');
      return;
    }
    else {
      res.status(200).json(results)
    }
  })
})

// GET: Retrieve calendar events for a specific user
app.get('/account/calendar/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  connection.query('SELECT calendar_info FROM user_pass_combo WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
          console.error('Error fetching calendar info:', err);
          res.status(500).send('Server error');
          return;
      }

      if (results.length === 0) {
          console.log('No calendar found for user:', userId);
          res.status(404).send('Calendar not found');
          return;
      }

      // Parse the stored calendar string back to an object
      try {
          const calendar = JSON.parse(results[0].calendar_info);
          res.status(200).json(calendar);  // Send the parsed object back
      } catch (e) {
          console.error('Error parsing calendar data:', e);
          res.status(500).send('Error parsing calendar data');
      }
  });
});


// POST: Save calendar events for a specific user
app.post('/account/calendar/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  console.log('Received userId:', userId);
  console.log('Received calendar data:', req.body);

  if (isNaN(userId)) {
      console.error('Invalid user ID');
      res.status(400).send('Invalid user ID');
      return;
  }

  if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid calendar data format:', req.body);
      res.status(400).send('Invalid calendar data');
      return;
  }

  const calendarString = JSON.stringify(req.body);

  connection.query(
      'UPDATE user_pass_combo SET calendar_info = ? WHERE user_id = ?',
      [calendarString, userId],
      (err, results) => {
          if (err) {
              console.error('Error updating calendar:', err);
              res.status(500).send('Database error');
              return;
          }
          console.log('Calendar updated successfully:', results);
          res.status(200).send('Calendar info saved successfully');
      }
  );
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/', (req, res) => {
    res.send('Got a POST request')
})

// Registers the app to use bodyParser to make our lives easier and avoid needing to decode json frequently.
app.use(bodyParser.json());