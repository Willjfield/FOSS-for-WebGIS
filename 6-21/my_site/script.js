console.log('loading: loaded')

let map = L.map('map').setView([45.604, -114.143], 5.91)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

let activeFilters = new Set([
  'AIR VALVE', 
  'CATTLEGUARD', 
  'DRAIN', 
  'GATE',
  'PRESSURE BREAK',
  'SPRING',
  'TROUGH',
  'VALVE'
])

const filterFeatures = (feature) => {
  return activeFilters.has(feature.properties.POINT_FEAT) &&
  (
    feature.properties.PROJ_NAME === 'Shares Basin Fence' ||
    feature.properties.PROJ_NAME === 'Jim Sage Cattleguard' || 
    feature.properties.PROJ_NAME === 'Robber Gulch Pipeline and Troughs' ||
    feature.properties.PROJ_NAME === 'Ski Protection Fence and Cattleguard' ||
    feature.properties.PROJ_NAME === 'Petan Piute Basin Fence Gate' ||
    feature.properties.PROJ_NAME === 'Rabbit Creek Pipeline' ||
    feature.properties.PROJ_NAME === 'Windy Point Pipeline' ||
    feature.properties.PROJ_NAME === 'Wilson Creek Pipeline' ||
    feature.properties.PROJ_NAME === 'CHOKECHERRY PIPELINE'
  )
}

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

let geoJsonLayer

function drawMap(data) {
  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer)
  }
  geoJsonLayer = L.geoJSON(data, {
    style: { color: '#116ad2' },
    filter: filterFeatures,
    pointToLayer: (feature, latlng) => {
      let pointFeatColor = pointFeatColors[feature.properties.POINT_FEAT]
      if (!pointFeatColor) {
        pointFeatColor = 'grey'
      }
      let colorIcon = createColorIcon(pointFeatColor)
      let new_marker = L.marker(latlng, { icon: colorIcon })
      new_marker.bindPopup(
        'Name: ' 
        +'<b>' + toTitleCase(feature.properties.PROJ_NAME) + '</b><br>' 
        + 'Feature: ' + '<b>' + toTitleCase(feature.properties.POINT_FEAT)
        + '</b>')
      return new_marker
    }
  }).addTo(map)
}

function toTitleCase(word) {
  return word.toLowerCase().split(' ').map((new_word) => {
    return(new_word.charAt(0).toUpperCase() + new_word.slice(1))
  }).join(' ')
}

axios('blm_idaho_range_improvement_point.geojson')
  .then(resp => {
    drawMap(resp.data)
    console.log('finished loading')
    document.querySelectorAll('#filters input[type="checkbox"]').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        if (this.checked) {
          activeFilters.add(this.value)
        } else {
          activeFilters.delete(this.value)
        }
        drawMap(resp.data)
      })
    })
  })
