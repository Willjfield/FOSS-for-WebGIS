console.log('loaded');

let map = L.map('map').setView([40.7, -73.7], 11);

let basemap_urls = {
    toner:"https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
    osm:'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
}

L.tileLayer(basemap_urls.toner, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([40.74860435246981, -73.98388941596163]).addTo(map);

const message ="hello!";

marker.bindPopup(`<b>CUNY GC</b> ${message}`);

axios('https://raw.githubusercontent.com/Willjfield/FOSS-for-WebGIS/main/6-21/site/data/subways.geojson').then(resp => {
    console.log(resp.data)
    L.geoJSON(resp.data,{
        style: function(feature){
            switch (feature.properties.rt_symbol) {
                case 'A': case 'C': case 'E': return { color: "blue" };
                case 'B': case 'M': case 'D': return { color: "orange" };
                case 'N': case 'Q': case 'R': case 'W': return { color: "yellow" };
                case '1': case '2': case '3': return { color: "red" };
                case 'J': case 'Z': return { color: "brown" };
                case '4': case '5': case '6': return { color: "green" };
                case '7': return { color: "purple" };
                case 'G': return { color: "lightgreen" };
                case 'S': case 'L': return { color: "gray" };
                default: return { color: "black" };


            }
        }
    }).addTo(map).bringToBack();
})

axios('https://raw.githubusercontent.com/Willjfield/FOSS-for-WebGIS/main/6-21/site/data/pizza.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#555",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };

    L.geoJSON(resp.data,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map).bringToFront();
})