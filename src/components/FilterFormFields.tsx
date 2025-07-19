import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { companyList, hullJobs } from '../data/filterData';
import type { FilterFormValues } from '../data/filterData';

interface FilterFormFieldsProps {
  control: Control<FilterFormValues>;
  vesselOptions: { id: string; label: string }[];
}

const FilterFormFields: React.FC<FilterFormFieldsProps> = ({ control, vesselOptions }) => {
  return (
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
  );
};

export default FilterFormFields; 