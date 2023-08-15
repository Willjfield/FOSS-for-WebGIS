document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('navbar')
  
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      navContainer.innerHTML = html
      
      // Moved this block inside the .then so it runs after the navbar HTML is set
      const aboutLink = document.getElementById('aboutLink')
      const modal = document.querySelector('.modal')
      const closeModalButton = document.querySelector('.modal-close')

      aboutLink.addEventListener('click', (event) => {
        event.preventDefault()
        modal.classList.add('is-active')
      })

      modal.querySelector('.modal-background').addEventListener('click', () => {
        modal.classList.remove('is-active')
      })

      closeModalButton.addEventListener('click', () => {
        modal.classList.remove('is-active')
      })
    })
    .catch(err => {
      console.warn("Navbar not loaded:", err)
    })
})

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
    'circle-color': [
      'match',
      ['get', 'POINT_FEAT'],
      'CATTLEGUARD', '#A691AE',
      'CULVERT', '#A997DF',
      'FENCE POINT', '#FFC857',
      'GATE', '#E8F086',
      'HEAD BOX', '#BDD9BF',
      'RESERVOIR', '#FF4242',
      'POND', '#0A284B',
      'SPRING', '#235FA4',
      'TANK', '#E5323B',
      'VALVE', '#929084',
      'WELL', '#058ED9',
      '#FFFFFF'
    ],
    'circle-radius': 4,
    'circle-stroke-width': 0.5,
    'circle-stroke-color': '#000000'
  }
})

updateVisibleFeatures()
applyFeatureFilter()
appendColorCirclesToFilters()

let filtersContainer = document.getElementById('filters') 
filtersContainer.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('circle-legend')) {
    e.preventDefault()  // wow! this was not easy
    let checkbox = e.target.nextElementSibling
    checkbox.checked = !checkbox.checked
    // circle color based on the checkbox state
    if (checkbox.checked) {
      e.target.style.backgroundColor = e.target.dataset.color
    } else {
      e.target.style.backgroundColor = 'white'
    }
    // call funcs to udpate
    updateVisibleFeatures()
    applyFeatureFilter()
  }
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

let featureDescription = document.getElementById('feature-description')
// Switch-case structure to handle different feature types
switch (e.features[0].properties.POINT_FEAT) {
  case "CATTLEGUARD":
    featureDescription.innerHTML = `
    Cattleguards are obstructions placed on the roadway:
      <ul>
        <li>Prevents cattle movement</li>
        <li>Often made of steel or wood</li>
        <li>Used in rural areas</li>
      </ul>`
    break
  
  case "CULVERT":
    featureDescription.innerHTML = `
    A culvert is a structure that:
      <ul>
        <li>Allows water to flow under a road</li>
        <li>Helps in flood control</li>
      </ul>`
    break
  
  case "FENCE POINT":
    featureDescription.innerHTML = `
    Fence Points are essential components of fences:
      <ul>
        <li>Mark the beginning or end of a fence</li>
        <li>Important for boundary demarcation</li>
      </ul>`
    break
  
  case "GATE":
    featureDescription.innerHTML = `
    Gates are entry or exit points:
      <ul>
        <li>Used to control access</li>
        <li>Can be manual or automated</li>
        <li>Varieties include swinging, sliding, and revolving</li>
      </ul>`
    break

  case "HEAD BOX":
    featureDescription.innerHTML = `
      A head box manages water flow:
      <ul>
        <li>Regulates water in irrigation systems</li>
        <li>Helps in diverting water</li>
        <li>Crucial for agricultural areas</li>
      </ul>`
    break

  case "POND":
    featureDescription.innerHTML = `
      Ponds are water bodies that:
      <ul>
        <li>Are smaller than lakes</li>
        <li>Can be natural or man-made</li>
        <li>Support aquatic life and often used for recreation</li>
      </ul>`
    break

  case "RESERVOIR":
    featureDescription.innerHTML = `
      Reservoirs are large water storage areas:
      <ul>
        <li>Use to store water for drinking, irragation, or hydroelectricity</li>
        <li>Can be natural or artificial</li>
        <li>Plays a vital role in water management</li>
      </ul>`
    break

  case "SPRING":
    featureDescription.innerHTML = `
      Springs are natural water sources:
      <ul>
        <li>Result from groundwater being pressurized / emerging from the ground</li>
        <li>Can form pools or flow as streams</li>
        <li>Crucial water source for many ecosystems</li>
      </ul>`
    break

  case "TANK":
    featureDescription.innerHTML = `
      Tanks are containers for storing water:
      <ul>
        <li>Can be underground or above ground</li>
        <li>Used in agriculture, industry, and households</li>
      </ul>`
    break

  case "WELL":
    featureDescription.innerHTML = `
      Wells are man-made structures to access groundwater:
      <ul>
        <li>Historically used as primary water sources</li>
        <li>Crucial in areas lacking surface water</li>
      </ul>`
    break  

  default:
    featureDescription.innerHTML = "Information about this feature is not available."
  }
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

let visibleFeatures = []

function updateVisibleFeatures() {
  visibleFeatures = []
  let checkboxes = document.querySelectorAll("#filters input[type='checkbox']:checked")
  checkboxes.forEach(checkbox => {
    visibleFeatures.push(checkbox.value)
  })
}

function applyFeatureFilter() {
  map.setFilter('blm-points', ['in', 'POINT_FEAT', ...visibleFeatures])
}

function appendColorCirclesToFilters() {
  let colorMapping = {
    'CATTLEGUARD': '#A691AE',
    'CULVERT': '#A997DF',
    'FENCE POINT': '#FFC857',
    'GATE': '#E8F086',
    'HEAD BOX': '#BDD9BF',
    'RESERVOIR': '#FF4242',
    'POND': '#0A284B',
    'SPRING': '#235FA4',
    'TANK': '#E5323B',
    'VALVE': '#929084',
    'WELL': '#058ED9',
  }
  let labels = document.querySelectorAll("#filters label")
    labels.forEach(label => {
      let featureName = label.querySelector('input').value
      let colorCircle = document.createElement('span')
      colorCircle.className = 'circle-legend'
      colorCircle.dataset.color = colorMapping[featureName] || '#FFFFFF'
      label.insertBefore(colorCircle, label.firstChild)
        
      // initialize the circle color based on the checkbox state
      let checkbox = label.querySelector('input[type="checkbox"]')
      if (checkbox.checked) {
          colorCircle.style.backgroundColor = colorCircle.dataset.color
      } else {
          colorCircle.style.backgroundColor = 'white'
      }
    })
}
