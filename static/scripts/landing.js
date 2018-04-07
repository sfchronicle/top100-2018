require("./lib/social");
var cookies = require("./cookies");

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

// variable to keep track of number of restaurants displayed
var count = 100;

// defining function for looking at multiple elements
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));

// how long to wait before saving
var timeTimeout = 5000;

// smooth scroll to skip reading Michael's intro if you want
document.getElementById("scroll-rest").addEventListener("click",function(){
    // top position relative to the document
    var pos = $("#search-stick-here").offset().top-30;
    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});

// smooth scroll to read Michael's intro
document.getElementById("introduction").addEventListener("click",function(){
    // top position relative to the document
    var pos = $("#intro").offset().top-60;
    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});

// determine phone vs desktop
if (screen.width > window.devicePixelRatio*480){
  window.onscroll = function() {activate()};
} else {
  window.onscroll = function() {activateMobile()};

  // smooth scroll to skip reading Michael's intro if you want
  document.getElementById("search-button").addEventListener("click",function(){
      // top position relative to the document
      var pos = $("#search").offset().top-60;
      // animated top scrolling
      $('body, html').animate({scrollTop: pos});
  });
}

// scrolling functionality: ----------------------------------------------------
// stick the second nav once you get to it -------------------------------------
// fade in various nav elements depending on page location ---------------------

function activate() {
  var sticker = document.getElementById('search');
  var sticker_ph = document.getElementById('search-stick-ph');
  var window_top = document.documentElement.scrollTop || document.body.scrollTop;//document.body.scrollTop;
  var div_top = document.getElementById('search-stick-here').getBoundingClientRect().top + window_top - 46;
  var intro_top = document.getElementById('intro').getBoundingClientRect().top + window_top - 70;
  if (window_top > intro_top){
    $("#top100-nav-link").addClass("active");
    $("#top-nav img").attr("src","//projects.sfchronicle.com/shared/logos/sfletter_c_black.png");
  } else {
    $("#top100-nav-link").removeClass("active");
    $("#top-nav img").attr("src","//projects.sfchronicle.com/shared/logos/sfc_logo_black.png");
  }
  if (window_top > div_top) {
    $(".secondary-link-container").addClass("active");
    sticker.classList.add('fixed-second');
    sticker_ph.style.display = 'block'; // puts in a placeholder for where sticky used to be for smooth scrolling
  } else {
    $(".secondary-link-container").removeClass("active");
    sticker.classList.remove('fixed-second');
    sticker_ph.style.display = 'none'; // puts in a placeholder for where sticky used to be for smooth scrolling
  }
}

function activateMobile() {
  var window_top = document.documentElement.scrollTop || document.body.scrollTop;//document.body.scrollTop;
  var div_top = document.getElementById('search-stick-here').getBoundingClientRect().top + window_top - 46;
  var intro_top = document.getElementById('intro').getBoundingClientRect().top + window_top - 46;
  if (window_top > intro_top){
    $("#top100-nav-link").addClass("active");
    $("#top-nav img").attr("src","//projects.sfchronicle.com/shared/logos/sfletter_c_black.png");
  } else {
    $("#top100-nav-link").removeClass("active");
    $("#top-nav img").attr("src","//projects.sfchronicle.com/shared/logos/sfc_logo_black.png");

    
  }
  if (window_top > div_top) {
    $(".secondary-link-container-mobile").addClass("active");
  } else {
    $(".secondary-link-container-mobile").removeClass("active");
  }
}

// Give restaurants that haven't been seen yet a little flag
$(function(){
  var restaurantCookie = getCookie("sfc_top100_2018");
  $(".restaurant").each(function(){
    if (restaurantCookie.indexOf($(this).attr("id")) == -1){
      $(this).find(".border").addClass("unseen");
    }
  });
});


