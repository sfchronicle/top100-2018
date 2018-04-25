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

//Set proper image size for slideshow
var imageWidth = $(".swiper-container").width();
imageWidth *= Math.round(window.devicePixelRatio);

// Load first photo instantly
$(".swiper-slide img").first().attr("src", function(){
	return $(this).data("noload-src")+imageWidth.toString()+"x0.jpg";
});

// Load up other photos after delay
setTimeout(function(){
	$(".swiper-slide img").each(function(){
		if (!$(this).attr("src")){
			$(this).attr("src", function(){
				return $(this).data("noload-src")+imageWidth.toString()+"x0.jpg";
			});
		}
	});
}, 1000);

// Slider
if($('.swiper-slide').length === 1){
  $('.swiper-pagination').css('display', 'none');
} else {
	// Create swiper
	var swiperData = {
    spaceBetween: 100,
    autoHeight: true, 
    calculateHeight: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    pagination: '.swiper-pagination',
    paginationClickable: true
  }

  var mySwiper = new Swiper('.swiper-container', swiperData);
}

// We've arrived on an article, so save a cookie that says so
// Get existing cookie
var cookieValue = getCookie("sfc_top100_2018");
if (!cookieValue){
	cookieValue = "";
} 
// If the slug is not present in the string
if (cookieValue.indexOf(restaurant.Slug) == -1){
	// If it's not the first name, add a spacer
	if (cookieValue){
		cookieValue += "|";
	} 
	// Add to existing cookie
	cookieValue += restaurant.Slug;
	// Max cookie expiration
	setCookie("sfc_top100_2018", cookieValue, 2147483647);
}

// Get current strings in cookie and report back
var cookiesNumber = 100 - cookieValue.split("|").length;

if (cookiesNumber > 10){
	// Let them know we're tracking!
	$("#explore-text span.number").html(cookiesNumber);
} else if (cookiesNumber > 0){
	// Let them know they're close!
	$("#explore-text").hide();
	$("#nearing-text").show().find("span.number").html(cookiesNumber);
	// A lot of work just to remove an 'S' but sure
	if (cookiesNumber == 1){
		$("#nearing-text").text($("#nearing-text").text().replace("restaurants", "restaurant"));
	}
} else {
	// Congratulate the reader!
	$("#explore-text").hide();
	$("#final-text").show();
}

// Add analytics for explore text
$("#explore-text a, #nearing-text a, #final-text a").on("click", function(){
  // Check to see how often this is clicked
  if (typeof ens_specialEvent != "undefined"){
    ens_specialEvent("Top 100 Restaurants 2018","Button Click","Still Hungry Link");
  }
});

// Add a special icon if this restaurant is new or a classic
var newIcon = "//projects.sfchronicle.com/shared/logos/top100_new.png?a";
var classicIcon = "//projects.sfchronicle.com/shared/logos/top100_classic.png?a";
var iconChoice;
var returningVal = restaurant.Returning.toLowerCase();
// Check values on restaurant
if (returningVal == "no"){
	iconChoice = newIcon;
} else if (returningVal == "classic"){
	iconChoice = classicIcon;
}
// If a value was chosen, set src
if (iconChoice){
	$(".special-icon").attr("src", iconChoice);
}

// ************* RELATED SECTION ****************

var findUnseenRestaurant = function(index, cookie, alreadySelected){
	// Loop through and find a restaurant the user hasn't seen yet
	var foundRest = false;
	var countIndex = index;
	var catchCount = 0;
	while (!foundRest){
		// Wrap back around if we're at 100
		if (countIndex == 100){
			countIndex = 0;
		}

		if (cookie.indexOf(restaurants[countIndex].Slug) == -1){
			// Check if it's already selected
			if (alreadySelected.indexOf(restaurants[countIndex]) == -1){
				// This means the user hasn't visited, let's return
				foundRest = true;
				return restaurants[countIndex];
			}
		} else {
			// Catch if we go over 100 and still haven't found anything
			// Which could happen if they've read it all!
			if (catchCount > 100){
				foundRest = true;
				return null;
			}
		}

		// Increment
		countIndex++;
		catchCount++;
	}
}

// Find restaurant that matches the current name
var thisRestaurant = restaurants.find(function(element) {
  return element.Name == restaurant.Name;
});

// Get index of current restaurant
var thisRestaurantIndex = restaurants.indexOf(thisRestaurant);

// Related restaurants are the next 3
var relatedRestaurants = [];
for (var r = 0; r < 3; r++){
	relatedRestaurants[r] = findUnseenRestaurant(thisRestaurantIndex, cookieValue, relatedRestaurants); 
}

// Set values on HTML
$("#related-rest .wrap").each(function(index){
	// Only create if it exists
	if (relatedRestaurants[index] != null){
		// Get URL with no query or hash (or trailing slash)
	  var fullUrl = location.href.split('#')[0].split('?')[0].slice(0, -1);
	  // Get array based on slashes
	  fullUrl = fullUrl.split("/");
	  // Remove the restaurant path and rejoin
	  fullUrl.pop();
	  fullUrl = fullUrl.join("/"); 
	  // Set new path using slug
	  var finalUrl = fullUrl+"/"+relatedRestaurants[index].Slug;
	  $(this).find("a").attr("href", finalUrl);
	  // Set image URL
	  if (relatedRestaurants[index].wcm_img){
	    $(this).find("img").attr("src", "https://s.hdnux.com/photos/60/22/02/"+relatedRestaurants[index].wcm_img.split(" ")[0]+"/7/premium_gallery_landscape.jpg");
	  }
	  // Set name
	  $(this).find(".name div").text(relatedRestaurants[index].Name);
	  // Set region
	  $(this).find(".info").text(relatedRestaurants[index].Region + " | " + relatedRestaurants[index].SubRegion);
	} else {
		$(this).remove();
	}
});

// Enable nav
if ($(window).width() < 666) {
  $('.landing-nav').removeClass("active");
  $('#landing-mobile-nav').addClass("active").css("pointer-events", "auto");
} else {
  $('.landing-nav').css("pointer-events", "auto");
}

$(function(){
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
});
      

var userIdentity;
var restaurantList;
var globalTimeout = null;

// Sets the user ID from treg (hopefully) 
var checkUser = function(repetitions, original_promise) {
	console.log("CHECKINNNN");
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
    console.log(treg.identity.id);
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
  // Add button event
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
});

/* HANDLE SAVE CODE */

// Get data
function getData(user, promise) {
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

      // Only set if it's for the current user's data
      restaurantList = data;
      setIcons();
      
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
    console.log("ELEM", elem, saveID);
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
  // Check to see how often this is clicked
  if (typeof ens_specialEvent != "undefined"){
    ens_specialEvent("Top 100 Restaurants 2018","Button Click","Save To List");
  }
  
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

// exit the subscribe window
$("#exit").on("click", function(){
  $("#log-in-instructions").hide();
  $("body, html").css("overflow-y", "auto");
});

