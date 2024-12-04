/*changeTheGuy.js
Name of code artifact: Random CAT Considerations
Description: Toggles random cat considerations; applies choice to all pages
Name(s): Katie Golder, William Johnson
Date Created: 12-04-24
Dates Revised (Brief description of each revision & author): N/A
Preconditions (Acceptable/unacceptable input values/types, and meanings): Button to change the cat state
Postconditions (Return values/types, and meanings): CAT state
Error and exception condition values/types that can occur, and meanings: N/A
Side effects: N/A
Invariants: Uses local storage
Known faults: None
*/

window.addEventListener("load", function () {

let catModeEnabled = false;

function loadSavedCatMode() {//Loads saved cat mode state from localStorage if available
    const isEnabled = localStorage.getItem('catModeEnabled'); //retrieve local storage to variable
    if (isEnabled !== null) {//Checks if previously cat mode was set
        catModeEnabled = isEnabled; //updates to match cat state saved
        applyCatMode(); //Applies state
    } 
}

function applyCatMode() {//Applies cat mode
    const image = document.getElementById("cat"); //Gets cat image
    image.style.display = (catModeEnabled ? "block" : "none"); //toggles image visibility
    localStorage.setItem('catModeEnabled', catModeEnabled); //Saves the new state
    console.log(catModeEnabled);
}

function toggleCatMode(){
    catModeEnabled = !catModeEnabled;
    applyCatMode();
}

const catStateButton = document.getElementById("cat-button");//Button for toggling cat mode
if (catStateButton) { //If toggle button exists, bind
    catStateButton.addEventListener("click", toggleCatMode); //Listens for button to toggle cat mode state
}

loadSavedCatMode();//Runs to get possible saved cat mode state
});