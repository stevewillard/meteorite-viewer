/* eslint-disable react/style-prop-object */
import { useState } from 'react'
import MapGL, { Layer, Source, Popup } from '@urbica/react-map-gl'
import { Box, useTheme } from '@material-ui/core'

import { useData } from '../useData'

const TOKEN =
  'pk.eyJ1IjoiY3VyaW8iLCJhIjoiY2lyNTY3enc4MDAwOWcxbm5idnB4YnlzaiJ9.0i80WzmmlxDYCCs3Gks2bg'

export const Map = () => {
  const theme = useTheme()

  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 0,
  })

  /**
   * Get filtered data rows
   */
  const { data } = useData()

  /**
   * Build a GEOJSON feature collection
   * from the rows
   */
  const featureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  data?.forEach((row) => {
    featureCollection.features.push({
      type: 'Feature',
      geometry: row.geolocation,
      properties: {
        ...row,
      },
    })
  })

  return (
    <MapGL
      style={{ width: '100%', height: 330 }}
      mapStyle="mapbox://styles/curio/cit0goeew00002xpigazq25s9"
      accessToken={TOKEN}
      onViewportChange={setViewport}
      {...viewport}
    >
      <Source id="meteorites" type="geojson" data={featureCollection} />
      <Layer
        id="meteorites"
        type="circle"
        source="meteorites"
        paint={{
          'circle-radius': 3,
          'circle-color': theme.palette.secondary.main,
        }}
        onHover={(event) => {
          if (event.features.length > 0) {
            const nextHoveredPointId = event.features[0].id

            if (hoveredPoint !== nextHoveredPointId) {
              setHoveredPoint({
                feature: event.features[0],
                lngLat: event.lngLat,
              })
            }
          }
        }}
        onLeave={() => {
          if (hoveredPoint) {
            setHoveredPoint(null)
          }
        }}
      />

      {hoveredPoint?.lngLat && (
        <Popup
          longitude={hoveredPoint.lngLat.lng}
          latitude={hoveredPoint.lngLat.lat}
          closeButton={false}
          closeOnClick={false}
          anchor="top"
          className="map-tooltip"
        >
          <Box color="white" bgcolor="black" m={-2} p={2} fontWeight="bold" fontSize="14px">
            <Box>{hoveredPoint.feature.properties.name}</Box>
            <Box>{hoveredPoint.feature.properties.recclass}</Box>
            <Box>{hoveredPoint.feature.properties.year?.slice(0, 4) || null}</Box>
            <Box>Mass: {hoveredPoint.feature.properties.mass}g</Box>
            <Box>Fall: {hoveredPoint.feature.properties.fall}</Box>
          </Box>
        </Popup>
      )}
    </MapGL>
  )
}
