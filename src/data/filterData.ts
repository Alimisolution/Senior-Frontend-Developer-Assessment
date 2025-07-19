export const companyList = [
  { id: 'cmp2', label: 'Company 1' },
  { id: 'cmp1', label: 'Company 2' },
  { id: 'cmp3', label: 'Company 3' },
];

export const hullJobs = [
  { id: '03573a58-6a32-4433-9e1a-9f9d31c71edb', label: 'Hull Inspection (HI)' },
  { id: 'b10dd87b-68b4-496d-9b60-39cf9f03c0bb', label: 'Propeller Polish (PP)' },
  { id: 'ee828f1f-f1cd-4962-a980-12ccc4e48e7b', label: 'Hull Cleaning (HC)' },
  { id: '3a95d310-64bc-4599-8c4d-9304d12bb986', label: 'Propeller Inspection (PI)' },
  { id: 'c854b265-067c-4b7a-8d6a-d00f7304297b', label: 'Drydock (DD)' },
];

// Dummy vessel data per company
export const vesselList: { [key: string]: { id: string; label: string }[] } = {
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

export const getDefaultDate = (yearsAgo = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  return d.toISOString().split('T')[0];
};

export const defaultValues = {
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  company: ['cmp2'], 
  vessel: 'vsl3', 
  hullJobs: [],
};

export type FilterFormValues = Omit<typeof defaultValues, 'hullJobs'> & { hullJobs: string[] }; 