import "/style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).
catch(e => {
  console.error(e)
  alert("Failed to get weather data")
})

function renderWeather({current, daily, hourly}) {
   renderCurrentWeather(current)
   renderDailyWeather(daily)
   renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")

}

function setValue(selector, value, {parent = document} = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")

 function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.highFeelsLike)
  setValue("current-fl-low", current.lowFeelsLike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
 }

 //daily formatting
const DAY_FORMATTER = Intl.DateTimeFormat(undefined, {weekday: "long"}) //format day rather than a specific date
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")

function renderDailyWeather (daily) {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.maxTemp, {parent: element})
    setValue("time", DAY_FORMATTER.format(day.timestamp), {parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.appendChild(element)
  })
 }

 //Hourly formatting
 const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric"}) 
 const hourlySection = document.querySelector("[data-day-section]")
 const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hour.maxTemp, {parent: element})
    setValue("fl-temp", hour.feelsLike, {parent: element})
    setValue("wind", hour.windSpeed, {parent: element})
    setValue("precip", hour.precip, {parent: element})
    setValue("day", DAY_FORMATTER.format(hour.timestamp), {parent: element})
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), {parent: element})
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.appendChild(element)
  })
  
}