import React from 'react';
import { TextField } from '@mui/material';

/**
 * Componente wrapper per TextField che mantiene lo stile coerente con MySelect e MyCheckbox
 */
function MyTextField({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  size = 'small',
  lowZIndex = false,
  ...otherProps 
}) {
  const customSx = lowZIndex ? {
    '& .MuiInputLabel-root': {
      zIndex: 1
    },
    '& .MuiInputLabel-shrink': {
      zIndex: 1
    }
  } : {};

  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      size={size}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={customSx}
      {...otherProps}
    />
  );
}

export default MyTextField;