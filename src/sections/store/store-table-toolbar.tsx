import { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

type Props = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function StoreTableToolbar({ numSelected, filterName, onFilterName }: Props) {
  return (
    <TextField
      fullWidth
      value={filterName}
      onChange={onFilterName}
      placeholder="Search stores..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ p: 2 }}
    />
  );
}