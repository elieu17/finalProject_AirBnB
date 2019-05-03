// create separate overlay layers
var price_layer = new L.LayerGroup();
var crime_layer = new L.LayerGroup();

// Create map function
function createMap(listings) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map": lightmap
  };
  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Price Map": price_layer,
    "Crime Map": crime_layer
  }
  // Creating map object
  var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11,
    layers: [streetmap, price_layer]
  });

  // add layer control to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(price) {
  if (price >= 200) {
    return "Maroon";
  } else if (price >= 175) {
    return "DarkRed";
  } else if (price >= 150) {
    return "Red";
  } else if (price >= 125) {
    return "OrangeRed";
  } else if (price >= 100) {
    return "Orange";
  } else if (price >= 75) {
    return "Yellow";
  } else if (price >= 50) {
    return "YellowGreen";
  } else if (price < 50) {
    return "Green";
  } else {
    return "transparent";
  }
}

// Create map
L.geoJson(gjsonMarkers, {
  style: function(feature){
    return{
      color: "grey",
      fillColor: chooseColor(feature.properties.price),
      fillOpacity: 0.6,
      weight: 1.0  
    };
  },
  // Called on each feature
  onEachFeature: function(feature, layer) {
    // set mouse events to change map styling
    layer.on({
      // mouseover event
      mouseover: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 1
        });
      },
      // mouseout event
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.6
        });
      }
    });
    // pop-up information about neighborhood
    if (feature.properties.price == undefined) {
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>Median Price: N/A</h2>");
    } else {
      layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>Median Price: $" + feature.properties.price + "</h2>");
    }
  }
}).addTo(price_layer);

// send price layer to createMap function
createMap(price_layer);