import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import MapPanel from './MapPanel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Trail coloring options for dropdown
const TRAIL_COLOR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'power', label: 'Power' },
  { value: 'consumption', label: 'Excess Consumption' },
  { value: 'sfoc', label: 'SFOC' },
];

interface MapSectionProps {
  filteredData: any[];
  trailColorMetric: string;
  onTrailColorChange: (value: string) => void;
  isMobile: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({ filteredData, trailColorMetric, onTrailColorChange, isMobile }) => {
  return (
    <div style={{ 
      flex: isMobile ? 'none' : 2, 
      height: isMobile ? '75%' : 'auto',
      minWidth: 0, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Trail coloring dropdown */}
      <Box p={2} pb={0}>
        <FormControl size="small" fullWidth disabled={filteredData.length === 0}>
          <InputLabel id="trail-color-label">Trail Coloring</InputLabel>
          <Select
            labelId="trail-color-label"
            value={trailColorMetric}
            label="Trail Coloring"
            onChange={e => onTrailColorChange(e.target.value)}
            aria-label="Trail coloring metric"
          >
            {TRAIL_COLOR_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Map or empty state message */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, maxHeight: '100%', overflow: 'hidden' }}>
        {filteredData.length === 0 ? (
          <div
            style={{ position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center', color: '#888', fontSize: 20, opacity: 0.85, animation: 'fadein 0.6s' }}
            aria-live="polite"
            role="status"
          >
            <InfoOutlinedIcon style={{ fontSize: 48, marginBottom: 8, color: '#bbb' }} aria-hidden="true" />
            <div>No vessel trail data matches your filter.</div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <MapPanel trailData={filteredData} trailColorMetric={trailColorMetric} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSection; 