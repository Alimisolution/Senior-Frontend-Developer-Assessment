import { useState, useMemo } from 'react';
import MapPanel from './components/MapPanel';
import { IconButton, Snackbar, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FilterModal from './components/FilterModal';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import mockData from '../mockData.json';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';

// Trail coloring options for dropdown
const TRAIL_COLOR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'power', label: 'Power' },
  { value: 'consumption', label: 'Excess Consumption' },
  { value: 'sfoc', label: 'SFOC' },
];



// Main application component.
// Handles theme, filter modal, map, info cards, and accessibility.
function App() {
  // Theme and filter state
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trailColorMetric, setTrailColorMetric] = useState('none');
  const isMobile = useMediaQuery('(max-width:600px)');

  // Use theme for card backgrounds and text
  const cardBg = theme.palette.background.paper;
  const cardText = theme.palette.text.primary;

  // Filter vessel trail data based on filterValues
  const allData = (mockData as any).Data || [];
  const filteredData = useMemo(() => {
    if (!filterValues) return allData;
    return allData.filter((d: any) => {
      // Date range (string comparison)
      const dateOk = (!filterValues.dateFrom || d.timestamp >= filterValues.dateFrom) &&
        (!filterValues.dateTo || d.timestamp <= filterValues.dateTo);
      return dateOk;
    });
  }, [allData, filterValues]);

  // Helper to format date for info card display
  function formatDate(dateStr: string | undefined) {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  }

  // Reset filter handler
  const handleResetFilter = () => {
    setFilterValues(null);
  };

  // Info card values from filtered data
  const paintValue = 'Sigma Coatings'; // Mock value
  const hullRoughness = filteredData.length > 0 ? (filteredData[filteredData.length - 1].shaftPower ?? 'N/A') : 'N/A';
  const logFactor = filteredData.length > 0 ? (filteredData[filteredData.length - 1].shaftSpeed ?? 'N/A') : 'N/A';
  const lastUnderwater = filteredData.length > 0 ? filteredData[filteredData.length - 1].timestamp : 'N/A';

  // Handle filter form submit
  const handleFilterSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(false);
      setSnackbarOpen(true);
      setFilterValues(data);
    }, 5000);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Header with filter and theme toggles */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 56, minHeight: 56, padding: 16, boxSizing: 'border-box', borderBottom: '1px solid #eee' }}>
          <IconButton onClick={() => setModalOpen(true)} color="inherit" aria-label="Open filter modal">
            {/* Filter Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18h4v-2h-4v2zm-7-8v2h18v-2H3zm3-6v2h12V4H6z" fill="currentColor" />
            </svg>
          </IconButton>
          <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit" aria-label="Toggle dark mode">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </div>
        {/* Main Content: Map and Info Cards */}
        <div style={{ display: 'flex', flex: 1, width: '100%', height: 'calc(100vh - 56px)', flexDirection: isMobile ? 'column' : 'row' }}>
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
                  onChange={e => setTrailColorMetric(e.target.value)}
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
          <div style={{ 
            flex: isMobile ? 'none' : 1, 
            height: isMobile ? '25%' : 'auto',
            minWidth: isMobile ? 0 : 320, 
            background: cardBg 
          }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 16, overflowY: isMobile ? 'auto' : 'unset', maxHeight: isMobile ? '100%' : 'unset' }}>
              {/* Filter range and reset button */}
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>
                  {filterValues ? (
                    <>
                      <b>Filter:</b> {formatDate(filterValues.dateFrom)} to {formatDate(filterValues.dateTo)}
                    </>
                  ) : (
                    <b>All Data</b>
                  )}
                </span>
                <button
                  style={{ marginLeft: 8, padding: '4px 10px', fontSize: 13, borderRadius: 4, border: '1px solid #bbb', background: '#f7f7f7', cursor: 'pointer' }}
                  onClick={handleResetFilter}
                  disabled={!filterValues}
                  aria-label="Reset filter"
                >
                  Reset Filter
                </button>
              </div>
              <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
                <b>Paint</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : paintValue}
              </div>
              <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
                <b>Hull Roughness</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : hullRoughness}
              </div>
              <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
                <b>Log Factor</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : logFactor}
              </div>
              <div style={{ flex: 1, background: cardBg, color: cardText, padding: 16 }}>
                <b>Last Underwater</b><br />{filteredData.length === 0 ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>No data</span> : lastUnderwater}
              </div>
            </div>
          </div>
        </div>
        {/* Filter Modal */}
        <FilterModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFilterSubmit}
          initialValues={filterValues}
          loading={loading}
        />
        {/* Snackbar for filter success */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Filters applied successfully!"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
