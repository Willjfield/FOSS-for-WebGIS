let map = L.map('map').setView([40.7, -73.9], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//////// Add Marker with popup
const marker = L.marker([
    40.74860435246981, -73.98388941596163]).addTo(map);

marker.bindPopup("<b>CUNY GC</b>");

//////// Add Subways
///https://leafletjs.com/examples/geojson/
///https://axios-http.com/
///Live Server

const subways = axios('../data/subways.geojson').then(resp => {
    console.log(resp);
    L.geoJSON(resp.data, {
        style: { color: "#ff0000" }
    }).addTo(map);
});

