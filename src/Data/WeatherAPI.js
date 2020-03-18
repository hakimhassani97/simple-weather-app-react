import axios from "axios"

const API_URL='https://api.openweathermap.org/data/2.5/forecast'///daily'
const API_KEY='001b0f58045147663b1ea518d34d88b4'
export default class WeatherAPI{
    static getWeatherForCity=(city)=>{
        return axios.get(API_URL+'?q='+city+'&APPID='+API_KEY+'&cnt=1000&units=metric')
    }
}