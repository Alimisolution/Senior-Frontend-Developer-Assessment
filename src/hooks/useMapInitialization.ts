import { useEffect } from 'react';
import type { RefObject } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

export const useMapInitialization = (
  mapRef: RefObject<HTMLDivElement | null>,
  mapInstance: RefObject<Map | null>,
  tooltipRef: RefObject<HTMLDivElement | null>,
  tooltipOverlayRef: RefObject<Overlay | null>,
  vectorLayerRef: RefObject<VectorLayer>
) => {
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Create tooltip overlay
      tooltipOverlayRef.current = new Overlay({
        element: tooltipRef.current!,
        positioning: 'bottom-left',
        offset: [10, 0],
        stopEvent: false,
      });

      mapInstance.current = new Map({
        target: mapRef.current!,
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayerRef.current,
        ],
        overlays: [tooltipOverlayRef.current],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      // Add pointer cursor style to the map
      const viewport = mapInstance.current.getViewport();
      viewport.style.cursor = 'default';
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []); // Empty dependency array to ensure it only runs once
}; 