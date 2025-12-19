import { APIKEY } from "./environment.js";

const cityNameEl = document.getElementById("cityName");
const currentTempEl = document.getElementById("currentTemp");
const weatherDescEl = document.getElementById("weatherDesc");
const highLowEl = document.getElementById("highLow");
const searchInput = document.getElementById("UserSearchInput");
const btnF = document.getElementById("btnF");
const btnC = document.getElementById("btnC");

let savedWeatherData = null;
let isFahrenheit = true;

function toFahrenheit(k) {
  return Math.round((k - 273.15) * 9 / 5 + 32);
}

function toCelsius(k) {
  return Math.round(k - 273.15);
}

function fetchWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`)
    .then(res => res.json())
    .then(data => updateScreen(data))
    .catch(err => console.error(err));
}

function fetchWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`)
    .then(res => res.json())
    .then(data => updateScreen(data))
    .catch(() => alert("City not found"));
}

function updateScreen(data) {
  savedWeatherData = data;

  cityNameEl.textContent = data.name;
  weatherDescEl.textContent = data.weather[0].main;

  if (isFahrenheit) {
    currentTempEl.textContent = toFahrenheit(data.main.temp) + "°F";
    highLowEl.textContent =
      toFahrenheit(data.main.temp_min) + "°F / " +
      toFahrenheit(data.main.temp_max) + "°F";
  } else {
    currentTempEl.textContent = toCelsius(data.main.temp) + "°C";
    highLowEl.textContent =
      toCelsius(data.main.temp_min) + "°C / " +
      toCelsius(data.main.temp_max) + "°C";
  }
}


navigator.geolocation.getCurrentPosition(
  pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
  err => console.error(err.message)
);

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    fetchWeatherByCity(searchInput.value);
    searchInput.value = "";
  }
});

btnF.addEventListener("click", () => {
  isFahrenheit = true;
  if (savedWeatherData) updateScreen(savedWeatherData);
});

btnC.addEventListener("click", () => {
  isFahrenheit = false;
  if (savedWeatherData) updateScreen(savedWeatherData);
});
