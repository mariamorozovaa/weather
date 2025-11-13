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
  const date = new Date(dateStr);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("ru-RU", options);
}

//функции управления состоянием
function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

function showError() {
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

//прослушиватели событий
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() === "") {
    showError();
    error.textContent = "Введите название города";
    return;
  }
  forDisplayWeather();
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (cityInput.value.trim() === "") {
      showError();
      error.textContent = "Введите название города";
      return;
    }
    forDisplayWeather();
  }
});

async function getWeaher(city) {
  try {
    showLoading();
    hideError();
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

    hideLoading();

    return [currWeaherJSON, forecastWeaherJSON];
  } catch (currError) {
    hideLoading();
    showError();
    error.textContent = "Введено некорректное название города";
    console.log(currError.message);
  }
}
//отображение текущей погоды
function displayCurrWeaher(currWeaherObj) {
  cityName.textContent = currWeaherObj.name;
  date.textContent = getCurrDate();
  description.textContent = currWeaherObj.weather[0].description;
  temp.textContent = formatTemp(currWeaherObj.main.temp);
  weatherIcon.src = getWeatherIconURL(currWeaherObj.weather[0].icon);
  feelsLike.textContent = `${formatTemp(currWeaherObj.main.feels_like)}°`;
  humidity.textContent = `${currWeaherObj.main.humidity}%`;
  windSpeed.textContent = `${currWeaherObj.wind.speed} м/с`;
  pressure.textContent = `${currWeaherObj.main.pressure} гПа`;
}

//отображение прогноза погоды на 5 дней
function displayForecastWeaher(forecastWeaherObj) {
  const dailyForecast = forecastWeaherObj.list.filter((item, index) => index % 8 === 0);
  const forecastHTML = dailyForecast
    .map((day) => {
      return `
        <div class="forecast-day">
          <span class="forecast-date">${formatForecastDate(day.dt_txt)}</span>
          <img src="${getWeatherIconURL(day.weather[0].icon)}" alt="Погода" class="forecast-icon">
          <p class="forecast-desc">${day.weather[0].description}</p>
          <span class="forecast-temp">${formatTemp(day.main.temp)}°C</span>
        </div>
      `;
    })
    .join("");
  forecast.innerHTML = forecastHTML;
}

//вспомогательная функция для отображения погоды
async function forDisplayWeather() {
  if (cityInput.value === "") {
    const [defaultCurrWeather, defaultForecastWeaher] = await getWeaher("Moscow");
    displayCurrWeaher(defaultCurrWeather);
    displayForecastWeaher(defaultForecastWeaher);
    return;
  }

  const [currWeaher, forecastWeaher] = await getWeaher(cityInput.value.trim());
  displayCurrWeaher(currWeaher);
  displayForecastWeaher(forecastWeaher);
}

//вызов функции для отображения погоды
forDisplayWeather();
