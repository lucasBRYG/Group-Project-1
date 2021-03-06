// Script.js file with jQuery code to generate a dynamically HTML and CSS pages.
// store the value of the input
let city = $("#cityName").val();
// Nick's API keys
const cityKey = "91a49fc1d36c35421107a53b3f87c750";
const bikeKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const runKey = "200931616-afc833c049b5997e40e044a809f9cd91";
const climbKey = "200931616-01e2cafc553024f568bca2e9d24d47b5";
const hikeKey = "200929750-d723e897b2d3dea9d999e2d05c66faa4";
const powderkey = "200929765-58e44682209185ac5d6d43b2d266c58d";
var lat = 0;
var long = 0;
var maxd = 0;

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
  $('#cardTrailInfo').hide();
  $('#trailBox').hide();
  $('#weatherCard').hide();
  $('.modal').modal();

  $("#searchButton").on("click", () => {  // Adding click event listen listener to all buttons
        
        if ($("#cityName").val().length === 0){
          $('#cardTrailInfo').hide();
          $('#trailBox').hide();
          $('#weatherCard').hide();
          alert("City is required");
          return;
        }
        if ($("#difficulty-select").val().length === 0){
          alert("Difficulty is required");
          return;
        }
        $('#trailBox').show();
        $('#weatherCard').show();
        $("#cardTrailInfo").empty();
        // get the value of the input from user
        city = $("#cityName").val().trim();
        // clear cityname input box
        $("#cityName").val("");
        // full url to call api   

        const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey;
        $.ajax({ // Performing an AJAX request with the queryURL
            url: queryUrl,
            method: "GET"
        })
        // call back function, what to do with the response after asynchronous call is finished
        .done(function () { // To validate if the request is successful 
              apiCallOut(city);
            })
            .fail(function(){ // To validate if the request is not successful 
              $('#cardTrailInfo').hide();
              $('#trailBox').hide();
              $('#weatherCard').hide();
              alert("City was not found");
              $("#cityName").val("");
              
            })

    });
  
  });

function makeList(response) { // All data is being pulled correctly and propagated to the html elements in the main page. 

  $("#trailContent").empty();
  $(".collection").empty();
  for (i=0; i < response.trails.length; i++) {
  console.log(response.trails[0].name);
  console.log(response.trails[0].location);
  console.log(response.trails[0].length);
  console.log(response.trails[0].difficulty);
  var diffSelector = $("#difficulty-select").val();
  console.log($("#difficulty-select").val());
  if (diffSelector.indexOf(response.trails[i].difficulty) !== -1 ) {
  // Creating and storing all element to create the forecast card
  var ul = $("<ul class='collection'>");
  var li = $("<li>");
  var rowList = $("<div class='row collapsible-header' style='margin-bottom: 0px;'>");
  var colName = $("<div class='col s6'>");
  var trailNameList = $("<div id='trailNameList'>");
  var icon = $("<i class='material-icons'>").text("place");
  var colDifficulty = $("<div class='col s2'>");
  var spanDifficulty;
  // Setting attributes of the elements to a property
  if (response.trails[i].difficulty === "green"){
   spanDifficulty = $("<span class='badge green white-text' id='difficultyList1'>").text("Easy")
  }
  if (response.trails[i].difficulty === "blue")[
   spanDifficulty = $("<span class='badge blue white-text' id='difficultyList1'>").text("Intermediate")
  ]
  if (response.trails[i].difficulty === "greenBlue")[
    spanDifficulty = $("<span class='badge cyan white-text' id='difficultyList1'>").text("Easy/Inter")
   ]
   if (response.trails[i].difficulty === "blueBlack")[
    spanDifficulty = $("<span class='badge indigo darken-4 white-text' id='difficultyList1'>").text("Inter/Hard")
   ]
   if (response.trails[i].difficulty === "black")[
    spanDifficulty = $("<span class='badge black white-text' id='difficultyList1'>").text("Hard")
   ]

  var colLength = $("<div class='col s1 center-align'>");
  var colLocation = $("<div class='col s3 center-align'>");
  var spanLength = $("<span id='lengthList'>").text(response.trails[i].length + "mi.");
  var spanLocation = $("<span id='lengthList'>").text(response.trails[i].location);  
  console.log(response.trails[i].id);
  li.attr("id",response.trails[i].id);
  li.addClass("rowTrail");
  trailNameList.text(response.trails[i].name);  
  // Appending all the tags to their parents  
  trailNameList.prepend(icon);
  colDifficulty.append(spanDifficulty);
  colLocation.append(spanLocation);
  colLength.append(spanLength);
  colName.append(trailNameList);
  rowList.append(colName,colDifficulty,colLength,colLocation);
  li.append(rowList);
  ul.append(li);
  $("#trailContent").append(ul);
  }     
}       
};
function getCurrentForecast () {  
  $.ajax({ // Performing an AJAX request with the queryURL
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey,
    method: "GET"
    // call back function, what to do with the response after asynchronous call is finished
  }).then(function (response){
    $('#weatherBox').empty();  
    let results = response.list; // storing the data from the AJAX request in an array 
    console.log(results);     
    for (let i = 0; i < results.length; i++) {
      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
      var tempF = parseInt((results[i].main.temp - 273.15) * 9/5 + 32);
      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        // Creating and storing all element to create the forecast card
        let pop = (results[i].pop * 100);    
        const card = $("<div>").addClass("card blue-grey darken-1");
        const cardBody = $("<div>").addClass("card-content white-text");
        const cityDate = $("<h5>").addClass("card-title date center-align").text((results[i].dt_txt).substr(0,10)); // Setting attributes of the elements to a property
        const image = $("<div class='center-align'>")
        const image2 = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png") 
        image2.attr("id","icon");
        const temperature = $("<p>").addClass("card-text temp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text humidity").text("Humidity: " + results[i].main.humidity + "%");
        const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + results[i].wind.speed + " MPH");
        const precip = $("<p>").addClass("card-text Visibility").text(`Chance of Precipitation: ${pop}%`);
        // Appending all the tags to their parents
        cardBody.append(cityDate, image, temperature, humidity, wind, precip);
        image.append(image2);
        card.append(cardBody);
        $("#weatherBox").append(card);       
        
      }
    }
  });
}

