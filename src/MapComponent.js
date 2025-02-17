import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css'; // Import OpenLayers CSS
import { markersData } from './RiverData';
import { scale } from 'ol/size';

const MapComponent = () => {
    const mapRef = useRef();

    useEffect(() => {
        // Create vector source and layer for markers
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        //Generate Points on map
        markersData.forEach(marker => {
          const feature = new Feature({
            geometry: new Point(fromLonLat([marker.longitude, marker.latitude])),
            name: marker.name,
            description: marker.description
          });

          feature.setStyle(new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#2f00ff'
              }),
              stroke: new Stroke({
                color: '#ffffff',
                width: 1
              })
            })
         }));

        vectorSource.addFeature(feature);

        })

        // Initialize the map when the component mounts
        const map = new Map({
          target: mapRef.current, // Reference to the DOM element
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 19
              })
            }),
            vectorLayer
          ],
          view: new View({
            center: fromLonLat([-80.0194, 40.4049]), 
            zoom: 10, // Initial zoom level
          }),
        });
    
        // Cleanup the map when the component unmounts
        return () => map.setTarget(undefined);
      }, []);

    
  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '800px' }}
    />
  );

  
}

export default MapComponent;