require("./lib/social");
var cookies = require("./cookies");
require("lazyload");
lazyload();

// function to find minimum
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

// variable to keep track of number of restaurants displayed
var count = 100;

// smooth scroll to skip reading Michael's intro if you want
$("#restaurants").on("click",function(){
  scrollToResults();
  $(".search").click();
});


if ($(window).width() < 666) {
  $('.landing-nav').addClass("active").css("pointer-events", "auto");
  $('#top-nav').removeClass("fixed");
  $('#social-links').hide();
  $('#search').removeClass("fixed-second");

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
  window.onscroll = function() {
    var window_top = document.documentElement.scrollTop || document.body.scrollTop;
    var div_top = document.getElementById('search-stick-here').getBoundingClientRect().top + window_top +100;
    if (window_top > div_top) {
      $('.landing-nav').addClass("active").css("pointer-events", "auto");
    } else {
      $('.landing-nav').removeClass("active").css("pointer-events", "none");
    }
  }
} 

// Trigger scroll immediately so the search bar can appear if necessary
$(window).trigger("scroll");

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


// search bar code -------------------------------------------------------------
// IMPORTANT: Keep this updated with filter options
function getFilterList() {
  // NOTE: If we want to curate these instead of pull them dynamically off list
  // Replace the vars below with a complete array of autocomplete options
  // var cuisineArray = cuisineString.split("|");
  // Our curated list:
  var cuisineArray = ["American", "Italian", "Northern California", "French", "Indian", "Drink-centric", "Spanish", "Thai", "Chinese", "Japanese", "Greek", "Moroccan", "Vietnamese", "Rotisserie", "Hawaiian", "Seafood", "Mexican"];
  var regionArray = regionString.split(/,|\||\//);
  // Fix some names
  var nameArray = nameString.replace(/&amp;/g, "&").replace(/&#39;/g, "'").split("|");
  // Combine all arrays
  var allArrays = [cuisineArray, regionArray, nameArray];
  var masterArray = [];
  for (var i = 0; i < allArrays.length; i++){
    masterArray = masterArray.concat(allArrays[i]);
  }
  // Filter out dups
  masterArray = masterArray.filter(function (item, pos) {
    return masterArray.indexOf(item) == pos;
  });
  // Return the full array of autocomplete options
  return masterArray;
}

// Create autocomplete
if (typeof $("#search-bar input").autocomplete == "function"){
  $("#search-bar input").autocomplete({
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

    // Restore gold on search nav (if user was looking at mylist)
    $(".search").addClass("homepage");
    $(".mylist").removeClass("active");

    // Hide list text in case we are switching to search
    $("#mylist-box").hide();

    // If there's a value in the search bar, allow cancel
    if ($(this).val()){
      $(".cancel-search").show();
    } else {
      $(".cancel-search").hide();
    }
  });
}

// Finds and displays results that match the term
var findMatches = function(term){
  // Scroll user back to stop to observe results
  scrollToResults();

  var matchingEntries;
  if (typeof term === "string"){
    var searchTerm = term.toLowerCase();
    matchingEntries = $(".restaurant").filter(function() {
      if ($(this).attr("class").toLowerCase().indexOf(searchTerm) != -1){
        return true;
      } else {
        return false;
      }
    });
  } else {
    // This would indicate we're searching by array, so filter differently
    matchingEntries = $(".restaurant").filter(function() {
      if (term.indexOf($(this).attr("id")) != -1){
        return true;
      }
      return false;
    });
  }

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


// Scrolls user to results list (keeping that logic in one place)
var scrollToResults = function(){
  if ($(window).width() < 768){
    // Adjust for mobile
    $('body,html').animate({ scrollTop: $('#results').position().top-108 }, 150);
  } else {
    // Adjust for desktop
    $('body,html').animate({ scrollTop: $('#results').position().top-80 }, 150);
  }
}

var userIdentity;
var restaurantList;
var globalTimeout = null;

// Sets the user ID from treg (hopefully) 
console.log("CHECK USER 3");
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

// If the user is coming to site with a share link, render those results
var renderUserResults = function() {
  // See if we have the info
  var queryResult = checkForParam("share");
  if (queryResult){
    // Decode the result
    queryResult = $.base64.decode(queryResult);
    // Try to fetch data with it
    getData(queryResult, null, true);
    // Actual rendering happens in the getData success callback
  }
}

// Inspect the URL for the relevant query string
var checkForParam = function(query) {
  var queryValue = location.search.match(new RegExp("[\?\&]"+query+"=([^\&]*)(\&?)","i"));
  if (queryValue){
    // We found a share value, return it
    return queryValue[1];
  } else {
    // Either no query or mismatched query
    return null;
  }
}

var checkForHash = function(){
  var hash = window.location.hash;
  // If this is one of the hashes we're expecting, scroll the reader down
  if (hash == "#search" || hash == "#mylist"){
    scrollToResults();
  }
}

// Start by seeing if we can get the user on load
var waitForTreg = checkUser();
checkForHash();
renderUserResults();

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
      if (!share){
        // Only set if it's for the current user's data
        restaurantList = [];
      }
    },
    success: function(data) {
      console.log("SUCCESS, here's the data ", data);
      // Reset timeout var
      globalTimeout = null;

      if (!share){
        // Only set if it's for the current user's data
        restaurantList = data;
        setIcons();
        // If coming from a collex to mylist, handle that
        // Only simulate a click on list if we've got an identity back
        console.log("CHECK HASH", window.location.hash, userIdentity);
        if (window.location.hash == "#mylist" && userIdentity){
          // Also display list results
          $(".mylist").click();
        }
      } else {
        // If this is a search for another user's data, just render the result
        const mappedList = data.map(function(item){
          // Shave the prefix off of item
          return item.substring(4, item.length);
        });
        // Filter and scroll user there
        findMatches(mappedList);
        // Add a bit of help text
        $("#count-results").text($("#count-results").text() + " shared from a reader's list");
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
  $(".mylist").addClass("active");
  // Show list as a filter
  const mappedList = restaurantList.map(function(item){
    // Shave the prefix off of item
    return item.substring(4, item.length);
  });
  findMatches(mappedList);
  // Append query string to let people share their list
  // Use history API to update query
  if (history.pushState) {
    // Get URL with no query or hash (or trailing slash)
    var fullUrl = location.href.split('#')[0].split('?')[0] + "?share=" + $.base64.encode(userIdentity) + "#search";
    window.history.pushState({path:fullUrl},'',fullUrl);
  }
}


$(".search, .mobile-search").on("click", function(e){  
  //Intercept the link functionality on homepage and just bring user to search
  e.preventDefault();
  // Hide explainer text 
  $("#mylist-box").hide();
  // Set nav colors
  $(".search").addClass("homepage");
  $(".mylist").removeClass("active");
  // Bring user to search
  scrollToResults();
  // Use history API to update query
  if (history.pushState) {
    // Get URL with no query or hash (or trailing slash)
    var fullUrl = location.href.split('#')[0].split('?')[0] + "#search";
    window.history.pushState({path:fullUrl},'',fullUrl);
  }
  // Put focus into search bar
  $("#search-bar input").focus();
  // Restore 100 results 
  showAllRestaurants();
});

// event listener for "My List" button
$(".mylist").on("click",function(e) {
  //Intercept the link functionality on homepage and just bring user to search
  e.preventDefault();
  // Don't do anything unless the initial check has resolved
  if (globalTimeout == null){
    var promise = checkUser(1);
    $.when(promise).then(function(data){
      if (userIdentity == "no id"){
        $("body").find("#log-in-instructions").show();
        $("body, html").css("overflow-y", "hidden");
      } else if (userIdentity) {
        // Give it gold bg
        $(this).toggleClass("selected");
        showMyList();
        // Clear any search terms from bar
        $("#search-bar input").val("");
        $(".cancel-search").hide();
        // Change result text a little
        var resultsText = $("#count-results").text();
        $("#count-results").text(resultsText.replace(/[a-zA-Z]+/, "") + " restaurants on your list");
        // Swap out "restaurants" if it's just 1 result
        if (resultsText.substring(0,2) == "1 "){
          $("#count-results").text($("#count-results").text().replace("restaurants", "restaurant"));
        }
        $("#mylist-box").show();
        // Handle zero results condition
        if (resultsText.substring(0,1) == "0"){
          $("#search-noresults").hide();
        } else {
          // If there are results, append share tools
          var encodedURL = location.href.split('#')[0].split('?')[0] + "?share=" + $.base64.encode(userIdentity) + "#search";
          var twitterCopy = $("#twitter-icon").clone();
          twitterCopy.attr("href", "https://twitter.com/intent/tweet?url="+encodeURIComponent(encodedURL)+"&text="+encodeURIComponent("Check out my list from @sfchronicle's Top 100 Restaurants."));
          var facebookCopy = $("#facebook-icon").clone();
          facebookCopy.attr("onclick", "window.open('https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(encodedURL)+"', 'facebook-share-dialog', 'width=626,height=436'); return false;");
          var linkIcon = $("<a>", {
            html: '<i class="fa fa-link" aria-hidden="true"></i><span class="hide link-copy-text">URL copied to clipboard!</span><input class="hide link-copy-input" />',
          });
          // Add buttons
          $("#count-results").append('<span>Share with a friend: </span>').append(twitterCopy).append(facebookCopy).append(linkIcon);
          // Add event to link button
          linkIcon.on("click", function(){
            $(".link-copy-text").css("display", "block");
            $(".link-copy-input").show().val(encodedURL);
            $(".link-copy-input")[0].select();
            document.execCommand('copy');
          });
        }
      } 
    });
  }
});

// handle print button functionality
$(".print-link").on("click", function(){
  window.print();
  return false;
})

// exit the subscribe window
$("#exit").on("click", function(){
  $("#log-in-instructions").hide();
  $("body, html").css("overflow-y", "auto");
})

$('#introduction, .closer').on("click", function(){
  $("body, html").toggleClass('noscroll');
  $('.intro-overlay').toggleClass('hide');
})

$(".intro-overlay").mouseup(function(e){
  var popup = $("#about-popup"); 

  if(e.target.id != popup.attr('id') && !popup.has(e.target).length){
    $("body, html").toggleClass('noscroll');
    $('.intro-overlay').toggleClass('hide');
  }
});

// Populate the latest news section of the site
$(function(){
  var url = 'https://www.sfchronicle.com/default/feed/test-feed-for-top100-2003.php';
  $.ajax({
    type: 'GET',
    url: "https://api.rss2json.com/v1/api.json?rss_url=" + url,
    dataType: 'jsonp',
    success: function(data) {  
      var items = data.items.splice(0,3);

      items.forEach(function(item){

        // Get title
        var title = item.title;
        // Get link
        var link = item.link;
        // Get pubdate and convert to AP style
        var date = timeConverter(item.pubDate);
        // Get image src
        var imageURL = item.enclosure.link;
        var lastSlash = imageURL.lastIndexOf("/");
        imageURL = imageURL.replace(imageURL.substring(lastSlash+1), "premium_gallery_landscape.jpg");

        // push each story html
        var html = '<div class="story "><a target="_blank" href="'+link+'"><img src="'+imageURL+'"></a><div class="story-info"><label class="timestamp">'+date+'</label><h3><span>'+title+'</span></h3></div></div>';
        $('.stories').append(html);
      });

    }
  });
});

function timeConverter(timeStamp){
  var UNIX_timestamp = new Date(timeStamp).getTime();
  var a = new Date(UNIX_timestamp);
  var months = ['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = a.getDate();
  var time = month + ' ' + day + ', ' + year ;
  return time;
}

