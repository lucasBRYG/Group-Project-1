$(document).ready(function(){
  $(".button-collapse").sideNav();
  $('select').material_select();
  $('.collapsible').collapsible();
});
// store the value of the input
let city = $("#searchTerm").val();
// Nick's API keys
const cityKey = "91a49fc1d36c35421107a53b3f87c750";
const bikeKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const runKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const climbKey = "200931616-01e2cafc553024f568bca2e9d24d47b5";
const hikeKey = "200929750-d723e897b2d3dea9d999e2d05c66faa4";
const lat = 0;
const maxd = 0;

//  Biking query url: https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=
//  Running query url: https://www.trailrunproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=
//  Climbing query rul: https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=40.03&lon=-105.25&maxDistance=10&minDiff=5.6&maxDiff=5.10&key=


$("#searchTerm").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
});

$("#searchBtn").on("click", () => {

        $('#forecastH5').addClass('show');

        // get the value of the input from user
        city = $("#searchTerm").val();

        // clear input box
        $("#searchTerm").val("");

        // full url to call api
        const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + cityKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                console.log(response);

                console.log(response.city.name);
                console.log(response.city.coord.lat);
                console.log(response.city.coord.lon);
                console.log(response.list[0].weather[0].icon);

                let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
                console.log(Math.floor(tempF));

                console.log(response.list[0].main.humidity);

                console.log(response.list[0].wind.speed);
                console.log(response.list[0].pop);

                getCurrentConditions(response);
                getCurrentForecast(response);
                makeList();

            });
            let lat = response.city.coord.lat;
            let lon = response.city.coord.lon;
            let maxd = 10;



            const hikeQrl = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&maxDistance=" + maxd+ "&key=" + hikeKey;

            $.ajax({
              url: hikeQrl,
              method: "GET"
          })
            .then(function (response){
              console.log(response);


            }
            )

    });
  
    
    










  function makeList() {
    let listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
  }
//click cards
$("#list-group-item").on("click", function(event) {
  event.preventDefault();
  console.log(list-group-item)
  getCurrentContitions(list-group-item)

}); 

  function getCurrentConditions (response) {

    // convert to fahrenheit 
    let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    // get and set the content 
    let pop = (response.list[0].pop * 100);
    let lat = response.city.coord.lat;
    let lon = response.city.coord.lon;
    let vindex = lat + lon; 
    const card = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const city = $("<h4>").addClass("card-title").text(response.city.name);
    const cityDate = $("<h4>").addClass("card-title").text(response.list[0].dt_txt);
    const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.list[0].main.humidity + "%");
    const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.list[0].wind.speed + " MPH");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png")
    const precip = $("<p>").addClass("card-text Visibility").text(`Chance of Precipitation: ${pop}%`);
    const uvi = $("<p>").addClass("card-text uvindex").text(`UV Index: ${vindex}`);

    // add to page
    city.append(cityDate, image, uvi);
    cardBody.append(city, temperature, humidity, wind,precip);
    card.append(cardBody);
    $("#currentCity").append(card)
   
  }

function getCurrentForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    console.log(response)
    console.log(response.dt_txt)
    $('#forecast').empty();

    // variable to hold response.list
    let results = response.list;
    console.log(results)
    
    //declare start date to check against
    // startDate = 20
    //have end date, endDate = startDate + 5

    for (let i = 0; i < results.length; i++) {

      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      console.log(day);
      console.log(hour);

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        // get the temperature and convert to fahrenheit 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);
        let list = response.list;
        let pop = (response.list[i].pop * 100);
        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const cityDate = $("<h4>").addClass("card-title").text(list[i].dt_txt);
        const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
        const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.list[i].wind.speed + " MPH");
        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png")
        const precip = $("<p>").addClass("card-text Visibility").text("Chance of Precipitation: " + pop + " %");
    

        cardBody.append(cityDate, image, temperature, humidity, wind, precip);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
  });
}