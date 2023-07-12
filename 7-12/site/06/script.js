//01 Add a map with demo tiles

//https://maplibre.org/maplibre-gl-js/docs/examples/simple-map/
// const map = new maplibregl.Map({
//     container: 'map', // container id
//     style: 'https://demotiles.maplibre.org/style.json', // style URL
//     center: [-73.9205, 40.6803], // starting position [lng, lat]
//     zoom: 9, // starting zoom
//     hash: true
// });

//02 Replace with our own map from maptiler

//Open Maptiler my cloud
//Open "Maps", select your map
//Copy the "use vector style" link

const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i', // style URL
    center: [-73.9205, 40.6803], // starting position [lng, lat]
    zoom: 9, // starting zoom
    hash: true
});

//03 Map events
//https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#events
//https://maplibre.org/maplibre-gl-js/docs/API/classes/maplibregl.Map/#on - Yikes! Why so buried?
//https://docs.mapbox.com/mapbox-gl-js/api/map/#map-events - A little easier to find

// map.once('load',()=>{
//     console.log('loaded!');
// });

// map.once('click',()=>{
//     console.log('clicked!');
// });

// map.on('click',()=>{
//     console.log('clicked!');
// });

//04 Load geojson
//Include Axios
map.once('load', main);

async function main() {
    //Load geojson async/await == .then(...)
    let SchoolGeojson = await axios('../schools.geojson');
    map.addSource('schools-src', {
        'type': 'geojson',
        'data': SchoolGeojson.data
    });

    //https://maplibre.org/maplibre-style-spec/layers/
    map.addLayer({
        'id': 'schools',
        'type': 'circle',
        'source': 'schools-src',
        'layout': {},
        //https://maplibre.org/maplibre-style-spec/layers/#circle
        'paint': {
            'circle-color': '#68f',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white'
        }
    });

    //05 Add Map Events
    addEvents();

}

function addEvents() {
    // Create a popup, but don't add it to the map yet.
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'schools', (e) => {
        //06 Add popups
        //https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-hover/
        
        //console.log(e);
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.SCHOOLNAME;
        const district = e.features[0].properties.DIST_NAME;
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(
            `
            <b>${name}</b>
            <br>
            ${district}
            `
        ).addTo(map);
    });

    map.on('mouseleave', 'schools', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}