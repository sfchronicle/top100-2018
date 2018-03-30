require("./lib/social");

console.log("RUNNING MAIN");

// Slider
if($('.swiper-slide').length === 1){
  $('.swiper-pagination').css('display', 'none');
} else {
  var mySwiper = new Swiper ('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true
  });
}
