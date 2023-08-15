// set up navbar
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('navbar')
  fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
      navContainer.innerHTML = html
      // After dynamically adding content, hide filters and map initially
      hideInitially('filters')
      hideInitially('map')
    })
    .catch(err => {
      console.warn("Navbar not loaded:", err)
    })
})

let hasScrolled = false
let hasShownText = false
let lastScrollTop = 0

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > lastScrollTop) {
    // User is scrolling down
    if (!hasScrolled && 
        isTransparent(document.getElementById('filters')) && 
        isTransparent(document.getElementById('map'))) {
        
        fadeIn('filters')
        fadeIn('map')
        let prompt = document.getElementById('scrollPrompt')
        prompt.style.display = 'none'
        hasScrolled = true
    }
    // maps / filters fully opaque AND text hasn't been shown yet
    else if (hasScrolled && !hasShownText &&
             isOpaque(document.getElementById('filters')) && 
             isOpaque(document.getElementById('map'))) {
                
        fadeIn('introContainer')
        hasShownText = true
    }
  } else {
    // User is scrolling up
    if (hasShownText && isTransparent(document.getElementById('introContainer'))) {
        fadeOut('introContainer')
        hasShownText = false
    }
    else if (hasScrolled && 
             isOpaque(document.getElementById('filters')) && 
             isOpaque(document.getElementById('map'))) {
        
        fadeOut('filters')
        fadeOut('map')
        let prompt = document.getElementById('scrollPrompt')
        prompt.style.display = 'block'
        hasScrolled = false
    }
  }

  lastScrollTop = scrollTop
})

function fadeIn(elementId) {
  const el = document.getElementById(elementId)
  el.classList.add('fade-in')
  el.classList.remove('fade-out')
  el.style.display = 'block'
}

function fadeOut(elementId) {
  const el = document.getElementById(elementId)
  el.classList.remove('fade-in')
  el.classList.add('fade-out')

  setTimeout(() => {
    if (el.classList.contains('fade-out')) {
      el.style.display = 'none'
    }
  }, 500)
}

function hideInitially(elementId) {
  const el = document.getElementById(elementId)
  el.classList.remove('fade-in')
  el.classList.add('fade-out')
}

function isOpaque(el) {
  return el.classList.contains('fade-in')
}

function isTransparent(el) {
  return el.classList.contains('fade-out')
}

let map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/topo-v2/style.json?key=eU7KU2yMOEVpP5MBHOFw',
  hash: true,
  scrollZoom: false // disable map's scroll initially
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
