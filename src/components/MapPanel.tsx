import React, { useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Overlay from 'ol/Overlay';
import { useMapInitialization } from '../hooks/useMapInitialization';
import { useTooltip } from '../hooks/useTooltip';
import { useTrailData } from '../hooks/useTrailData';

interface MapPanelProps {
  trailData: any[];
  trailColorMetric: string;
}

const MapPanel: React.FC<MapPanelProps> = ({ trailData, trailColorMetric }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipOverlayRef = useRef<Overlay | null>(null);

  // Vector source and layer are now inside the component, but only created once
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const vectorLayerRef = useRef<VectorLayer>(
    new VectorLayer({
      source: vectorSourceRef.current,
      style: (feature) => {
        if (feature.getGeometry() instanceof LineString) {
          return new Style({
            stroke: new Stroke({ color: '#0000FF', width: 3 }),
          });
        }
        return new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({ color: '#1976d2' }),
            stroke: new Stroke({ color: '#fff', width: 1 }),
          }),
        });
      },
    })
  );

  // Initialize map
  useMapInitialization(mapRef, mapInstance, tooltipRef, tooltipOverlayRef, vectorLayerRef);

  // Setup tooltip
  useTooltip(mapInstance, tooltipOverlayRef);

  // Update trail data
  useTrailData(mapInstance, vectorSourceRef, trailData, trailColorMetric);

  return (
    <>
      <div 
        key="map-container"
        style={{ 
          width: '100%', 
          height: '100%', 
          background: '#eee', 
          position: 'relative',
          minHeight: 0,
          flex: 1,
          overflow: 'hidden'
        }} 
        ref={mapRef} 
      />
    </>
  );
};

export default MapPanel; 