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
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
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
    //показать индикатор загрузки
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    //формируем URL для запросов
    const currWeatherURL = `${CURR_BASE_URL}?q=${city}&appid=${API_KEY}&lang=ru`;
    const forecastWeatherURL = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&lang=ru`;
    //выполняем запросы параллельно
    const [currResponse, forecastResponse] = await Promise.all([fetch(currWeatherURL), fetch(forecastWeatherURL)]);
    if (!currResponse.ok || !forecastResponse.ok) {
      throw new Error(`${currResponse.status}, ${forecastResponse.status}`);
    }

    const currWeaherJSON = await currResponse.json();
    const forecastWeaherJSON = await forecastResponse.json();

    //логирование для теста
    console.log(currWeaherJSON);
    console.log(forecastWeaherJSON);
    //скрыть индикатор загрузки
    loading.classList.add("hidden");

    return [currWeaherJSON, forecastWeaherJSON];
  } catch (curError) {
    loading.classList.add("hidden");
    error.classList.remove("hidden");
    error.textContent = curError.message;
  }
}

async function displayCurrWeaher(currWeaherObj) {
  cityName.textContent = currWeaherObj.name;
  date.textContent = getCurrDate();
  description.textContent = currWeaherObj.weather[0].description;
  temp.textContent = formatTemp(currWeaherObj.main.temp);
  weatherIcon.src = getWeatherIconURL(currWeaherObj.weather[0].icon);
  feelsLike.textContent = `${formatTemp(currWeaherObj.main.feels_like)}°`;
}

async function forDisplayData() {
  if (cityInput.value === "") {
    const [defaultCurrWeather, defaultForecastWeaher] = await getWeaher("Moscow");
    displayCurrWeaher(defaultCurrWeather);
    return;
  }

  const [currWeaher, forecastWeaher] = await getWeaher(cityInput.value);
  displayCurrWeaher(currWeaher);
}

searchBtn.addEventListener("click", () => {
  forDisplayData();
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    forDisplayData();
  }
});

forDisplayData();
