/*themeToggle.html
Name of code artifact: 
Description: 
Name(s): Katie Golder
Date Created: 10-28-24
Dates Revised (Brief description of each revision & author): N/A
Preconditions (Acceptable/unacceptable input values/types, and meanings): 
Postconditions (Return values/types, and meanings): 
Error and exception condition values/types that can occur, and meanings: N/A
Side effects: N/A
Invariants: 
Known faults: 
*/

function toggleTheme() {
    let theme = document.getElementById('theme');
    if (theme.getAttribute('href') == 'css/general.css') {
        theme.setAttribute('href', 'css/dark.css');
    } else {
        theme.setAttribute('href', 'css/general.css');
    }
}