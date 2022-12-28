let tempFormat = 'celsius'


function getLocationFromUser (){
    if ('geolocation' in navigator) {
        /* geolocation is available */
        console.log('geolocation IS available');
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude, position.coords.longitude);
            let defaultCoords = [];
            defaultCoords.push(position.coords.latitude);
            defaultCoords.push(position.coords.longitude);
            defaultLocation =  defaultCoords;
            getDefaultData(defaultLocation);
          },
            // When the permission is denied
            () => {
                // Add the longitudes and latitudes of the hard-coded coordinate here
                console.log('you hit block!')
                getDefaultData();
            });  
      } else {
        console.log('geolocation is NOT available');
        return false;
        /* geolocation IS NOT available */
    }
}

function getDefaultData(coords) {
    //get a 2 item array of lat lon coordinates to set up initial page
    if (!coords){
        //default to Kansas if nothing sent in
        let lat = 39.057;
        let lon = -95.680;
        let apiCall = ('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=7e9a8a2360a1c8b97cb00837292efb3f');
        getWeatherData(apiCall).then(data => renderPage(data)).catch(err => console.log(err));
    
    } else {
        //preferably build from user locale
        let lat = coords[0];
        let lon = coords[1];
        let apiCall = ('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=7e9a8a2360a1c8b97cb00837292efb3f');
        getWeatherData(apiCall).then(data => renderPage(data)).catch(err => console.log(err));
    }

    
}
async function getWeatherData(apiCall){
    //take in a completed url for a fetch request and return a processed json from a resolved promise;
    try{
    let response = await fetch(apiCall, {mode: 'cors'});
    let responseData = await response.json();
    // console.log(responseData);
    // let city = responseData.name;
    // let country = responseData.sys.country;
    
    // let temp = convertTemp(responseData.main.temp, tempFormat);
    // console.log('does it work?', city, country, temp);
    return responseData;
    } catch (err) {
        console.log(err);
    }
    
}

function renderPage(data){
    //temps are in kelvin by default
    console.log('data will now be processed to go to DOM');
    renderTimeDate();
    let city = data.name;
    let country = data.sys.country;
    let temp = convertTemp(data.main.temp, tempFormat);
    let description
    let windSpeed
    let windDirection
    let humidity
    let pressure
    let highTemp
    let lowTemp
    console.log('renderPage function', city, country, temp);

}

function renderTimeDate(){
    let Today = new Date();
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dayOfWeek = days[Today.getDay()];
    let month = months[Today.getMonth()];
    let time = `${Today.getHours()}` + `:` + `${Today.getMinutes()}`;
    let date = `${dayOfWeek}` + ` ${month}` + ` ${Today.getDate()}`;
    
    
    console.log(time, date);
    //TODO: render time to DOM
}

function convertTemp (temp, tempFormat){
    //temps are kelvin by default, so you will always start with a kelvin number
    
    if(tempFormat === 'kelvin') {
        let convertedTemp = roundDown(temp);
        return convertedTemp; 
    } else if (tempFormat === 'celsius') {
        let convertedTemp = roundDown(temp - 273.15);
        return convertedTemp; 
    } else if (tempFormat === 'fahrenheit'){
        let convertedTemp = roundDown((temp - 273.15) * (9/5) + 32);
        return convertedTemp; 
    }
       
}

function roundDown(num){
    return Math.round(num * 100) /100
}



getLocationFromUser();
