console.log('loaded!')
console.log(maplibregl);

const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i', // style URL
    center: [-74.671, 40.54], // starting position [lng, lat]
    zoom: 8, // starting zoom
    hash: true
});

map.once('load',main);

async function main(){
    const schoolGeojson = await axios('../schools.geojson');
    
    map.addSource('school-geo-source',{
        'type':'geojson',
        'data':schoolGeojson.data
    });

    map.addLayer({
        'id':'nj-schools',
        'source': 'school-geo-source',
        'type': 'circle',
        'paint':{
            'circle-color':'#68f',
            'circle-stroke-width':2,
            'circle-stroke-color':'#fff'
        }
    })
    addEvents();

}

function addEvents(){
    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter','nj-schools',(e)=>{
       // console.log()
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        console.log(props)
        popup.setLngLat(coordinates).setHTML(
            `
            <div class='popup-style'>
            <b>${props.SCHOOLNAME}</b>
            <br>
            ${props.DIST_NAME}
            </div>
            `
        ).addTo(map);
    });

    map.on('mouseleave','nj-schools',(e)=>{
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'initial';
        popup.remove();
    });

    document.getElementById('fly-to').addEventListener('click',()=>{
        map.flyTo({
            center:[-73.983486, 40.7489],
            zoom:16
        })
    })
}

