require("./lib/social");
require("./lib/leaflet-mapbox-gl");
require("leaflet");

// setting parameters for the center of the map and initial zoom level
if (screen.width <= 480){
  var sf_lat = 37.779480;
  var sf_long = -122.426623;
  var zoom_deg = 11;//13 zoomed out
} else {
  var sf_lat = 37.825809;
  var sf_long = -122.371562;
  var zoom_deg = 12;//13 zoomed out
}

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

// var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 20,
// 	ext: 'png'
// }).addTo(map);

// var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
// 	maxZoom: 16
// }).addTo(map);

var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
}).addTo(map);

// var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 19
// }).addTo(map);

// icon for restaurants
var purpleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

function clickZoom(e) {
    map.setView(e.target.getLatLng());
}

// all the markers for the map
var markersArray = [];

// markers for restaurants
restaurants.forEach(function(d,dIDX){
  var photos = d.wcm_img.split(' ');
  var html_str = "<div class='rest-name-popup'>"+d.Name+"</div><div class='rest-img-link-popup'><a href='../"+d.slug+"' target='_blank'><img src='https://s.hdnux.com/photos/72/15/17/"+photos[0]+"/7/premium_landscape.jpg'></div><div class='click-popup'><i class='fa fa-external-link'></i>Read the review</a></div>";
  if (screen.width <= 480){
      var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  } else {
      var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
  }
  if (d.OtherLocationAddress){
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[0];
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[0];
  } else {
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
  }
  var class_str = " "+d.slug+ " "+regionstring+" "+subregionstring+" "+d.Cuisine.replace(/ /g,'').toLowerCase()+" active";
  marker._icon.className += class_str;
  map.addLayer(marker);
  markersArray.push(marker);
});

// markers for restaurants with two locations
var stupid_var = 0;
// NEED TO UPDATE THIS ----------------------------------------------------------------------------------------------------
restaurants.forEach(function(d,dIDX){
  if (d.OtherLocationAddress){
    console.log("WE HAVE A DOUBLE ADDRESS");
    console.log(d.Name);
    var photos = d.wcm_img.split(' ');
    var html_str = "<div class='rest-name-popup'>"+d.Name+"</div><div class='rest-img-link-popup'><a href='../"+d.slug+"' target='_blank'><img src='https://s.hdnux.com/photos/72/15/17/"+photos[0]+"/7/premium_landscape.jpg'></div><div class='click-popup'><i class='fa fa-external-link'></i>Read the review</a></div>";
    if (screen.width <= 480){
        var marker = L.marker([37.764403+0.002*stupid_var,-122.356585+0.002*stupid_var], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
    } else {
        var marker = L.marker([37.764403+0.002*stupid_var,-122.356585+0.002*stupid_var], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
    }
    if (d.OtherLocationAddress){
      var regionstring = d.Region.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[1];
      var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[1];
    } else {
      var regionstring = d.Region.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
      var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
    }
    var class_str = " "+d.slug+ " "+regionstring+" "+subregionstring+" "+d.Cuisine.replace(/ /g,'').toLowerCase()+" active";
    marker._icon.className += class_str;
    map.addLayer(marker);
    markersArray.push(marker);
    stupid_var ++;
  }
});
// NEED TO UPDATE THIS ----------------------------------------------------------------------------------------------------


var count;

// searchbar code
$("#mapsearchbar").bind("input propertychange", function () {
  var filterval = $(this).val().toLowerCase().replace(/ /g,'');
  console.log(filterval);
  var class_match = 0;
  count = 0;

  // $(".scrolly-restaurants").animate({ scrollTop: 0 }, "fast");
  // $(".map-sidebar").animate({ scrollTop: 0 }, "fast");
  // $(window).animate({ scrollTop: 0 }, "fast");
  $('html, body').animate({ scrollTop: 0 }, "fast");

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

  $(".leaflet-marker-icon").filter(function() {

    var classes = this.className.split(" ");
    for (var i=0; i< classes.length; i++) {

      var current_class = classes[i].toLowerCase();

      if ( current_class.match(filterval)) {
        class_match = class_match + 1;
      }
    }

    if (class_match > 0) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
    class_match = 0;

  });

  console.log(count);

  if (count != 0){
    $("#no-results").css("display","none");
    // $(".scrolly-restaurants").css("padding-top","220px");
    $(".num-results").addClass("active");
    if (count == 1){
      document.getElementById("num-results-search").innerHTML = "is 1 result";
    } else {
      document.getElementById("num-results-search").innerHTML = "are "+count+" results";
    }
  } else {
    $("#no-results").css("display","block");
    // $(".scrolly-restaurants").css("padding-top","0px");
    $(".num-results").removeClass("active");
  }

  } else {
    $(".map-restaurant").addClass("active");
    $(".leaflet-marker-icon").addClass("active");

    $("#no-results").css("display","none");
    count = restaurants.length;
    $(".num-results").removeClass("active");
  }

});

document.getElementById("reset-map-button").addEventListener("click",function(){
  console.log("click");
  // $(".scrolly-restaurants").css("padding-top","220px");

  $('html, body').animate({ scrollTop: 0 }, "fast");

  document.getElementById('mapsearchbar').value = "";

  $(".map-restaurant").addClass("active");
  $(".leaflet-marker-icon").addClass("active");

  $("#no-results").css("display","none");
  $(".num-results").removeClass("active");
  map.setView([sf_lat,sf_long], zoom_deg);
});

var locatorList = document.getElementsByClassName("map-locator");
var td;
for (var t = 0; t < locatorList.length; t++){
  td = locatorList[t];
  if (typeof window.addEventListener === 'function'){
    (function (_td) {
      td.addEventListener('click', function(){
        var IDX = _td.id.split("map-locator-")[1];//_td.classList[0].split("day")[1];
        map.setView([restaurants[IDX].Lat,restaurants[IDX].Lng],14);
        markersArray[IDX].openPopup();
      });
    })(td);
  }
}
