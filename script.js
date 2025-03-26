document.addEventListener('DOMContentLoaded', () => {
    let weatherData = []; // Store fetched data
    let isCelsius = localStorage.getItem('isCelsius') === 'false' ? false : true; // Get unit from storage
    
    // Function to fetch weather data
    async function fetchWeatherData() {
        try {
            const response = await fetch('weather.json'); // Fetch JSON file
            if (!response.ok) throw new Error('Failed to load weather data');
            weatherData = await response.json();
            const savedCity = localStorage.getItem('selectedCity') || 'Tokyo';
            updateWeather(savedCity); // Update UI with stored city or default
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
    
    // Convert Celsius to Fahrenheit
    function convertToFahrenheit(celsius) {
        return ((celsius * 9/5) + 32).toFixed(1); // Keep 1 decimal place
    }

    // Function to update weather display
    function updateWeather(city) {
        if (!weatherData.length) {
            console.warn("Weather data not loaded yet.");
            return;
        }

        // Find city data
        const cityWeather = weatherData.find(entry => entry.cityName.toLowerCase() === city.toLowerCase());

        if (!cityWeather) {
            alert("City not found in weather data.");
            return;
        }

        // Save selected city in localStorage
        localStorage.setItem('selectedCity', city);

        // Update all sections if present
        if (document.getElementById('temperature')) {
            document.getElementById('temperature').textContent = `${cityWeather.temperatureCelsius} °C`;
        }

        if (document.getElementById('humidityValue')) {
            document.getElementById('humidityValue').textContent = `${cityWeather.humidity} %`;
        }

        if (document.getElementById('uvValue')) {
            document.getElementById('uvValue').textContent = cityWeather.uvIndex;
        }

        if (document.getElementById('windSpeed')) {
            document.getElementById('windSpeed').textContent = cityWeather.windSpeed;
        }
    }

    // Ensure the button exists before adding an event listener
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const cityInput = document.getElementById('cityInput').value.trim();
            if (cityInput) {
                updateWeather(cityInput);
            } else {
                alert('Please enter a city!');
            }
        });
    } else {
        console.error("Search button not found in the DOM.");
    }

    fetchWeatherData(); // Call function to load weather data
});