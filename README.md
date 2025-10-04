# Weather Information Center

A responsive web application that fetches and displays real-time weather data from the OpenWeatherMap API.

## Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **5-Day Forecast**: View upcoming weather predictions
- **Location-based Weather**: Use your current location to get local weather
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient background with glassmorphism effects
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading animations for better user experience

## Files Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API calls
└── README.md           # This documentation file
```

## Setup Instructions

### 1. Get API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key from your dashboard

### 2. Configure the Application

1. Open `script.js`
2. Replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
this.apiKey = 'your_actual_api_key_here';
```

### 3. Run the Application

#### Option A: Local Server (Recommended)
Due to CORS restrictions, you'll need to run this on a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

#### Option B: Live Server Extension
If using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server".

## How to Use

1. **Search by City**: Enter a city name in the search box and click the search button or press Enter
2. **Get Current Location**: Click "Get Current Location" to automatically detect your location and show local weather
3. **View Details**: The app displays:
   - Current temperature and weather conditions
   - Feels-like temperature
   - Visibility, humidity, wind speed, and pressure
   - 5-day weather forecast

## API Endpoints Used

- **Geocoding API**: `https://api.openweathermap.org/geo/1.0/direct` - Convert city names to coordinates
- **Current Weather API**: `https://api.openweathermap.org/data/2.5/weather` - Get current weather data
- **5-Day Forecast API**: `https://api.openweathermap.org/data/2.5/forecast` - Get weather forecast

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **JavaScript ES6+**: Modern JavaScript with async/await, classes, and fetch API
- **Font Awesome**: Icons for weather conditions and UI elements
- **Google Fonts**: Inter font family for modern typography

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Customization

### Changing the Default City
In `script.js`, modify the `loadDefaultWeather()` method:

```javascript
async loadDefaultWeather() {
    await this.getWeatherByCity('YourCityName');
}
```

### Styling Modifications
The CSS uses CSS custom properties (variables) for easy theming. You can modify colors, fonts, and spacing in `styles.css`.

### Adding New Weather Details
To add more weather information:

1. Add HTML elements in `index.html`
2. Add corresponding CSS styles in `styles.css`
3. Update the `displayWeather()` method in `script.js`

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure you're running the app on a local server, not opening the HTML file directly
2. **API Key Error**: Verify your API key is correct and active
3. **City Not Found**: Try different city names or check spelling
4. **Location Permission**: Allow location access when prompted for current location feature

### API Rate Limits

The free OpenWeatherMap API has rate limits:
- 60 calls per minute
- 1,000,000 calls per month

For production use, consider upgrading to a paid plan.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.

---

**Note**: This application is for educational purposes. Make sure to follow OpenWeatherMap's terms of service when using their API.


