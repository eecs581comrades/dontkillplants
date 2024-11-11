
function loadPlant() {
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
                    localStorage.setItem('sunlightTop', plant.sunlight_duration_top); // Saves the plant ID in localStorage
                    localStorage.setItem('sunlightBottom', plant.sunlight_duration_bottom); // Saves the plant ID in localStorage
                    localStorage.setItem('waterLimit', plant.watering_frequency_int); // Saves the plant ID in localStorage
                    
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
}

let day = 1;
let careHistory = { water: 0, sunlight: 0, neglect: 0 , both: 0};

// Tracks plant care per day and logs the actions taken
function careForPlant(action) {
    if (isPlantDead()) {
        displayLog(`The plant has died. Refresh to restart.`, "dead");
        return;
    }

    switch(action) {
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

    day++;
}

// Logs a new entry in the plant log
function displayLog(message, className = "") {
    const log = document.getElementById('log');
    const entry = document.createElement('p');
    entry.className = `log-entry ${className}`;
    entry.textContent = message;
    log.appendChild(entry);
}

// Checks plant health based on 7-day care history
function checkPlantHealth() {

    loadPlant();
    const sunlightTop = localStorage.getItem('sunlightTop');
    const sunlightBottom = localStorage.getItem('sunlightBottom');
    const waterLimit = localStorage.getItem('waterLimit');
    const neglectLimit = 7 - ((sunlightBottom/7)+waterLimit);// Threshold for plant death due to neglect

    if (neglectLimit < 0) {
        neglectLimit = 0;
    }

    if (careHistory.water > waterLimit) {
        displayLog("Plant has died from over-watering.", "dead");
    } else if (careHistory.sunlight > sunlightTop) {
        displayLog("Plant has died from overexposure to sunlight.", "dead");
    } else if (careHistory.neglect > neglectLimit) {
        displayLog("Plant has died from neglect.", "dead");
    } else {
        displayLog(`Day ${day}: Plant is healthy after a week.`);
    }

    // Reset weekly care history
    careHistory = { water: 0, sunlight: 0, neglect: 0, both: 0 };
}

// Checks if the plant is dead based on previous entries
function isPlantDead() {
    const entries = document.querySelectorAll('.log-entry');
    return Array.from(entries).some(entry => entry.classList.contains('dead'));
}
