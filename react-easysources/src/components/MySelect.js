import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * Componente Select riusabile
 */
function MySelect({ label, options, value, onChange, ...props }) {
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
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MySelect;