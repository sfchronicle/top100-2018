require('lazyload');
lazyload();

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
  $('.landing-nav').css("pointer-events", "auto");
}


$(".region-button").on("click",function(){
  $('body,html').animate({ scrollTop: $('.regions-container').position().top-70 }, 150);
});

$(".cuisine-button").on("click",function(){
  $('body,html').animate({ scrollTop: $('.cuisines-container').position().top-70 }, 150);
});
