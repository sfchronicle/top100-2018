require("./lib/social");
var cookies = require("./cookies");

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

// variable to keep track of number of restaurants displayed
var count = 100;

// how long to wait before saving
var timeTimeout = 5000;

// smooth scroll to skip reading Michael's intro if you want
document.getElementById("restaurants").addEventListener("click",function(){
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
var userIdentity;
var restaurantList;

// Sets the user ID from treg (hopefully) 
var checkUser = function(repetitions) {
  // Set a timeout logic waits for resolution
  var delay = 500;

  if (!repetitions){
    // Start us off with 0 if unspecified
    repetitions = 0;
  }

  if (userIdentity){
    // If we already know the user's identity, we can bail out here
    return userIdentity;
  }
  
  // Keep setting a timeout until we have what we need
  setTimeout(function(){
    var user = fetchIdentity();
    if (user || user === null){
      // If we found a user, set the var
      userIdentity = user;
      // If we're developing on localhost, use a test identity
      if (window.location.href.indexOf("localhost") != -1){
        // NOTE: Comment this next line out if you want to test what happens 
        // when a user is not logged in (in the local dev environment)
        // Alternatively, increment the integer to start with fresh data
        userIdentity = 11220454;
      } 
      // Only get data if it's actually the user
      // Otherwise, we will need to prompt a login
      if (userIdentity){
        getData(userIdentity);
      }
    } else {
      if (repetitions < 10){
        checkUser(repetitions+1);
      } else {
        // If we've looped 10 times, bail out
        return null;
      }
    }
  }, delay);

  // Return null if we didn't resolve anything
  return null;
}

var fetchIdentity = function(){
  console.log(treg, treg.identity, treg.identity.id);
  if (treg && treg.identity && (typeof treg.identity.id === "string" || treg.identity.id === null)){
    // We have a valid object, so return the ID
    // NOTE: The ID might be null, but we know one way or another
    return treg.identity.id;
  } else {  
    // The objects are not ready yet
    return null;
  }
}

// Start by seeing if we can get the user on load
checkUser();

// Get data
function getData() {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2018/checklist/" + userIdentity,
    error: function(msg) {
      // This can error if there's no data yet -- go ahead and just set it blank
      restaurantList = [];
    },
    success: function(data) {
      restaurantList = data;
      setIcons();
    }
  });
}

// set checks on load for a particular user
function setIcons() {
  restaurantList.forEach(function(saveID){
    var elem = document.getElementById(saveID);
    if ($("i", elem).hasClass("fa-square-o")) {
      $("i", elem).toggleClass("fa-square-o fa-check-square-o");
    }
  });
}

// saving restaurants as favorites ------------------------------------------------

function saveNewData(user, restaurants) {
  var newSavedData = {
    "edbId":user,
    "restaurants":restaurants
  };
  console.log("SENDING DATA ");
  console.log(JSON.stringify(newSavedData));
  $.ajax({
    method: "POST",
    data: JSON.stringify(newSavedData),
    contentType: "application/json",
    error: function(msg) { 
      console.log("Failed to save data"); 
    },
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2018/checklist"
  });
}

$(".save-button").each(function(index) {
  $(this).on("click", function(e) {

    if (userIdentity) {
      // Get ID for saving
      var itemID = $(this).find(".save-restaurant").attr("id");

      // Either check or uncheck
      $("i", $(this)).toggleClass("fa-square-o fa-check-square-o");

      // are we adding or removing the restaurant from the list?
      if( $("i", $(this)).hasClass("fa-check-square-o") ) {
        console.log("we do not have this restaurant yet, ID: ", itemID);
        restaurantList.push(itemID);
        console.log(restaurantList);
      } else {
        console.log("we need to remove this restaurant, ID: ", itemID)
        var index = restaurantList.indexOf(itemID);
        restaurantList.splice(index,1);
      }

      // Save new data
      saveNewData(userIdentity, restaurantList);

    } else {
      // User hasn't logged in -- prompt them to do so
      $("#log-in-instructions").show();
      $("body, html").css("overflow-y", "hidden");
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

function showMyList() {
  var prefix = "save";
  // Remove yellow from the search item 
  $(".search").removeClass("homepage");

  if (userIdentity === null){
    $("#log-in-instructions").show();
    $("body, html").css("overflow-y", "hidden");
  } else {
    // TODO: Show list as a filter
    console.log(restaurantList);
    // var fav_count = 0;
    // $(".restaurant").filter(function() {
    //   var thisID = this.getAttribute("id");

    //   if (restaurantList.indexOf(prefix+thisID) > -1) {
    //     $(this).addClass("active");
    //     fav_count += 1;
    //   } else {
    //     $(this).removeClass("active");
    //   }
    // });

    // if (fav_count == 0) {
    //   $('#no-saved-restaurants').show();
    // } else {
    //   $('#no-saved-restaurants').hide();
    // }
  }
}

// event listener for "My List" button
$(".mylist").on("click",function() {
  $(this).toggleClass("selected");
  showMyList();
});

// event listener for "My List" button
$("#exit").on("click", function(){
  $("#log-in-instructions").hide();
  $("body, html").css("overflow-y", "auto");
})

