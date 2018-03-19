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
