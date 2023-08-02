const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');

const map = new maplibregl.Map({
    container: 'map', // container id
    style: "../class-style.json",
    hash: true,
    center: [-73.9536, 40.748], // starting position
    zoom: 12 // starting zoom
});



map.once('load', () => {
    map.addSource('historical-nyc-src', {
        "type": "image",
        "url": "../historical-maps-of-manhattan.jpg",
        "coordinates": [
            [-73.99816, 40.84100],
            [-73.87625, 40.79040],
            [-73.96897, 40.67443],
            [-74.08249, 40.72430]
        ]
    });

    map.addLayer({
        'id': 'nyc',
        'source': 'historical-nyc-src',
        'type': 'raster'
    });

    slider.addEventListener('input', (e) => {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty(
            'nyc',
            'raster-opacity',
            parseInt(e.target.value, 10) / 100
        );

        // Value indicator
        sliderValue.textContent = e.target.value + '%';
    });

    let distancePnts = [];
    let markers = [];

    map.on('click', (e) => {
        if(markers.length > 1){
            markers.forEach(m=>m.remove());
            markers = [];
        }
        
        markers.push(new maplibregl.Marker()
            .setLngLat(e.lngLat)
            .addTo(map));
        distancePnts.push(turf.point([e.lngLat.lng,e.lngLat.lat]))
        if(distancePnts.length < 2) return;
        let options = { units: 'miles' };
        let distance = turf.distance(distancePnts[0], distancePnts[1], options);
        console.log(distance);
        distancePnts = [];
        
    });
});




