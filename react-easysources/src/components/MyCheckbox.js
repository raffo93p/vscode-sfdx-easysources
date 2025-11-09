import React from 'react';
import { Grid, Checkbox, FormControlLabel } from '@mui/material';

/**
 * Componente Checkbox riusabile
 */
function MyCheckbox({ checked, onChange, label, size = 6, ...props }) {
  if (checked === null || checked === undefined) {
    return null;
  }

  return (
    <Grid item xs={size} {...props}>
      <FormControlLabel 
        control={
          <Checkbox 
            checked={checked} 
            onChange={onChange} 
          />
        } 
        label={label} 
      />
    </Grid>
  );
}

export default MyCheckbox;