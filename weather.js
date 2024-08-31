import axios from 'axios';


export function getWeather(lat,lon,timezone){
    return axios
        .get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime", 
            {
                params: {
                    latitude: lat,
                    longitude: lon,  
                    timezone,
                },
            }
        )
        .then(({data}) => {
            if (!data || !data.current_weather || !data.daily) {
            throw new Error("Incomplete weather data");
        }
            return {
                current: parseCurrentWeather(data),
    // //       daily:parseDailyWeather(data),
    // //       hourly:parseHourlyWeather(data),
            }
        })
   

}

console.log();

function parseCurrentWeather({ current_weather, daily}){
    if (!current_weather || !daily) {
        throw new Error("Incomplete weather data");
    }
    const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
    } = current_weather
    

    const {
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
    } = daily
    

    return {
        currentTemp: Math.round(currentTemp),
        highTemp:Math.round(maxTemp),
        lowTemp:Math.round(minTemp),
        highFeelsLike:Math.round(maxFeelsLike),
        lowFeelsLike:Math.round(minFeelsLike),
        precip: Math.round(precip * 100) / 100,
        windSpeed: Math.round(windSpeed),
        iconCode,
    }
}