// search bar code -------------------------------------------------------------
// IMPORTANT: Keep this updated with filter options
console.log("cuisineString", cuisineString, typeof cuisineString);
function getFilterList() {
  // NOTE: If we want to curate these instead of pull them dynamically off list
  // Replace the vars below with a complete array of autocomplete options
  var cuisineArray = cuisineString.split("|");
  var regionArray = regionString.split(/,|\||\//);
  // Fix some names
  var nameArray = nameString.replace(/&amp;/g, "&").replace(/&#39;/g, "'").split("|");
  // Combine all arrays
  var allArrays = [cuisineArray, regionArray, nameArray];
  var masterArray = [];
  for (var i = 0; i < allArrays.length; i++){
    masterArray = masterArray.concat(allArrays[i]);
  }
  // Return the full array of autocomplete options
  return masterArray;
}

// Create autocomplete
$( "#search-bar input" ).autocomplete({
  source: function(request, response) {
    var results = $.ui.autocomplete.filter(getFilterList(), request.term);
    // Sort alphabetically, limit results
    response(results.sort().slice(0, 5));
  },
  // Find matches on selection
  select: function( event, ui ) {
    findMatches(ui.item.value);
  }
});

// Find matches while typing
$("#search-bar input").on("input", function(){
  findMatches($(this).val());

  // If there's a value in the search bar, allow cancel
  if ($(this).val()){
    $(".cancel-search").show();
  } else {
    $(".cancel-search").hide();
  }
});

// Finds and displays results that match the term
var findMatches = function(term){
  // Scroll user back to stop to observe results
  $('body,html').animate({ scrollTop: $('#results').position().top-80 }, 150);

  var searchTerm = term.toLowerCase();
  var matchingEntries = $(".restaurant").filter(function() {
    if ($(this).attr("class").toLowerCase().indexOf(searchTerm) != -1){
      return true;
    } else {
      return false;
    }
  });

  // Turn all restaurants that don't match off
  $(".restaurant").not(matchingEntries).removeClass("active");

  // Turn all restaurants that do match on
  matchingEntries.addClass("active");

  // Show restaurant count
  count = matchingEntries.length;
  let resultText = " results";

  // Special handling for 1 result
  if (count == 1){
    resultText = " result";
  }

  // Special handling for no results
  if (count == 0){
    $(".search-noresults").show();
  } else {
    $(".search-noresults").hide();
  }

  // Show results
  $('#count-results').text(count + resultText);

  // Don't show results if it's the full list
  if (count < 100){
    $('#count-results').show();
  } else {
    $('#count-results').hide();
  }
}

// Cancel search by pressing the X button
$(".cancel-search").on("click", function(){
  showAllRestaurants();

  // Hide button
  $(this).hide();

  // Wipe text
  $("#search-bar input").val("");
});

// check for log on information on load ------------------------------------------------

// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// temporary code for testing ---------------------------
var identity = {
  edbId: "11220453"
}
var restaurantList;
var saveTimer;

function setCheckUser(delay, repetitions, success, error) {
  if (identity.edbId) {
    success(identity.edbId);
    console.log("SET USER SUCCESS");
  } else {
    error();
  }
}

// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var edbId;
// var restaurantList;
// var saveTimer;
// function setCheckUser(delay, repetitions, success, error) {
//   console.log("CHECKING");

//   var x = 0;
//   var intervalID = window.setInterval(function () {
//   console.log("INTERVAL", intervalID);
//   console.log("syncPaymeterSdk", syncPaymeterSdk);

//     // loop while waiting for syncPaymeterSdk to load
//     if ( window.syncPaymeterSdk ) {
//       window.clearInterval( intervalID );

//       if ( treg.identity.edbId ) {

//         success(treg.identity);
//         console.log("SUCCESS", treg.identity);

//       } else {

//         var a = window.syncPaymeterSdk;
//         a.events.registerHandler( a.events.onAuthorizeSuccess, function () {
//           // set callback for completion of authorization
//           if ( treg.identity.edbId ) {
//             if ( success && typeof(success) === "function" ) {
//               success(treg.identity);
//             }
//           } else {
//             if ( error && typeof(error) === "function" ) {
//               error();
//             }
//           }
//         }) || error();
//       }

//     } else if ( ++x === repetitions ) {
//       window.clearInterval( intervalID );
//       if ( error && typeof(error) === "function" ) {
//         error();
//       }
//     }

//   }, delay );

// }
// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// response if a user is not logged in
function errorCallBack() {
  console.log("error");
  $("#nouser").removeClass("hidden");

  // check to see if user logs on after load
  if (treg.hasActiveSession() == false) {
    // console.log("no active session");
    treg.registerEvent(treg.event.onSessionFound, function ()   {
      // we are going to keep checking for the user ID if people log in
      // console.log("now we are checking again");
      successCallBack(treg.identity);
      console.log(treg.identity);
    });
  }
}

// response if a user is logged in
function successCallBack(identity) {
  console.log("TEST A BC", identity);
  if (identity.edbId != null) {
    console.log("YAY LOGGED IN");
    // console.log("success");
    edbId = identity.edbId;
    console.log(edbId);
    getData();
  }
}

// retreive data
var savedData;
function getData() {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2018/checklist/" + edbId,
    error: function(msg) {
      restaurantList = [];
      console.log("fail");
    },
    success: function(data) {
      // console.log("success");
      savedData = data;
      console.log("DATA:", data);
      restaurantList = savedData;
      setIcons();
      // console.log(savedData);
    }
  });
}

