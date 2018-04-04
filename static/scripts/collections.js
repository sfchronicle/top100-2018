
document.getElementById("sf-region").addEventListener("click",function(){
  $(".region-button").removeClass("active");
  $(".subregion-button").removeClass("active");
  $(".subregions-container").removeClass("active");
  document.getElementById("sf-region").classList.add("active");
  document.getElementById("sf-subregions").classList.add("active");
});

document.getElementById("northbay-region").addEventListener("click",function(){
  $(".region-button").removeClass("active");
  $(".subregion-button").removeClass("active");
  $(".subregions-container").removeClass("active");
  document.getElementById("northbay-region").classList.add("active");
  document.getElementById("northbay-subregions").classList.add("active");
});

document.getElementById("southbay-region").addEventListener("click",function(){
  $(".region-button").removeClass("active");
  $(".subregion-button").removeClass("active");
  $(".subregions-container").removeClass("active");
  document.getElementById("southbay-region").classList.add("active");
  document.getElementById("southbay-subregions").classList.add("active");
});

document.getElementById("eastbay-region").addEventListener("click",function(){
  $(".region-button").removeClass("active");
  $(".subregion-button").removeClass("active");
  $(".subregions-container").removeClass("active");
  document.getElementById("eastbay-region").classList.add("active");
  document.getElementById("eastbay-subregions").classList.add("active");
});
