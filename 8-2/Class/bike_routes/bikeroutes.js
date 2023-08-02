const map = new maplibregl.Map({
    container: 'map',
    style: './dark_matter-style.json',
    center: [-74.262, 40.73],
    zoom: 15.6,
    bearing: 0,
    pitch: 30,
    hash: true
});

map.once('load', async () => {
    const response = await axios.get("./routes.csv", { responseType: 'blob', });
    const file = response.data;
    const obj = csvJSON(await file.text());

    let propertyDataArray = [];
    let p = -1;
    for (let c = 0; c < obj.length; c++) {
        if (obj[c].trackpoint_type === "\"SEGMENT_START_MANUAL\"") {
            p++;
            propertyDataArray.push([])
        }
        if (obj[c].latitude && obj[c].longitude && !obj[c].longitude.includes('-74.262')) {
            propertyDataArray[p].push(
                [+obj[c].longitude, +obj[c].latitude]
            )
        }
    }

    console.log(propertyDataArray)
    map.addLayer(new deck.MapboxLayer({
        id: 'deckgl-routes',
        type: deck.PathLayer,
        data: propertyDataArray,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: d => d,
        getColor: d => [150, 50, 150],
        getWidth: d => .75,
        opacity: 0.1
    }),);
})

function csvJSON(csvStr) {
    var lines = csvStr.split("\n");
    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    return result; //JavaScript object
}