// set checks on load for a particular user
function setIcons() {
  savedData.forEach(function(saveID){
    var elem = document.getElementById(saveID);
    if ($("i", elem).hasClass("fa-square-o")) {
      $("i", elem).toggleClass("fa-square-o fa-check-square-o");
    }
  });
}

// check to see if a user is logged on on load
var result = setCheckUser( 500, 5, successCallBack, errorCallBack );
console.log("GET RESULT:", result);

// saving restaurants as favorites ------------------------------------------------

function saveNewData() {
  var newSavedData = {edbId:edbId,restaurants:restaurantList};
  // console.log("SENDING DATA ");
  // console.log(JSON.stringify(newSavedData));
  $.ajax({
    method: "POST",
    data: JSON.stringify(newSavedData),
    contentType: "application/json",
    success: function(msg) { console.log("success"); },
    error: function(msg) { console.log("fail"); },
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2018/checklist"
  });
}

qsa(".save-restaurant").forEach(function(restaurant,index) {
  restaurant.addEventListener("click", function(e) {xw
    // console.log(restaurant.id);

    if (restaurantList) {
      $("i", this).toggleClass("fa-square-o fa-check-square-o");

      // console.log(savedData);
      // console.log(restaurantList);

      // are we adding or removing the restaurant from the list?
      if(  $("i", this).hasClass("fa-check-square-o") ) {
        // console.log("we do not have this restaurant yet");
        restaurantList.push(restaurant.id);
        // console.log(restaurantList);
      } else {
        // console.log("we need to remove this restaurant")
        var index = restaurantList.indexOf(restaurant.id);
        restaurantList.splice(index,1);
        // console.log(restaurantList);
      }

      // save new data
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveNewData(),timeTimeout);

    } else {

      document.getElementById("log-in-instructions").classList.add("show");
      document.body.classList.add("noverflow");

    }

  });

});


// function to show all restaurants ------------------------------------------------------------------

function showAllRestaurants() {
  count = 100;
  $(".restaurant").addClass("active");
  $("#count-results").hide();
}


// function to show "my list" restaurants -------------------------------------------------------------

