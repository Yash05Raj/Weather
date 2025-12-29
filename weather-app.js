const API_KEY = 'ca7bc6ebabe15057ad28e0817b26b91f'; // API Key (replace with yours)
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const weatherSection = document.getElementById('weather-section');

// New UI Elements
const cityName = document.getElementById('city-name');
const weatherDate = document.getElementById('weather-date');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const highLowTemp = document.getElementById('high-low-temp');

// Bento Grid Elements
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const windDeg = document.getElementById('wind-deg');
const pressure = document.getElementById('pressure');

searchForm.addEventListener('submit', handleSearch);

// Initialize with Demo Data if no key is present or on first load for UX showcase
window.addEventListener('DOMContentLoaded', () => {
    // If the key is the known placeholder, show demo data immediately
    if (isPlaceholderKey()) {
        displayWeatherData(getMockData());
    }
});

function isPlaceholderKey() {
    return API_KEY === 'ca7bc6ebabe15057ad28e0817b26b91f';
}

async function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    if (isPlaceholderKey()) {
        // Fallback to mock data for demonstration
        console.warn("Using mock data due to missing API Key");
        showLoading();
        await new Promise(r => setTimeout(r, 800)); // Fake loading for realism
        displayWeatherData(getMockData(city));
        return;
    }

    await fetchWeatherData(city);
}

async function fetchWeatherData(city) {
    try {
        showLoading();
        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found.' : 'Failed to fetch weather data.');
        }

        const data = await response.json();
        displayWeatherData(data);

    } catch (error) {
        showError(error.message);
    }
}

function displayWeatherData(data) {
    hideLoading();
    hideError();

    const {
        name,
        sys: { country },
        main: { temp, feels_like, humidity: humidityValue, pressure: pressureValue, temp_min, temp_max },
        weather,
        wind: { speed, deg }
    } = data;

    const weatherCondition = weather[0];
    const weatherMain = weatherCondition.main.toLowerCase();

    // Update Text Content
    cityName.textContent = `${name}, ${country}`;
    weatherDate.textContent = getCurrentDate();

    // Main Display
    temperature.textContent = `${Math.round(temp)}°`;
    weatherDescription.textContent = weatherCondition.description;

    // Calculate High/Low if available, or approximate
    const high = temp_max ? Math.round(temp_max) : Math.round(temp + 2);
    const low = temp_min ? Math.round(temp_min) : Math.round(temp - 2);
    highLowTemp.textContent = `H: ${high}°  L: ${low}°`;

    // Grid Details
    if (feelsLike) feelsLike.textContent = `${Math.round(feels_like)}°`;
    if (humidity) humidity.innerHTML = `${humidityValue}<span class="bento-unit">%</span>`;
    if (windSpeed) windSpeed.innerHTML = `${speed} <span class="bento-unit">km/h</span>`;
    if (windDeg && deg !== undefined) windDeg.textContent = getWindDirection(deg);
    if (pressure) pressure.innerHTML = `${pressureValue} <span class="bento-unit">hPa</span>`;

    // Background Update
    updateBackground(weatherMain, weatherCondition.id);

    weatherSection.classList.remove('hidden');
    cityInput.value = '';
}

function updateBackground(weatherMain, weatherId) {
    // Ideally we would toggle specific classes, but for this design
    // we are sticking to the global "starry" theme.
    // We can add subtle class modifiers if needed later.
    document.body.className = `starry-background ${weatherMain}`;
}

function getCurrentDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

function showLoading() {
    loadingContainer.classList.remove('hidden');
    weatherSection.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

function hideLoading() {
    loadingContainer.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    weatherSection.classList.add('hidden');
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
}

function hideError() {
    errorContainer.classList.add('hidden');
}

// Mock Data Generator for UI Testing
function getMockData(city = "Bengaluru") {
    // Generate slightly random data for liveliness
    const temp = 16 + Math.random() * 5;
    return {
        name: city,
        sys: { country: "IN" },
        main: {
            temp: temp,
            feels_like: temp - 2,
            humidity: 83,
            pressure: 1015,
            temp_min: 14,
            temp_max: 26
        },
        weather: [{
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d"
        }],
        wind: {
            speed: 5,
            deg: 160
        }
    };
}
