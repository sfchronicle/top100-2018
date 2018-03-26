require("./lib/social");
require("./lib/leaflet-mapbox-gl");

// setting parameters for the center of the map and initial zoom level
var sf_lat = 37.7749;
var sf_long = -122.4294;
var zoom_deg = 12;//13 zoomed out

// initialize map with center position and zoom levels
var map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
}).setView([sf_lat,sf_long], zoom_deg);

// var gl = L.mapboxGL({
//     accessToken: 'pk.eyJ1IjoiZW1ybyIsImEiOiJjaXl2dXUzMGQwMDdsMzJuM2s1Nmx1M29yIn0._KtME1k8LIhloMyhMvvCDA',
//     style: 'mapbox://styles/emro/cj8bybgjo6muo2rpu8r43ur4z'
// }).addTo(map);

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

// icon for restaurants
var purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

restaurants.forEach(function(d,dIDX){
  var html_str = "<b>"+d.Name+"</b>";
  // var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  marker._icon.classList.add(d.slug);
  map.addLayer(marker);
});

var count;

// searchbar code
$("#mapsearchbar").bind("input propertychange", function () {
  var filterval = $(this).val().toLowerCase().replace(/ /g,'');
  var class_match = 0;
  count = 0;

  $(".map-sidebar").animate({ scrollTop: 0 }, "fast");

  if (filterval != ""){

  $(".restaurant").filter(function() {

    var classes = this.className.split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();

      if ( current_class.match(filterval)) {
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

  if (count != 0){
    $("#no-results").css("display","none");
    $(".scrolly-restaurants").css("padding-top","180px");
  } else {
    $("#no-results").css("display","block");
    $(".scrolly-restaurants").css("padding-top","0px");
  }

  } else {
    $(".restaurant").addClass("active");
    $("#no-results").css("display","none");
    count = restaurants.length;
  }
  console.log(count);

});

document.getElementById("reset-map-button").addEventListener("click",function(){
  console.log("click");
  $(".scrolly-restaurants").css("padding-top","180px");
  $(".map-sidebar").animate({ scrollTop: 0 }, "fast");
  document.getElementById('mapsearchbar').value = "";
  $("#no-results").css("display","none");
  $(".restaurant").addClass("active");
});
