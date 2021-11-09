// use these links to get the state info
var txdotBoundUrl = "https://githubusercontent.com/deldersveld/topojson/blob/080eb96a46307efd0c4a31f4c11ccabeee5e97dd/countries/us-states/TX-48-texas-counties.json";
var gitStatesUrl =  "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json";
var topos = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/TX-48-texas-counties.json"

// Create three layer Groups
var txCounties = L.layerGroup();
var stateLines = new L.layerGroup();
var txTopos = new L.layerGroup()

// Create the tile layers
//Define streetMap, topoMap layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

// Create the baseMap object
var baseMaps = {
    "Street View": street,
    "Topographic View": topo
    
};  

// create the default overlay to add to the baseMap on load
var overlayMaps = {
    "Counties":txCounties,
    "Regional":stateLines,
    "Local Topo":txTopos
};

// create our map, giving it the streetmap and counties on load
var myMap = L.map("map", {
    center: [31.4499, -98.5709],
    zoom: 6,
    layers: [street,txCounties]
});

// Incorporate default baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// create the multi poligon options

function get_full_data(){
    timelineData = {}
    // d3.json("static/data/harris_test.json").then(function(data) {
    d3.json("static/data/peak.json").then(function(data) {
        // console.log("Date: ", data[0]["RecordDateTime"]["$date"]);
        // console.log("Full Data: ", data);
        data.forEach(e => {
            // console.log(e);
            // console.log(e["OutageCountMAX"]);
            if(timelineData[e["RecordDateTime"]["$date"]]===undefined) timelineData[e["RecordDateTime"]["$date"]] = {};
            // if(e['OutageCountMAX']>0) 
            timelineData[e["RecordDateTime"]["$date"]][e["CountyName"]] = {"OutageCountMAX":e['OutageCountMAX'], "TrackedCount":e['TrackedCount']}            
        });
        
    });
    return timelineData;

}

d3.json(txdotBoundUrl).then(function(data) {

    function chooseColor(powerloss) {
        switch(true) {
            case powerloss < 10:
                return "#00ffff";
            case powerloss < 15:
                return "#33cccc";
            default:
                return "#0099cc";
            }
        }
    
    })   
    
    L.json(data, {
        pointToLayer: function(latlng) {
            return L.polygon(latlng,
            {
            color: "#6699ff",
            fillcolor: "#99ccff",
            fillOpacity: 1,
            stroke: true,
            weight: 0.75
            }
        );
    },
    onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>County Name: ${feature.properties.CNTY_NM}</h3><hr><p>Federal Information Processing System (FIPS) Code: ${feature.properties.CNTY_FIPS}</p>`);
            
    }
}).addTo(txCounties);
txCounties.addTo(myMap)