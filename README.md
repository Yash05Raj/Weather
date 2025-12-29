# Weather App

A beautiful, premium-designed weather application with dynamic animations and searching capabilities.

## Features
- **Real-time Weather**: Fetches data from OpenWeatherMap (or uses Mock Mode if API key is not configured).
- **Dynamic Animations**: Background changes based on weather conditions (Rain, Snow, Clouds, Clear).
- **Bento Stats**: Clean visualization of humidity, wind, pressure, and more.
- **Location Support**: Uses browser geolocation to find weather at your current position.

## How to Run Locally

You can run this web application using any simple HTTP server. Here are the easiest methods:

### Option 1: VS Code Live Server (Recommended)
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Open `index.html`.
3. Click **"Go Live"** in the bottom right corner of VS Code.
4. The app will open automatically in your browser (usually at `http://127.0.0.1:5500`).

### Option 2: Python (If installed)
Runs a simple server from your terminal:
```bash
# Form the project directory
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Double-Click
You can also simply double-click `index.html` to open it in your browser.
*Note: Some features like Geolocation or certain API calls might have strict permission requirements that work better on a local server.*

## Developer Notes (Mock Mode)
If no API Key is provided in `script.js` (default state), the app runs in **Mock Mode** using `ca7bc6ebabe15057ad28e0817b26b91f`.

**Supported Mock Cities:**
- London
- New York / NYC
- Tokyo
- Paris
- Sydney
- Bengaluru / Bangalore
- Mumbai
- Delhi

**Animation Testing:**
You can force animations by adding keywords to these cities:
- "London Rain"
- "Tokyo Snow"
- "Paris Clouds"
