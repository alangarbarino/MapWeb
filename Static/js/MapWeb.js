function createMap() {

    console.log("entering CreateMap")

    //Create base layer that will be the map background

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 8,
        minZoom: 2,
        id: "mapbox.light",
        Bounds: [[85, -180],[-85, 180]],
        maxBoundsViscosity: 1,
        accessToken: API_KEY
    });

    var eqLayer = L.geoJSON();

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold overlay layers
    var overlayMaps = {

    };

    // Create the map object with default options
    map = L.map("map", {
        center: [38.381266, -97.922211],
        zoom: 3,
        layers: [lightmap,]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);

//********************************************* //
    // Get legend colors

    function getColor(d) {
        return d > 5  ? 'red' :
               d > 4  ? 'salmon' :
               d > 3  ? 'orange' :
               d > 2  ? 'yellow' :
               d > 1  ? 'lightgreen' :
                        'white' ;
    }
//********************************************* //

    // Add legend to map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        magLimits = [0, 1, 2, 3, 4, 5],
        labels = [];

        for (var i = 0; i < magLimits.length; i++) {
            var colors = getColor(magLimits[i] + 0.1) ;
            
            '<i class = "square" style = "background":' + colors + '"></i> ' +
            magLimits[i] + (magLimits[i + 1] ? '&ndash;' + magLimits[i + 1] + '<br>' : '+');

        labels.push(
        '<i style="background:' + colors + '"></i> ' +
        magLimits[i] + (magLimits[i + 1] ? '&ndash;' + magLimits[i + 1]: '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);

    //     // loop through our density intervals and generate a label with a colored square
    //     for (var i = 0; i < magLimits.length; i++) {
    //         div.innerHTML += 
    //             '<i class = "circle" style="background:' + getColor(magLimits[i] + 0.1) + '"></i> ' +
    //             magLimits[i] + (magLimits[i + 1] ? '&ndash;' + magLimits[i + 1] + '<br>' : '+');
    // }            
    

    // call update layer function to retrieve and write earthquake data to map
    updateEqLayer();
};

// ********************************************* //
function updateEqLayer() {
    console.log("entering updateEqLayer")

    // Get earthquake data and log to console
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`;
    d3.json(url, function (eqData) {
        var pprint = JSON.stringify(eqData, null, 2); // spacing level = 2
        console.log(pprint);

        // call getLayer function to build markers and place on map
        getLayer(eqData);

    });
}

// ********************************************* //
function getLayer(eqData) {

    L.geoJSON(eqData, {
        // call function to bind popup information 
        onEachFeature: onEachFeature, 
        pointToLayer: function (feature, latlng) {
            // call updateIcon function to style marker based on magnitude
            markerStyle = updateIcon(feature.properties.mag);
            return L.circleMarker(latlng, markerStyle);
        }
    }).addTo(map);
}

// ********************************************* //
// bind popup
function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.title);
}   

// ********************************************* //
function updateIcon(magnitude){

    switch (true) {
        case (magnitude > 5): 
                return {
                radius: 13,
                fillColor: "red",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }  
            break;

        case (magnitude > 4): 
                return {
                radius: 11,
                fillColor: "salmon",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }
            break;

        case (magnitude > 3): 
                return {
                radius: 9,
                fillColor: "orange",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }
            break;

        case (magnitude > 2): 
                return {
                radius: 7,
                fillColor: "yellow",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }
            break;

            case (magnitude > 1): 
                return {
                radius: 5,
                fillColor: "lightgreen",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
                }
                console.log("entering mag 1") ;
            break;

        default: 
                return {
                radius: 3,
                fillColor: "white",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
    };
}

// ********************************************* //
// JS entry point, call createMap function to build base map
    createMap();

