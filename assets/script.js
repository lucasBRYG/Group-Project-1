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
  $('#weatherBox').empty();


$("#searchButton").on("click", () => {



        // localStorage.clear();

        $('#forecastH5').addClass('show');

        // get the value of the input from user
        city = $("#cityName").val().trim();

        // clear cityname input box
        $("#cityName").val("");


        // full url to call api
        const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                console.log(response);
                let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
                console.log(Math.floor(tempF));

                // getCurrentConditions(response);
                getCurrentForecast(response);

                

                 localStorage.setItem("lat", JSON.stringify(response.city.coord.lat));
                 localStorage.setItem("long",JSON.stringify(response.city.coord.lon));

                 lat = JSON.stringify(response.city.coord.lat);
                 long = JSON.stringify(response.city.coord.lon);

                 var maxd = $("#distance").val();
                 localStorage.setItem("distance", JSON.stringify(maxd));
                 
                

                //  console.log(lat);
                // console.log(long);
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
                  makeList(response);
                  $(".rowTrail").on("click", function(){  // Event listener, for when a row of the list  is clicked
                    //clearCardTrail();
                    console.log($(this).attr("id"));
                    generateTrailInfo($(this).attr("id"));
                  
                    });           

                });

                 
            });




    });
  
  });

function makeList(response) {

  $(".collection").empty();


    for (i=0; i < response.trails.length; i++) {

    console.log(response.trails[0].name);
    console.log(response.trails[0].location);
    console.log(response.trails[0].length);
    console.log(response.trails[0].difficulty);
      
    var li = $("<li>");
    var rowList = $("<div class='row collapsible-header' style='margin-bottom: 0px;'>");
    var colName = $("<div class='col s6'>");
    var trailNameList = $("<div id='trailNameList'>");
    var icon = $("<i class='material-icons'>").text("place");
    var colDifficulty = $("<div class='col s2'>");


    if (response.trails[i].difficulty === "green"){
    var spanDifficulty = $("<span class='badge green white-text' id='difficultyList1'>").text("Beginner")
    }
    if (response.trails[i].difficulty === "blue")[
     spanDifficulty = $("<span class='badge blue white-text' id='difficultyList1'>").text("Easy")
    ]
    if (response.trails[i].difficulty === "greenBlue")[
      spanDifficulty = $("<span class='badge cyan white-text' id='difficultyList1'>").text("Intermediate")
     ]
     if (response.trails[i].difficulty === "blueBlack")[
      spanDifficulty = $("<span class='badge indigo darken-4 white-text' id='difficultyList1'>").text("Difficult")
     ]
     if (response.trails[i].difficulty === "black")[
      spanDifficulty = $("<span class='badge black white-text' id='difficultyList1'>").text("Expert")
     ]

    var colLength = $("<div class='col s1 center-align'>");
    var colLocation = $("<div class='col s3 center-align'>");
    var spanLength = $("<span id='lengthList'>").text(response.trails[i].length);

    var spanLocation = $("<span id='lengthList'>").text(response.trails[i].location);
    
    console.log(response.trails[i].id);
    li.attr("id",response.trails[i].id);
    li.addClass("rowTrail");

    trailNameList.text(response.trails[i].name);    
    trailNameList.prepend(icon);
    colDifficulty.append(spanDifficulty);
    colLocation.append(spanLocation);
    colLength.append(spanLength);
    colName.append(trailNameList);
    rowList.append(colName,colDifficulty,colLength,colLocation);
    li.append(rowList);
    $(".collection").append(li);
    
  }
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

    $('#weatherBox').empty();

    // variable to hold response.list
    let results = response.list;
    console.log(results);    
    //declare start date to check against
    // startDate = 20
    //have end date, endDate = startDate + 5
    for (let i = 0; i < results.length; i++) {
      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      var tempF = parseInt((results[i].main.temp - 273.15) * 9/5 + 32);
      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        let pop = (results[i].pop * 100);    
        const card = $("<div>").addClass("card blue-grey darken-1");
        const cardBody = $("<div>").addClass("card-content white-text");
        const cityDate = $("<h5>").addClass("card-title date center-align").text((results[i].dt_txt).substr(0,10));
        const image = $("<div class='center-align'>")
        const image2 = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png") 
        image2.attr("id","icon");
        const temperature = $("<p>").addClass("card-text temp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text humidity").text("Humidity: " + results[i].main.humidity + "%");
        const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + results[i].wind.speed + " MPH");
        const precip = $("<p>").addClass("card-text Visibility").text(`Chance of Precipitation: ${pop}%`);
    
        cardBody.append(cityDate, image, temperature, humidity, wind, precip);
        image.append(image2);
        card.append(cardBody);
        $("#weatherBox").append(card);
      }
    }
  });
}

function generateTrailInfo(idTrail){

  var hikeQrl = "https://www.hikingproject.com/data/get-trails-by-id?ids="+ idTrail + "&key=" + hikeKey;
  
  console.log(hikeQrl);

  $.ajax({
    url: hikeQrl,
    method: "GET"
})
  .then(function (response){
   
    var trailInfo = response.trails[0];
    console.log(trailInfo);
    
  });


};


