// Database info for current plant
const plantData = {
    name: "Lavender",
    watering: { frequency: "Once per week", amount: "250ml" },
    sunlight: { type: "Full Sun", duration: "6 hours per day" },
    optimalHumidity: "30-50%",
    temperatureRange: "60°F to 80°F"
};

let day = 1;
let careHistory = { water: 0, sunlight: 0, neglect: 0 };

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
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.textContent = message;
    log.appendChild(entry);
}

// Checks plant health based on 7-day care history
function checkPlantHealth() {
    const waterLimit = 1; // Weekly water limit from database
    const sunlightLimit = 6; // Weekly sunlight limit from database
    const neglectLimit = 2; // Threshold for plant death due to neglect

    if (careHistory.water > waterLimit) {
        displayLog("Plant has died from overwatering.", "dead");
    } else if (careHistory.sunlight > sunlightLimit) {
        displayLog("Plant has died from overexposure to sunlight.", "dead");
    } else if (careHistory.neglect > neglectLimit) {
        displayLog("Plant has died from neglect.", "dead");
    } else {
        displayLog(`Day ${day}: Plant is healthy after a week.`);
    }

    // Reset weekly care history
    careHistory = { water: 0, sunlight: 0, neglect: 0 };
}

// Checks if the plant is dead based on previous entries
function isPlantDead() {
    const entries = document.querySelectorAll('.log-entry');
    return Array.from(entries).some(entry => entry.classList.contains('dead'));
}
