require("./lib/social");
var cookies = require("./cookies");

//Set proper image size for slideshow
var imageWidth = $(".swiper-container").width();
imageWidth *= window.devicePixelRatio;
$(".swiper-slide img").attr("src", function(){
	return $(this).data("noload-src")+imageWidth.toString()+"x0.jpg";
});

// Slider
if($('.swiper-slide').length === 1){
  $('.swiper-pagination').css('display', 'none');
} else {
	// Create swiper
	var swiperData = {
    spaceBetween: 100,
    autoHeight: true, 
    calculateHeight:true,
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
console.log(cookieValue, "cookieValue");
if (!cookieValue){
	cookieValue = "";
}

// If the slug is not present in the string
if (cookieValue.indexOf(restaurant.Slug) == -1){
	// Add to existing cookie
	cookieValue += "|" + restaurant.Slug;
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
} else {
	// Congratulate the reader!
	$("#explore-text").hide();
	$("#final-text").show();
}

// ************* RELATED SECTION ****************

console.log(restaurant, restaurants);

// Find restaurant that matches the current name
var thisRestaurant = restaurants.find(function(element) {
  return element.Name == restaurant.Name;
});

// Get index of current restaurant
var thisRestaurantIndex = restaurants.indexOf(thisRestaurant);

// Related restaurants are the next 3
var relatedRestaurants = [];
relatedRestaurants[0] = restaurants[thisRestaurantIndex+1];
relatedRestaurants[1] = restaurants[thisRestaurantIndex+2];
relatedRestaurants[2] = restaurants[thisRestaurantIndex+3];
console.log(relatedRestaurants);

// Set values on HTML
$("#related-rest .wrap").each(function(index){
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
  $(".rtitle .next-link").attr("href", finalUrl);
  // Set image URL
  if (relatedRestaurants[index].wcm_img){
    $(this).find("img").attr("src", "https://ww3.hdnux.com/photos/60/22/02/"+relatedRestaurants[index].wcm_img.split(" ")[0]+"/7/premium_gallery_landscape.jpg");
  }
  // Set name
  $(this).find(".name div").text(relatedRestaurants[index].Name);
  // Set region
  $(this).find(".info").text(relatedRestaurants[index].Region + " | " + relatedRestaurants[index].SubRegion);
});



