/*themeToggle.js
Name of code artifact: Dark Mode
Description: Switches between Dark and light modes
Name(s): Katie Golder, Chase Curtis
Date Created: 10-28-24
Dates Revised (Brief description of each revision & author): Chase 11-8-24 implemented local storage
Preconditions (Acceptable/unacceptable input values/types, and meanings): Sun/Moon button pressed
Postconditions (Return values/types, and meanings): Button press means the css theme switches
Error and exception condition values/types that can occur, and meanings: N/A
Side effects: N/A
Invariants: Uses local storage
Known faults: None
*/

function toggleTheme() {//Switchs between dark and light mode and sets across all pages
    let theme = document.getElementById('theme'); //Gets and sets theme of html page
    let userId = localStorage.getItem('userId'); //
    let newMode;
    const darkMode = localStorage.getItem('darkMode'); //Gets last saved theme
    if (darkMode === 'true') { //Checks if dark mode is being used
        theme.setAttribute('href', 'css/general.css'); //Switchs to light mode
        localStorage.setItem('darkMode', false); //Saves light mode as current theme
        newMode = 0;
    } else {//Checks if light mode is being used
        theme.setAttribute('href', 'css/dark.css');//Switches to dark mode
        localStorage.setItem('darkMode', true);//Saves dark mode as current theme
        newMode = 1;
    }

    if (userId != 'null') {
        // Send API request to update darkMode in the database
        fetch(`http://localhost:5100/account/darkMode/${userId}/${newMode}`, {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update dark mode preference in the database');
            }
            console.log('Dark mode preference updated successfully.');
        })
        .catch(error => {
            console.error('Error updating dark mode preference:', error);
        });
    }
}
