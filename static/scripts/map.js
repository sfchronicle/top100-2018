require("./lib/social");
require("./lib/leaflet-mapbox-gl");
require("leaflet");

// IMPORTANT: This is the inner height of the window with the bottom toolbar
// If this value is different later, that means it's gone
var initialInnerHeight = window.innerHeight;
var navTimeout = null;

console.log("screen", screen);

// setting parameters for the center of the map and initial zoom level
if ($(window).width() <= 480){
  var sf_lat = 37.779480;
  var sf_long = -122.426623;
  var zoom_deg = 11;//13 zoomed out
  var lat_offset = 0.0055;
} else {
  var sf_lat = 37.825809;
  var sf_long = -122.371562;
  var zoom_deg = 12;//13 zoomed out
  var lat_offset = 0;
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

var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

// var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
// 	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
// 	maxZoom: 16
// }).addTo(map);

// var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 	subdomains: 'abcd',
// 	minZoom: 0,
// 	maxZoom: 18,
// 	ext: 'png'
// }).addTo(map);

// var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 19
// }).addTo(map);

// icon for restaurants
var purpleIcon = new L.Icon({
  iconUrl: '../static/graphics/marker-icon-yellow-white-hole.png',
  // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [12, 32],
  popupAnchor: [-2, -30],
  // shadowSize: [, 41]
});

function clickZoom(e) {
  map.setView(e.target.getLatLng());
}

// Get parent URL from jinja string in meta tag
var parentURL = $('#parentURL').data('url');
// all the markers for the map
var markersArray = [];
// markers for restaurants
restaurants.forEach(function(d,dIDX){
  var photos = d.wcm_img.split(' ');
  var html_str = "<div class='rest-name-popup'>"+d.Name+"</div><div class='rest-img-link-popup'><a href='"+parentURL+d.Slug+"/'><img src='https://s.hdnux.com/photos/72/15/17/"+photos[0]+"/7/premium_landscape.jpg'></div><div class='click-popup'><i class='fa fa-external-link'></i>View restaurant</a></div><div class='click-popup'><a target='_blank' href='https://www.google.com/maps/place/"+d.GoogleAddress+"/'><i class='fa fa-compass'></i>Get directions</a></div>";
  if (screen.width <= 480){
      var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  } else {
      var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
  }
  if (d.OtherLat){
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[0];
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[0];
  } else {
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").replace(","," ").toLowerCase();
  }
  var class_str = " "+d.Slug+ " "+regionstring+" "+subregionstring+" "+d.Cuisine.replace(/ /g,'').toLowerCase()+" active";
  marker._icon.className += class_str;
  map.addLayer(marker);
  markersArray.push(marker);
});

// markers for restaurants with two locations
restaurants.forEach(function(d,dIDX){
  if (d.OtherLat){
    var photos = d.wcm_img.split(' ');
    var html_str = "<div class='rest-name-popup'>"+d.Name+"</div><div class='rest-img-link-popup'><a href='"+parentURL+d.slug+"' target='_blank'><img src='https://s.hdnux.com/photos/72/15/17/"+photos[0]+"/7/premium_landscape.jpg'></div><div class='click-popup'><i class='fa fa-external-link'></i>View restaurant</a></div>";
    if (screen.width <= 480){
      var marker = L.marker([d.OtherLat,d.OtherLng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
    } else {
      var marker = L.marker([d.OtherLat,d.OtherLng], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
    }
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[1];
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[1];
    var class_str = " "+d.Slug+ " "+regionstring+" "+subregionstring+" "+d.Cuisine.replace(/ /g,'').toLowerCase()+" active";
    marker._icon.className += class_str;
    map.addLayer(marker);
    markersArray.push(marker);
  }
});

// markers for restaurants with two locations
restaurants.forEach(function(d,dIDX){
  if (d.OtherOtherLat){
    var photos = d.wcm_img.split(' ');
    var html_str = "<div class='rest-name-popup'>"+d.Name+"</div><div class='rest-img-link-popup'><a href='"+parentURL+d.slug+"' target='_blank'><img src='https://s.hdnux.com/photos/72/15/17/"+photos[0]+"/7/premium_landscape.jpg'></div><div class='click-popup'><i class='fa fa-external-link'></i>View restaurant</a></div>";
    if (screen.width <= 480){
      var marker = L.marker([d.OtherOtherLat,d.OtherOtherLng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
    } else {
      var marker = L.marker([d.OtherOtherLat,d.OtherOtherLng], {icon: purpleIcon}).addTo(map).bindPopup(html_str).on("click",clickZoom);
    }
    var regionstring = d.Region.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[2];
    var subregionstring = d.SubRegion.replace(/ /g,'').replace("/"," ").toLowerCase().split(",")[2];
    var class_str = " "+d.Slug+ " "+regionstring+" "+subregionstring+" "+d.Cuisine.replace(/ /g,'').toLowerCase()+" active";
    marker._icon.className += class_str;
    map.addLayer(marker);
    markersArray.push(marker);
  }
});

var count;

// searchbar code
if ($(window).width() <= 480){
  $("#mapsearchbar").on("focus", function(){
    hideMobileMap();
  });
}

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
    $("#map").addClass("smallmap");
    $("#stick-me").addClass("smallmap");
    $(".map-sidebar").addClass("smallmap");

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

    $("#stick-me").removeClass("smallmap");
    $("#map").removeClass("smallmap");
    $(".map-sidebar").removeClass("smallmap");

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

  $("#stick-me").removeClass("smallmap");
  $("#map").removeClass("smallmap");
  $(".map-sidebar").removeClass("smallmap");

  revealMobileMap();

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
        var slug = '#'+$(this).data('slug');

        if ($(window).width() <= 480){
          // If it's a small window, reload it
          window.location.href = document.location.protocol +"//"+ document.location.host + document.location.pathname + slug;
          window.location.reload();
        } else {
          // If it's a big window, reset it
          var IDX = _td.id.split("map-locator-")[1];
          map.setView([+restaurants[IDX].Lat+lat_offset,restaurants[IDX].Lng],14);
          markersArray[IDX].openPopup();
          
          history.replaceState(null, null, slug);

          $("#stick-me").removeClass("smallmap");
          $("#map").removeClass("smallmap");
          $(".map-sidebar").removeClass("smallmap");
        }
      });
    })(td);
  }
}

