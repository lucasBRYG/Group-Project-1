
// store the value of the input
let city = $("#cityName").val();
// Nick's API keys
const cityKey = "91a49fc1d36c35421107a53b3f87c750";
const bikeKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const runKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const climbKey = "200931616-01e2cafc553024f568bca2e9d24d47b5";
const hikeKey = "200929750-d723e897b2d3dea9d999e2d05c66faa4";
var lat = 0;
var long = 0;
var maxd = 0;

//  Biking query url: https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=
//  Running query url: https://www.trailrunproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=
//  Climbing query rul: https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=40.03&lon=-105.25&maxDistance=10&minDiff=5.6&maxDiff=5.10&key=


$("#cityName").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#cityName").click(); 
	} 
});

$(document).ready(function(){
  $(".button-collapse").sideNav();
  $('select').material_select();



$("#searchButton").on("click", () => {

        $('#forecastH5').addClass('show');

        // get the value of the input from user
        city = $("#cityName").val().trim();

        // clear input box
        $("#searchTerm").val("");

        // full url to call api
        const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                
                let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
                console.log(Math.floor(tempF));

                getCurrentConditions(response);
                getCurrentForecast(response);
                

                 localStorage.setItem("lat", JSON.stringify(response.city.coord.lat));
                 localStorage.setItem("long",JSON.stringify(response.city.coord.lon));
                 maxd = 10;
                 

            });

            console.log(lat);
            console.log(long);
            var lat = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("long"));
            let hikeQrl = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + maxd+ "&key=" + hikeKey;

            console.log(lat);
            console.log(long);
            $.ajax({
              url: hikeQrl,
              method: "GET"
          })
            .then(function (response){
              console.log(response.trails);
              console.log(response.trails[0].name);
              console.log(response.trails[0].location);
              console.log(response.trails[0].imgSmall);
              makeList();

            }
            )

    });
  
  });

    

   function makeList() {

    $('#trailContent').empty();

    
    const card = $("<div>").addClass("card blue-grey darken-1");
    const cardBody = $("<div>").addClass("card-content white-text");
    const trailName = $("<h5>").addClass("card-title date").text(response.trails[0].name);
    const image = $("<div>")
    const image2 = $("<img>").attr("src", response.trails[0].imgSmall);
    const difficulty= $("<p>").addClass("card-text temp").text("Difficulty: " + tempF + " °F");
    const stars = $("<p>").addClass("card-text humidity").text("Stars: " + response.trails.stars);
    const length = $("<p>").addClass("card-text current-wind").text("Length: " + response.trails[0].length + " miles");
        
    
    cardBody.append(trailName, image, difficulty, stars,length);
    image.append(image2);
    card.append(cardBody);
    $("trailContent").append(card)
  //   let listItem = $("<li>").addClass("list-group-item").text(city);
  //   $(".list").append(listItem);
   }

  function getCurrentConditions (response) {

    // convert to fahrenheit 
    let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#weatherBox').empty();

    // get and set the content 
    let pop = (response.list[0].pop * 100);
    let lat = response.city.coord.lat;
    let lon = response.city.coord.lon;
    
    const card = $("<div>").addClass("card blue-grey darken-1");
    const cardBody = $("<div>").addClass("card-content white-text");
    const cityDate = $("<h5>").addClass("card-title date").text(response.list[0].dt_txt);
    const image = $("<div>")
    const image2 = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png") 
    const temperature = $("<p>").addClass("card-text temp").text("Temperature: " + tempF + " °F");
    const humidity = $("<p>").addClass("card-text humidity").text("Humidity: " + response.list[0].main.humidity + "%");
    const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.list[0].wind.speed + " MPH");
    const precip = $("<p>").addClass("card-text Visibility").text(`Chance of Precipitation: ${pop}%`);
    
    // $("div").append('div class="card z-depth-5"> This is the added')

    cardBody.append(cityDate, image, temperature, humidity, wind, precip);
    image.append(image2);
    card.append(cardBody);
    $("#weatherBox").append(card)
   
  }

function getCurrentForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey,
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