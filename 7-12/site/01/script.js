//01 Add a map with demo tiles

//https://maplibre.org/maplibre-gl-js/docs/examples/simple-map/
const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [-73.9205, 40.6803], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true
});
