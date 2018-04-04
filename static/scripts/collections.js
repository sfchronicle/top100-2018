
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
