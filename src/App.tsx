import React from 'react';
import { Snackbar } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme/theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppHeader from './components/AppHeader';
import MapSection from './components/MapSection';
import InfoCards from './components/InfoCards';
import FilterModal from './components/FilterModal';
import { useAppData } from './hooks/useAppData';

// Main application component.
// Handles theme, filter modal, map, info cards, and accessibility.
function App() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const {
    mode,
    modalOpen,
    snackbarOpen,
    filterValues,
    loading,
    trailColorMetric,
    filteredData,
    setTrailColorMetric,
    handleResetFilter,
    handleFilterSubmit,
    handleToggleTheme,
    handleOpenModal,
    handleCloseModal,
    handleCloseSnackbar,
  } = useAppData();

  const theme = React.useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Use theme for card backgrounds and text
  const cardBg = theme.palette.background.paper;
  const cardText = theme.palette.text.primary;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Header with filter and theme toggles */}
        <AppHeader 
          onOpenFilter={handleOpenModal}
          mode={mode}
          onToggleTheme={handleToggleTheme}
        />
        {/* Main Content: Map and Info Cards */}
        <div style={{ display: 'flex', flex: 1, width: '100%', height: 'calc(100vh - 56px)', flexDirection: isMobile ? 'column' : 'row' }}>
          <MapSection 
            filteredData={filteredData}
            trailColorMetric={trailColorMetric}
            onTrailColorChange={setTrailColorMetric}
            isMobile={isMobile}
          />
          <InfoCards 
            filteredData={filteredData}
            filterValues={filterValues}
            cardBg={cardBg}
            cardText={cardText}
            isMobile={isMobile}
            onResetFilter={handleResetFilter}
          />
        </div>
        {/* Filter Modal */}
        <FilterModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFilterSubmit}
          initialValues={filterValues}
          loading={loading}
        />
        {/* Snackbar for filter success */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message="Filters applied successfully!"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
