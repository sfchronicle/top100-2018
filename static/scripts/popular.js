// Insert logic for grabbing most popular here
var cookies = require("./cookies");
var top100Results = [];
// Hit our cached chartbeat results for data
var settings = {
  "async": true,
  "url": "https://extras.sfgate.com/editorial/analytics/chartbeatfood.json?asv",
  "method": "GET",
}
// Make the request
$.ajax(settings).done(function (response) {
  // Filter to get only the top 100 pages
  top100Results = response.pages.filter(function(item){
    if (item.path.indexOf("projects.sfchronicle.com/2018/top-100-restaurants/") != -1){
      return true;
    } else {
      return false;
    }
  });
  // Now just render an array of IDs
  top100Results = top100Results.map(function(item){
    // Get the text before the final slash (that's the ID we need)
    var result = item.path.split("/");
    result = result[result.length - 2]; 
    if (result != "top-100-restaurants"){
      return result;
    }
    // If we didn't find an ID, it'll map undefined 
  });
  
}).always(function(){
  // NOTE: It's okay if the request failed because we'll still come in with our defaults below
  // If we're developing on localhost, fake the results (since no real results are probably live yet)
  // Also serve this up if it's we've got less than 4 popular results :(
  if (window.location.href.indexOf("localhost") != -1 || top100Results.length < 3){
    top100Results = top100Results.concat(["a16", "acaciahouse", "acquerello", "ad-hoc"]);
  }
  // One last filter to remove the undefineds and the current item (if it exists in the set)
  top100Results = top100Results.filter(function(item){
    if (typeof item != "undefined" && (typeof restaurant == "undefined" || item != restaurant.Slug)){
      return true;
    } else {
      return false;
    }
  });
  // Final filter to create an array of restaurants objects
  finalFilter(top100Results);
});

// Try this a couple times and then bail out
var finalFilter = function(results){
  // If the global var is not defined yet, try again in a moment
  if (typeof restaurants == "undefined"){
    setTimeout(finalFilter.bind(null, results), 500);
    return false;
  }
  // ^ If it is defined, carry on
  var orderedArray = [];
  // We need the complete objects from the restaurant list
  // But we need them in order of popularity
  var finalPopular = results.filter(function(item){
    // Do not even start the loop if we have all we need
    if (orderedArray.length >= 3){
      return false;
    }
    // If we don't have what we need, cycle through
    $.each(restaurants, function(index, rest){
      if (item == rest.Slug){
        orderedArray.push(rest);
        return true;
      }
    });
  });
  // Assign back so it can be used
  finalPopular = orderedArray;

  // Set values on HTML
  $("#popular-rest .wrap").each(function(index){
    // Get URL
    var fullUrl = $(this).find("a").first().data("link");
    // Set new path using slug
    var finalUrl = fullUrl+finalPopular[index].Slug;
    $(this).find("a").attr("href", finalUrl);
    // Set image URL
    if (finalPopular[index].wcm_img){
      $(this).find("img").attr("src", "https://s.hdnux.com/photos/60/22/02/"+finalPopular[index].wcm_img.split(" ")[0]+"/7/premium_gallery_landscape.jpg");
    }
    // Set name
    $(this).find(".name div").text(finalPopular[index].Name);
    // Set region
    $(this).find(".info").text(finalPopular[index].Region + " | " + finalPopular[index].SubRegion);
    // Give popular restaurants that haven't been seen yet a little flag
    var restaurantCookie = getCookie("sfc_top100_2018");
    if (restaurantCookie.indexOf(finalPopular[index].Slug) == -1){
      $(this).find(".border").addClass("unseen").eq(1).addClass("white");
    }
    // Add analytics
    $(this).find("a").on("click", function(){
      // Check to see how often this is clicked
      if (typeof ens_specialEvent != "undefined"){
        ens_specialEvent("Top 100 Restaurants 2018","Button Click","Still Hungry Link");
      }
    });
  });
}

