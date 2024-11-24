// map.js
// Name of code artifact: 19) Plant Store Locator
// Description: Plant Store Locator
// Name(s): Matthew Petillo
// Date Created: 11/17/24
// Dates Revised (Brief description of each revision & author): N/A
// Preconditions (Acceptable/unacceptable input values/types, and meanings) : User inputs some sort of location data
// Postconditions (Return values/types, and meanings): Returns list of plant stores on google map
// Error and exception condition values/types that can occur, and meanings: no plant stores nearby
// Side effects: N/A
// Invariants: N/A
// Known faults: no address verification, could be used for overflow buffer attack

let map;
let service;
let infowindow;
let AdvancedMarkerElement; // Declare a global reference for AdvancedMarkerElement

async function loadModules() {
    // Dynamically load the AdvancedMarkerElement library
    const library = await google.maps.importLibrary("marker");
    AdvancedMarkerElement = library.AdvancedMarkerElement;
}

async function initMap() {
    // Wait for modules to load
    await loadModules();

    // Initialize map centered on a default location
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
        zoom: 5,
        mapId: 'cdbf71ecab2991bf'
    });
    infowindow = new google.maps.InfoWindow();
}

function findPlantStores() {
    const address = document.getElementById("address").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            map.setZoom(12);

            const request = {
                location: results[0].geometry.location,
                radius: '5000', // 5km radius
                type: ['store'],
                keyword: 'garden store',
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // Clear the list before populating new results
                    const listDiv = document.getElementById("list");
                    listDiv.innerHTML = "";

                    results.forEach(place => {
                        addToList(place);
                    });
                }
            });
        } else {
            alert("Address not found: " + status);
        }
    });
}



function addToList(place) {
    const listDiv = document.getElementById("list");

    // Create a list item for the place
    const listItem = document.createElement("div");
    listItem.style.cursor = "pointer";
    listItem.style.padding = "10px";
    listItem.style.borderBottom = "1px solid #ccc";

    listItem.innerHTML = `
        <strong>${place.name}</strong><br>
        ${place.vicinity || "Address not available"}
    `;

    // Attach a reference to the AdvancedMarkerElement for this place
    const redMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    const markerContent = document.createElement('img');
    markerContent.src = redMarkerIcon;
    markerContent.style.width = "32px";
    markerContent.style.height = "32px";

    const advancedMarker = new AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        content: markerContent,
    });

    // Define a function to set the infowindow content and open it
    const showInfoWindow = () => {
        infowindow.setContent(`
            <div>
                <h3>${place.name}</h3>
                <p>${place.vicinity || 'Address not available'}</p>
                <p>Rating: ${place.rating || 'Rating not available'}</p>
                <p>${place.opening_hours?.weekday_text?.join('<br>') || "Hours not available"}</p>
            </div>
        `);
        infowindow.open({
            map,
            anchor: advancedMarker,
        });
    };

    // Add click listeners to both the marker and the list item
    listItem.addEventListener("click", () => {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        showInfoWindow();
    });

    advancedMarker.addListener("click", () => {
        showInfoWindow();
    });

    // Add the list item to the container
    listDiv.appendChild(listItem);
}


