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

  // Adding GeoJSON source
  map.addSource('blm', {
    type: 'geojson',
    data: 'blm_idaho_range_improvement_point.geojson',
  })

  // add circle layer for points
  map.addLayer({
    id: 'blm-points',
    type: 'circle',
    source: 'blm',
    paint: {
      'circle-radius': 6,
      'circle-color': '#B42222',
      'circle-stroke-width': 0.5,
      'circle-stroke-color': '#000000',
    },
  })

  // click event to show a popup with the project name
  map.on('click', 'blm-points', function (e) {
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h3>' + e.features[0].properties.PROJ_NAME + '</h3>')
      .addTo(map)
  })

  // Change the cursor to a pointer on hover
  map.on('mouseenter', 'blm-points', function () {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'blm-points', function () {
    map.getCanvas().style.cursor = ''
  })
})
