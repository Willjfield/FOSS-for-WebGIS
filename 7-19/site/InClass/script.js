let map = new maplibregl.Map({
    container: 'map',
    center: [-73.9536, 40.748],
    zoom: 13,
    style: "../in-class-7-19.json",
    hash: true,
    // transformRequest: (url, resourceType)=> {
    //   if(resourceType === 'Source' && url.startsWith('http://myHost')) {
    //     return {
    //      url: url.replace('http', 'https'),
    //      headers: { 'my-custom-header': true},
    //      credentials: 'include'  // Include cookies for cross-origin requests
    //    }
    //   }
    // }
});

map.once("load", () => {
    let markers =[];
    let coordinates =[];
    map.on("click",(e)=>{

        if(coordinates.length > 1) coordinates = [];

        coordinates.push(turf.point([e.lngLat.lng,e.lngLat.lat]));
        if(coordinates.length === 2){
            var distance = turf.distance(coordinates[0], coordinates[1], {units:'miles'});
            console.log(distance)
        }


    });
    
    map.addSource('nyc-src', {
        "type": "image",
        "url": "../historical-maps-of-manhattan.jpg",
        "coordinates": [
            [-73.9944686, 40.8422140],
            [-73.8709387, 40.7946102],
            [-73.9642441, 40.6684403],
            [-74.08027832, 40.72742719]
        ]
    });

    map.addLayer({
        "id": 'nyc-historical',
        "type": "raster",
        "source": "nyc-src"
    }, "subways");

    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('slider-value');

    slider.addEventListener('input', (e) => {
        // Adjust the layers opacity. layer here is arbitrary - this could
        // be another layer name found in your style or a custom layer
        // added on the fly using `addSource`.
        map.setPaintProperty(
            'nyc-historical',
            'raster-opacity',
            parseInt(e.target.value, 10) / 100
        );

        // map.setPaintProperty(
        //     'subways',
        //     'line-width',
        //     (parseInt(e.target.value, 10) / 100) * 6
        // );

        // Value indicator
        sliderValue.textContent = e.target.value + '%';
    });
});
