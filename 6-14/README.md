## GOALS:

- What is FOSS?
- State of Web Mapping
    - Early web maps were not *really* interactive
    - Invention of slippy maps (2006 using OSM data)
        - Google pushed peoples' expectations
    - WebGL
        - Low level graphics library for the browser
        - Watch out for WebGPU!
    - OSM  
        - https://www.openstreetmap.org/#map=4/38.01/-95.84  
        - https://github.com/osmlab  
        - https://link.springer.com/referenceworkentry/10.1007/978-3-319-23519-6_1654-1  
    - Carto/Uber ecosystem
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

    - Features
        - Point, Line, Polygon, Multi...  

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
    - Full Stack
        - Self-hosted from "scratch"
        - Using Maptiler/Mapbox/ArcGIS etc
    

## HOMEWORK: