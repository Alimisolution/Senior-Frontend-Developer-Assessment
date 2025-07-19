import { useEffect } from 'react';
import type { RefObject } from 'react';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

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

export const useTrailData = (
  mapInstance: RefObject<Map | null>,
  vectorSourceRef: RefObject<VectorSource>,
  trailData: any[],
  trailColorMetric: string
) => {
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
}; 