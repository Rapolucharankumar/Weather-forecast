// Simple Weather App - Debug Version
console.log('Weather app script loaded!');

class WeatherApp {
    constructor() {
        console.log('WeatherApp constructor called');
        this.apiKey = '8e716cde4efd85b501c42f04572b1934';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geoUrl = 'https://api.openweathermap.org/geo/1.0';
        
        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeElements() {
        console.log('Initializing elements...');
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
        
        console.log('Elements initialized:', {
            cityInput: !!this.cityInput,
            searchBtn: !!this.searchBtn,
            weatherContainer: !!this.weatherContainer
        });
    }

    bindEvents() {
        console.log('Binding events...');
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => {
                console.log('Search button clicked');
                this.searchWeather();
            });
        }
        
        if (this.locationBtn) {
            this.locationBtn.addEventListener('click', () => {
                console.log('Location button clicked');
                this.getCurrentLocationWeather();
            });
        }
        
        if (this.cityInput) {
            this.cityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.searchWeather();
                }
            });
        }
    }

    async loadDefaultWeather() {
        console.log('Loading default weather...');
        // Show demo data first
        this.showDemoWeather();
    }

    async searchWeather() {
        const city = this.cityInput ? this.cityInput.value.trim() : '';
        console.log('Searching for city:', city);
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        try {
            this.showLoading();
            this.hideError();
            
            // Try to get real data first
            await this.getWeatherByCity(city);
        } catch (error) {
            console.error('Search error:', error);
            // Fallback to demo data
            this.showDemoWeather(city);
        }
    }

    async getCurrentLocationWeather() {
        console.log('Getting current location...');
        this.showError('Location feature requires HTTPS. Please search for a city instead.');
    }

    async getWeatherByCity(city) {
        console.log('Fetching weather for city:', city);
        
        try {
            // Use CORS proxy
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const geoUrl = `${proxyUrl}${encodeURIComponent(`${this.geoUrl}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`)}`;
            
            console.log('Fetching geocoding data...');
            const geoResponse = await fetch(geoUrl);
            
            if (!geoResponse.ok) {
                throw new Error('City not found');
            }

            const geoData = await geoResponse.json();
            console.log('Geocoding data:', geoData);
            
            if (geoData.length === 0) {
                throw new Error('City not found');
            }

            const { lat, lon } = geoData[0];
            console.log('Coordinates:', lat, lon);
            
            await this.getWeatherByCoords(lat, lon, city);

        } catch (error) {
            console.error('Error in getWeatherByCity:', error);
            throw error;
        }
    }

    async getWeatherByCoords(lat, lon, cityName = null) {
        console.log('Fetching weather by coordinates...');
        
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            
            // Get current weather
            const weatherUrl = `${proxyUrl}${encodeURIComponent(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)}`;
            console.log('Fetching current weather...');
            
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const weatherData = await weatherResponse.json();
            console.log('Weather data:', weatherData);

            // Get 5-day forecast
            const forecastUrl = `${proxyUrl}${encodeURIComponent(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)}`;
            console.log('Fetching forecast...');
            
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            const forecastData = await forecastResponse.json();
            console.log('Forecast data:', forecastData);

            this.displayWeather(weatherData, forecastData, cityName);
            this.hideLoading();

        } catch (error) {
            console.error('Error in getWeatherByCoords:', error);
            throw error;
        }
    }

    showDemoWeather(cityName = 'London') {
        console.log('Showing demo weather for:', cityName);
        
        const demoWeatherData = {
            name: cityName,
            main: {
                temp: 22,
                feels_like: 24,
                humidity: 65,
                pressure: 1013
            },
            weather: [{
                description: 'partly cloudy',
                icon: '02d'
            }],
            visibility: 10000,
            wind: {
                speed: 3.5
            }
        };

        const demoForecastData = {
            list: [
                { dt: Date.now() / 1000 + 86400, main: { temp: 20 }, weather: [{ description: 'sunny', icon: '01d' }] },
                { dt: Date.now() / 1000 + 172800, main: { temp: 18 }, weather: [{ description: 'cloudy', icon: '04d' }] },
                { dt: Date.now() / 1000 + 259200, main: { temp: 25 }, weather: [{ description: 'clear sky', icon: '01d' }] },
                { dt: Date.now() / 1000 + 345600, main: { temp: 19 }, weather: [{ description: 'light rain', icon: '10d' }] },
                { dt: Date.now() / 1000 + 432000, main: { temp: 23 }, weather: [{ description: 'partly cloudy', icon: '02d' }] }
            ]
        };

        this.displayWeather(demoWeatherData, demoForecastData, cityName);
    }

    displayWeather(weatherData, forecastData, cityName = null) {
        console.log('Displaying weather data:', weatherData);
        
        // Display current weather
        if (this.cityName) this.cityName.textContent = cityName || weatherData.name;
        if (this.currentDate) this.currentDate.textContent = this.formatDate(new Date());
        if (this.temperature) this.temperature.textContent = Math.round(weatherData.main.temp);
        if (this.description) this.description.textContent = weatherData.weather[0].description;
        if (this.feelsLikeTemp) this.feelsLikeTemp.textContent = Math.round(weatherData.main.feels_like);
        
        // Set weather icon
        this.setWeatherIcon(weatherData.weather[0].icon);
        
        // Display weather details
        if (this.visibility) this.visibility.textContent = `${weatherData.visibility / 1000} km`;
        if (this.humidity) this.humidity.textContent = `${weatherData.main.humidity}%`;
        if (this.windSpeed) this.windSpeed.textContent = `${weatherData.wind.speed} m/s`;
        if (this.pressure) this.pressure.textContent = `${weatherData.main.pressure} hPa`;

        // Display forecast
        this.displayForecast(forecastData);

        // Show weather container
        if (this.weatherContainer) {
            this.weatherContainer.classList.remove('hidden');
        }
        this.hideLoading();
    }

    displayForecast(forecastData) {
        if (!this.forecast) return;
        
        this.forecast.innerHTML = '';
        
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
        if (!this.weatherIcon) return;
        
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
        console.log('Showing loading...');
        if (this.loading) this.loading.classList.remove('hidden');
        if (this.weatherContainer) this.weatherContainer.classList.add('hidden');
    }

    hideLoading() {
        console.log('Hiding loading...');
        if (this.loading) this.loading.classList.add('hidden');
    }

    showError(message) {
        console.log('Showing error:', message);
        if (this.errorMessage) this.errorMessage.textContent = message;
        if (this.error) this.error.classList.remove('hidden');
        if (this.weatherContainer) this.weatherContainer.classList.add('hidden');
    }

    hideError() {
        console.log('Hiding error...');
        if (this.error) this.error.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
console.log('Script loaded, waiting for DOM...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        new WeatherApp();
        console.log('WeatherApp initialized successfully!');
    } catch (error) {
        console.error('Error initializing WeatherApp:', error);
    }
});

console.log('Script execution completed');
