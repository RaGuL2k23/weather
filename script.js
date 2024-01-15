let weather_api_key = "f185ddf7f79d466f80b42901241301";
let src;
let input = document.querySelector("input");
let place = input.value;
const placeName = document.querySelector("#place");
let area = document.querySelector("p.area");
let temp = document.querySelector("p.temp");
let feeltemp = document.querySelector(".feeltemp");
let precipitation = document.querySelector(".precipitation");
let windSpeed = document.querySelector(".wind");
let conditionTxt = document.querySelector("#conditionTxt");
let conditionImg = document.querySelector("#conditionImg");
let windDirection = document.getElementById("windDirection");
let wind_degree = document.getElementById("wind_degree");
let unitCorF_ = document.querySelector("#unit");
let unitKmorM_ = document.querySelector("#unitkm");
let uv = document.querySelector("#uv");
let visibility = document.querySelector("#vis");
let humidity = document.querySelector("#humidity");
let time = document.getElementById("time");
let gust = document.getElementById("gust");
let pressure = document.getElementById("pressure");
let imgGifi = document.querySelector(".gifi");
const gifHolder = document.querySelector(".gif");
let unitCorF = "c";
let unitKmorM = "kph";
unitKmorM_.addEventListener("click", () => {
  unitKmorM_.textContent = unitKmorM == "kph" ? "kph" : "mph";
  console.log(unitKmorM);
  updateUnitKmorM();
});
unitCorF_.addEventListener("click", () => {
  unitCorF_.textContent = unitCorF == "f" ? "f" : "c";
  unitCorF_.textContent =
    unitCorF_.textContent == "f" ? "Fahrenheit" : "Celcius";
  console.log(unitCorF);
  updateUnitCorF();
});
async function loadJson() {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${weather_api_key}&q=${place}`,
    );
    console.log(response.ok, "df", response.status);
    if (!response.ok) {
      alert("invalid search place");
    }
    let data = await response.json();
    return data;
  } catch {
    alert("invalid search/url");
  }
}
async function getGifs(value) {
  if (value == "clear") {
    value = "good weather";
  }
  // else if (value == "cloudy") value ="partly cloudy"
  src = `https://api.giphy.com/v1/gifs/translate?api_key=zPTIhZRX66AcZEA09mMDHZXmNmpHA8mX&s=${value} `;

  let response = await fetch(src);
  if (!response.ok) {
    alert("invalid search place");
  }
  let data = await response.json();
  return data;
}
let data;
async function displayDetails() {
  try {
    placeName.textContent = `${place}`;
    data = await loadJson();
    let gifObj = await getGifs(data.current.condition.text);
    gifHolder.textContent = " ";
    imgGifi = new Image();
    imgGifi.src = gifObj.data.images.original.url;
    gifHolder.append(imgGifi);
    document.body.style.backgroundImage = `url(${imgGifi.src})`;
    area.innerHTML = `<p>Location :${data.location.name}</p><p>region :${data.location.region} country :${data.location.country}</p>`;
    updateMoreElements(data); //dynamic updation of temp to cel to fahreheit
  } catch (err) {
    alert("perhaps invalid search place");
    console.log(err);
  }
}
function updateMoreElements(v = data) {
  let data = v;
  updateUnitCorF(data);
  updateUnitKmorM(data);
}
function updateUnitCorF(v = data) {
  let data = v;
  unitCorF = unitCorF == "f" ? "c" : "f";
  let feelslike = data.current[`feelslike_${unitCorF}`];
  feeltemp.textContent = `feels like :${feelslike} ${unitCorF.toUpperCase()}`;
  const temperature = data.current[`temp_${unitCorF}`];
  temp.textContent = `Temperature out there is ${temperature} ${unitCorF.toUpperCase()}`;
}
function updateUnitKmorM(v = data) {
  let data = v;

  precipitation.textContent = ` ${data.current.precip_in} inches, ${data.current.precip_mm}mm`;

  //wind
  unitKmorM = unitKmorM == "mph" ? "kph" : "mph";
  let wind = data.current[`wind_${unitKmorM}`];
  windSpeed.textContent = `wind speed : ${wind} ${unitKmorM}`;
  windDirection.textContent = ` wind direction:  ${data.current.wind_dir}`;
  wind_degree.textContent = `wind Degree : ${data.current.wind_degree}`;

  conditionTxt.textContent = `${data.current.condition.text}`;
  conditionImg.src = `https:${data.current.condition.icon}`;
  let dataTime = data.location.localtime.split(" ");
  time.innerHTML = `<nav>Date :${dataTime[0].split("-").reverse().join("-")}</div><nav style="margin-left:-60px">Time : ${dataTime[1]}`;

  uv.textContent = `UV INDEX: ${data.current.uv}`;
  visibility.textContent = `Visibility: ${data.current.vis_km}km or ${data.current.vis_miles}Miles `;
  humidity.textContent = `Humidity ${data.current.humidity}%`;
  let gust_ = data.current[`gust_${unitKmorM}`];
  gust.textContent = `Gust : ${gust_} ${unitKmorM}`;
  pressure.textContent = `pressure ${data.current.pressure_in} in`;
}
function findWeatherDetails() {
  place = input.value;
  displayDetails();
}
displayDetails().catch(alert);
