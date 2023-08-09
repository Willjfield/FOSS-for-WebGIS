//https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim
//https://ivansanchez.gitlab.io/gleo/
let map = L.map('map').setView([40.7, -73.9], 11);

//http://maps.stamen.com/#terrain/12/37.7706/-122.3782
//Layer Controls
const baseLayers = {
    terrain: L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    osm: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
}

baseLayers['terrain'].addTo(map);
baseLayers['osm'].addTo(map);

const layerControl = L.control.layers(baseLayers).addTo(map);


//////// Add Marker with popup
const marker = L.marker([
    40.74860435246981, -73.98388941596163]).addTo(map);

marker.bindPopup("<b>CUNY GC</b>");

//////// Add Subways
///https://leafletjs.com/examples/geojson/
///https://axios-http.com/
///Live Server

// const subways = axios('../data/subways.geojson').then(resp => {
//     console.log(resp);
//     L.geoJSON(resp.data, {
//         style: { color: "#ff0000" }
//     }).addTo(map);
// });

//Style subways
const subways = axios('../data/subways.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: function (feature) {
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
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.rt_symbol) {
                layer.bindPopup(feature.properties.rt_symbol);
            }
        }
    }).addTo(map).bringToBack();
});

//Add pizza places
//Set Z Index
const pizza = axios('../data/pizza.geojson').then(resp => {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };

    L.geoJSON(resp.data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    }).addTo(map).bringToFront();

    console.log(resp.data)

    const points = resp.data.features
        .map(f=>new L.LatLng(f.geometry.coordinates[1],f.geometry.coordinates[0]));

    var line = L.polyline(points, {snakingSpeed: 20});
    line.addTo(map).snakeIn();

});

//Walking area
const walking = axios('../data/walk-area.geojson').then(resp => {

    L.geoJSON(resp.data, {
        style: { opacity: 0.95, color: "#000", weight: 2 },
        onEachFeature: function (feature, layer) {
            layer.on({
                click: function(e){
                    const name = e.target.feature.properties.areaName;
                    const dataDiv = document.getElementById('clicked-data');

                    const bills = e.target.feature.properties.bills;

                    dataDiv.innerHTML = 'DATA ON FEATURE:';
                    bills.forEach(bill=>{
                        let text = `<p>${name} has ${bill.name} which would do ${bill.description}</p>`;
                        dataDiv.innerHTML += text;
                    })
                   
                    //const stateBills = arrayOfBills.filter(bill => bill.state === name);
                }
            });
        }
    }).addTo(map).bringToBack();

});

