// API Configuration
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Indian cities database for validation
const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Chandigarh', 'Thiruvananthapuram', 'Bhopal', 'Patna', 'Raipur',
    'Ranchi', 'Shimla', 'Dehradun', 'Gandhinagar', 'Panaji', 'Imphal', 'Shillong', 'Aizawl',
    'Kohima', 'Itanagar', 'Dispur', 'Agartala', 'Gangtok', 'Srinagar', 'Jammu', 'Amaravati',
    'Surat', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Vadodara', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Amritsar', 'Allahabad', 'Prayagraj', 'Visakhapatnam',
    'Vijayawada', 'Madurai', 'Guwahati', 'Coimbatore', 'Kochi', 'Cochin', 'Kozhikode', 'Calicut',
    'Jodhpur', 'Gwalior', 'Mysore', 'Mysuru', 'Tiruchirappalli', 'Trichy', 'Jabalpur', 'Kota',
    'Bhubaneswar', 'Mangalore', 'Mangaluru', 'Udaipur', 'Aurangabad', 'Dhanbad', 'Amravati',
    'Solapur', 'Jalandhar', 'Ajmer', 'Jamshedpur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur',
    'Bikaner', 'Warangal', 'Guntur', 'Bhilai', 'Firozabad', 'Kurnool', 'Rajpur Sonarpur',
    'Rajahmundry', 'Bokaro', 'South Dumdum', 'Bellary', 'Patiala', 'Gopalpur', 'Agartala',
    'Bhagalpur', 'Muzaffarnagar', 'Bhatpara', 'Panihati', 'Latur', 'Dhule', 'Tiruppur',
    'Rohtak', 'Korba', 'Bhilwara', 'Brahmapur', 'Muzaffarpur', 'Ahmednagar', 'Mathura',
    'Kollam', 'Avadi', 'Kadapa', 'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur',
    'Satara', 'Bijapur', 'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur',
    'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur',
    'Khammam', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl',
    'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Kirari Suleman Nagar',
    'Barasat', 'Purnia', 'Satna', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela',
    'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar', 'Anantapur', 'Etawah',
    'Ambernath', 'North Dumdum', 'Bharatpur', 'Begusarai', 'New Delhi', 'Gandhidham',
    'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar', 'Thoothukudi', 'Raurkela Industrial Township',
    'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
    'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu Tawi', 'Sangli Miraj Kupwad', 'Mangaluru',
    'Erode', 'Belgaum', 'Belagavi', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
    'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajahmundry', 'Bokaro Steel City',
    'Noida', 'Greater Noida', 'Ghaziabad', 'Navi Mumbai', 'New Mumbai'
];

// Helper Functions

// Normalizes city name for case-insensitive comparison
function normalizeCityName(city) {
    return city.trim().toLowerCase();
}

// Checks if a city is in the predefined list of Indian cities
function isValidIndianCity(city) {
    const normalizedInput = normalizeCityName(city);
    return INDIAN_CITIES.some(validCity => normalizeCityName(validCity) === normalizedInput);
}

// Finds similar city names for suggestions based on input
function findSimilarCities(city, maxSuggestions = 3) {
    const normalizedInput = normalizeCityName(city);
    const suggestions = INDIAN_CITIES.filter(validCity =>
        normalizeCityName(validCity).includes(normalizedInput) ||
        normalizedInput.includes(normalizeCityName(validCity))
    );
    return suggestions.slice(0, maxSuggestions);
}

// Geocodes location using Nominatim (OpenStreetMap) - Primary service
async function geocodeWithNominatim(locationName) {
    try {
        const url = `${NOMINATIM_URL}?q=${encodeURIComponent(locationName)}&format=json&countrycodes=IN&limit=5&addressdetails=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WeatherApp/1.0' // Required by Nominatim usage policy
            }
        });

        if (!response.ok) {
            throw new Error('Nominatim API request failed');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            return null;
        }

        // Get the first result
        const result = data[0];

        // Format the location name from address details
        let displayName = result.display_name;
        if (result.address) {
            const addr = result.address;
            // Prioritize city/town/village names
            const cityName = addr.city || addr.town || addr.village || addr.state_district || addr.county;
            const stateName = addr.state;
            if (cityName && stateName) {
                displayName = `${cityName}, ${stateName}`;
            } else if (cityName) {
                displayName = cityName;
            }
        }

        return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            name: displayName
        };
    } catch (error) {
        console.warn('Nominatim geocoding failed:', error);
        return null;
    }
}

// Geocodes location using Open-Meteo - Fallback service
async function geocodeWithOpenMeteo(locationName) {
    try {
        const url = `${GEOCODING_URL}?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        return data.results[0];
    } catch (error) {
        console.warn('Open-Meteo geocoding failed:', error);
        return null;
    }
}

