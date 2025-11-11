//общие URL
const API_KEY = "c4ef06ff4c9b9130299e0898ebb95c02";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const CURR_BASE_URL = `${BASE_URL}/weather`;
const FORECAST_URL = `${BASE_URL}/forecast`;

//элементы ввода
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const cityName = document.querySelector("#cityName");
const date = document.querySelector("#date");
const description = document.querySelector("#description");
const temp = document.querySelector("#temp");
const weatherIcon = document.querySelector("#weatherIcon");
const feelsLike = document.querySelector("#feelsLike");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const pressure = document.querySelector("#pressure");

//элементы состояния
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");

//прогноз на 5 дней
const forecast = document.querySelector("#forecast");

//вспомогательные функции
function formatTemp(temp) {
  return Math.round(temp - 273.15);
}

function getWeatherIconURL(iconCode) {
  return `https://api.openweathermap.org/img/wn/${iconCode}.png`;
}

function getCurrDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("ru-RU", options);
}

function formatForecastDate(dateStr) {
  const date = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("ru-RU", options);
}

async function getWeaher(city) {
  try {
    //формируем URL для запросов
    const currWeatherURL = `${CURR_BASE_URL}?q=${city}&appid=${API_KEY}&lang=ru`;
    const forecastWeatherURL = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&lang=ru`;
    //выполняем запросы параллельно
    const [currResponse, forecastResponse] = await Promise.all([fetch(currWeatherURL), fetch(forecastWeatherURL)]);
  } catch {}
}
