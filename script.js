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