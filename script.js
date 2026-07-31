let fbtn = document.querySelector("#f");
let cbtn = document.querySelector("#c");
let dy = document.querySelector(".daylength");
const timeElement = document.getElementById("time3");
const rise = document.getElementById("time1");
const set = document.getElementById("time2");
const e5 = document.querySelector('#tomorrow-temp');
const e6 = document.querySelector("#search-city");
const e7 = document.querySelector(".fa-solid.fa-magnifying-glass");
const e8 = document.querySelector("#text1");
const temp = document.querySelector(".curr-temp");
const now = new Date();
const currentHour =`${now.getFullYear()}-${ String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00`;
const imgArr = ["rainy", "cloudy", "sunny", "warm", "lighting"];
const img = document.querySelector("#curr-image");
let data ;

let lat = 28.49615;
let lon = 77.53601;
let celsius = true;
let currentTempC = null;

async function coordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
  try {
          const response = await fetch(geoUrl);
          if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
          }

          const data = await response.json();
          let check = false;
          if (!data.results || data.results.length === 0) {
            lat = 28.49615;
            lon = 77.53601;
          }
          else {
            lat = data.results[0].latitude ;
            lon = data.results[0].longitude;
            check = true;
          }
          
          return {
            lati: lat,
            loni : lon,
            value : check
          }

      } catch (err) {
          console.error("Error:", err.message);
      }

}

async function call(city) {
  const ans = await coordinates(city);
    lat = ans.lati;
    lon = ans.loni;
    let value = ans.value;
  
  const baseurl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,sunset,sunrise,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m&current=weather_code,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,rain,precipitation,cloud_cover&timezone=auto`;

  let response = await fetch(baseurl);
  data = await response.json();
  console.log(data);
  setTemperature(data);
  sunTime(data);
  nextFive(data);
  changeImage();
  return value;
  
}
  
async function searchCity(evt) {
    if(evt.key=='Enter') {
      cityFind();
    }
}
  
  async function cityFind(){
    let city = e6.value;
    if(city.length<=2) {
      city = "Noida";
    }
    let value = await call(city);
    if(!value) {
      city = "Noida";
    }
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(); 
    e8.innerText= city;
    e6.value = "";

}

function nextFive(data){
  const times = data.hourly.time;
  const temps = data.hourly.temperature_2m;
  const index = times.indexOf(currentHour);


  for(let i=index ;i< index+5;i++){
      const e3 = document.querySelector(`.card212${i-index+1}   #hourly-temp`);
      const e4 = document.querySelector(`.card212${i-index+1}   #time`);
      const hour24 = Number(times[i].substring(11, 13));
      
      const period = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 || 12;
      
      e3.innerText=temps[i]+" °C";
      e4.innerText = `${hour12} ${period}`;
    }
    
    // tomorrow 
    let avg = ((data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1])/2).toFixed(2) ;
    e5.innerText= avg+" °C";

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

function toFahrenheit() {
  for(let i=0 ;i<5;i++){
    const e3 = document.querySelector(`.card212${i+1}   #hourly-temp`);
    let value = parseFloat(e3.innerText);
    const f = (value * 9) / 5 + 32;
    e3.innerText = `${f.toFixed(1)} °F`;
    
  }
  
  // tomorrow 
  let avg =  parseFloat(e5.innerText);
  const f2 = (avg * 9) / 5 + 32;
  e5.innerText = `${f2.toFixed(1)} °F`;
  
}

function toCelsius() {
  const temps = data.hourly.temperature_2m;
  const times = data.hourly.time;
  const index = times.indexOf(currentHour);
  
  
  for(let i=index ;i< index+5;i++){
    const e3 = document.querySelector(`.card212${i-index+1}   #hourly-temp`);
    let value=temps[i]+" °C"
    e3.innerText= value;
    }
    
    // tomorrow 
    let avg = ((data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1])/2).toFixed(2) ;
    e5.innerText= avg+" °C";
}
  
function changeImage() {
    const code = data.current.weather_code;
    const temp = data.current.temperature_2m;
    let nextName ;
    
    if (code === 0) {
      nextName  = "sunny";
    }
    else if (code === 1 || code === 2) {
      nextName  = "warm";
    }
    else if (code === 3) {
      nextName  = "cloudy";
    }
    else if (
        (code >= 51 && code <= 67) ||
        (code >= 80 && code <= 82)
      ) {
        nextName  = "rainy";
      }
      else if (code >= 95 && code <= 99) {
        nextName  = "lighting";
      }
      else {
        nextName  = "cloudy";
      }
      img.style.backgroundImage = `url("images/${nextName}.png")`;
}
    
    
    window.addEventListener("load", async () => {
      celsius = true;
      e8.innerText= "Noida";
      await call("Noida");
    });
    
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

    
  // Dynamic City
  e6.addEventListener("keydown", (evt)=>{searchCity(evt);})
  e7.addEventListener("click", async (evt) => {
      cityFind();
    });