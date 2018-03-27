require("./lib/social");
require("./lib/leaflet-mapbox-gl");

// setting parameters for the center of the map and initial zoom level
var sf_lat = 37.825809;
var sf_long = -122.371562;
var zoom_deg = 12;//13 zoomed out

// initialize map with center position and zoom levels
var map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
}).setView([sf_lat,sf_long], zoom_deg);

L.control.zoom({
     position:'bottomleft'
}).addTo(map);

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

function clickZoom(e) {
    map.setView(e.target.getLatLng());
}

restaurants.forEach(function(d,dIDX){
  var html_str = "<b>"+d.Name+"</b>";
  // var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
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

  $(".map-restaurant").filter(function() {

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
    $(".scrolly-restaurants").css("padding-top","220px");
    $(".num-results").addClass("active");
    if (count == 1){
      document.getElementById("num-results-search").innerHTML = "is 1 result";
    } else {
      document.getElementById("num-results-search").innerHTML = "are "+count+" results";
    }
  } else {
    $("#no-results").css("display","block");
    $(".scrolly-restaurants").css("padding-top","0px");
    $(".num-results").removeClass("active");
  }

  } else {
    $(".map-restaurant").addClass("active");
    $("#no-results").css("display","none");
    count = restaurants.length;
    $(".num-results").removeClass("active");
  }

});

document.getElementById("reset-map-button").addEventListener("click",function(){
  console.log("click");
  $(".scrolly-restaurants").css("padding-top","220px");
  $(".map-sidebar").animate({ scrollTop: 0 }, "fast");
  document.getElementById('mapsearchbar').value = "";
  $("#no-results").css("display","none");
  $(".map-restaurant").addClass("active");
  $(".num-results").removeClass("active");
  map.setView([sf_lat,sf_long], zoom_deg);
});

var locatorList = document.getElementsByClassName("map-locator");
console.log(restaurants);
// var lIDX;
for (var ll=0; ll<locatorList.length; ll++){
  // var lIDX = ll;
  locatorList[ll].addEventListener("click",function(l){
    // console.log(lIDX);
    console.log("click");
    console.log($("."+l.target.id.split("map-locator-")[1]))
    $("."+l.target.id.split("map-locator-")[1]).css("height","100px");
    console.log($("."+l.target.id.split("map-locator-")[1]))
    // console.log(maptarget[0]);

    // map.setView([restaurants[lIDX].Lat,restaurants[lIDX].Lng],14);
    // map.setView(e.target.getLatLng(),12);
  })
};

// var td;
// for (var t = 0; t < locatorList.length; t++){
//     td = locatorList[t];
//     console.log(t);
//     if (typeof window.addEventListener === 'function'){
//         (function (_td) {
//             td.addEventListener('click', function(){
//                 var IDX = t;//_td.classList[0].split("day")[1];
//                 console.log(_td);
//                 console.log(IDX);
//                 console.log("click");
//             });
//         })(td);
//     }
// }
