require("./lib/social");
var cookies = require("./cookies");
require("lazyload");
try { 
  // Attempt to load lazyload
  lazyload();
} catch (err){
  // We're on iPad or some device that can't handle this
  // Flip all the data-srcs to srcs
  $(".image-wrapper img").attr("src", function(){
    return $(this).data("src");
  });
}

//Give restaurants that haven't been seen yet a little flag
$(function(){
  var restaurantCookie = getCookie("sfc_top100_2018");
  $(".restaurant").each(function(){
    if (restaurantCookie.indexOf($(this).attr("id")) == -1){
      $(this).find(".border").addClass("unseen").eq(1).addClass("white");
    }
  });

  // Enable tooltips
  if ($( ".unseen" ).length > 0){
    $( ".unseen" ).tooltip({
      content: "New for you",
      position: {
        my: "left bottom-20",
        at: "left top",
        using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }
      }
    });
  }
});

var userIdentity;
var restaurantList;
var globalTimeout = null;

// Sets the user ID from treg (hopefully) 
var checkUser = function(repetitions, original_promise) {
  // Set a deferred to return immediately
  var waitForUser;
  if (!original_promise){
    waitForUser = $.Deferred();
  } else {
    waitForUser = original_promise;
  }
   
  // Set a timeout logic waits for resolution
  var delay = 100;

  if (typeof repetitions == "undefined"){
    // Start us off with 0 if unspecified
    repetitions = 20;
  }

  console.log("HERE'S USER ID", userIdentity, repetitions);
  if (userIdentity && userIdentity != "no id"){
    // If we already know the user's identity, we can bail out here
    console.log("RESOLVE 1");
    waitForUser.resolve();
    return userIdentity;
  }
  
  // Keep setting a timeout until we have what we need
  globalTimeout = setTimeout(function(){
    var getUser = fetchIdentity();
    if (getUser){
      // If we got something, set it for real
      userIdentity = getUser;
      // Only get data if it's actually the user
      // Otherwise, we will need to prompt a login
      getData(userIdentity, waitForUser, false);
    } else {
      if (repetitions > 0){
        console.log("CHECK USER 4");
        checkUser(repetitions-1, waitForUser);
      } else {
        // If we've looped 10 times, bail out with "no id" flag
        userIdentity = "no id";
        console.log("BAIL OUT", userIdentity);
        console.log("RESOLVE 2");
        globalTimeout = null;
        waitForUser.resolve();
      }
    }
  }, delay);

  // Return the deferred
  return waitForUser;
}

var fetchIdentity = function(){
  if (treg && treg.identity && (typeof treg.identity.id === "string" || treg.identity.id === null)){
    // We have a valid object, so return the ID
    // NOTE: The ID might be null, but we know one way or another
    if (window.location.href.indexOf("localhost") != -1){
      var tempID = 11220454;
      console.log("THIS IS LOCALHOST, SETTING TEMP ID", tempID);
      // If we're developing on localhost, use a test identity
      // NOTE: Comment this next line out if you want to test what happens 
      // when a user is not logged in (in the local dev environment)
      // Alternatively, increment the integer to start with fresh data
      return tempID;
    }
    return treg.identity.id;
  } else {  
    // The objects are not ready yet
    return null;
  }
}

// Start by seeing if we can get the user on load
var waitForTreg = checkUser();

// Wait until we have a user to place the modal
$.when(waitForTreg).then(function(){
  // Add things that should happen after user is obtained here
  
});

// Get data
function getData(user, promise, share) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2018/checklist/" + user,
    error: function(msg) {
      // This can error if there's no data yet -- go ahead and just set it blank
    },
    success: function(data) {
      // Reset timeout var
      globalTimeout = null;

      if (!share){
        // Only set if it's for the current user's data
        restaurantList = data;
        setIcons();
      } else {
        // If this is a search for another user's data, just render the result
        const mappedList = data.map(function(item){
          // Shave the prefix off of item
          return item.substring(4, item.length);
        });
      }
      
      // Resolve promise if there was one
      if (promise){
        promise.resolve();
      }
    }
  });
}

