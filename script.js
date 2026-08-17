let fbtn = document.querySelector("#f");
let cbtn = document.querySelector("#c");
let dy = document.querySelector(".daylength");
const timeElement = document.getElementById("time3");
const rise = document.getElementById("time1");
const set = document.getElementById("time2");
const e5 = document.querySelector("#tomorrow-temp");
const e6 = document.querySelector("#search-city");
const e12 = document.querySelector("#weather");
const e7 = document.querySelector(".fa-solid.fa-magnifying-glass");
const e8 = document.querySelector("#text1");
const temp = document.querySelector(".curr-temp");
let currentHour;
const imgArr = ["rainy", "cloudy", "sunny", "warm", "lighting"];
const img = document.querySelector("#curr-image");
const img2 = document.querySelector("#next-image");
const graph = document.querySelector(".graph");
const raintime = document.querySelector(".rain-time");
const uv_para = document.querySelector("#uv-index");
const hm = document.querySelector("#humidity");
const windBars = document.querySelector(".wind-bars");
const wn = document.querySelector("#windSpeed");
const othercity1 = document.querySelector("#othercity1");
const othercity2 = document.querySelector("#othercity2");
const ot1 = document.querySelector("#other1");
const ot2 = document.querySelector("#other2");
let data;
let times;
let index = -1;

let lat;
let lon;
let celsius = true;
let currentTempC = null;
let nearbyCityWeather = [];

