import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  Paper,
  useTheme,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Snackbar from '@mui/material/Snackbar';

const companyList = [
  { id: 'cmp2', label: 'Company 1' },
  { id: 'cmp1', label: 'Company 2' },
  { id: 'cmp3', label: 'Company 3' },
];

const hullJobs = [
  { id: '03573a58-6a32-4433-9e1a-9f9d31c71edb', label: 'Hull Inspection (HI)' },
  { id: 'b10dd87b-68b4-496d-9b60-39cf9f03c0bb', label: 'Propeller Polish (PP)' },
  { id: 'ee828f1f-f1cd-4962-a980-12ccc4e48e7b', label: 'Hull Cleaning (HC)' },
  { id: '3a95d310-64bc-4599-8c4d-9304d12bb986', label: 'Propeller Inspection (PI)' },
  { id: 'c854b265-067c-4b7a-8d6a-d00f7304297b', label: 'Drydock (DD)' },
];

// Dummy vessel data per company
const vesselList: { [key: string]: { id: string; label: string }[] } = {
  cmp1: [
    { id: 'vsl1', label: 'Vessel 1A' },
    { id: 'vsl2', label: 'Vessel 1B' },
  ],
  cmp2: [
    { id: 'vsl3', label: 'Vessel 2A' },
    { id: 'vsl4', label: 'Vessel 2B' },
  ],
  cmp3: [
    { id: 'vsl5', label: 'Vessel 3A' },
    { id: 'vsl6', label: 'Vessel 3B' },
  ],
};

const getDefaultDate = (yearsAgo = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  return d.toISOString().split('T')[0];
};

const defaultValues = {
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  company: ['cmp2'], // Company 1
  vessel: 'vsl3', // Default vessel for Company 1
  hullJobs: [],
};

type FilterFormValues = Omit<typeof defaultValues, 'hullJobs'> & { hullJobs: string[] };

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FilterFormValues) => void;
  initialValues?: FilterFormValues;
  loading?: boolean;
};

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, onSubmit, initialValues, loading }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<FilterFormValues>({
    defaultValues: initialValues || defaultValues,
  });

  // Watch company selection to update vessel options
  const selectedCompanies = useWatch({ control, name: 'company' }) || watch('company');
  const vesselOptions = selectedCompanies.length > 0 ? vesselList[selectedCompanies[0]] : [];

  // Reset vessel when company changes or when modal is opened with initial values
  useEffect(() => {
    const vessel = getValues('vessel');
    if (vesselOptions.length > 0 && !vesselOptions.some(v => v.id === vessel)) {
      setValue('vessel', vesselOptions[0].id);
      setSnackbarMsg('Vessel reset to a valid option for the selected company.');
      setSnackbarOpen(true);
    }
  }, [selectedCompanies, open, initialValues, setValue, getValues]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Paper sx={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <DialogTitle>Global Filters</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Controller
                name="dateFrom"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Date From" type="date" InputLabelProps={{ shrink: true }} />
                )}
              />
              <Controller
                name="dateTo"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Date To" type="date" InputLabelProps={{ shrink: true }} />
                )}
              />
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>Company</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Company" />}
                      renderValue={(selected) =>
                        companyList.filter((c) => (selected as any[]).includes(c.id)).map((c) => c.label).join(', ')
                      }
                    >
                      {companyList.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          <Checkbox checked={field.value.indexOf(c.id) > -1} />
                          <ListItemText primary={c.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="vessel"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>Vessel</InputLabel>
                    <Select {...field} label="Vessel">
                      {vesselOptions.map((v: any) => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="hullJobs"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>Hull Jobs</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Hull Jobs" />}
                      renderValue={(selected) =>
                        hullJobs.filter((h) => (selected as string[]).includes(h.id)).map((h) => h.label).join(', ')
                      }
                    >
                      {hullJobs.map((h) => (
                        <MenuItem key={h.id} value={h.id}>
                          <Checkbox checked={field.value.indexOf(h.id) > -1} />
                          <ListItemText primary={h.label} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
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