function generateTrailInfo(idTrail){ // All data is being pulled correctly and propagated to the html elements in the main page. 
  $("#cardTrailInfo").empty();
  var currentPage = document.location.href.match(/[^\/]+$/)[0];
  var hikeQrl;
                if (currentPage === "hiking.html"){
                  hikeQrl = "https://www.hikingproject.com/data/get-trails-by-id?ids="+ idTrail + "&key=" + hikeKey;
                } else if ( currentPage ==="biking.html") {
                  hikeQrl = "https://www.mtbproject.com/data/get-trails-by-id?ids="+ idTrail + "&key=" + bikeKey;
                } else if ( currentPage ==="running.html" ){
                  hikeQrl = "https://www.trailrunproject.com/data/get-trails-by-id?ids="+ idTrail + "&key=" + runKey;
                } else if ( currentPage === "climbing.html") { 
                  hikeQrl = "https://www.powderproject.com/data/get-trails-by-id?ids="+ idTrail + "&key=" + powderkey;
                }

   console.log(hikeQrl);
  $.ajax({
    url: hikeQrl,
    method: "GET"
  })
  .then(function (response){
   // Creating and storing all element to create the forecast card // Setting attributes of the element
    var trailInfo = response.trails[0];
    console.log(trailInfo.ascent);
    var nav = $("<nav>");
    var divNav = $("<div class='nav-wrapper green darken-3'>");
    var pTitle = $("<p class='flow-text green darken-3 center'>Trail Info</p>");   

    var divCard = $("<div class='card' style='padding: 20px'>");
    var h3 = $("<h3 id='trailName' class='center-align'>");
    h3.text(trailInfo.name); 
    var divImage = $("<div style='padding: 30px;' >");
    var divContImage = $("<div class='center-align'>");
    var imgTrail = $("<img id='imgInfo' style='width: 400px; height: 400px;'src=''>");
    imgTrail.attr("src",trailInfo.imgMedium); 
    var divCardContent = $("<div class='card-content'>");
    var h5 = $("<h5 id='summaryTrail' class='center-align card-title'>");
    h5.text(trailInfo.summary); 
    var row = $("<div class='row'>");

    var divCol1 = $("<div class='col s4 center-align'>");
    var imgLength = $("<img src='../Group-Project-1/assets/images/length.png' alt='' class='circle responsive-img'>");
    var spanLength = $("<span class='black-text'>");
    var divlength = $("<div style='font-weight: bold;'>Length:</div>");
    var length = $("<div>");
    length.text(trailInfo.length);

    var divCol2 = $("<div class='col s4 center-align'>");
    var imgAscent = $("<img src='../Group-Project-1/assets/images/hikingAscent.jpg' alt='' class='circle responsive-img'>");
    var spanAsDes = $("<span class='black-text'>");
    var divAscent = $("<div style='font-weight: bold;'>Ascent:</div>");
    var spanAscent = $("<span style='font-weight: normal;'>");
    spanAscent.text(trailInfo.ascent);
    var divDescent = $("<div style='font-weight: bold;'>Descent:</div>");
    var spanDescent = $("<span style='font-weight: normal;'>");
    spanDescent.text(trailInfo.descent);

    var divCol3 = $("<div class='col s4 center-align'>");
    var imgElevation = $("<img src='../Group-Project-1/assets/images/elevation.png' alt='' class='circle responsive-img'>");
    var spanElevation = $("<span class='black-text'>");
    var divHigh = $("<div style='font-weight: bold;'>High:</div>");
    var spanHigh = $("<span style='font-weight: normal;'>");
    spanHigh.text(trailInfo.high);
    var divLow = $("<div style='font-weight: bold;'>Low:</div>");
    var spanLow = $("<span style='font-weight: normal;'>");
    spanLow.text(trailInfo.low);

    var divCardAction = $("<div class='car-action'>");
    var iframe = $("<iframe id='map' style='width:100%; max-width:1200px; height:410px;' frameborder='0' scrolling='no' src=''>");

    var currentPage = document.location.href.match(/[^\/]+$/)[0];
    console.log(currentPage);
    var typeTrail = "";
    if (currentPage === "hiking.html"){
      typeTrail = "https://www.hikingproject.com/widget?v=3&map=1&type=trail&x=-11761235&y=4908907&z=5&id=";
      imgAscent.attr("src","../Group-Project-1/assets/images/hikingAscent.jpg");
    } else if ( currentPage ==="biking.html") {
      typeTrail = "https://www.mtbproject.com/widget?v=3&map=1&type=trail&x=-11761235&y=4908907&z=5&id=";
      imgAscent.attr("src","../Group-Project-1/assets/images/bikingAscent.png");
    } else if ( currentPage ==="running.html" ){
      typeTrail = "https://www.trailrunproject.com/widget?v=3&map=1&type=trail&x=-11761235&y=4908907&z=5&id=";
      imgAscent.attr("src","../Group-Project-1/assets/images/runningAscent.jpg");
    } else if ( currentPage === "climbing.html") { 
      typeTrail = "https://www.powderproject.com/widget?v=3&map=1&type=trail&x=-11761235&y=4908907&z=5&id=";
    }
    var url = typeTrail+trailInfo.id;    
    iframe.attr("src",url);
    // Appending all the tags to their parents
    divNav.append(pTitle);
    nav.append(divNav);
    spanLength.append(divlength);
    spanLength.append(length);
    divCol1.append(imgLength,spanLength);   
    divAscent.append(spanAscent);
    divDescent.append(spanDescent);
    spanAsDes.append(divAscent, divDescent);
    divCol2.append(imgAscent,spanAsDes);
    divHigh.append(spanHigh);
    divLow.append(spanLow);
    spanElevation.append(divHigh,divLow);
    divCol3.append(imgElevation,spanElevation);
    row.append(divCol1,divCol2,divCol3);
    divCardContent.append(h5,row);
    divContImage.append(imgTrail);
    divImage.append(divContImage);
    divCardAction.append(iframe);
    divCard.append(h3,divImage,divCardContent,divCardAction);
    $("#cardTrailInfo").append(nav,divCard);
  });
};

