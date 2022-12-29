const toggleButtons = document.getElementById('toggle-buttons');
const toggleC = document.getElementById('toggle-c');
const toggleF = document.getElementById('toggle-f');
const toggleK = document.getElementById('toggle-k');

//set default temperature unit to celsius
toggleC.classList.add('active');
let tempFormat = 'celsius' //fahrenheit celsius kelvin

toggleC.addEventListener('click', toggleTempFormat);
toggleF.addEventListener('click', toggleTempFormat);
toggleK.addEventListener('click', toggleTempFormat);

function getUnitFromSymbol(symbol){
    let unit;
    if (symbol === 'f'){
        unit = 'fahrenheit'
    }
    if (symbol === 'c'){
        unit = 'celsius'
    }
    if (symbol === 'k'){
        unit = 'kelvin'
    }

    return unit;
}

function toggleTempFormat(){
    let id = this.id
    let symbol = id.charAt(id.length-1);
    let unit = getUnitFromSymbol(symbol);

    //make sure the other one is no longer active. 
    const activeButtons = toggleButtons.querySelectorAll('.active');
    activeButtons.forEach(button =>{
        button.classList.remove('active');
    });

    //set clicked temp to active
    let activatedButton = document.getElementById(`${id}`);
    activatedButton.classList.add('active');

    
    console.log(id, symbol, unit, tempFormat);
    convertAllTemps(tempFormat, unit);
    tempFormat = unit; //set the global var to the clicked-on unit
    console.log(id, symbol, unit, tempFormat);
}


function convertAllTemps(fromUnit, toUnit){
    //code to change all temps on page
    console.log(fromUnit, toUnit);

    //grab dom elements
    const temperatureDisplay = document.querySelector('.temperature');
    const feelsLikeCard = document.getElementById('feels-like');
    const lowOfCard = document.getElementById('low-temp');
    const highOfCard = document.getElementById('high-temp');

    //get JUST the numbers out of them
    let mainTempInput = temperatureDisplay.innerText
    let highTempInput = highOfCard.querySelector('.card-data').innerText
    let lowTempInput = lowOfCard.querySelector('.card-data').innerText
    let feelsLikeInput = feelsLikeCard.querySelector('.card-data').innerText
    

    //get JUST the numbers out of them
    
    let mainTempOutput = extractNumber(mainTempInput)
    let highTempOutput = extractNumber(highTempInput)
    let lowTempOutput = extractNumber(lowTempInput)
    let feelsLikeOutput = extractNumber(feelsLikeInput)
    

    //convert correctly
    console.log('where conversion will happen', mainTempOutput, highTempOutput, lowTempOutput, feelsLikeOutput);
    mainTempOutput = convertTemp(mainTempOutput, toUnit, fromUnit);
    highTempOutput = convertTemp(highTempOutput, toUnit, fromUnit);
    lowTempOutput = convertTemp(lowTempOutput, toUnit, fromUnit);
    feelsLikeOutput = convertTemp(feelsLikeOutput, toUnit, fromUnit);
    console.log('where conversion will happen', mainTempOutput, highTempOutput, lowTempOutput, feelsLikeOutput);

    //put them back with correct unit via innertext
    // highOfCard.querySelector('.card-data').innerText = `${highTemp}`+`${tempSymbol}`; 
    // lowOfCard.querySelector('.card-data').innerText = `${lowTemp}`+`${tempSymbol}`; 
    // feelsLikeCard.querySelector('.card-data').innerText = `${feelsLike}`+`${tempSymbol}`;

    let tempSymbol = getSymbolFromTempFormat(toUnit);
    temperatureDisplay.innerText = `${mainTempOutput}`+`${tempSymbol}`;
    highOfCard.querySelector('.card-data').innerText = `${highTempOutput}`+`${tempSymbol}`; 
    lowOfCard.querySelector('.card-data').innerText = `${lowTempOutput}`+`${tempSymbol}`; 
    feelsLikeCard.querySelector('.card-data').innerText = `${feelsLikeOutput}`+`${tempSymbol}`;
}

