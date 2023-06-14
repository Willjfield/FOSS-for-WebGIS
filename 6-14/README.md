## GOALS:

- What is FOSS?
- State of Web Mapping
    - Early web maps were not *really* interactive
    - Invention of slippy maps (2006 using OSM data)
        - Google pushed peoples' expectations
    - WebGL
        - Low level graphics library for the browser
        - Watch out for WebGPU!
    - OS Geo
        - https://www.osgeo.org
        - https://2023.foss4g.org/
        - https://www.osgeo.org/events/foss4g-na-2023/
    - OSM  
        - https://www.openstreetmap.org/#map=4/38.01/-95.84  
        - https://github.com/osmlab  
        - https://link.springer.com/referenceworkentry/10.1007/978-3-319-23519-6_1654-1  
    - Carto/Uber ecosystem
        - https://github.com/visgl  
    - Postgis, QGIS
    - Hosting Services:
        - Mapbox
        - MapTiler
        - ArcGIS
        - Your own server

    - https://github.com/sshuair/awesome-gis
    - https://github.com/mapbox/awesome-vector-tiles
    - https://github.com/osmlab/awesome-openstreetmap

- Web Map Fundamentals
    - Tiles  
        https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/#3/15.00/50.00

        https://www.maptiler.com/news/2019/02/what-are-vector-tiles-and-why-you-should-care/
        

    - Vector tiles could be .mvt files or .mbtiles or "cut" directly from database
    - Some periphery formats: pmtiles, h3 tiles (https://wolf-h3-viewer.glitch.me/)

    - Coordinate Systems  
        https://pro.arcgis.com/en/pro-app/latest/help/mapping/properties/coordinate-systems-and-projections.htm
    - Projection Systems
        https://en.wikipedia.org/wiki/Web_Mercator_projection

    - Features
        - Point, Line, Polygon, Multi... with properties associated

    - Geocoding/Reverse geocoding

    - Common API Patterns
        - Div to hold the map
        - Layers and Sources
            - style spec
            - https://docs.mapbox.com/mapbox-gl-js/style-spec/
        - Styling functions

    - Data Formats
        - Raster tiles
        - Vector tiles
        - geotiffs
        - PBFs
        - geojson
        - topojson
        - wkt
        - Spatial database

    - Full Stack
        - Self-hosted from "scratch"
        - Using Maptiler/Mapbox/ArcGIS etc

- Where to get data:
    - https://geojson.io/
    - https://data.cityofnewyork.us/browse?limitTo=maps
    - https://data.gis.ny.gov/
    - https://www.census.gov/geographies/mapping-files.html
    

## HOMEWORK:
    - Find (or create) data (ideally geojson) to add to a map next week