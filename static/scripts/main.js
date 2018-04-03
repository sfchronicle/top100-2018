require("./lib/social");
var cookies = require("./cookies");

// Slider
if($('.swiper-slide').length === 1){
  $('.swiper-pagination').css('display', 'none');
} else {
	// Create swiper
	var swiperData = {
    spaceBetween: 100,
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
if (cookieValue.indexOf(restaurantSlug) == -1){
	// Add to existing cookie
	cookieValue += "|" + restaurantSlug;
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



