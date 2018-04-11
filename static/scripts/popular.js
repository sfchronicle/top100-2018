// Insert logic for grabbing most popular here
// WORKING, hide our API key
// ALSO instead of pinging chartbeat directly, we should ping our server which has cached results
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://api.chartbeat.com/live/toppages/v3/?apikey=6033653176adbfc228e9358316a06054&host=sfchronicle.com&section=food&limit=100",
  "method": "GET",
}
// Make the request
$.ajax(settings).done(function (response) {
  console.log(response);
  // Filter to get only the top 100 pages
  var top100Results = response.pages.filter(function(item){
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
  // If we're developing on localhost, fake the results (since no real results are probably live yet)
  // Also serve this up if it's we've got less than 4 popular results :(
  if (window.location.href.indexOf("localhost") != -1 || top100Results < 3){
    top100Results = top100Results.concat(["a16", "acaciahouse", "acquerello", "ad-hoc"]);
  }
  // One last filter to remove the undefineds and the current item (if it exists in the set)
  top100Results = top100Results.filter(function(item){
    if (typeof item != "undefined" && item != restaurant.Slug){
      return true;
    } else {
      return false;
    }
  });
  // Final filter to create an array of restaurants objects
  var finalPopular = restaurants.filter(function(item){
    if (top100Results.indexOf(item.Slug) != -1){
      return true;
    } else {
      return false;
    }
  });
  // Set values on HTML
  $("#popular-rest .wrap").each(function(index){
    // Get URL with no query or hash (or trailing slash)
    var fullUrl = location.href.split('#')[0].split('?')[0].slice(0, -1);
    // Get array based on slashes
    fullUrl = fullUrl.split("/");
    // Remove the restaurant path and rejoin
    fullUrl.pop();
    fullUrl = fullUrl.join("/"); 
    // Set new path using slug
    var finalUrl = fullUrl+"/"+finalPopular[index].Slug;
    $(this).find("a").attr("href", finalUrl);
    // Set next link as the text link
    if (index == 0){
      $(".rtitle .next-link").attr("href", finalUrl);
    }
    // Set image URL
    if (finalPopular[index].wcm_img){
      $(this).find("img").attr("src", "https://ww3.hdnux.com/photos/60/22/02/"+finalPopular[index].wcm_img.split(" ")[0]+"/7/premium_gallery_landscape.jpg");
    }
    // Set name
    $(this).find(".name div").text(finalPopular[index].Name);
    // Set region
    $(this).find(".info").text(finalPopular[index].Region + " | " + finalPopular[index].SubRegion);
  });
  // WORKING, do something with these results
  console.log("TOP 100", top100Results);
});