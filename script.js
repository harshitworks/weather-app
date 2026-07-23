let fbtn = document.querySelector("#f");
let cbtn = document.querySelector("#c");

fbtn.addEventListener("click", () => {
    fbtn.classList.add("toggle-btn");
    cbtn.classList.remove("toggle-btn");
  });
  
cbtn.addEventListener("click", () => {
    cbtn.classList.add("toggle-btn");
    fbtn.classList.remove("toggle-btn");
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
    const nextIndex = currentIndex >= 0
      ? (currentIndex + 1) % imgArr.length
      : 0;

    const nextName = imgArr[nextIndex];
    el.style.backgroundImage = `url("images/${nextName}.png")`;

}

// function toggleTemperature(btn) {


// }

const temp = document.querySelector(".curr-temp");

let baseurl = "https://api.open-meteo.com/v1/forecast?latitude=28.4962&longitude=77.536&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,rain,relative_humidity_2m,precipitation_probability,precipitation,weather_code&models=best_match&current=relative_humidity_2m,temperature_2m,apparent_temperature,wind_speed_10m,is_day&timezone=auto&wind_speed_unit=ms";

async function call() {
  let response = await fetch(baseurl);
  let data = await response.json();
  console.log(data);
  let curr_temp = data.current.temperature_2m;
  temp.innerText = `${curr_temp} °C`;

}
call();