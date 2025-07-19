import { useEffect } from 'react';
import type { RefObject } from 'react';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';

export const useTooltip = (
  mapInstance: RefObject<Map | null>,
) => {
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
  }, [mapInstance.current]); // Only re-run when map instance changes
}; 