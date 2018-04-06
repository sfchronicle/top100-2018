
if (document.getElementById("sf-region")){

  document.getElementById("sf-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("sf-region").classList.add("active");
    document.getElementById("sf-subregions").classList.add("active");
    checkRestaurants("sanfrancisco");
  });

  document.getElementById("northbay-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("northbay-region").classList.add("active");
    document.getElementById("northbay-subregions").classList.add("active");
    checkRestaurants("northbay");
  });

  document.getElementById("southbay-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("southbay-region").classList.add("active");
    document.getElementById("southbay-subregions").classList.add("active");
    checkRestaurants("southbay");
  });

  document.getElementById("eastbay-region").addEventListener("click",function(){
    $(".region-button").removeClass("active");
    $(".subregion-button").removeClass("active");
    $(".subregions-container").removeClass("active");
    document.getElementById("eastbay-region").classList.add("active");
    document.getElementById("eastbay-subregions").classList.add("active");
    checkRestaurants("eastbay");
  });

}

if (document.getElementById("select-regions")){

  var chooseRegion = document.getElementById('select-regions');
  var chooseEastbay = document.getElementById('select-eastbay-subregions');
  var chooseNorthbay = document.getElementById('select-northbay-subregions');
  var chooseSF = document.getElementById('select-sf-subregions');
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

  chooseEastbay.addEventListener('change', function(d) {
    var key = chooseEastbay.value.split("-")[0];
    check_dropdowns(key);
  });

  chooseNorthbay.addEventListener('change', function(d) {
    var key = chooseNorthbay.value.split("-")[0];
    check_dropdowns(key);
  });

  chooseSF.addEventListener('change', function(d) {
    var key = chooseSF.value.split("-")[0];
    check_dropdowns(key);
  });

}

if (document.getElementById("select-cuisine")){

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
