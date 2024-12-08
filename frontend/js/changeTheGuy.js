/*changeTheGuy.js
Name of code artifact: Customization
Description: Cycles through filters on the mandrake when user presses button on viewCurrentSimulations.html; applies choice to all pages
Name(s): Katie Golder
Date Created: 11-21-24
Dates Revised (Brief description of each revision & author): N/A
Preconditions (Acceptable/unacceptable input values/types, and meanings): Button to change mandrake
Postconditions (Return values/types, and meanings): Change mandrake filter
Error and exception condition values/types that can occur, and meanings: N/A
Side effects: N/A
Invariants: Uses local storage
Known faults: None
*/

window.onload = () => {
const filters = [//Filters to cycle through
    "none",
    "grayscale(100%)",
    "sepia(100%)",
    "blur(5px)",
    "contrast(500%)",
    "invert(100%)",
    "hue-rotate(90deg)"
];

let currentFilterIndex = 0; //Starting value

function loadSavedFilter() {//Loads saved filter from localStorage if available
    const filterd = localStorage.getItem('savedFilter'); //retrieve local storage to variable
    if (filterd !== null) {//Checks if previous changed filter was set
        currentFilterIndex = filterd; //updates to match filter saved
        applyFilter(); //Applies chosen filter
    } 
}

function applyFilter() {//Applies chosen filter
    const image = document.getElementById("filterable");//Gets Mandrake image
    image.style.filter = filters[currentFilterIndex]; //Applies filter to image
    localStorage.setItem('savedFilter', currentFilterIndex); //Saves the chosen filter for use on other pages
}

function cycleFilter() {//Cycles through filters
    currentFilterIndex = (currentFilterIndex + 1) % filters.length; // Increases filter index and loops through possibilities
    const userId = localStorage.getItem('userId'); //Gets user id
    if (userId != 'null') {
        // Send API request to update darkMode in the database
        fetch(`http://localhost:5100/account/guy/${userId}/${currentFilterIndex}`, {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update guy preference in the database');
            }
            console.log('guy preference updated successfully.');
        })
        .catch(error => {
            console.error('Error updating guy preference:', error);
        });
    }
    applyFilter(); //Applies chosen filter
}

const filterButton = document.getElementById("filter-button");//Button for changing Mandrake
if (filterButton) { //Checks to only run on page(s) with button for changing Mandrake
    filterButton.addEventListener("click", cycleFilter); //Listens for button to change mandrake to cycle through posibilities
}

loadSavedFilter();//Runs to get possible saved filter when the page loads for change to apply across pages
};