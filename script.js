let fbtn = document.querySelector("#f");
let cbtn = document.querySelector("#c");
let dy = document.querySelector(".daylength");
const timeElement = document.getElementById("time3");
const rise = document.getElementById("time1");
const set = document.getElementById("time2");

const temp = document.querySelector(".curr-temp");
let lat = 28.49615;
let lon = 77.53601;
let baseurl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunset,sunrise,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,rain,precipitation,cloud_cover&timezone=auto`;
let celsius = true;
let currentTempC = null;

async function coordinates() {
  const city = "Bulandshahr";
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

  const response = await fetch(geoUrl);
  const data = await response.json();
  const lat = data.results[0].latitude;
  const lon = data.results[0].longitude;

  return {
    lat: lat,
    lon : lon
  }
}

async function call() {
  const ans = await coordinates();
  lat = ans.lat;
  lon = ans.lon;

  baseurl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunset,sunrise,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,rain,precipitation,cloud_cover&timezone=auto`;


  let response = await fetch(baseurl);
  let data = await response.json();

  console.log(data);
  setTemperature(data);
  sunTime(data);
  nextFive(data);
  
  
  
}
// Dynamic City

// const e6 = document.querySelector("#search-city");
// e6.addEventListener("keydown", (evt)=>{searchCity(evt);})

// const e7 = document.querySelector(".fa-solid.fa-magnifying-glass");

// e7.addEventListener("click", (evt) => {
//     console.log(e6.value);
// });


// function searchCity(evt) {
//   if(evt.key=='Enter') {
//     console.log(e6.value);
//   }
  
// }

function nextFive(data){
  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;

  const now = new Date();

  const currentHour =
  `${now.getFullYear()}-${
  String(now.getMonth()+1).padStart(2,"0")
  }-${
  String(now.getDate()).padStart(2,"0")
  }T${
  String(now.getHours()).padStart(2,"0")
  }:00`;

  const index = times.indexOf(currentHour);


  for(let i=index ;i< index+5;i++){

      const e3 = document.querySelector(`.card212${i-index+1}   #hourly-temp`);
      const e4 = document.querySelector(`.card212${i-index+1}   #time`);
      const hour24 = Number(times[i].substring(11, 13));
      
      const period = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 || 12;
      
      e3.innerText=temps[i];
      e4.innerText = `${hour12} ${period}`;
    }
    
    // tomorrow 
    let avg = (data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1])/2 ;
    const e5 = document.querySelector('#tomorrow-temp');
    e5.innerText= avg+" °C";
    
    console.log(avg);


}

function setTemperature(data) {
  let curr_temp = data.current.temperature_2m;
  currentTempC = curr_temp;
  celsius = true;
  temp.innerText = `${currentTempC} °C`;

}

function sunTime(data) {
  const duration = data.daily.daylight_duration[0];
  const seconds = data.daily.daylight_duration[0];
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  timeElement.innerText = `${hours}h ${minutes}m`;
  
  let sunset = data.daily.sunset[0].substring(11);
  let sunrise = data.daily.sunrise[0].substring(11);
  rise.innerText = sunrise + " AM";
  set.innerText = sunset + " PM";

}

window.addEventListener("load", async () => {
  await call();
});

fbtn.addEventListener("click", () => {
  fbtn.classList.add("toggle-btn");
  cbtn.classList.remove("toggle-btn");
  if (currentTempC !== null) {
    celsius = false;
    const f = (currentTempC * 9) / 5 + 32;
    temp.innerText = `${f.toFixed(1)} °F`;
  }
});

cbtn.addEventListener("click", () => {
  cbtn.classList.add("toggle-btn");
  fbtn.classList.remove("toggle-btn");
  if (currentTempC !== null) {
    celsius = true;
    temp.innerText = `${currentTempC} °C`;
  }
});

const imgArr = ["rainy", "cloudy", "sunny", "warm", "lighting"];
const img = document.querySelector(".image");

img.addEventListener("click", (evt) => changeImage(evt.currentTarget));

function changeImage(el) {
  const currentUrl = getComputedStyle(el).backgroundImage;
  const currentName = currentUrl
    .split("/")
    .pop()
    .replace(/["')]/g, "")
    .replace(/\.[^.]+$/, "");
  const currentIndex = imgArr.indexOf(currentName);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % imgArr.length : 0;

  const nextName = imgArr[nextIndex];
  el.style.backgroundImage = `url("images/${nextName}.png")`;
}
