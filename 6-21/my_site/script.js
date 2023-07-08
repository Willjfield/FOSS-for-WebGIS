console.log('loading: loaded')

let map = L.map('map').setView([45.604, -114.143], 5.91)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)



const filterFeatures = (feature) => 
  feature.properties.PROJ_NAME === 'Shares Basin Fence' ||
  feature.properties.PROJ_NAME === 'Jim Sage Cattleguard' || 
  feature.properties.PROJ_NAME === 'Robber Gulch Pipeline and Troughs' ||
  feature.properties.PROJ_NAME === 'Ski Protection Fence and Cattleguard' ||
  feature.properties.PROJ_NAME === 'Petan Piute Basin Fence Gate' ||
  feature.properties.PROJ_NAME === 'Rabbit Creek Pipeline' ||
  feature.properties.PROJ_NAME === 'Windy Point Pipeline' ||
  feature.properties.PROJ_NAME === 'Wilson Creek Pipeline' ||
  feature.properties.PROJ_NAME === 'CHOKECHERRY PIPELINE'

// TODO REMOVE this is diagnostic code
const filtered_feat_points = axios('blm_idaho_range_improvement_point.geojson')
  .then(resp => {
    console.log(resp.data)
    let filteredData = resp.data.features.filter(filterFeatures)
    console.log('filteredData >> ', filteredData)
    filteredData.forEach(feature => {
        console.log('feat_point >> ', feature.properties.POINT_FEAT)
      })
  })

// source: https://github.com/pointhi/leaflet-color-markers
const pointFeatColors = {
    'AIR VALVE': 'gold',
    'CATTLEGUARD': 'green',
    'DRAIN': 'violet',
    'GATE': 'red',
    'PRESSURE BREAK': 'black',
    'SPRING': 'orange',
    'TROUGH': 'blue',
    'VALVE': 'yellow',
}

// https://github.com/pointhi/leaflet-color-markers
const createColorIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
}

const range_imps = axios('blm_idaho_range_improvement_point.geojson')
    .then(resp => {
        console.log(resp.data)
        L.geoJSON(resp.data, {
            style: { color: '#116ad2' },
            filter: filterFeatures,
            pointToLayer: (feature, latlng) => {
                let pointFeatColor = pointFeatColors[feature.properties.POINT_FEAT]
                // fallback color
                if (!pointFeatColor) {
                    pointFeatColor = 'grey'
                }
                // create colored icon
                let colorIcon = createColorIcon(pointFeatColor)
                // use colored icon when creating marker
                let new_marker = L.marker(latlng, { icon: colorIcon })
                new_marker.bindPopup(
                    '<b>' + feature.properties.PROJ_NAME + '</b><br>' + feature.properties.POINT_FEAT)
                return new_marker
            }

        }).addTo(map)

        console.log('finished loading')
    })

    

