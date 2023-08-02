let map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/topo-v2/style.json?key=eU7KU2yMOEVpP5MBHOFw',
  hash: true,
})

const idahoBounds = [
  [-117.243027, 41.988056], // sw coordinates
  [-111.043495, 49.001146], // ne coordinates
]
map.on('load', function () {
  // try to fit map to IdahoBounds
  map.fitBounds(idahoBounds, { padding: 20 })

  // adding GeoJSON source
  map.addSource('blm', {
    type: 'geojson',
    data: 'blm_idaho_range_improvement_point.geojson',
    promoteId: { 'OBJECTID': 'id' }  // set objectid in GEOJSON to id
  })

  // add circle layer for points
  map.addLayer({
    id: 'blm-points',
    type: 'circle',
    source: 'blm',
    paint: {
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'hover'], false ],
        6,  // when hovered
        4   // unhovered
      ],
      'circle-color': [
        'match',
        ['get', 'POINT_FEAT'],
        'AIR VALVE', '#E8F086',
        'CATTLEGUARD', '#6FDE6E',
        'DRAIN', '#FF4242',
        'GATE', '#A691AE',
        'PRESSURE BREAK', '#235FA4',
        'SPRING', '#BDD9BF',
        'TROUGH', '#929084',
        'VALVE', '#058ED9',
        '#000000'
      ],
      'circle-stroke-width': 0.5,
      'circle-stroke-color': '#000000',
    },
  })

  // click event to show a popup with the project name
  map.on('click', 'blm-points', function (e) {
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        '<b>' + 'Project: ' + '</b>' + '<h3>' + e.features[0].properties.PROJ_NAME + '</h3>' +
        '<b>' + 'Feature Type: ' + '</b>' + '<h3>' + e.features[0].properties.POINT_FEAT + '</h3>'
      )
      .addTo(map)
  })

  // mouse enter event to change the cursor and grow the circle
  map.on('mouseenter', 'blm-points', function (e) {
    if (Array.isArray(e.features) && e.features.length > 0 && e.features[0].id) {
      map.getCanvas().style.cursor = 'pointer'
      map.setFeatureState(
        { source: 'blm', id: e.features[0].id },
        { hover: true }
      )
    }
  })

  // mouse leave event to revert the cursor and shrink the circle
  map.on('mouseleave', 'blm-points', function (e) {
    if (Array.isArray(e.features) && e.features.length > 0 && e.features[0].id) {
      map.getCanvas().style.cursor = ''
      map.setFeatureState(
        { source: 'blm', id: e.features[0].id },
        { hover: false }
      )
    }
  })
})
