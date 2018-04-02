require("./lib/social");

console.log("RUNNING MAIN");

// Slider
if($('.swiper-slide').length === 1){
  $('.swiper-pagination').css('display', 'none');
} else {
	// Create swiper
	var swiperData = {
    spaceBetween: 100,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
  }

  if ($(window).width() > 767){
  	// Only enable pagination at desktop size
		swiperData.pagination = '.swiper-pagination';
    swiperData.paginationClickable = true;
	}

  var mySwiper = new Swiper('.swiper-container', swiperData);
}
