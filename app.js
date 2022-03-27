var L = window.L;
var MQ = window.MQ;

// default map layer
let map = L.map("map", {
  layers: MQ.mapLayer(),
  zoom: 10,
  maxZoom: 18,
  minZoom: 3
}).locate({ setView: true, maxZoom: 16 });

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "akorejwo/ckxoocmbp3gds14odme1jp69f",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoiYWtvcmVqd28iLCJhIjoiY2t3eGJvdGx3MGJ1azJ3cXRyZzVsYXJrNCJ9.pUQUacBihQdnkQVE7AcDww"
  }
).addTo(map);

const loc1 = [];
const userLoc = [];

let start = userLoc; //document.getElementById("start").value;
let end = loc1;

/* locating user */
function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng, { icon: userIcon })
    .addTo(map)
    .bindPopup("You are within " + radius + " meters from this point");
  //.openPopup();

  L.circle(e.latlng, radius).addTo(map);

  userLoc.push(e.latlng.lat, e.latlng.lng);
  loc1.push(e.latlng.lat + 1.012, e.latlng.lng - 0.02);
}

map.on("locationfound", onLocationFound);

function onLocationError(e) {
  alert(e.message);
}

map.on("locationerror", onLocationError);

var userIcon = L.icon({
  iconUrl: "img/me.svg",

  iconSize: [20], // size of the icon
  iconAnchor: [10, 10],
  shadowSize: [50, 64], // size of the shadow
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

/* Gas station locations */
// geojson files
var gasIcon = L.icon({
  iconUrl: "img/gas-pump.png",
  iconAnchor: [25, 20],
  iconSize: [50], // size of the icon
  popupAnchor: [0, -20]
});

var gasStationsLoc = L.geoJson(gasStations, {
  pointToLayer: function (feature, latlng) {
    return new L.marker(latlng, {
      iconUrl: "img/gas-pump.png",
      radius: 15,
      fillOpacity: 1
    });
  }
}).addTo(map);

/* looking for gas stations in a radius */
var inRange = [];

function panicFunction() {
  var statRadius = 1000;
  var inRange = [];
  var j = 0;
  console.log("PANIC");

  var a = 1,
    b = 0,
    temp;

  while (inRange.length < 1) {
    L.circle(userLoc, statRadius).addTo(map);

    j = 0;

    while (j < gasStations.features.length) {
      var coordsX = gasStations.features[j].geometry.coordinates[1];
      var coordsY = gasStations.features[j].geometry.coordinates[0];
      var coords = [coordsX, coordsY];

      if (userLoc.length === 0) {
        console.log("problem with location - refresh");
      }

      const userLatLng = L.latLng(userLoc);
      const stationLatLng = L.latLng(coords);

      var dUserGas = userLatLng.distanceTo(stationLatLng);

      if (dUserGas < statRadius) {
        distGas = [{ ID: j, dist: dUserGas, coords: coords }];
        inRange.push(distGas);
      }

      j++;
    }

    temp = a;
    a = a + b;
    b = temp;

    statRadius += a * 100;

    if (inRange.length > 0) {
      break;
    }
  }

  if (inRange.length > 0) {
    const closest = inRange.reduce((acc, loc) =>
      acc.distance < loc.distance ? acc : loc
    );
    closestID = closest[0].ID;
    console.log(closestID);

    for (let i = 0; i < inRange.length; i++) {
      if (closestID == inRange[i][0].ID) {
        console.log(inRange[i][0].coords);

        L.marker(inRange[i][0].coords, { icon: gasIcon }).addTo(map);
      }
    }
  }
}

/* pathfinding */
/*
function runDirection(start, end) {
  // recreating new map layer after removal

  map = L.map("map", {
    layers: MQ.mapLayer(),
    zoom: 10,
    maxZoom: 18,
    minZoom: 3
  }).locate({ setView: true, maxZoom: 16 });

  var dir = MQ.routing.directions();
  start = L.latLng(userLoc);
  end = gasStations.features[4].coordinates;

  dir.route({
    locations: [start, end]
  });

  console.log(dir);

  CustomRouteLayer = MQ.Routing.RouteLayer.extend({
    createStartMarker: (location) => {
      var custom_icon;
      var marker;

      custom_icon = L.icon({
        iconUrl: "img/red.png",
        iconSize: [20, 29],
        iconAnchor: [10, 29],
        popupAnchor: [0, -29]
      });

      marker = L.marker(start, { icon: custom_icon }).addTo(map);

      return marker;
    },

    createEndMarker: (location) => {
      var custom_icon;
      var marker;

      custom_icon = L.icon({
        iconUrl: "img/blue.png",
        iconSize: [20, 29],
        iconAnchor: [10, 29],
        popupAnchor: [0, -29]
      });

      marker = L.marker(end, { icon: custom_icon }).addTo(map);

      return marker;
    }
  });

  map.addLayer(
    new CustomRouteLayer({
      directions: dir,
      fitBounds: true
    })
}
*/
/*
// function that runs when form submitted
function submitForm(event) {
  event.preventDefault();

  // delete current map layer
  map.remove();

  // getting form data
  //start = userLoc; //document.getElementById("start").value;
  //end = loc1; //document.getElementById("destination").value;

  // run directions function
  runDirection(start, end);

  // reset form
  document.getElementById("form").reset();
}

// asign the form to form variable
const form = document.getElementById("form");

// call the submitForm() function when submitting the form
form.addEventListener("submit", submitForm);

console.log(locations);
*/