const cityCatalogue = [
  { name: "New Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Noida", lat: 28.5355, lon: 77.391 },
  { name: "Greater Noida", lat: 28.4744, lon: 77.504 },
  { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
  { name: "Gurugram", lat: 28.4595, lon: 77.0266 },
  { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
  { name: "Meerut", lat: 28.9845, lon: 77.7064 },
  { name: "Hapur", lat: 28.7306, lon: 77.7759 },
  { name: "Bulandshahr", lat: 28.4069, lon: 77.8498 },
  { name: "Bijnor", lat: 29.3724, lon: 78.1358 },
  { name: "Agra", lat: 27.1767, lon: 78.0081 },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { name: "Dehradun", lat: 30.3165, lon: 78.0322 },
  { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
  { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Pune", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Kochi", lat: 9.9312, lon: 76.2673 },
  { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { name: "Patna", lat: 25.5941, lon: 85.1376 },
  { name: "London", lat: 51.5072, lon: -0.1276 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
];

function distanceInKm(lat1, lon1, lat2, lon2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderNearbyCities() {
  const cards = [
    { city: othercity1, temperature: ot1 },
    { city: othercity2, temperature: ot2 },
  ];

  cards.forEach((card, index) => {
    const nearby = nearbyCityWeather[index];
    if (!nearby) return;
    card.city.innerText = nearby.name;
    const value = celsius
      ? nearby.temperatureC
      : (nearby.temperatureC * 9) / 5 + 32;
    card.temperature.innerText = `${value.toFixed(1)} °${celsius ? "C" : "F"}`;
  });
}

async function loadNearbyCities(userLocation) {
  const closestCities = cityCatalogue
    .map((city) => ({
      ...city,
      distance: distanceInKm(
        userLocation.lat,
        userLocation.lon,
        city.lat,
        city.lon,
      ),
    }))
    .filter((city) => city.distance > 3)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);

  othercity1.innerText = "Loading…";
  othercity2.innerText = "Loading…";

  try {
    nearbyCityWeather = await Promise.all(
      closestCities.map(async (city) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m`,
        );
        if (!response.ok)
          throw new Error(`Unable to load weather for ${city.name}`);
        const weather = await response.json();
        return {
          name: city.name,
          temperatureC: weather.current.temperature_2m,
        };
      }),
    );
    renderNearbyCities();
  } catch (error) {
    console.error("Failed to load nearby cities:", error);
    othercity1.innerText = "Unavailable";
    othercity2.innerText = "Unavailable";
  }
}

async function Api(coordinate) {
  const baseurl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${coordinate.lat}` +
    `&longitude=${coordinate.lon}` +
    `&daily=weather_code,sunset,sunrise,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,wind_speed_10m_max` +
    `&hourly=temperature_2m,precipitation_probability,uv_index,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m` +
    `&current=weather_code,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,rain,precipitation,cloud_cover` +
    `&timezone=auto`;

  try {
    const response = await fetch(baseurl);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    data = await response.json();
    times = data.hourly.time;

    currentHour = data.current.time.slice(0, 13) + ":00";
    index = times.indexOf(currentHour);

    if (index === -1) {
      throw new Error("Current hour not found in hourly data");
    }

    // Update UI
    setTemperature(data);
    sunTime(data);
    nextFive(data);
    changeImage(data.current.weather_code, img, true);
    precipitationGraph(data);
    uvIndex(data);
    humidity(data);
    windSpeed(data);
    return true;
  } catch (error) {
    console.error("Weather API error:", error);
    return false;
  }
}

async function call(city) {
  const ans = await coordinates(city);
  if (!ans.value) {
    return {
      value: false,
    };
  }

  const weatherLoaded = await Api(ans);
  if (!weatherLoaded) {
    return {
      value: false,
    };
  }
  return ans;
}

async function coordinates(city) {
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?` +
    `name=${encodeURIComponent(city)}` +
    `&count=10` +
    `&language=en` +
    `&format=json`;

  try {
    const response = await fetch(geoUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return {
        value: false
      };
    }

    const searchedName = city.trim().toLowerCase();

    let result = data.results.find(
      place =>
        place.name &&
        place.name.toLowerCase() === searchedName
    );

    if (!result) {
      result = data.results[0];
    }

    return {
      lat: result.latitude,
      lon: result.longitude,
      value: true,
      name: result.name
    };

  } catch (error) {
    console.error("Geocoding ERROR:", error);
    return {
      value: false
    };
  }
}

async function searchCity(evt) {
  if (evt.key == "Enter") {
    cityFind();
  }
}

async function cityFind() {
  let city = e6.value.trim();
  if (city.length <= 2) {
    city = "Noida";
  }

  e6.value = "";
  const ans = await call(city);
  if (!ans.value) {
    e8.innerText = "Location not found";
    return;
  }
  e8.innerText = ans.name;
}

function nextFive(data) {
  const temps = data.hourly.temperature_2m;

  for (let i = index; i < index + 5; i++) {
    const e3 = document.querySelector(
      `.card212${i - index + 1}   #hourly-temp`,
    );
    const e4 = document.querySelector(`.card212${i - index + 1}   #time`);
    const hour24 = Number(times[i].substring(11, 13));

    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;

    e3.innerText = temps[i] + " °C";
    e4.innerText = `${hour12} ${period}`;
  }

  // tomorrow
  let avg = (
    (data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1]) /
    2
  ).toFixed(2);
  e5.innerText = avg + " °C";
  changeImage(data.daily.weather_code[1], img2, false);
}

function setTemperature(data) {
  let curr_temp = data.current.temperature_2m;
  currentTempC = curr_temp;
  celsius = true;
  prevtemp = temp.innerText;
  temp.innerText = `${currentTempC} °C`;
}

function sunTime(data) {

  const seconds = data.daily.daylight_duration[0];
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  timeElement.innerText = `${hours}h ${minutes}m`;

  function convertTime(timestamp) {
    const timePart = timestamp.substring(11, 16);
    const parts = timePart.split(":");

    let hour = Number(parts[0]);
    const minute = parts[1];

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  }

  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];

  rise.innerText = convertTime(sunrise);
  set.innerText = convertTime(sunset);
}

function toFahrenheit() {
  for (let i = 0; i < 5; i++) {
    const e3 = document.querySelector(`.card212${i + 1}   #hourly-temp`);
    let value = parseFloat(e3.innerText);
    const f = (value * 9) / 5 + 32;
    e3.innerText = `${f.toFixed(1)} °F`;
  }

  // tomorrow
  let avg = parseFloat(e5.innerText);
  const f0 = (avg * 9) / 5 + 32;
  e5.innerText = `${f0.toFixed(1)} °F`;

  renderNearbyCities();
}

function toCelsius() {
  const temps = data.hourly.temperature_2m;
  for (let i = index; i < index + 5; i++) {
    const e3 = document.querySelector(
      `.card212${i - index + 1}   #hourly-temp`,
    );
    let value = temps[i] + " °C";
    e3.innerText = value;
  }

  // tomorrow
  let avg = (
    (data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1]) /
    2
  ).toFixed(2);
  e5.innerText = avg + " °C";

  renderNearbyCities();
}

function changeImage(code, tag, change) {
  let nextName;
  let weatherName;

  if (code === 0) {
    if (data.current.is_day) {
      nextName = "sunny";
      weatherName = "Clear Sky";
    } else {
      nextName = "clear";
      weatherName = "Clear Sky";
    }
  } else if (code === 1) {
    if (data.current.is_day) {
      nextName = "warm";
    } else {
      nextName = "clear";
    }
    weatherName = "Clear Sky";
  } else if (code === 2) {
    if (data.current.is_day) {
      nextName = "warm";
      weatherName = "Clear Sky";
    } else {
      nextName = "clear";
      weatherName = "Partly Cloudy";
    }
  } else if (code === 3) {
    nextName = "cloudy";
    weatherName = "Overcast";
  } else if (code === 45 || code === 48) {
    nextName = "mist";
    weatherName = "Fog";
  } else if (code >= 51 && code <= 55) {
    nextName = "humidity";
    weatherName = "Drizzle";
  } else if (code === 56 || code === 57) {
    nextName = "frost";
    weatherName = "Freezing Drizzle";
  } else if (code >= 61 && code <= 65) {
    nextName = "rainy";
    weatherName = "Rain";
  } else if (code === 66 || code === 67) {
    nextName = "frost";
    weatherName = "Freezing Rain";
  } else if (code >= 71 && code <= 77) {
    nextName = "snow";
    weatherName = "Snow";
  } else if (code >= 80 && code <= 82) {
    nextName = "rainy";
    weatherName = "Rain Showers";
  } else if (code === 85 || code === 86) {
    nextName = "snow";
    weatherName = "Snow Showers";
  } else if (code >= 95 && code <= 99) {
    nextName = "thunderstorm";
    weatherName = "Thunderstorm";
  } else {
    nextName = "cloudy";
    weatherName = "Cloudy";
  }

  tag.style.backgroundImage = `url("images/${nextName}.png")`;

  // Change weather text
  if (change) {
    e12.innerText = weatherName;
  }
}

fbtn.addEventListener("click", () => {
  fbtn.classList.add("toggle-btn");
  cbtn.classList.remove("toggle-btn");
  if (currentTempC !== null && celsius) {
    celsius = false;
    const f = (currentTempC * 9) / 5 + 32;
    temp.innerText = `${f.toFixed(1)} °F`;
    toFahrenheit();
  }
});

cbtn.addEventListener("click", () => {
  cbtn.classList.add("toggle-btn");
  fbtn.classList.remove("toggle-btn");
  if (currentTempC !== null && !celsius) {
    celsius = true;
    temp.innerText = `${currentTempC} °C`;
    toCelsius();
  }
});

// Dynamic City>
e6.addEventListener("keydown", (evt) => {
  searchCity(evt);
});
e7.addEventListener("click", async (evt) => {
  cityFind();
});

// Chances of Rain
function precipitationGraph(data) {
  const precipitationProbabilities = data.hourly.precipitation_probability;
  const bars = graph.children;

  raintime.innerHTML = "";
  for (let i = index; i < index + 6; i++) {
    const hours24 = Number(times[i].substring(11, 13));
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerText = hours12 + " " + period;
    raintime.appendChild(tooltip);
    bars[i - index].style.height = precipitationProbabilities[i] + "%";
  }
}

// UV Index :
function uvIndex(data) {
  const curr_uv = data.hourly.uv_index[index];
  const path = document.querySelector("#uv");
  const path_length = path.getTotalLength();
  let uv_level = "";
  if (curr_uv <= 2) {
    uv_level = "Low";
  } else if (curr_uv <= 6) {
    uv_level = "Moderate";
  } else {
    uv_level = "High";
  }

  path.style.strokeDasharray = path_length;
  const progress = (curr_uv / 11) * path_length;
  path.style.strokeDashoffset = path_length - progress;
  uv_para.innerHTML = ` ${curr_uv.toFixed(0)}/10 <br> ${uv_level} `;
}

// Humidity :
function humidity(data) {
  const humidity = data.current.relative_humidity_2m;
  let status = "";
  if (humidity < 30) {
    status = "Low";
  } else if (humidity >= 30 && humidity <= 40) {
    status = "Good";
  } else if (humidity >= 40 && humidity <= 60) {
    status = "Moderate";
  } else {
    status = "High";
  }

  hm.innerHTML = `${status}: ${humidity}%  `;
}
// wind speed :
function windSpeed(data) {
  wn.innerText = "Now: " + data.current.wind_speed_10m + " Km/h";
  const wind = data.hourly.wind_speed_10m;
  const wbars = windBars.children;
  let winds = [];
  for (let i = index; i < index + 10; i++) {
    if (i == index) {
      wbars[i - index].style.backgroundColor = "rgb(140, 239, 94)";
    }
    winds.push(wind[i]);
  }
  let max = Math.max(...winds);
  for (let i = 0; i < 10; i++) {
    let w = (winds[i] / max) * 100;
    wbars[i].style.height = w + "%";
  }
}

// location :
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          value: true,
        });
      },
      (error) => {
        console.error("Location error:", error);

        resolve({
          lat: 28.49615,
          lon: 77.53601,
          value: false,
        });
      },
    );
  });
}
async function getPlaceName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county ||
      "Unknown Location"
    );
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown Location";
  }
}
// Window Reload -->
window.addEventListener("load", async () => {
  celsius = true;
  try {
    const ans = await getLocation();
    const city = await getPlaceName(ans.lat, ans.lon);
    e8.innerText = city;
    await Api(ans);
    await loadNearbyCities(ans);
  } catch (err) {
    console.error("Failed to load weather:", err);
  }
});