function extractNumber(string){
    //takes a string with numbers and then a degree/symbol
    //gets only the decimal number and returns it as an int.
    if (typeof string === 'number'){
        return string;
    } else {
        let rx1 = /( |^)([+-]?[0-9]*\.?[0-9]*)( |$)/g
        //there MUST be a space between the number and the symbol
        arr = rx1.exec(string)
        //returns an array with the number in index 2
        let num = Number(arr[2]);
        return num;
    }

}



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
        getWeatherData(apiCall).then(data => parseData(data)).catch(err => console.log(err));
    
    } else {
        //preferably build from user locale
        let lat = coords[0];
        let lon = coords[1];
        let apiCall = ('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=7e9a8a2360a1c8b97cb00837292efb3f');
        getWeatherData(apiCall).then(data => parseData(data)).catch(err => console.log(err));
    }

    
}


async function getWeatherData(apiCall){
    //take in a completed url for a fetch request and return a processed json from a resolved promise;
    try{
    let response = await fetch(apiCall, {mode: 'cors'});
    let responseData = await response.json();
    
    return responseData;
    } catch (err) {
        console.log(err);
    }
    
}

function parseData(data){
    console.log('data will now be processed from resolved promise');
    

    //get data from resolved promise object
    let city = data.name;
    let country = data.sys.country;
    console.log(data.main.temp);
    let temp = convertTemp(data.main.temp, tempFormat);
    let feelsLike = convertTemp(data.main.feels_like, tempFormat);
    let description = data.weather[0].description;
    let windSpeed = data.wind.speed;
    let humidity = data.main.humidity;
    let pressure = data.main.pressure;
    let clouds = data.clouds.all;
    let highTemp = convertTemp(data.main.temp_max, tempFormat);
    let lowTemp = convertTemp(data.main.temp_min, tempFormat);

    //test line
    console.log('parseData function prints:', city, country, temp, description, clouds, windSpeed, humidity, pressure, highTemp, lowTemp);
    
    //take data and use it to render page
    renderPage(city, country, temp, description, clouds, windSpeed, humidity, pressure, highTemp, lowTemp, feelsLike, tempFormat);

}

function getSymbolFromTempFormat(tempFormat){
    if (tempFormat === 'celsius'){
        return tempSymbol = ' ℃';
    } else if (tempFormat === 'fahrenheit'){
        return tempSymbol = ' ℉';
    } else{
        return tempSymbol = ' K';
    }
}

function renderPage(city, country, temp, description, clouds, windSpeed, humidity, pressure, highTemp, lowTemp, feelsLike, tempFormat){
    console.log('data will now be rendered to the DOM')
    renderTimeDate();

    //get appropriate symbol for temp format fahrenheit celsius kelvin
    let tempSymbol = getSymbolFromTempFormat(tempFormat);
    

    //get DOM elements
    const content = document.getElementById('content');
    
    const temperatureDisplay = content.querySelector('.temperature');
    
    const cityAndCountryDisplay = document.getElementById('city-country');
    const descriptionDisplay = content.querySelector('.description');
    const feelsLikeCard = document.getElementById('feels-like');
    const lowOfCard = document.getElementById('low-temp');
    const highOfCard = document.getElementById('high-temp');
    const pressureCard = document.getElementById('pressure');
    const humidityCard = document.getElementById('humidity');
    const windSpeedCard = document.getElementById('wind-speed');

    //render elements to DOM
    cityAndCountryDisplay.innerText = `${city}, ${country}`;
    temperatureDisplay.innerText = `${temp}`+`${tempSymbol}`;
    descriptionDisplay.innerText = `Looks like ${description} with ${clouds}% cloud coverage.`
    windSpeedCard.querySelector('.card-data').innerText = `${windSpeed} m/s`;
    humidityCard.querySelector('.card-data').innerText = `${humidity}%`; 
    pressureCard.querySelector('.card-data').innerText = `${pressure} hPa`; 
    highOfCard.querySelector('.card-data').innerText = `${highTemp}`+`${tempSymbol}`; 
    lowOfCard.querySelector('.card-data').innerText = `${lowTemp}`+`${tempSymbol}`; 
    feelsLikeCard.querySelector('.card-data').innerText = `${feelsLike}`+`${tempSymbol}`;
    
    //TODO: call giphy here
    displayGif(description).catch(err => console.log(err));
    

}

