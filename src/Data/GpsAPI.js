export default class GpsAPI{
    static getLocation=(handler)=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handler);
        } else {
            return "Geolocation is not supported by this browser.";
        }
    }
}