function mylist_function(list) {

  document.getElementById("restaurants-wrap").classList.remove("hide");
  document.getElementById("intro-container").classList.add("hide");
  document.getElementById("search-noresults").classList.add("hide");


  var listID = list.getAttribute("id");
  // console.log(listID);
  if (listID == "mylist-starred") {
    var prefix = "save";
  } else {
    var prefix = "check";
  }
  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };

  document.getElementById(listID).classList.add("selected");

  document.getElementById('searchrestaurants').value = "";
  document.getElementById('brunch').value = "all";
  document.getElementById('new').value = "all";

  selNeighborhoods.classList.remove("active");
  selPrice.classList.remove("active");
  selNoise.classList.remove("active");
  selCuisine.classList.remove("active");

  var fav_count = 0;
  $(".restaurant").filter(function() {
    var thisID = this.getAttribute("id");

    if (restaurantList.indexOf(prefix+thisID) > -1) {
      $(this).addClass("active");
      fav_count += 1;
    } else {
      $(this).removeClass("active");
    }
  });

  // document.getElementById('count-results').classList.add("hide");
  if (fav_count == 0) {
    if (prefix == "save") {
      document.getElementById('no-checked-restaurants').classList.add("hide");
      document.getElementById('no-saved-restaurants').classList.remove("hide");
    } else {
      document.getElementById('no-saved-restaurants').classList.add("hide");
      document.getElementById('no-checked-restaurants').classList.remove("hide");
    }
    document.getElementById('count-results').classList.add("hide");
  } else {
    document.getElementById('no-saved-restaurants').classList.add("hide");
    document.getElementById('no-checked-restaurants').classList.add("hide");
    document.getElementById('count-results').classList.remove("hide");
    document.getElementById('count-results').innerHTML = fav_count+" result(s)";

  }

}

// function to assess all the filters when user picks a new one ---------------------------------------

var cuisine_flag = 1, neighborhood_flag = 1, new_flag = 1, brunch_flag = 1, alcohol_flag = 1, noise_flag = 1, price_flag = 1, flag_min = 1;

function check_filters() {

  document.getElementById("restaurants-wrap").classList.remove("hide");
  document.getElementById("intro-container").classList.add("hide");
  document.getElementById("about").classList.remove("selected");

  document.getElementById('searchrestaurants').value = "";

  count = 0;
  showall_button.classList.remove("selected");
  mylist_starred_button.classList.remove("selected");
  mylist_checked_button.classList.remove("selected");

  document.getElementById('no-saved-restaurants').classList.add("hide");
  document.getElementById('no-checked-restaurants').classList.add("hide");

  // display text for empty search results
  if (count > 0) {
    document.getElementById('search-noresults').classList.add("hide");
    document.getElementById('count-results').classList.remove("hide");
    document.getElementById('count-results').innerHTML = count+" result(s)";
  } else {
    document.getElementById('search-noresults').classList.remove("hide");
    document.getElementById('count-results').classList.add("hide");
  }
  if (count == 100) {
    showall_button.classList.add("selected");
    document.getElementById('count-results').classList.add("hide");
  }

};

// // event listener for "My List" button
// var mylist_checked_button = document.getElementById('mylist-checked');
// mylist_checked_button.addEventListener("click",function() {
//   if (edbId) {
//     $(this).toggleClass("selected");
//     mylist_function(this);
//   } else {
//     document.getElementById("log-in-instructions").classList.add("show");
//     document.body.classList.add("noverflow");
//   }
// });

// // event listener for "My List" button
// var close_instructions = document.getElementById('exit');
// close_instructions.addEventListener("click",function() {
//   document.getElementById("log-in-instructions").classList.remove("show");
//   document.body.classList.remove("noverflow");
// });


var windowWidth = $(window).width();
if(windowWidth > 480) {
    var timerHed = setInterval(function(){
    $(".top100-hed").fadeIn(2000);
      clearInterval(timerHed);
  }, 2000);

  var timerDek = setInterval(function(){
    $(".deck").fadeIn(2000);
      clearInterval(timerDek);
  }, 4000);
}else{
  $(".top100-hed, .deck").show();
}

