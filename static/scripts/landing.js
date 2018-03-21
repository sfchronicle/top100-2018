'use strict';

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

// search bar code -------------------------------------------------------------

// searchbar code
$("#searchrestaurants").bind("input propertychange", function () {
  var filter = $(this).val().toLowerCase().replace(/ /g,'').replace().replace(/'/g,'');
  var class_match = 0;
  count = 0;

  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };
  if (filter == "") {
    document.getElementById("showall").classList.add("selected");
  }

  selCuisine.selectedIndex = 0;
  selNeighborhoods.selectedIndex = 0;
  selNoise.selectedIndex = 0;
  selPrice.selectedIndex = 0;

  selNeighborhoods.classList.remove("active");
  selPrice.classList.remove("active");
  selNoise.classList.remove("active");
  selCuisine.classList.remove("active");

  document.getElementById("intro-container").classList.add("hide");
  document.getElementById("restaurants-wrap").classList.remove("hide");

  $(".restaurant").filter(function() {

    var classes = this.className.split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();
      if ( current_class.match(filter)) {
        class_match = class_match + 1;
      }
    }
    if (class_match > 0) {
      $(this).addClass("active");
      count+=1;
    } else {
      $(this).removeClass("active");
    }
    class_match = 0;

  });

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
    document.getElementById('count-results').classList.add("hide");
  }

});

// check for log on information on load ------------------------------------------------

// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // temporary code for testing ---------------------------
// var edbId = "11220453";
// var restaurantList;
// var saveTimer;
//
// function setCheckUser(delay, repetitions, success, error) {
//   if (edbId) {
//     success(edbId);
//   } else {
//     error();
//   }
// }

// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var edbId;
var restaurantList;
var saveTimer;
function setCheckUser(delay, repetitions, success, error) {

  var x = 0;
  var intervalID = window.setInterval(function () {

    // loop while waiting for syncPaymeterSdk to load
    if ( window.syncPaymeterSdk ) {
      window.clearInterval( intervalID );

      if ( treg.identity.edbId ) {

        success(treg.identity);

      } else {

        var a = window.syncPaymeterSdk;
        a.events.registerHandler( a.events.onAuthorizeSuccess, function () {
          // set callback for completion of authorization
          if ( treg.identity.edbId ) {
            if ( success && typeof(success) === "function" ) {
              success(treg.identity);
            }
          } else {
            if ( error && typeof(error) === "function" ) {
              error();
            }
          }
        }) || error();
      }

    } else if ( ++x === repetitions ) {
      window.clearInterval( intervalID );
      if ( error && typeof(error) === "function" ) {
        error();
      }
    }

  }, delay );

}
// DO NOT DELETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// response if a user is not logged in
function errorCallBack() {
  // console.log("error");
  $("#nouser").removeClass("hidden");

  // check to see if user logs on after load
  if (treg.hasActiveSession() == false) {
    // console.log("no active session");
    treg.registerEvent(treg.event.onSessionFound, function ()   {
      // we are going to keep checking for the user ID if people log in
      // console.log("now we are checking again");
      successCallBack(treg.identity);
      // console.log(edbId);
    });
  }
}

