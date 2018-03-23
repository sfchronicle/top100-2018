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

restaurants.forEach(function(d){
  var html_str = "<b>"+d.Name+"</b>";
  var marker = L.marker([d.Lat, d.Lng], {icon: purpleIcon}).addTo(map).bindPopup(html_str);
  map.addLayer(marker);
});


console.log(restaurants);
