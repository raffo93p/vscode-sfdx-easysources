import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * Componente Select riusabile
 * Supporta sia array di stringhe che array di {label, value}
 */
function MySelect({ label, options, value, onChange, ...props }) {
  // Normalizza options: se è un array di stringhe, convertilo in {label, value}
  const normalizedOptions = options?.map(option => 
    typeof option === 'string' 
      ? { label: option, value: option }
      : option
  ) || [];

  return (
    <FormControl variant="standard" fullWidth {...props}>
      <InputLabel id={`${label.toLowerCase()}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label.toLowerCase()}-select-label`}
        id={`${label.toLowerCase()}-select`}
        value={value}
        label={label}
        onChange={onChange}
      >
        {normalizedOptions.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MySelect;