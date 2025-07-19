import { useState, useMemo } from 'react';
import mockData from '../../mockData.json';

export const useAppData = () => {
  // Theme and filter state
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trailColorMetric, setTrailColorMetric] = useState('none');

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

  // Reset filter handler
  const handleResetFilter = () => {
    setFilterValues(null);
  };

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

  // Theme toggle handler
  const handleToggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Open modal handler
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Close modal handler
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return {
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
  };
}; 