// create separate overlay layers
var price_layer = new L.LayerGroup();
var neighborhood_layer = new L.LayerGroup();
var assault = new L.LayerGroup();
var burglary = new L.LayerGroup();
var drugs = new L.LayerGroup();
var larceny = new L.LayerGroup();


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
    "Neighborhoods": neighborhood_layer,
    "Assaults": assault,
    "Burglaries": burglary,
    "Drug-related": drugs,
    "Larceny": larceny
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

//Just Neighborhoods
L.geoJson(gjsonMarkers, {
  style: function(){
    return{
      color: "grey",
      fillOpacity: 0.2,
      weight: 3.0  
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
    layer.bindPopup("<h1>" + feature.properties.neighborhood);
  }
}).addTo(neighborhood_layer);

// send price layer to createMap function
createMap(price_layer);

//ASSAULT
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "JSON_Files/Assault2018.json", false);
xhReq.send(null);
var assault_loc = JSON.parse(xhReq.responseText);
console.log(assault_loc);
var assaultMarkers = [];
for (var i = 0; i < assault_loc.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  assaultMarkers.push(
    L.circle(assault_loc[i].Lat_Lng,{
      stroke: true,
      fillOpacity: 0.75,
      color: "purple",
      fillColor: "purple",
    })
      .bindPopup("<h1> OFFENSE:" + assault_loc[i].OFNS_DESC + "</h1> <hr> <h3>TYPE: " + assault_loc[i].LAW_CAT_CD + "</h3>" +"</h1> <hr> <h3>BORO: " + assault_loc[i].BORO_NM + "</h3>" +"</h1> <hr> <h3>NYPD PRECINCT: " + parseInt(assault_loc[i].ADDR_PCT_CD) + "</h3>")
      .addTo(assault)
      );
} 
  
//BURGLARY
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "JSON_Files/Burglary2018.json", false);
xhReq.send(null);
var burglary_loc = JSON.parse(xhReq.responseText);
console.log(burglary_loc);
var burglaryMarkers = [];
for (var i = 0; i < burglary_loc.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  burglaryMarkers.push(
    L.circle(burglary_loc[i].Lat_Lng,{
      stroke: false,
      fillOpacity: 0.75,
      color: "red",
      fillColor: "red",
    })
      .bindPopup("<h1> OFFENSE:" + burglary_loc[i].OFNS_DESC + "</h1> <hr> <h3>TYPE: " + burglary_loc[i].LAW_CAT_CD + "</h3>" +"</h1> <hr> <h3>BORO: " + burglary_loc[i].BORO_NM + "</h3>" +"</h1> <hr> <h3>NYPD PRECINCT: " + parseInt(burglary_loc[i].ADDR_PCT_CD) + "</h3>")
      .addTo(burglary)
  );
}

//DRUG-RELATED CRIMES
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "JSON_Files/Drugs2018.json", false);
xhReq.send(null);
var drugs_loc = JSON.parse(xhReq.responseText);
console.log(drugs_loc);
var drugsMarkers = [];
for (var i = 0; i < drugs_loc.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  drugsMarkers.push(
    L.circle(drugs_loc[i].Lat_Lng,{
      stroke: false,
      fillOpacity: 0.75,
      color: "blue",
      fillColor: "blue",
    })
    .bindPopup("<h1> OFFENSE:" + drugs_loc[i].OFNS_DESC + "</h1> <hr> <h3>TYPE: " + drugs_loc[i].LAW_CAT_CD + "</h3>" +"</h1> <hr> <h3>BORO: " + drugs_loc[i].BORO_NM + "</h3>" +"</h1> <hr> <h3>NYPD PRECINCT: " + parseInt(drugs_loc[i].ADDR_PCT_CD) + "</h3>")
    .addTo(drugs)
  );
}

//LARCENY
var xhReq = new XMLHttpRequest();
xhReq.open("GET", "JSON_Files/Larceny2018.json", false);
xhReq.send(null);
var larceny_loc = JSON.parse(xhReq.responseText);
console.log(larceny_loc);
var larcenyMarkers = [];
for (var i = 0; i < larceny_loc.length; i++) {
  // Setting the marker radius for the state by passing population into the markerSize function
  larcenyMarkers.push(
    L.circle(larceny_loc[i].Lat_Lng,{
      stroke: false,
      fillOpacity: 0.75,
      color: "green",
      fillColor: "green",
    })
    .bindPopup("<h1> OFFENSE:" + larceny_loc[i].OFNS_DESC + "</h1> <hr> <h3>TYPE: " + larceny_loc[i].LAW_CAT_CD + "</h3>" +"</h1> <hr> <h3>BORO: " + larceny_loc[i].BORO_NM + "</h3>" +"</h1> <hr> <h3>NYPD PRECINCT: " + parseInt(larceny_loc[i].ADDR_PCT_CD) + "</h3>")
    .addTo(larceny)
  );
}

