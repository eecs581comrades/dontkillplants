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
const userId = localStorage.getItem('userId'); // Gets the user ID stored in localStorage

const randomCATs = [
    { status: "The local squirrels ate your plant... The plant has died.", died: true, water: 0, sunlight: 0 },
    { status: "It rained heavily last night and you forgot to cover your plant. An extra watering has occurred.", died: false, water: 1, sunlight: 0 },
    { status: "A cat has knocked over your plant! The plant has died.", died: true, water: 0, sunlight: 0 },
    { status: "It was unexpectedly bright outside today. Your plant has received an extra serving of sunlight.", died: false, water: 0, sunlight: 1 },
    { status: "The military has confiscated your plant. (It's probably dead).", died: true, water: 0, sunlight: 0 },
    { status: "You stubbed your toe! This has nothing to do with the plant.", died: false, water: 0, sunlight: 0 },
    { status: "You thought about the plant. It probably didn't think about you.", died: false, water: 0, sunlight: 0 },
    { status: "Your plant was replaced in the night by a changeling! Practically, nothing has changed...", died: false, water: 0, sunlight: 0},
    { status: "An ominous silence hangs over the garden...", died: false, water: 0, sunlight: 0},
    { status: "The universe was against you today (-1 to all actions)", died: false, water: -1, sunlight: -1},
    { status: "A portal has opened to another dimension! The other dimension was full of water and sunlight. (+2 to water and sunlight)", died: false, water: 2, sunlight: 2},
    { status: "The tears of your enemies have flooded the garden! (+3 watering, -1 sunlight)", died: false, water: 3, sunlight: -1 },
    { status: "Today was a good day. The plant is happy.", died: false, water: 0, sunlight: 0},
    { status: "A business of ferrets has destroyed your garden while performing a tapdance... oh well...", died: true, water: 0, sunlight: 0 },
    { status: "You spent the day watching British TV shows. It was nice.", died: false, water: 0, sunlight: 0 },
    { status: "A rival plant gang stole your plants water! (-1 watering)", died: false, water: -1, sunlight: 0},
    { status: "The local schoolboard has decided plants are bad. This makes your plant sad. It takes one psychic damage.", died: false, water: 0, sunlight: 0 },
    { status: "A portal has opened to another dimension! It was full of vegans! They ate your plant.", died: true, water: 0, sunlight: 0 },
    { status: "Your plant has become enlightened! (+5 sunlight)", died: false, water: 0, sunlight: 5 },
    { status: "Your plant has descended into the depths of hell! Thankfully, it's sunny there and they make it back unscathed (+3 sunlight).", died: false, water: 0, sunlight: 3 },
    { status: "You dress up your plant for the holidays. Unfortunately this blocks out the sun. (-1 sunlight, +1 kawaii plant aura)", died: false, water: 0, sunlight: -1 },
    { status: "Your plant gains protection from blue until end of turn. (-1 watering)", died: false, water: -1, sunlight: 0 },
    { status: "Your plant exploded. Nice.", died: true, water: 0, sunlight: 0 },
    { status: "A cheerful silence hangs over the garden...", died: false, water: 0, sunlight: 1 },
    { status: "You woke up on the wrong side of the bed... The plant doesn't care.", died: false, water: 0, sunlight: 0 },
    { status: "Somehow you have time traveled back to the 1800s. (-200 water, -200 sunlight, +200 tachyons).", died: true, water: -200, sunlight: -100 },
    { status: "The cops have arrested your plant for posession of illegal narcotics. You maintain plausible deniability.", died: true, water: 0, sunlight: 0 },
    { status: "Your plant got tired of waiting and decided to water itself (+1 watering).", died: false, water: 1, sunlight: 0 },
    { status: "Your plant has discovered the internet! It is now enjoying ASMR on YouTube.", died: false, water: 0, sunlight: 0},
    { status: "Your plant has died of alcohol poisoning.", died: true, water: -100, sunlight: 0},
    { status: "Your plant took a jaunt through the woods. It is much happier. It did not discover the tentacle monster.", died: false, water:0, sunlight:5},
    { status: "Your plant took a jaunt through the woods. It discovered the tentacle monster. It did not make it out the other side."}
];

const CATOdds = 0.15;

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

let day = 1; // Initializes the day counter
let catsEnabledFlag = localStorage.getItem('catModeEnabled'); 
let randomCATsEnabled = catsEnabledFlag === "true" || catsEnabledFlag === true;

let careHistory = { water: 0, sunlight: 0, neglect: 0, both: 0 }; // Tracks number of care actions taken

// Tracks plant care per day and logs the actions taken
function careForPlant(action) {
    if (isPlantDead()) { // Checks if plant is already dead
        clearLogs();
        displayLog(`The plant has died. Refresh to restart.`, "dead");
        return;
    }

    let catActionText = "";
    if (randomCATsEnabled) {
        const catRand = (Math.floor(Math.random() * 100) + 1) / 100;
        if (catRand <= CATOdds) {
            const randomIndex = Math.floor(Math.random() * randomCATs.length);
            catAction = randomCATs[randomIndex];
            careHistory.water += catAction.water;
            careHistory.sunlight += catAction.sunlight;
            if (catAction.died) {
                displayLog(catAction.status, "dead");
                return;
            } else {
                catActionText = "\n" + catAction.status;
            }
        }
    }

    switch(action) { // Records action based on user input
        case 'water':
            careHistory.water++;
            displayLog(`Day ${day}: Watered the plant.` + catActionText);
            break;
        case 'sunlight':
            careHistory.sunlight++;
            displayLog(`Day ${day}: Exposed plant to sunlight.` + catActionText);
            break;
        case 'nothing':
            careHistory.neglect++;
            displayLog(`Day ${day}: No action taken.` + catActionText);
            break;
        case 'both':
            careHistory.water++;
            careHistory.sunlight++;
            displayLog(`Day ${day}: Watered and exposed to sunlight.` + catActionText);
            break;
    }

    // Check every 7 days if the plant survives
    if (day % 7 === 0) {
        const currentDay = day; // Save current day for log output
        clearLogs();
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
        displayLog(`Day ${day}: Plant is healthy.`);
    }

}

// Clear logs from previous weeks
function clearLogs() {
    const log = document.getElementById('log');
    log.innerHTML = ''; // Remove all child elements (log entries)
}

// Checks if the plant is dead based on previous entries
function isPlantDead() {
    const entries = document.querySelectorAll('.log-entry'); // Selects all log entries
    const a = Array.from(entries).some(entry => entry.classList.contains('dead')); // Returns true if any entry marks plant as dead
    return a;
}
