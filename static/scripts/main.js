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
if (!cookieValue){
	cookieValue = "";
} 
// If the slug is not present in the string
if (cookieValue.indexOf(restaurant.Slug) == -1){
	// If it's not the first name, add a spacer
	if (cookieValue){
		cookieValue += "|";
	} 
	// Add to existing cookie
	cookieValue += restaurant.Slug;
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

// Add a special icon if this restaurant is new or a classic
var newIcon = "//projects.sfchronicle.com/shared/logos/top100_new.png?a";
var classicIcon = "//projects.sfchronicle.com/shared/logos/top100_classic.png?a";
var iconChoice;
var returningVal = restaurant.Returning.toLowerCase();
// Check values on restaurant
if (returningVal == "no"){
	iconChoice = newIcon;
} else if (returningVal == "classic"){
	iconChoice = classicIcon;
}
// If a value was chosen, set src
if (iconChoice){
	$(".special-icon").attr("src", iconChoice);
}

// ************* RELATED SECTION ****************

var findUnseenRestaurant = function(index, cookie, alreadySelected){
	// Loop through and find a restaurant the user hasn't seen yet
	var foundRest = false;
	var countIndex = index;
	var catchCount = 0;
	while (!foundRest){
		// Wrap back around if we're at 100
		if (countIndex == 100){
			countIndex = 0;
		}

		if (cookie.indexOf(restaurants[countIndex].Slug) == -1){
			// Check if it's already selected
			if (alreadySelected.indexOf(restaurants[countIndex]) == -1){
				// This means the user hasn't visited, let's return
				foundRest = true;
				return restaurants[countIndex];
			}
		} else {
			// Catch if we go over 100 and still haven't found anything
			// Which could happen if they've read it all!
			if (catchCount > 100){
				foundRest = true;
				return null;
			}
		}

		// Increment
		countIndex++;
		catchCount++;
	}
}

// Find restaurant that matches the current name
var thisRestaurant = restaurants.find(function(element) {
  return element.Name == restaurant.Name;
});

// Get index of current restaurant
var thisRestaurantIndex = restaurants.indexOf(thisRestaurant);

// Related restaurants are the next 3
var relatedRestaurants = [];
for (var r = 0; r < 3; r++){
	relatedRestaurants[r] = findUnseenRestaurant(thisRestaurantIndex, cookieValue, relatedRestaurants); 
}

// Set values on HTML
$("#related-rest .wrap").each(function(index){
	// Only create if it exists
	if (relatedRestaurants[index] != null){
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
	  // Set next link as the text link
	  if (index == 0){
	  	$(".rtitle .next-link").attr("href", finalUrl);
	  }
	  // Set image URL
	  if (relatedRestaurants[index].wcm_img){
	    $(this).find("img").attr("src", "https://ww3.hdnux.com/photos/60/22/02/"+relatedRestaurants[index].wcm_img.split(" ")[0]+"/7/premium_gallery_landscape.jpg");
	  }
	  // Set name
	  $(this).find(".name div").text(relatedRestaurants[index].Name);
	  // Set region
	  $(this).find(".info").text(relatedRestaurants[index].Region + " | " + relatedRestaurants[index].SubRegion);
	} else {
		$(this).remove();
	}
});



