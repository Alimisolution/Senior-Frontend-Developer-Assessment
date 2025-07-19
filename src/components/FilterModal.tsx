import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import FilterFormFields from './FilterFormFields';
import { useFilterForm } from '../hooks/useFilterForm';
import type { FilterFormValues } from '../data/filterData';

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FilterFormValues) => void;
  initialValues?: FilterFormValues;
  loading?: boolean;
};

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, onSubmit, initialValues, loading }) => {
  const theme = useTheme();
  const {
    handleSubmit,
    control,
    isSubmitting,
    vesselOptions,
    snackbarOpen,
    snackbarMsg,
    setSnackbarOpen,
  } = useFilterForm(initialValues);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Paper sx={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <DialogTitle>Global Filters</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <FilterFormFields control={control} vesselOptions={vesselOptions} />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={isSubmitting || loading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? 'Submitting...' : 'Apply'}
            </Button>
          </DialogActions>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Dialog>
  );
};

export default FilterModal; 