// set checks on load for a particular user
function setIcons() {
  restaurantList.forEach(function(saveID){
    var elem = $("#"+saveID)[0];
    // If this is a collection page, the element might be undefined -- check for that
    if (typeof elem != "undefined"){
      if ($("i", elem).hasClass("fa-square-o")) {
        $("i", elem).toggleClass("fa-square-o fa-check-square-o");
      }
    }
  });
}

// saving restaurants as favorites ------------------------------------------------
function saveNewData(user, restaurants) {
  var newSavedData = {
    "edbId":user,
    "restaurants":restaurants
  };
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

    if (userIdentity && userIdentity != "no id") {
      // Get ID for saving
      var itemID = $(this).find(".save-restaurant").attr("id");

      // Either check or uncheck
      $("i", $(this)).toggleClass("fa-square-o fa-check-square-o");

      // are we adding or removing the restaurant from the list?
      if( $("i", $(this)).hasClass("fa-check-square-o") ) {
        restaurantList.push(itemID);
      } else {
        var index = restaurantList.indexOf(itemID);
        restaurantList.splice(index,1);
      }

      // Save new data
      saveNewData(userIdentity, restaurantList);

    } else {
      // Don't do anything unless the initial check has resolved
      if (globalTimeout == null){
        // Only give it one chance
        var promise = checkUser(1);
        $.when(promise).then(function(data){
          if (userIdentity == "no id"){
            // User hasn't logged in -- prompt them to do so
            $("#log-in-instructions").show();
            $("body, html").css("overflow-y", "hidden");
          } else if (userIdentity) {
            // Successfully fetched -- proceed with original logic
            $(this).click();
          }
        });
      }
    }
  });
});

// exit the subscribe window
$("#exit").on("click", function(){
  $("#log-in-instructions").hide();
  $("body, html").css("overflow-y", "auto");
});

// if we are on the "Regions" collection, implement "Regions" buttons and drop-downs
if (document.getElementById("sf-region")){

  // if reader clicks on "SF" region, show appropriate sub-regions and filter
  document.getElementById("sf-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("sf-region").classList.add("active");
    document.getElementById("sf-subregions").classList.add("active");
    checkRestaurants("sanfrancisco");
  });

  // if reader clicks on "North Bay", show appropriate sub-regions and filter
  document.getElementById("northbay-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("northbay-region").classList.add("active");
    document.getElementById("northbay-subregions").classList.add("active");
    checkRestaurants("northbay");
  });

  // if reader clicks on "South Bay", show appropriate sub-regions and filter
  document.getElementById("southofsf-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("southofsf-region").classList.add("active");
    // document.getElementById("southofsf-subregions").classList.add("active");
    checkRestaurants("southofsf");
  });

  // if reader clicks on "East Bay", show appropriate sub-regions and filter
  document.getElementById("eastbay-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("eastbay-region").classList.add("active");
    document.getElementById("eastbay-subregions").classList.add("active");
    checkRestaurants("eastbay");
  });

}

// if we are on the "Cuisines" collection, implement "Cuisines" buttons and drop-downs
if (document.getElementById("select-regions")){

  // these are our 4 drop-downs for mobile
  var chooseRegion = document.getElementById('select-regions');
  var chooseEastbay = document.getElementById('select-eastbay-subregions');
  var chooseNorthbay = document.getElementById('select-northbay-subregions');
  var chooseSF = document.getElementById('select-sf-subregions');

  // if reader picks a "region", show appropriate sub-region dropdowns and reset various things and filter results
  chooseRegion.addEventListener('change', function(d) {
    var key = chooseRegion.value.split("-")[0];
    console.log(key);
    chooseEastbay.value = "all";
    chooseNorthbay.value = "all";
    chooseSF.value = "all";
    $(".subregions-dropdown").removeClass("active");
    $("#"+key+"-subregions-dropdown").addClass("active");
    check_dropdowns(key);
  });

  // if reader chooses "East Bay", filter results
  chooseEastbay.addEventListener('change', function(d) {
    var key = chooseEastbay.value.split("-")[0];
    check_dropdowns(key);
  });

  // if reader chooses "North Bay", filter results
  chooseNorthbay.addEventListener('change', function(d) {
    var key = chooseNorthbay.value.split("-")[0];
    check_dropdowns(key);
  });

  // if reader chooses "SF", filter results
  chooseSF.addEventListener('change', function(d) {
    var key = chooseSF.value.split("-")[0];
    check_dropdowns(key);
  });

}