// response if a user is logged in
function successCallBack(identity) {
  if (identity.edbId != null) {
    // console.log("success");
    edbId = identity.edbId;
    // console.log(edbId);
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


// setting up drop-down menus -------------------------------------------------

// cuisines drop-down -----------------
var cuisines = ["American","Chinese","Drink-centric","French","Greek","Hawaiian","Indian","International","Italian","Japanese","Mediterranean","Mexican","Moroccan",  "Northern California","Seafood","Spanish","Thai","Vietnamese"];
var selCuisine = document.getElementById('select-cuisine');
for(var i = 0; i < cuisines.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = cuisines[i];
    opt.value = cuisines[i].toLowerCase().replace(/ /g,'');
    selCuisine.appendChild(opt);
}
$('.dropdown-container').on('change', function(){
    $('body,html').animate({ scrollTop: $('#restaurants').position().top },300);
    $('#brunch-spots').removeClass('show');
    $('#new-additions').removeClass('show');
});

$('.filter').on('click', function(){
    $('body,html').animate({ scrollTop: $('#restaurants').position().top },300);
    $('#brunch-spots').removeClass('show');
    $('#new-additions').removeClass('show');
});

// neighborhoods drop-down ------------------
var regions = ["East Bay","San Francisco","North Bay","South of SF"];
var neighborhoods = {"East Bay":["Berkeley","Oakland","Port Costa"], "North Bay":["Yountville","Napa","Sausalito","St. Helena","Healdsburg","Fairfax"], "San Francisco":["Castro","Chinatown","Civic Center","Cow Hollow","Embarcadero","Financial District","Hayes Valley","Lower Pacific Heights","Marina","Mid-Market","Mission","Nob Hill","Noe Valley","NoPa","North Beach","Pacific Heights","Presidio","Russian Hill","SoMa","Tenderloin","The Richmond","Union Square","Western Addition"], "South of SF":["Los Gatos","Burlingame","Daly City"]};

var selNeighborhoods = document.getElementById("select-neighborhood");
for (var j = 0; j< regions.length; j++) {
  var opt = document.createElement('optgroup');
  opt.className += "optionGroup";
  opt.label = regions[j];
  opt.value = regions[j].toLowerCase().replace(/ /g,'');
  selNeighborhoods.appendChild(opt);
  for (var i = 0; i < neighborhoods[regions[j]].length; i++) {
    var opt = document.createElement('option');
    opt.className += "optionChild";
    opt.innerHTML = neighborhoods[regions[j]][i];
    opt.value = neighborhoods[regions[j]][i].toLowerCase().replace(/ /g,'');
    selNeighborhoods.appendChild(opt);
  }
}

// noise drop-down ---------------------------
var selNoise = document.getElementById('select-noise');

// cost drop-down ---------------------------
var selPrice = document.getElementById('select-price');

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

// function to show introduction ----------------------------------------------------------------------

function showintro_function(){

  var button_list = document.getElementsByClassName("button");
  for (var i=0; i<button_list.length; i++) {
    button_list[i].classList.remove("selected");
  };
  document.getElementById("about").classList.add("selected");

  document.getElementById('searchrestaurants').value = "";
  document.getElementById('brunch').value = "all";
  document.getElementById('new').value = "all";

  selCuisine.selectedIndex = 0;
  selNeighborhoods.selectedIndex = 0;
  selNoise.selectedIndex = 0;
  selPrice.selectedIndex = 0;

  selNeighborhoods.classList.remove("active");
  selPrice.classList.remove("active");
  selNoise.classList.remove("active");
  selCuisine.classList.remove("active");

  document.getElementById('count-results').classList.add("hide");
  document.getElementById('count-results').classList.add("hide");

  document.getElementById('no-saved-restaurants').classList.add("hide");
  document.getElementById('search-noresults').classList.add("hide");

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

  selCuisine.selectedIndex = 0;
  selNeighborhoods.selectedIndex = 0;
  selNoise.selectedIndex = 0;
  selPrice.selectedIndex = 0;

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

  $(".restaurant").filter(function() {

    // check all the classes for the restaurant
    var classes = this.className.toLowerCase().split(" ");

    // check cuisine
    if (selCuisine.value != "all"){
      cuisine_flag = (classes.indexOf(selCuisine.value)>0)
    } else {
      cuisine_flag = 1;
    }

    // check neighborhood
    if (selNeighborhoods.value != "all"){
      neighborhood_flag = (classes.indexOf(selNeighborhoods.value)>0)
    } else {
      neighborhood_flag = 1;
    }

    // check noise
    if (selNoise.value != "all"){
      noise_flag = (classes.indexOf(selNoise.value)>0)
    } else {
      noise_flag = 1;
    }

    // check price
    if (selPrice.value != "all"){
      price_flag = (classes.indexOf(selPrice.value)>0)
    } else {
      price_flag = 1;
    }

    // check for new restaurants
    if (new_button.value != "all"){
      new_flag = (classes.indexOf(new_button.value)>0)
    } else {
      new_flag = 1;
    }

    // check for restaurants serving brunch
    if (brunch_button.value != "all"){
      brunch_flag = (classes.indexOf(brunch_button.value)>0)
    } else {
      brunch_flag = 1;
    }

    // see if the restaurant satisfies all conditions set by user
    flag_min = [cuisine_flag, neighborhood_flag, new_flag, brunch_flag, noise_flag, price_flag, alcohol_flag].min();

    // show it if yes
    if (flag_min == 1){
      $(this).addClass("active");
      count += 1;
    } else {
      $(this).removeClass("active");
    }

  });

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

// event listeners for all the filters -------------------------------------------------

// event listener for cuisine drop down
selCuisine.addEventListener("change",function(event){
  if (event.target.value != "all") {
    selCuisine.classList.add("active");
  } else {
    selCuisine.classList.remove("active");
  }
  check_filters();
});

// event listener for neighborhoods drop down
selNeighborhoods.addEventListener("change",function(){
  if (event.target.value != "all") {
    selNeighborhoods.classList.add("active");
  } else {
    selNeighborhoods.classList.remove("active");
  }
  check_filters();
});

// event listener for noise drop down
selNoise.addEventListener("change",function(){
  if (event.target.value != "all") {
    selNoise.classList.add("active");
  } else {
    selNoise.classList.remove("active");
  }
  check_filters();
});

// event listener for prices drop down
selPrice.addEventListener("change",function(){
  if (event.target.value != "all") {
    selPrice.classList.add("active");
  } else {
    selPrice.classList.remove("active");
  }
  check_filters();
});

// event listener for "New" button
function toggle_new(b){b.value=(b.value=="new")?"all":"new";}
var new_button = document.getElementById('new');
new_button.value = "all";
new_button.addEventListener("click",function() {
  toggle_new(this);
  $(this).toggleClass("selected");
  check_filters();
});

// event listener for "Brunch" button
function toggle_brunch(b){b.value=(b.value=="brunch")?"all":"brunch";}
var brunch_button = document.getElementById('brunch');
brunch_button.value = "all";
brunch_button.addEventListener("click",function() {
  toggle_brunch(this);
  $(this).toggleClass("selected");
  check_filters();
});

// event listener for "New" button
var showall_button = document.getElementById('showall');
showall_button.addEventListener("click",function() {
  selNeighborhoods.classList.remove("active");
  selPrice.classList.remove("active");
  selNoise.classList.remove("active");
  selCuisine.classList.remove("active");
  $(this).toggleClass("selected");
  showall_function();
});


// event listener for "My List" button
var mylist_starred_button = document.getElementById('mylist-starred');
mylist_starred_button.addEventListener("click",function() {
  if (edbId) {
    $(this).toggleClass("selected");
    mylist_function(this);
  } else {
    document.getElementById("log-in-instructions").classList.add("show");
    document.body.classList.add("noverflow");
  }
});

// event listener for "My List" button
var mylist_checked_button = document.getElementById('mylist-checked');
mylist_checked_button.addEventListener("click",function() {
  if (edbId) {
    $(this).toggleClass("selected");
    mylist_function(this);
  } else {
    document.getElementById("log-in-instructions").classList.add("show");
    document.body.classList.add("noverflow");
  }
});

// event listener for "My List" button
var close_instructions = document.getElementById('exit');
close_instructions.addEventListener("click",function() {
  document.getElementById("log-in-instructions").classList.remove("show");
  document.body.classList.remove("noverflow");
});

// event listener for "My List" button
var showintro_button = document.getElementById('about');
showintro_button.addEventListener("click",function() {
  // console.log("click");
  $(this).toggleClass("selected");
  $("#intro-container").toggleClass("hide");
  $("#restaurants-wrap").toggleClass("hide");
  showintro_function(this);
});

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

// making special pages for Kim to social out ----------------------------------

$(document).ready(function () {

  if(window.location.hash) {
    var hash = document.URL.substr(document.URL.indexOf('#'))

    if (hash == "#brunch"){
      brunch_button.classList.add("selected");
      $('#brunch-spots').addClass('show');
      brunch_button.value = "brunch";
      check_filters();

    }

    if (hash == "#new"){
      new_button.classList.add("selected");
      $('#new-additions').addClass('show');
      new_button.value = "new";
      check_filters();
    }
  }
  
});
