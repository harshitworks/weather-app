let fbtn = document.querySelector("#f");
let cbtn = document.querySelector("#c");
let dy = document.querySelector(".daylength");
const timeElement = document.getElementById("time3");
const rise = document.getElementById("time1");
const set = document.getElementById("time2");
const e5 = document.querySelector('#tomorrow-temp');
const e6 = document.querySelector("#search-city");
const e12 = document.querySelector("#weather");
const e7 = document.querySelector(".fa-solid.fa-magnifying-glass");
const e8 = document.querySelector("#text1");
const temp = document.querySelector(".curr-temp");
const now = new Date();
const currentHour =`${now.getFullYear()}-${ String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:00`;
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
let data ;
let times  ;
let index = data ? times.indexOf(currentHour) : -1;

let lat ;
let lon ;
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
            lat: lat,
            lon : lon,
            value : check
          }

      } catch (err) {
          console.error("Error:", err.message);
      }

}

async function call(city) {
  const ans = await coordinates(city);
  await Api(ans);
  return ans.value;; 
  
}

async function Api(coordinate){

  const baseurl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinate.lat}&longitude=${coordinate.lon}&daily=weather_code,sunset,sunrise,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,wind_speed_10m_max&hourly=temperature_2m,precipitation_probability,uv_index,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,visibility,wind_speed_10m&current=weather_code,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,rain,precipitation,cloud_cover&timezone=auto`;
  let response = await fetch(baseurl);
  data = await response.json();
  times = data.hourly.time;
  index = times.indexOf(currentHour);
  
  setTemperature(data);
  sunTime(data);
  nextFive(data);
  changeImage(data.current.weather_code,img,true);
  precipitationGraph(data);
  uvIndex(data);
  humidity(data);
  windSpeed(data);

}
  
async function searchCity(evt) {
    if(evt.key=='Enter') {
      cityFind();
    }
}
  
let prevtemp ;
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
    let prev = e8.innerText;
    let prev2 = othercity1.innerText;
    let other2 = ot1.innerText;
    othercity1.innerText=prev;
    ot1.innerText= prevtemp;
    othercity2.innerText=prev2;
    ot2.innerText= other2;
    e8.innerText= city.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    e6.value = "";

}

function nextFive(data){
  const temps = data.hourly.temperature_2m;


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
    changeImage(data.daily.weather_code[1],img2,false);


}

function setTemperature(data) {
  let curr_temp = data.current.temperature_2m;
  currentTempC = curr_temp;
  celsius = true;
  prevtemp = temp.innerText;
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
  const f0 = (avg * 9) / 5 + 32;
  e5.innerText = `${f0.toFixed(1)} °F`;
  
  // other1:
  let ott1 = parseFloat(ot1.innerText);
  const f1 = (ott1 * 9) / 5 + 32;
  ot1.innerText = `${f1.toFixed(1)} °F`;

  let ott2 = parseFloat(ot2.innerText);
  const f2 = (ott2 * 9) / 5 + 32;
  ot2.innerText = `${f2.toFixed(1)} °F`;

  
}

function toCelsius() {
  const temps = data.hourly.temperature_2m;
  for(let i=index ;i< index+5;i++){
    const e3 = document.querySelector(`.card212${i-index+1}   #hourly-temp`);
    let value=temps[i]+" °C"
    e3.innerText= value;
    }
    
    // tomorrow 
    let avg = ((data.daily.temperature_2m_max[1] + data.daily.temperature_2m_min[1])/2).toFixed(2) ;
    e5.innerText= avg+" °C";

    let ott1 = parseFloat(ot1.innerText);
    const f1 = (ott1-32) * 5 / 9 ;
    ot1.innerText = `${f1.toFixed(1)} °C`;
  
    let ott2 = parseFloat(ot2.innerText);
    const f2 = (ott2 -32) * 5 /9;
    ot2.innerText = `${f2.toFixed(1)} °C`;

}
  
