import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { vesselList, defaultValues } from '../data/filterData';
import type { FilterFormValues } from '../data/filterData';

export const useFilterForm = (initialValues?: FilterFormValues) => {
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
  }, [selectedCompanies, setValue, getValues]);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return {
    handleSubmit,
    control,
    isSubmitting,
    vesselOptions,
    snackbarOpen,
    snackbarMsg,
    setSnackbarOpen,
  };
}; 