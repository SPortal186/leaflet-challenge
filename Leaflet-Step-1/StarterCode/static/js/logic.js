var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(JSON.stringify(queryUrl));
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features);
});

function markerSize(mag){
    return mag * 3;
}
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "rgb(240,107,107)";
        case depth > 70:
            return "rgb(240,167,107)";
        case depth > 50:
            return "rgba(243,186,77)";
        case depth > 30:
            return "rgba(243,219,77)";
        case depth > 10:
            return "rgba(225,243,77)";
        default:
            return "rgba(183,243,77)";
    }
}
function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function popUp(feature, layer){
    layer.bindPopup("<h3>Place: " + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  function marker(feature, location){
    var earthMark = {
      stroke: true,
      fillOpacity: 1,
      color: "#000000",
      weight: 1,
      radius: markerSize(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2])
    }

    return L.circleMarker(location, earthMark);

  }
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: popUp,
    pointToLayer: marker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var grayscaleMap = L.tileLayer('https://maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png', {
  attribution: '&copy; 2022 &middot; <a href="https://maps.omniscale.com/">Omniscale</a> ' +
  '&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 14,
  id: API_KEY
 

  });
  

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      32.09, -115.71
    ],
    zoom: 5
  });
    grayscaleMap.addTo(myMap); 
    earthquakes.addTo(myMap);
  

  // Set Up Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"), 
  magLevels = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < magLevels.length; i++) {
      div.innerHTML +=
          '<i class="square" style="background: ' + getColor(magLevels[i] + 1) + '"></i> ' + magLevels[i] + (magLevels[i + 1] ? '&ndash;' + magLevels[i + 1] + '<br>' : '+');
      }
  return div;
};
legend.addTo(myMap);

}