// implementing "Cuisines" drop downs is much easier because we don't have sub-filters
// only implement this drop down if we are on the "Cuisines" page
if (document.getElementById("select-cuisine")){

  // filter results based on "Cuisines" drop down select value
  var chooseCuisine = document.getElementById('select-cuisine');
  chooseCuisine.addEventListener('change', function(d) {
    var key = chooseCuisine.value.split("-")[0];
    check_dropdowns(key);
  });

}

// buttons for subregions
var subregionsButtons = document.getElementsByClassName("subregion-button")
var td;
for (var t = 0; t < subregionsButtons.length; t++){
  td = document.getElementById(subregionsButtons[t].id);
  if (typeof window.addEventListener === 'function'){
    (function (_td) {
      td.addEventListener('click', function(){
        $(".subregion-button").removeClass("active");
        _td.classList.add("active");
        checkRestaurants(_td.id.split("-")[0])
      });
    })(td);
  };
}

// buttons for cuisines
var cuisinesButtons = document.getElementsByClassName("cuisine-button")
var td;
for (var t = 0; t < cuisinesButtons.length; t++){
  td = document.getElementById(cuisinesButtons[t].id);
  if (typeof window.addEventListener === 'function'){
    (function (_td) {
      td.addEventListener('click', function(){
        $(".cuisine-button").removeClass("active");
        _td.classList.add("active");
        console.log(_td.id.split("-")[0])
        checkRestaurants(_td.id.split("-")[0])
      });
    })(td);
  };
}

// this is our function for filtering results based on buttons (aka Desktop filtering)
function checkRestaurants(key){

  $(".restaurant").filter(function() {

    // check all the classes for the restaurant
    var classes = this.className.toLowerCase().split(" ");

    // check region
    region_flag = (classes.indexOf(key.toLowerCase())>0);

    // show it if yes
    if (region_flag == 1){
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }

  });

}

// this is our function for filtering results based on buttons (aka Mobile filtering)
function check_dropdowns(key) {

  console.log(key);

  if (key != "all" && key != "allcuisines"){

    if (key.indexOf("all") != -1){
      var newkey = key.split("all")[1];
    } else {
      var newkey = key;
    }

    $(".restaurant").filter(function() {

      // check all the classes for the restaurant
      var classes = this.className.toLowerCase().split(" ");

      // check region
      region_flag = (classes.indexOf(newkey)>0);

      // show it if yes
      if (region_flag == 1){
        $(this).addClass("active");
      } else {
        $(this).removeClass("active");
      }

    });

  } else {
    $(".restaurant").addClass("active");
  }

}


if ($(window).width() < 666) {
  $('.landing-nav').addClass("active").css("pointer-events", "auto");
  $('#top-nav').removeClass("fixed");

  window.onscroll = function() {
    var window_top = document.documentElement.scrollTop || document.body.scrollTop;
    var div_top = document.getElementById('mobile-nav-stick').getBoundingClientRect().top + window_top;
    if (window_top > div_top) {
      $('#landing-mobile-nav').addClass("active").css("pointer-events", "auto");
    } else {
      $('#landing-mobile-nav').removeClass("active").css("pointer-events", "none");
    }
  }
} else {
  $('.landing-nav').css("pointer-events", "auto");
}


$(".region-button").on("click",function(){
  $('body,html').animate({ scrollTop: $('.regions-container').position().top-70 }, 150);
});

$(".cuisine-button").on("click",function(){
  $('body,html').animate({ scrollTop: $('.cuisines-container').position().top-70 }, 150);
});
