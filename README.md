# Weather App

A modern, responsive weather application that displays real-time weather information with a beautiful glassmorphism UI and starry night background.

## Features

- **Real-time Weather Data** - Current weather conditions, temperature, humidity, wind speed, and more
- **Automatic Location Detection** - Uses geolocation API to detect your current location
- **City Search** - Search for any Indian city with validation and suggestions
- **Comprehensive Metrics** - Displays visibility, precipitation, cloud coverage, wind gusts, sunrise/sunset times, and moon phases
- **Beautiful UI** - Glassmorphism design with starry background and smooth animations
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with glassmorphism effects and animations
- **JavaScript (ES6+)** - Dynamic functionality and API integration
- **OpenMeteo API** - Free weather data (no API key required)

## How to Run

Simply open `index.html` in your web browser. That's it!

### Using a Local Server (Optional)

For the best experience with geolocation features, you can run it on a local server:

**VS Code Live Server**
1. Install the Live Server extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

## How to Use

1. **Automatic Location** - On page load, the app will request your location permission
2. **Allow Location** - Click "Allow" to see weather for your current location
3. **Search Cities** - Enter any Indian city name in the search bar
4. **Location Button** - Click the location icon to refresh your current location weather

## Project Structure

```
Weather/
├── index.html          # Main HTML file
├── weather-styles.css  # Styling and animations
├── weather-app.js      # JavaScript logic and API calls
└── README.md          # Project documentation
```

## API Information

This app uses the **OpenMeteo API** which provides:
- No API key required
- Free weather data
- Geocoding services for city search
- Reverse geocoding for coordinates to city name
- Comprehensive weather metrics

## Weather Data Displayed

- Temperature (current and feels like)
- Weather condition description
- Humidity percentage
- Wind speed and direction
- Wind gusts
- Atmospheric pressure
- Visibility distance
- Cloud coverage
- Precipitation amount
- Sunrise and sunset times
- Moon phase and illumination

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Notes

- The app validates Indian cities only
- If a city is not found, suggestions will be provided
- Geolocation requires HTTPS or localhost for security
- Background changes based on weather conditions
