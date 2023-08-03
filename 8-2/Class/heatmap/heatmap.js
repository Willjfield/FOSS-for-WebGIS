const map = new maplibregl.Map({
    container: 'map',
    style: '../class-style.json',
    center: [-74.262, 40.73],
    maxZoom: 15,
    zoom: 13.5,
    bearing: 0,
    pitch: 30,
    hash: true
});

map.once('load', async () => {
    const properties = await axios('Maplewood_Parcels-4326.geojson');
    const propertyDataArray = properties.data.features;
    // console.log(propertyDataArray[10])
    map.addLayer(new deck.MapboxLayer({
        id: 'deckgl-heatmap',
        type: deck.HeatmapLayer,
        data: propertyDataArray,
        getPosition: (d) => {
            //console.log(d.geometry.coordinates[0][0][0])
            return d.geometry.coordinates[0][0][0]
        },
        getWeight: (d) => {
            // console.log(d)
            switch (d.properties.PEST_USE) {
                case 'NULL': case null:
                    return 0;
                case 'N':
                    return 0
                default:
                    return 1
            }
        },
        opacity: 0.3
    }),);
})