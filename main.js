/*jslint browser: true*/
/*global $, jQuery*/

var units = 'imperial';


var icons = [
  'url("desert.jpg")',
  'url("forest.jpg")',
  'url("mountain.png")',
  'url("snow.jpg")',
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
  } 
  
  else {
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
 
  
  setBackground(temp);
  dayOrNight(dt, sunset, sunrise);


};

function setBackground(temp) {
  if (temp >= 90) {//hot
    $('.forecast').css('background-image', icons[0]);
    $('.night-day').css('top', '55px');
    $('.night-day').css('left', '50px');
  } else if (temp < 90 && temp >= 70) {//comfortable
    $('.forecast').css('background-image', icons[1]);
    $('.night-day').css('top', '150px');
    $('.night-day').css('left', '200px');
  } else if (temp < 70 && temp >= 30) {//chilly
    $('.forecast').css('background-image', icons[2]);
    $('.night-day').css('top', '55px');
    $('.night-day').css('left', '50px');
  } else if (temp < 30) {//cold
    $('.forecast').css('background-image', icons[3]);
    $('.night-day').css('top', '100px');
    $('.night-day').css('left', '180px');
    $('.forecast').css('text-shadow', '0px 2px 2px #6f56cf');
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


$(document).ready(function() {
  
    getLocation();
    callWeatherAPI();
  
  
});
