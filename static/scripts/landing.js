require("./lib/social");

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

console.log(restaurants);

// search bar code -------------------------------------------------------------
// IMPORTANT: Keep this updated with filter options
function getFilterList() {
  // NOTE: If we want to curate these instead of pull them dynamically off list
  // Replace the vars below with a complete array of autocomplete options
  var cuisineArray = cuisineString.split("|");
  var regionArray = regionString.split("|");
  var nameArray = nameString.split("|");
  // Combine all arrays
  var allArrays = [cuisineArray, regionArray, nameArray];
  var masterArray = [];
  for (var i = 0; i < allArrays.length; i++){
    masterArray = masterArray.concat(allArrays[i]);
  }
  // Return the full array of autocomplete options
  return masterArray;
}

console.log("LOGGING IN LANMDING!", cuisineString, regionString);

// Create autocomplete
$( "#search-bar input" ).autocomplete({
  source: function(request, response) {
    var results = $.ui.autocomplete.filter(getFilterList(), request.term);
    // Sort alphabetically, limit results
    response(results.sort().slice(0, 5));
  },
  select: function( event, ui ) {
    findMatches(ui.item.value);
  }
});

$("#search-bar input").on("input", function(){
  findMatches($(this).val());
});

// Finds and displays results that match the term
var findMatches = function(term){
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
}

// searchbar code
// $("#searchrestaurants").bind("input propertychange", function () {
//   var filter = $(this).val().toLowerCase().replace(/ /g,'').replace().replace(/'/g,'');
//   var class_match = 0;
//   count = 0;

//   var button_list = document.getElementsByClassName("button");
//   for (var i=0; i<button_list.length; i++) {
//     button_list[i].classList.remove("selected");
//   };
//   if (filter == "") {
//     document.getElementById("showall").classList.add("selected");
//   }

//   selCuisine.selectedIndex = 0;
//   selNeighborhoods.selectedIndex = 0;
//   selNoise.selectedIndex = 0;
//   selPrice.selectedIndex = 0;

//   selNeighborhoods.classList.remove("active");
//   selPrice.classList.remove("active");
//   selNoise.classList.remove("active");
//   selCuisine.classList.remove("active");

//   document.getElementById("intro-container").classList.add("hide");
//   document.getElementById("restaurants-wrap").classList.remove("hide");

//   $(".restaurant").filter(function() {

//     var classes = this.className.split(" ");
//     for (var i=0; i< classes.length; i++) {

//       var current_class = classes[i].toLowerCase();
//       if ( current_class.match(filter)) {
//         class_match = class_match + 1;
//       }
//     }
//     if (class_match > 0) {
//       $(this).addClass("active");
//       count+=1;
//     } else {
//       $(this).removeClass("active");
//     }
//     class_match = 0;

//   });

//   // display text for empty search results
//   if (count > 0) {
//     document.getElementById('search-noresults').classList.add("hide");
//     document.getElementById('count-results').classList.remove("hide");
//     document.getElementById('count-results').innerHTML = count+" result(s)";
//   } else {
//     document.getElementById('search-noresults').classList.remove("hide");
//     document.getElementById('count-results').classList.add("hide");
//   }
//   if (count == 100) {
//     document.getElementById('count-results').classList.add("hide");
//   }

// });

// check for log on information on load ------------------------------------------------

// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// temporary code for testing ---------------------------
var edbId = "11220453";
var restaurantList;
var saveTimer;

function setCheckUser(delay, repetitions, success, error) {
  if (edbId) {
    success(edbId);
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
  console.log("TEST A", identity);
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
    url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2017/checklist/" + edbId,
    error: function(msg) {
      restaurantList = [];
      // console.log("fail");
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

// set stars and checks on load for a particular user
function setIcons() {
  savedData.forEach(function(saveID){
    var elem = document.getElementById(saveID);
    if ($("i", elem).hasClass("fa-star-o")) {
      $("i", elem).toggleClass("fa-star-o fa-star");
    }
    if ($("i", elem).hasClass("fa-square-o")) {
      $("i", elem).toggleClass("fa-square-o fa-check-square-o");
    }
    // $("i", elem).toggleClass("fa-star-o fa-star");
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
      url: "https://hcyqzeoa9b.execute-api.us-west-1.amazonaws.com/v1/top100/2017/checklist"
    });
  //   return false;
  // });
}

qsa(".save-restaurant").forEach(function(restaurant,index) {
  restaurant.addEventListener("click", function(e) {
    // console.log(restaurant.id);

    if (restaurantList) {
      $("i", this).toggleClass("fa-star-o fa-star");

      // console.log(savedData);
      // console.log(restaurantList);

      // are we adding or removing the restaurant from the list?
      if(  $("i", this).hasClass("fa-star") ) {
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

qsa(".check-restaurant").forEach(function(restaurant,index) {
  restaurant.addEventListener("click", function(e) {
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

function showall_function() {

  count = 100;

  document.getElementById("restaurants-wrap").classList.remove("hide");
  document.getElementById("intro-container").classList.add("hide");

  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };

  document.getElementById("showall").classList.add("selected");

  document.getElementById('searchrestaurants').value = "";
  document.getElementById('brunch').value = "all";
  document.getElementById('new').value = "all";

  document.getElementById('no-saved-restaurants').classList.add("hide");
  document.getElementById('no-checked-restaurants').classList.add("hide");
  document.getElementById("search-noresults").classList.add("hide");

  selCuisine.selectedIndex = 0;
  selNeighborhoods.selectedIndex = 0;
  selNoise.selectedIndex = 0;
  selPrice.selectedIndex = 0;

  $(".restaurant").filter(function() {
    $(this).addClass("active");
  });
  document.getElementById('count-results').classList.add("hide");

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

// navigation controls ---------------------------------------------------------

// filter button on mobile scrolls to top
$('#filter-btn').on('click', function(){
    $('body,html').animate({ scrollTop: $('#search').position().top },150);
});

// show the bottom nav only on small screens and after certain scroll height
$(document).scroll(function() {
  var y = $(this).scrollTop();
  var topDiv = $('#header').outerHeight( true )-10;
  var x = $(this).width();
  if (y > topDiv && x < 650){
    $('#bottom-nav').show();
  } else {
    $('#bottom-nav').hide();
  }
});