// see if the reader is loading a specific restaurant
$(document).ready(function(){
  //Start by revealing mobile map
  revealMobileMap();
  // Now get hash
  findByHash();
});

function findByHash() {
  console.log("FIND ME!");
  if(window.location.hash) {
    for (var idx=0; idx<restaurants.length; idx++){
      if (window.location.hash.split("#")[1] == restaurants[idx].Slug){
        map.setView([+restaurants[idx].Lat+lat_offset,restaurants[idx].Lng],14);
        markersArray[idx].openPopup();
      }
    }
  }
}

function hideMobileMap() {
  if ($(window).width() <= 480){
    $(".map-container").hide();
    $(".map-sidebar").animate({"margin-top": "0px"});
    $("#stick-me").animate({"top": "-50px"});
    $('html, body').animate({ scrollTop: 0 }, "fast").css("overflow-y", "auto");

    // Remove timeout that might have been set to position search bar
    clearTimeout(navTimeout);
    navTimeout = null;
  }
}

function revealMobileMap() {
  if ($(window).width() <= 480){
    var offset = 100;
    var specialiOSoffset = 0;
    var ua = window.navigator.userAgent;
    var webkit;
    var iOSSafari;
    $('html, body').css("overflow-y", "hidden");
    // If this is iOS, account for that awful bar on the bottom
    var iOS = /(iPad|iPhone|iPod)/g.test(ua);
    if (iOS){
      // If the above condition is true, that means we still have the bottom bar
      // Now check for Safari also
      webkit = !!ua.match(/WebKit/i);
      iOSSafari = webkit && !ua.match(/CriOS/i);

      if (iOSSafari){
        specialiOSoffset = 70;
        offset += specialiOSoffset;

        // If we have to deal with mobile Safari, keep a timeout watching for the bottom nav
        clearTimeout(navTimeout);
        navTimeout = setTimeout(revealMobileMap, 1000);

        // If the initial does not match the current, that means the map needs more space
        if (initialInnerHeight != window.innerHeight){
          offset -= (window.innerHeight-initialInnerHeight);
        }
      }
    } 

    // Actually modify the DOM so everything looks nice
    var scrollHeight = $(window).height()-offset;    
    $('html, body').animate({ scrollTop: 0 }, "fast", function(){
      // Only call callback if the timeout is waiting to be fired
      // Or if this is not iOSSafari
      if (!iOSSafari || navTimeout != null){
        $(".map-container").show().find("#map").css("height", "calc(100vh - "+offset+"px)");
        $(".map-sidebar").css({"margin-top": scrollHeight+70});
        $("#stick-me").css({"top": scrollHeight+specialiOSoffset});
      }
    });
  }
}

// locat restaurant on map and update the hash in URL
$(".img-link-map").on("click", function(){
  $(this).parent().find(".map-locator").click();
});

// locat restaurant on map and update the hash in URL
$(".name .info").on("click", function(){
  $("#mapsearchbar").val($(this).text()).trigger("input");
});


// Enable nav
if ($(window).width() < 666) {
  $('.landing-nav').removeClass("active");
  $('#landing-mobile-nav').addClass("active").css("pointer-events", "auto");
} else {
  $('.landing-nav').css("pointer-events", "auto");
}
