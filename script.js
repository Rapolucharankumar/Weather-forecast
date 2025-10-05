// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '8e716cde4efd85b501c42f04572b1934'; // Replace with your OpenWeatherMap API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geoUrl = 'https://api.openweathermap.org/geo/1.0';
        
        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherContainer = document.getElementById('weatherContainer');
        
        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.temperature = document.getElementById('temperature');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.description = document.getElementById('description');
        this.feelsLikeTemp = document.getElementById('feelsLikeTemp');
        this.visibility = document.getElementById('visibility');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.forecast = document.getElementById('forecast');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.locationBtn.addEventListener('click', () => this.getCurrentLocationWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }

    async loadDefaultWeather() {
        // Load weather for London as default
        await this.getWeatherByCity('London');
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        console.log('Searching for city:', city);
        await this.getWeatherByCity(city);
    }

    async getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();
        this.hideError();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.getWeatherByCoords(latitude, longitude);
            },
            (error) => {
                this.hideLoading();
                this.showError('Unable to retrieve your location. Please try searching for a city instead.');
            }
        );
    }

    async getWeatherByCity(city) {
        try {
            this.showLoading();
            this.hideError();

            // Use CORS proxy for local development
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const geoUrl = `${proxyUrl}${encodeURIComponent(`${this.geoUrl}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`)}`;
            
            const geoResponse = await fetch(geoUrl);
            
            if (!geoResponse.ok) {
                throw new Error('City not found');
            }

            const geoData = await geoResponse.json();
            if (geoData.length === 0) {
                throw new Error('City not found');
            }

            const { lat, lon } = geoData[0];
            await this.getWeatherByCoords(lat, lon, city);

        } catch (error) {
            this.hideLoading();
            this.showError(error.message || 'Failed to fetch weather data');
        }
    }

    async getWeatherByCoords(lat, lon, cityName = null) {
        try {
            // Use CORS proxy for local development
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            
            // Get current weather
            const weatherUrl = `${proxyUrl}${encodeURIComponent(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)}`;
            const weatherResponse = await fetch(weatherUrl);

            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const weatherData = await weatherResponse.json();

            // Get 5-day forecast
            const forecastUrl = `${proxyUrl}${encodeURIComponent(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)}`;
            const forecastResponse = await fetch(forecastUrl);

            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            const forecastData = await forecastResponse.json();

            this.displayWeather(weatherData, forecastData, cityName);
            this.hideLoading();

        } catch (error) {
            this.hideLoading();
            this.showError(error.message || 'Failed to fetch weather data');
        }
    }

    displayWeather(weatherData, forecastData, cityName = null) {
        // Display current weather
        this.cityName.textContent = cityName || weatherData.name;
        this.currentDate.textContent = this.formatDate(new Date());
        this.temperature.textContent = Math.round(weatherData.main.temp);
        this.description.textContent = weatherData.weather[0].description;
        this.feelsLikeTemp.textContent = Math.round(weatherData.main.feels_like);
        
        // Set weather icon
        this.setWeatherIcon(weatherData.weather[0].icon);
        
        // Display weather details
        this.visibility.textContent = `${weatherData.visibility / 1000} km`;
        this.humidity.textContent = `${weatherData.main.humidity}%`;
        this.windSpeed.textContent = `${weatherData.wind.speed} m/s`;
        this.pressure.textContent = `${weatherData.main.pressure} hPa`;

        // Display forecast
        this.displayForecast(forecastData);

        // Show weather container
        this.weatherContainer.classList.remove('hidden');
    }

    displayForecast(forecastData) {
        this.forecast.innerHTML = '';
        
        // Group forecast by day and take one entry per day
        const dailyForecasts = this.groupForecastByDay(forecastData.list);
        
        dailyForecasts.slice(0, 5).forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            const date = new Date(day.dt * 1000);
            const icon = day.weather[0].icon;
            const temp = Math.round(day.main.temp);
            const description = day.weather[0].description;
            
            forecastItem.innerHTML = `
                <div class="forecast-date">${this.formatDate(date, true)}</div>
                <div class="forecast-icon">
                    <i class="fas ${this.getWeatherIconClass(icon)}"></i>
                </div>
                <div class="forecast-temp">${temp}°C</div>
                <div class="forecast-desc">${description}</div>
            `;
            
            this.forecast.appendChild(forecastItem);
        });
    }

    groupForecastByDay(forecastList) {
        const grouped = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!grouped[date]) {
                grouped[date] = item;
            }
        });
        
        return Object.values(grouped);
    }

    setWeatherIcon(iconCode) {
        const iconClass = this.getWeatherIconClass(iconCode);
        this.weatherIcon.className = `fas ${iconClass}`;
    }

    getWeatherIconClass(iconCode) {
        const iconMap = {
            '01d': 'fa-sun',
            '01n': 'fa-moon',
            '02d': 'fa-cloud-sun',
            '02n': 'fa-cloud-moon',
            '03d': 'fa-cloud',
            '03n': 'fa-cloud',
            '04d': 'fa-cloud',
            '04n': 'fa-cloud',
            '09d': 'fa-cloud-rain',
            '09n': 'fa-cloud-rain',
            '10d': 'fa-cloud-sun-rain',
            '10n': 'fa-cloud-moon-rain',
            '11d': 'fa-bolt',
            '11n': 'fa-bolt',
            '13d': 'fa-snowflake',
            '13n': 'fa-snowflake',
            '50d': 'fa-smog',
            '50n': 'fa-smog'
        };
        
        return iconMap[iconCode] || 'fa-cloud';
    }

    formatDate(date, short = false) {
        const options = short 
            ? { weekday: 'short', month: 'short', day: 'numeric' }
            : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        return date.toLocaleDateString('en-US', options);
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.weatherContainer.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.error.classList.remove('hidden');
        this.weatherContainer.classList.add('hidden');
    }

    hideError() {
        this.error.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Note: To use this app, you need to:
// 1. Get a free API key from https://openweathermap.org/api
// 2. Replace 'YOUR_API_KEY_HERE' with your actual API key
// 3. Make sure to enable CORS or use a CORS proxy if testing locally