// Converts city name to geographical coordinates using dual geocoding system
async function getCityCoordinates(cityName) {
    // Try Nominatim first (better India coverage)
    let location = await geocodeWithNominatim(cityName);

    if (location) {
        console.log('Location found via Nominatim:', location);
        return location;
    }

    // Fallback to Open-Meteo
    location = await geocodeWithOpenMeteo(cityName);

    if (location) {
        console.log('Location found via Open-Meteo:', location);
        return location;
    }

    // If both fail, throw error
    throw new Error(`Location "${cityName}" not found. Please try a specific city name.`);
}

// Converts geographical coordinates to a city name
async function getCityNameFromCoords(lat, lon) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results && data.results[0] ? data.results[0].name : 'Your Location';
    } catch {
        return 'Your Location';
    }
}

// Formats an ISO time string to a readable local time
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Determines moon phase name, icon, and illumination from a 0-1 moon phase value
function getMoonPhaseInfo(moonPhase) {
    // moonPhase is 0-1 from OpenMeteo
    // Simplified emoji progression: 🌑 → 🌓 → 🌕 → 🌗 → 🌑
    const phases = [
        { name: 'New Moon', icon: '🌑', range: [0, 0.03] },
        { name: 'Waxing Crescent', icon: '🌑', range: [0.03, 0.22] },
        { name: 'First Quarter', icon: '🌓', range: [0.22, 0.28] },
        { name: 'Waxing Gibbous', icon: '🌓', range: [0.28, 0.47] },
        { name: 'Full Moon', icon: '🌕', range: [0.47, 0.53] },
        { name: 'Waning Gibbous', icon: '🌗', range: [0.53, 0.72] },
        { name: 'Last Quarter', icon: '🌗', range: [0.72, 0.78] },
        { name: 'Waning Crescent', icon: '🌑', range: [0.78, 0.97] },
        { name: 'New Moon', icon: '🌑', range: [0.97, 1] }
    ];

    const phase = phases.find(p => moonPhase >= p.range[0] && moonPhase <= p.range[1]);
    const illumination = Math.round(moonPhase * 100);

    if (phase) {
        return { ...phase, illumination };
    }
    return { name: 'New Moon', icon: '🌑', illumination };
}

// Map WMO weather codes to descriptions
function getWeatherDescription(wmoCode) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };

    return descriptions[wmoCode] || 'Unknown';
}

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const locationButton = document.getElementById('location-button');
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const weatherSection = document.getElementById('weather-section');

// Main weather display elements
const cityNameInfo = document.getElementById('city-name');
const weatherDate = document.getElementById('weather-date');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const highLowTemp = document.getElementById('high-low-temp');

// Detailed weather attributes
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const windDeg = document.getElementById('wind-deg');
const pressure = document.getElementById('pressure');

// Additional weather attributes
const visibility = document.getElementById('visibility');
const cloudCover = document.getElementById('cloud-cover');
const precipitation = document.getElementById('precipitation');
const windGust = document.getElementById('wind-gust');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const moonIcon = document.getElementById('moon-icon');
const moonPhaseName = document.getElementById('moon-phase-name');
const moonIllumination = document.getElementById('moon-illumination');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);

// Automatically request user's location on page load
window.addEventListener('DOMContentLoaded', () => {
    requestUserLocation();
});

// Listener for the location button
if (locationButton) {
    locationButton.addEventListener('click', requestUserLocation);
}

// Core Logic

// Requests user's current location and fetches weather data
async function requestUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            hideLoading();
            let errorMsg = 'Unable to get your location. ';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
            }

            // If weather is already displayed, don't hide it on location error
            if (!weatherSection.classList.contains('hidden')) {
                return;
            }

            showError(errorMsg);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Handles city search form submission
async function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    // Remove the validation check - let the geocoding API handle it
    // This allows searching for any location in India, not just predefined cities
    await fetchWeatherData(city);
}

// Fetches weather data for a given city name
async function fetchWeatherData(city) {
    try {
        showLoading();
        const location = await getCityCoordinates(city);
        await fetchAndDisplayWeather(location.latitude, location.longitude, location.name);
    } catch (error) {
        showError(error.message || 'Failed to fetch weather data.');
    }
}

