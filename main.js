/*jslint browser: true*/
/*global $, jQuery*/

var units = 'imperial';

function main() {
  getLocation();
  callWeatherAPI();
};

var icons = [
  'url("icons/png/sunny.png")',
  'url("icons/png/clouds.png")',
  'url("icons/png/wind.png")',
  'url("icons/png/snowing.png")',
  'url("icons/png/sunny.png")',
  'url("icons/png/moon-1.png")'
];

var Coordinates = function(lat, lon) {
  this.latitude = lat;
  this.longitude = lon;
};

var coord = new Coordinates(0, 0);

function getLocation() {
  var display = document.getElementById('weather');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    display.innerHTML = 'Geolocation is not supported by this browser.';
  }
};


function showPosition(position) {
  coord.latitude = position.coords.latitude;
  coord.longitude = position.coords.longitude;
  callWeatherAPI();
};

function getURL(lat, lon, units) {
  var appid = '81f3bc7a8917428ab1dc5be1c6b758d6';
  return 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat +
    '&lon=' +
    lon + '&units=' + units + '&appid=' + appid;
};

function callWeatherAPI() {
  var url = getURL(coord.latitude, coord.longitude, units);
  $.getJSON(url, getWeather);
};

function getWeather(data) {
  var city = data.name;
  var temp = data.main.temp;
  var tempUnit = units === 'metric' ? 'C' : 'F';
  var humidity = data.main.humidity; 
  var wind = data.wind.speed;
  var windUnit = units === 'metric' ? ' meters/sec' : ' mph';
  var conditions = data.weather[0].main;
  var cloudliness = data.clouds.all;
  var dt = data.dt;
  var sunset = data.sys.sunset;
  var sunrise = data.sys.sunrise;
  var code = data.weather[0].icon;


  $('.location').html(city);
  $('.temperature').html(Math.round(temp));
  $('#units').html(' °' + tempUnit);
  $('#condition').html(conditions);
  $('#wind').html(wind + windUnit);
  $('#humidity').html(humidity + '%');
 
  
  var tempArr = prepBackground(tempUnit);
  setBackground(temp, tempArr);
  dayOrNight(dt, sunset, sunrise);


};

function setBackground(temp, tempArr) {
  if (temp >= tempArr[0]) {
    $('.icon').css('background-image', icons[0]);
  } else if (temp < tempArr[0] && temp >= tempArr[1]) {
    $('.icon').css('background-image', icons[1]);
  } else if (temp < tempArr[1] && temp >= tempArr[2]) {
    $('.icon').css('background-image', icons[2]);
  } else if (temp < tempArr[2]) {
    $('.icon').css('background-image', icons[3]);
  }
};

function dayOrNight(dt, sunset, sunrise) {
  if( dt >= sunrise && dt < sunset) { //day
    $('.night-day').css('background-image', icons[4]);
  }
  
  else {//night
  $('.night-day').css('background-image', icons[5]);
}
    
}

function prepBackground(tempUnit) {
  var tempArr;
  switch (tempUnit) {
    case 'F':
      tempArr = [90, 70, 32];
      break;
    case 'C':
      tempArr = [32, 21, 0];
      break;
  }
  return tempArr;
};



$(document).ready(main);
