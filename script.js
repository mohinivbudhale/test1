console.log('Script.js loaded');

$(document).ready(function () {
    $("#geolocation-btn").on("click", function () {
        // Get user's geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successGeolocation, errorGeolocation);
        } else {
            showError("Geolocation is not supported by this browser.");
        }
    });

    $("#location-dropdown").on("change", function () {
        // Get sunrise and sunset data for the selected location
        const selectedLocation = $(this).val();
        getSunriseSunsetData(selectedLocation);
    });

    $("#search-btn").on("click", function () {
        // Search for the entered location and get sunrise and sunset data
        const searchLocation = $("#location-search").val();
        searchLocationData(searchLocation);
    });

    function successGeolocation(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getSunriseSunsetData(latitude, longitude);
    }

    function errorGeolocation(error) {
        showError(`Geolocation error: ${error.message}`);
    }

    function getSunriseSunsetData(latitude, longitude) {
        const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

        $.ajax({
            url: apiUrl,
            method: "GET",
            success: function (data) {
                // Handle successful response
                hideError();
                updateUI(data);
            },
            error: function (xhr, status, error) {
                // Handle error response
                showError(`Error: ${error}`);
            }
        });
    }

    function searchLocationData(location) {
        // Assuming the location parameter is an object with latitude and longitude properties
        const geocodeApiUrl = `https://geocode.maps.co/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`;

        $.ajax({
            url: geocodeApiUrl,
            method: "GET",
            success: function (data) {
                // Handle successful response
                hideError();

                // Check if the response contains valid data
                if (data.results && data.results.length > 0) {
                    // Extract relevant information from the reverse geocode API response
                    const address = data.results[0].formatted;
                    // ... (extract other relevant information if needed)

                    // Display or use the obtained address information
                    console.log('Reverse Geocode Address:', address);

                    // Call getSunriseSunsetData with the obtained latitude and longitude
                    getSunriseSunsetData(location.latitude, location.longitude);
                } else {
                    // Handle the case where the reverse geocode API did not return a valid result
                    showError("Location not found. Please enter a valid location.");
                }
            },
            error: function (xhr, status, error) {
                // Handle error response from the reverse geocode API
                console.error('Reverse Geocode API Error:', xhr.responseText); // Log the detailed error response
                showError(`Reverse Geocode API Error: ${error}`);
            }
        });
    }

    function updateUI(data) {
        // Update the UI with sunrise and sunset data
        const resultContainer = $("#result-container");
        resultContainer.empty(); // Clear previous data

        // Check if the response contains valid data
        if (data.results) {
            // Example: Display sunrise and sunset for today
            resultContainer.append(`<div>Today's Sunrise: ${data.results.sunrise}</div>`);
            resultContainer.append(`<div>Today's Sunset: ${data.results.sunset}</div>`);
            
            // Add similar lines for other information (tomorrow's sunrise/sunset, dawn/dusk, day length, solar noon, time zone)
        } else {
            // Handle the case where the sunrise/sunset API did not return a valid result
            showError("Sunrise/sunset data not available.");
        }
    }

    function showError(message) {
        $("#error-message").text(message).removeClass("hidden");
    }

    function hideError() {
        $("#error-message").text("").addClass("hidden");
    }
});