function changeImage(code,tag,change) {
    let nextName ;
    
    if (code === 0) {
      nextName = data.current.is_day ? "sunny": "clear";
    }
    else if (code === 1 || code === 2) {
      nextName  = "warm";
    }
    else if (code === 3) {
      nextName  = "cloudy";
    }
    else if (code >= 51 && code <= 67) {
        nextName  = "rainy";
      }
      else if (code >= 80 && code <= 82) {
        nextName = "favicon";
    }
      else if (code >= 95 && code <= 99) {
        nextName  = "lighting";
      }
      else {
        nextName  = "cloudy";
      }
      tag.style.backgroundImage = `url("images/${nextName}.png")`;
      if(nextName === "favicon") {
        nextName = "rainy";
      }
      else if(nextName === "clear") {
        nextName = "Clear Sky";
      }

      if(change) e12.innerText = nextName.charAt(0).toUpperCase() + nextName.slice(1);
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
     
    e6.addEventListener("keydown", (evt)=>{searchCity(evt);})
  e7.addEventListener("click", async (evt) => {
    cityFind();
  });
  
  // Chances of Rain
  function precipitationGraph(data) {
    const precipitationProbabilities = data.hourly.precipitation_probability;
    const bars = graph.children;
    
    raintime.innerHTML = "";
    for(let i = index; i < index + 6 ; i++){
      
      const hours24 = Number(times[i].substring(11, 13));
      const period = hours24 >= 12 ? "PM" : "AM";
      const hours12 = hours24%12 || 12 ;
      
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
    if(curr_uv <= 2) {
      uv_level = "Low";
    }
    else if(curr_uv <= 6) {
      uv_level = "Moderate";
    }
    else {
      uv_level = "High";
    }
    
    path.style.strokeDasharray = path_length;
    const progress = curr_uv/11 * path_length;
    path.style.strokeDashoffset = path_length - progress;
    uv_para.innerHTML = ` ${curr_uv.toFixed(0)}/10 <br> ${uv_level} `;
  }
  
  // Humidity : 
  
  function humidity(data) {
    const humidity = data.current.relative_humidity_2m;
    let status = "";
    if(humidity<30) {
      status = "Low";
    }
    else if(humidity>=30 && humidity<=40) {
      status = "Good";
    }
    else if(humidity>=40 && humidity<=60) {
      status = "Moderate";
    }
    else {
      status = "High";
    }
    
    hm.innerHTML = `${status}: ${humidity}%  `;
    
    
  }  
  // wind speed :
  function windSpeed(data) {
    wn.innerText = "Now: "+data.current.wind_speed_10m+" Km/h";
    const wind = data.hourly.wind_speed_10m;
    const wbars = windBars.children;
    let winds = [];
    for(let i = index; i < index + 10 ; i++){
      if(i==index) {
        wbars[i-index].style.backgroundColor= "rgb(140, 239, 94)";
      }
      winds.push(wind[i]);  
    }
    let max = Math.max(...winds); 
    for(let i = 0 ; i < 10 ; i ++) {
      let w = winds[i]/max*100;
      wbars[i].style.height= w +"%";
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
                      value: true
                    });
                  },
                  (error) => {
                    console.error("Location error:", error);
                    
                    resolve({
                      lat: 28.49615,
                      lon: 77.53601,
                      value: false
                    });
                  }
                );
              });
            }
            async function getPlaceName(lat, lon) {
              const url =
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
              
              try {
                const response = await fetch(url, {
                  headers: {
                    "Accept": "application/json"
                  }
                });
                if (!response.ok) {
                  throw new Error(`HTTP Error: ${response.status}`);
                }
                
                const data = await response.json();
                
                return data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown Location";
                
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
        e8.innerText=city;
        await Api(ans);
    } catch (err) {
        console.error("Failed to load weather:", err);
    }
  });