// Fetches weather data for given coordinates
async function fetchWeatherByCoordinates(lat, lon) {
    try {
        showLoading();
        const detectedCity = await getCityNameFromCoords(lat, lon);
        await fetchAndDisplayWeather(lat, lon, detectedCity);
    } catch (error) {
        showError('Failed to fetch weather data');
    }
}

// Fetches weather data from OpenMeteo API and displays it
async function fetchAndDisplayWeather(lat, lon, locationDisplayName) {
    try {
        const url = `${OPENMETEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,visibility&daily=sunrise,sunset,precipitation_sum&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }

        const data = await response.json();
        displayWeatherData(data, locationDisplayName);

    } catch (error) {
        throw error;
    }
}

// Displays the fetched weather data on the UI
function displayWeatherData(data, locationName) {
    hideLoading();
    hideError();

    const current = data.current;
    const daily = data.daily;

    const weatherCondition = getWeatherDescription(current.weather_code);
    const weatherMain = weatherCondition.toLowerCase();

    // Update location and date
    cityNameInfo.textContent = locationName;
    weatherDate.textContent = getCurrentDate();

    // Main temperature display
    temperature.textContent = `${Math.round(current.temperature_2m)}°`;
    weatherDescription.textContent = weatherCondition;
    highLowTemp.textContent = ''; // High/low not fetched in current API call

    // Weather details
    if (feelsLike) feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
    if (humidity) humidity.innerHTML = `${current.relative_humidity_2m}<span class="bento-unit">%</span>`;
    if (windSpeed) windSpeed.innerHTML = `${Math.round(current.wind_speed_10m)} <span class="bento-unit">km/h</span>`;
    if (windDeg) windDeg.textContent = getWindDirection(current.wind_direction_10m);
    if (pressure) pressure.innerHTML = `${Math.round(current.surface_pressure)} <span class="bento-unit">hPa</span>`;

    // Additional attributes
    if (visibility) visibility.innerHTML = `${(current.visibility / 1000).toFixed(1)} <span class="bento-unit">km</span>`;
    if (cloudCover) cloudCover.innerHTML = `${current.cloud_cover}<span class="bento-unit">%</span>`;
    if (precipitation) precipitation.innerHTML = `${current.precipitation} <span class="bento-unit">mm</span>`;
    if (windGust) windGust.innerHTML = `${Math.round(current.wind_gusts_10m)} <span class="bento-unit">km/h</span>`;

    // Sun times
    if (sunrise && daily.sunrise[0]) sunrise.textContent = formatTime(daily.sunrise[0]);
    if (sunset && daily.sunset[0]) sunset.textContent = formatTime(daily.sunset[0]);

    // Moon phase
    if (moonPhaseName) {
        let moonPhaseValue = 0.5; // Default fallback
        // Check if moon_phase data is available from the API
        if (daily.moon_phase && daily.moon_phase[0] !== undefined) {
            moonPhaseValue = daily.moon_phase[0];
        }

        const moonInfo = getMoonPhaseInfo(moonPhaseValue);
        moonPhaseName.textContent = moonInfo.name;
        if (moonIcon) moonIcon.textContent = moonInfo.icon;
        if (moonIllumination) moonIllumination.textContent = `${moonInfo.illumination}% illuminated`;
    }

    updateBackground(weatherMain, current.weather_code);

    weatherSection.classList.remove('hidden');
    cityInput.value = '';
}

// Gets the time of day based on current hour
function getTimeOfDay() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 16) {
        return 'afternoon';
    } else if (hour >= 16 && hour < 19) {
        return 'evening';
    } else {
        return 'night';
    }
}

// Updates the background based on time of day
function updateBackground(weatherMain, weatherId) {
    const timeOfDay = getTimeOfDay();
    // Always use time-based backgrounds as requested
    document.body.className = timeOfDay;
}

// Gets the current date in a formatted string
function getCurrentDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Converts wind degrees to cardinal direction
function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

// UI State Management

// Shows the loading indicator and hides other sections
function showLoading() {
    loadingContainer.classList.remove('hidden');
    weatherSection.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

// Hides the loading indicator
function hideLoading() {
    loadingContainer.classList.add('hidden');
}

// Displays an error message and hides other sections
function showError(message) {
    hideLoading();
    weatherSection.classList.add('hidden');
    errorMessage.innerHTML = message.replace(/\n/g, '<br>'); // Convert newlines to <br> tags
    errorContainer.classList.remove('hidden');
}

// Hides the error message
function hideError() {
    errorContainer.classList.add('hidden');
}
