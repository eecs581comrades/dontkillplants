/* 
Name of code artifact: Plant Log
Description: Simulates day-to-day logs of plants, tracking care actions and checking plant health periodically. The program displays care logs and monitors for conditions that may cause the plant to die due to overwatering, neglect, or overexposure to sunlight.
Name(s): Chase Curtis
Date Created: 11-10-24
Dates Revised: 

Preconditions:
- Requires `plantId`, `sunlightTop`, `sunlightBottom`, and `waterLimit` to be saved in localStorage before running.
- `plant-results` and `log` elements should exist in the HTML for output display.

Acceptable/unacceptable input values/types, and meanings:
- Acceptable inputs for `careForPlant(action)`: "water", "sunlight", "both", "nothing".
- Invalid inputs for `careForPlant(action)` will prevent the action from logging.

Postconditions:
- Adds a log entry for each care action taken daily, displays messages for plant health weekly.

Return values/types, and meanings:
- Returns no values, modifies DOM to display logs and messages.

Error and exception condition values/types that can occur, and meanings:
- Network errors during data fetch display a relevant error message in `plant-results`.

Side effects:
- Updates the DOM based on care actions and plant health status.

Invariants:
- Logs are reset weekly to evaluate health conditions based on recent care.

Known faults:
- Missing or incorrect localStorage values may cause unexpected results in health checks.
*/

// Retrieve plant ID from localStorage
const plantId = localStorage.getItem('plantId'); // Gets the plant ID stored in localStorage

// Check if plant ID exists
if (plantId) { // Verifies that a plant ID was retrieved
    // Log plant ID for debugging
    console.log("Searching for plant with ID:", plantId); // Logs the plant ID being searched

    // Fetch plant data from the backend
    fetch(`http://localhost:5100/search/id/${encodeURIComponent(plantId)}`) // Fetches plant data from the server using plant ID
        .then(response => { // Handles the server response
            if (!response.ok) { // Checks for an error response
                throw new Error("Network response was not ok"); // Throws an error if the response is not ok
            }
            return response.json(); // Parses the response as JSON
        })
        .then(data => { // Processes the received plant data
            const resultsDiv = document.getElementById('plant-results'); // Gets the results div for output
            console.log("Received data:", data); // Logs the received data for debugging
            if (data.length > 0) { // Checks if any data was returned
                const plant = data[0]; // Gets the first plant object from the returned array
                localStorage.setItem('plantId', plant.plant_id); // Saves the plant ID in localStorage
                localStorage.setItem('sunlightTop', plant.sunlight_duration_top); // Saves max sunlight duration
                localStorage.setItem('sunlightBottom', plant.sunlight_duration_bottom); // Saves min sunlight duration
                localStorage.setItem('waterLimit', plant.watering_frequency_int); // Saves water limit
            } else {
                resultsDiv.innerHTML = '<p>No results found for this plant.</p>'; // Displays message if no results found
            }
        })
        .catch(error => { // Catches any errors that occur during the fetch process
            console.error('Error fetching plant details:', error); // Logs the error
            document.getElementById('plant-results').innerHTML = '<p>Error retrieving plant details. Please try again.</p>'; // Displays error message
        });
} else {
    document.getElementById('plant-results').innerHTML = '<p>No plant specified. Please go back and enter a plant name.</p>'; // Message for missing plant ID
}

let day = 1; // Tracks the current day in the plant care log
let careHistory = { water: 0, sunlight: 0, neglect: 0, both: 0 }; // Tracks number of care actions taken

// Tracks plant care per day and logs the actions taken
function careForPlant(action) {
    if (isPlantDead()) { // Checks if plant is already dead
        displayLog(`The plant has died. Refresh to restart.`, "dead");
        return;
    }

    switch(action) { // Records action based on user input
        case 'water':
            careHistory.water++;
            displayLog(`Day ${day}: Watered the plant.`);
            break;
        case 'sunlight':
            careHistory.sunlight++;
            displayLog(`Day ${day}: Exposed plant to sunlight.`);
            break;
        case 'nothing':
            careHistory.neglect++;
            displayLog(`Day ${day}: No action taken.`);
            break;
        case 'both':
            careHistory.water++;
            careHistory.sunlight++;
            displayLog(`Day ${day}: Watered and exposed to sunlight.`);
            break;
    }

    // Check every 7 days if the plant survives
    if (day % 7 === 0) {
        checkPlantHealth();
    }

    day++; // Increment the day after each action
}

// Logs a new entry in the plant log
function displayLog(message, className = "") {
    const log = document.getElementById('log'); // Gets log div for output
    const entry = document.createElement('p'); // Creates a new paragraph for log entry
    entry.className = `log-entry ${className}`; // Adds CSS class for styling
    entry.textContent = message; // Sets message content
    log.appendChild(entry); // Adds entry to log
}

// Checks plant health based on 7-day care history
function checkPlantHealth() {

    const sunlightTop = parseInt(localStorage.getItem('sunlightTop')); // Retrieves max sunlight duration
    console.log(sunlightTop); // Debugging output
    const sunlightBottom = parseInt(localStorage.getItem('sunlightBottom')); // Retrieves min sunlight duration
    console.log(sunlightBottom); // Debugging output
    const waterLimit = parseInt(localStorage.getItem('waterLimit')); // Retrieves water limit
    console.log(waterLimit); // Debugging output
    var neglectLimit = 7; // Initializes neglect limit

    if (waterLimit < (sunlightBottom / 7)) { // Calculates threshold for neglect
        neglectLimit = neglectLimit - (sunlightBottom / 7);
    } else {
        neglectLimit = neglectLimit - waterLimit;
    }

    if (neglectLimit < 0) { // Ensures neglect limit doesn’t go negative
        neglectLimit = 0;
    }

    console.log(neglectLimit); // Debugging output

    if (careHistory.water > waterLimit) { // Checks if plant died from over-watering
        displayLog("Plant has died from over-watering.", "dead");
    } else if (careHistory.sunlight > sunlightTop) { // Checks if plant died from too much sunlight
        displayLog("Plant has died from overexposure to sunlight.", "dead");
    } else if (careHistory.neglect > neglectLimit) { // Checks if plant died from neglect
        displayLog("Plant has died from neglect.", "dead");
    } else {
        displayLog(`Day ${day}: Plant is healthy after a week.`);
    }

    // Reset weekly care history
    careHistory = { water: 0, sunlight: 0, neglect: 0, both: 0 };
}

// Checks if the plant is dead based on previous entries
function isPlantDead() {
    const entries = document.querySelectorAll('.log-entry'); // Selects all log entries
    return Array.from(entries).some(entry => entry.classList.contains('dead')); // Returns true if any entry marks plant as dead
}
