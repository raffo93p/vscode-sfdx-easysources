import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import HelpTooltip from './HelpTooltip';

/**
 * Componente Select riusabile
 * Supporta sia array di stringhe che array di {label, value}
 */
function MySelect({ label, options, value, onChange, helpText, ...props }) {
  // Normalizza options: se è un array di stringhe, convertilo in {label, value}
  const normalizedOptions = options?.map(option => 
    typeof option === 'string' 
      ? { label: option, value: option }
      : option
  ) || [];

  if (helpText) {
    // Se c'è helpText, usa un layout con Box per affiancare Select e HelpTooltip
    return (
      <Box display="flex" alignItems="flex-end" gap={0.5}>
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
        <HelpTooltip title={helpText} />
      </Box>
    );
  }

  // Se non c'è helpText, usa il layout standard
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