function apiCallOut(city){
        const queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + cityKey;
        $.ajax({ // Performing an AJAX request with the queryURL
            url: queryUrl,
            method: "GET"
        })
        // call back function, what to do with the response after asynchronous call is finished
        .then(function (response) { // To validate if the request is successful 
            console.log(response);
            let tempF = (response.list[0].main.temp - 273.15) * 1.80 + 32;
            console.log(Math.floor(tempF));
            getCurrentForecast(response);           

            localStorage.setItem("lat", JSON.stringify(response.city.coord.lat));
            localStorage.setItem("long",JSON.stringify(response.city.coord.lon));

            lat = JSON.stringify(response.city.coord.lat);
            long = JSON.stringify(response.city.coord.lon);

            var maxd = $("#distance").val();
            localStorage.setItem("distance", JSON.stringify(maxd));  // Grabbing and storing the longitud, latitude and distance in the local storage

            var lat = JSON.parse(localStorage.getItem("lat"));
            var long = JSON.parse(localStorage.getItem("long"));
            var filter = $("#filter-select").val();               
            var currentPage = document.location.href.match(/[^\/]+$/)[0];               
            var hikeQrl = "";
            if (currentPage === "hiking.html"){ // Condition according each html page
                hikeQrl = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + maxd+ "&sort=" + filter + "&maxResults=100"  +"&key=" + hikeKey;
                  
            } else if ( currentPage ==="biking.html") {
               hikeQrl = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + maxd+ "&sort=" + filter + "&maxResults=100"  + "&key=" + bikeKey;
                 
            } else if ( currentPage ==="running.html" ){
               hikeQrl = "https://www.trailrunproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + maxd+ "&sort=" + filter + "&maxResults=100"  + "&key=" + runKey;
                  
            } else if ( currentPage === "climbing.html") { 
              
               hikeQrl = "https://www.powderproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + maxd+ "&sort=" + filter + "&maxResults=100"  + "&key=" + powderkey;
                  
            }
            console.log(lat);
            console.log(long);
            console.log(hikeQrl);
            $.ajax({
                url: hikeQrl,
                method: "GET"
             })
              .then(function (response){

                makeList(response);
                $(".rowTrail").on("click", function(){  // Event listener, for when a row of the list  is clicked
                  $('#cardTrailInfo').show();
                  console.log($(this).attr("id"));
                  generateTrailInfo($(this).attr("id"));
               
                  });           

                });
            });           
};