function renderTimeDate(){
    let Today = new Date();
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dayOfWeek = days[Today.getDay()];
    let month = months[Today.getMonth()];
    let time = `${Today.getHours()}` + `:` + `${Today.getMinutes()}`;
    let date = `${dayOfWeek}` + ` ${month}` + ` ${Today.getDate()}`;
    
    const timeAndDayDisplay = document.getElementById('time-day');
    timeAndDayDisplay.innerText = `${time}`+` ${date}`;
}

function convertTemp (temp, tempFormat, fromUnit = 'kelvin'){
    //temps are kelvin by default, so you will always start with a kelvin number
    console.log(fromUnit);
    if (fromUnit === 'kelvin'){
        //these statements all take a kelvin unit and transform them into the tempFormat unit
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
    } else if (fromUnit === 'celsius'){
        //these statements all take a celsius unit and transform them into the tempFormat unit
        if(tempFormat === 'celsius') {
            let convertedTemp = roundDown(temp);
            return convertedTemp; 
        } else if (tempFormat === 'kelvin') {
            let convertedTemp = roundDown(temp + 273.15);
            return convertedTemp; 
        } else if (tempFormat === 'fahrenheit'){
            let convertedTemp = roundDown(temp * (9/5) + 32);
            return convertedTemp; 
        }
    } else if (fromUnit === 'fahrenheit'){
        //these statements all take a fahrenheit unit and transform them into the tempFormat uu65enit
        if(tempFormat === 'fahrenheit') {
            let convertedTemp = roundDown(temp);
            return convertedTemp; 
        } else if (tempFormat === 'kelvin') {
            let convertedTemp = roundDown(((temp - 32) * (5/9)) + 273.15);
            return convertedTemp; 
        } else if (tempFormat === 'celsius'){
            let convertedTemp = roundDown((temp - 32) * (5/9));
            return convertedTemp; 
        }
    }


}

function roundDown(num){
    return Math.round(num * 100) /100
}






///get input from searchbar
const searchBarInput = document.getElementById('searchbar-feild');
const gifContainer = document.getElementById('gifContainer');
const subBut = document.getElementById('submit-location');

//prevent default and add listener
subBut.addEventListener('click', function(event){
    event.preventDefault()
  });
subBut.addEventListener('click', getUserInput);

//hit enter to submit query
searchBarInput.onkeydown = function(e){
    if(e.keyCode == 13){
        getUserInput();
    }
 };

function getUserInput(){
    let inputString = document.querySelector('#searchbar-feild').value;
    //this will query by city, wheras the default queries by coordinates
    let apiCall = 'https://api.openweathermap.org/data/2.5/weather?q=' + inputString + '&appid=7e9a8a2360a1c8b97cb00837292efb3f'
    alert(apiCall);
    queryUserInput(apiCall);
}

function queryUserInput(apiCall){
    //run api call, get the data and then parse it.
    //the parseData function will also then render the page
    getWeatherData(apiCall).then(data => parseData(data)).catch(err => console.log(err));
}

async function displayGif(query){
    try{
        let inputString = query;
        let apiCall = 'https://api.giphy.com/v1/gifs/translate?api_key=7Wnj0H7weXMpnOdr2p83rxvT4J4ZGnKz&s=' + inputString;
        let response = await fetch(apiCall, {mode: 'cors'});
        let responseData = await response.json();
        gifContainer.src = responseData.data.images.original.url;
        } catch (err) {
            console.log(err);
        }

}


getLocationFromUser();

