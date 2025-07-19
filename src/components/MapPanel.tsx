import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Overlay from 'ol/Overlay';

interface MapPanelProps {
  trailData: any[];
  trailColorMetric: string;
}

// Color mapping logic
function getTrailColor(metric: string, value: number | undefined, sfocVisible?: boolean) {
  if (metric === 'power') {
    if (value === undefined) return '#00FF00'; // Power default: green
    if (value < 106) return '#00FF00';
    if (value < 114) return '#FFAC1C';
    return '#FF0000';
  } else if (metric === 'sfoc' && sfocVisible) {
    if (value === undefined) return '#FFAC1C'; // SFOC default: orange
    if (value < 103) return '#00FF00';
    if (value < 110) return '#FFAC1C';
    return '#FF0000';
  } else if (metric === 'consumption') {
    if (value === undefined) return '#FF0000'; // Consumption default: red
    if (value < 5) return '#00FF00';
    if (value < 15) return '#FFAC1C';
    return '#FF0000';
  }
  // Default for 'none'
  return '#0000FF';
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

  // Initialize map only once
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
  }, []);

  // Simple tooltip event handling
  useEffect(() => {
    if (!mapInstance.current) return;
    
    const map = mapInstance.current;
    const viewport = map.getViewport();
    
    
    // Create tooltip element and append to body
    const tooltipElement = document.createElement('div');
    tooltipElement.style.position = 'fixed';
    tooltipElement.style.zIndex = '9999';
    tooltipElement.style.display = 'none';
    tooltipElement.style.pointerEvents = 'none';
    tooltipElement.style.backgroundColor = '#000000';
    tooltipElement.style.color = '#FFFFFF';
    tooltipElement.style.padding = '8px 12px';
    tooltipElement.style.borderRadius = '6px';
    tooltipElement.style.fontSize = '13px';
    tooltipElement.style.minWidth = '180px';
    tooltipElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    document.body.appendChild(tooltipElement);
    
    const handlePointerMove = (evt: MouseEvent) => {
      const pixel = map.getEventPixel(evt);
      const feature = map.forEachFeatureAtPixel(pixel, (f) => f);
      
      if (feature && feature.getGeometry() instanceof Point) {
        const data = feature.get('data');
        if (data) {
          tooltipElement.innerHTML = `
            <b>Timestamp:</b> ${data.timestamp}<br/>
            <b>Power:</b> ${data.power}<br/>
            <b>Consumption:</b> ${data.consumption}<br/>
            <b>LogSpeed:</b> ${data.logSpeed}<br/>
            <b>WaveHeight:</b> ${data.waveHeight}<br/>
            <b>WindSpeed:</b> ${data.windSpeed}
          `;
          tooltipElement.style.display = 'block';
          tooltipElement.style.left = (evt.clientX + 10) + 'px';
          tooltipElement.style.top = (evt.clientY + 10) + 'px';
          viewport.style.cursor = 'pointer';
        }
      } else {
        tooltipElement.style.display = 'none';
        viewport.style.cursor = 'default';
      }
    };

    const handlePointerOut = () => {
      tooltipElement.style.display = 'none';
      viewport.style.cursor = 'default';
    };

    // Use DOM events instead of OpenLayers events
    viewport.addEventListener('mousemove', handlePointerMove);
    viewport.addEventListener('mouseout', handlePointerOut);

    return () => {
      viewport.removeEventListener('mousemove', handlePointerMove);
      viewport.removeEventListener('mouseout', handlePointerOut);
      // Clean up tooltip element
      if (document.body.contains(tooltipElement)) {
        document.body.removeChild(tooltipElement);
      }
    };
  }, [mapInstance.current]);

  // Only update vector layer features and fit view when trailData or trailColorMetric changes
  useEffect(() => {
    // Only update features, do not remove/re-add layer
    const vectorSource = vectorSourceRef.current;
    if (!mapInstance.current) return;
    // Filter only valid positions
    const validTrailData = Array.isArray(trailData)
      ? trailData.filter(d => Array.isArray(d.position) && d.position.length === 2 && !isNaN(d.position[0]) && !isNaN(d.position[1]))
      : [];
    vectorSource.clear();
    if (!validTrailData || validTrailData.length === 0) return;
    // Points
    const points = validTrailData.map((d, i) => {
      const color = getTrailColor(
        trailColorMetric,
        trailColorMetric === 'power' ? d.power :
        trailColorMetric === 'sfoc' ? d.sfoc :
        trailColorMetric === 'consumption' ? d.consumption : undefined,
        d.sfocVisible
      );
      const f = new Feature({ geometry: new Point(fromLonLat(d.position)), data: d, idx: i });
      f.setStyle(new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
      }));
      return f;
    });
    // Line
    const lineCoords = validTrailData.map((d) => fromLonLat(d.position));
    // For line coloring, use a single color for the whole line (could be improved to segment coloring)
    const lineColor = getTrailColor(
      trailColorMetric,
      trailColorMetric === 'power' ? validTrailData[0]?.power :
      trailColorMetric === 'sfoc' ? validTrailData[0]?.sfoc :
      trailColorMetric === 'consumption' ? validTrailData[0]?.consumption : undefined,
      validTrailData[0]?.sfocVisible
    );
    const line = new Feature({ geometry: new LineString(lineCoords) });
    line.setStyle(new Style({
      stroke: new Stroke({ color: lineColor, width: 3 }),
    }));
    vectorSource.addFeature(line);
    points.forEach((pt) => vectorSource.addFeature(pt));
    // Zoom to fit
    const view = mapInstance.current.getView();
    if (lineCoords.length > 1) {
      view.fit(new LineString(lineCoords), { padding: [40, 40, 40, 40], duration: 500 });
    } else if (lineCoords.length === 1) {
      view.setCenter(lineCoords[0]);
      view.setZoom(10);
    }
  }, [trailData, trailColorMetric]);

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