console.log('loading: loaded')

let map = L.map('map').setView([45.604, -114.143], 5.91)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

// thus ends 00

// thus begins 01
const marker = L.marker([43.529073, -116.065394]).addTo(map)

marker.bindPopup("<b>City Name</b><br>Sandy Point")

// thus ends 01

// thus begins 02





