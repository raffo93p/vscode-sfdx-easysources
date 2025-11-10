import React from 'react';
import { Grid } from '@mui/material';
import MySelect from './MySelect';

/**
 * Componente per i campi specifici dell'azione Are Aligned
 */
function AreAlignedFields({ 
  formState, 
  handleChangeSelect
}) {
  // Se non è arealigned, non mostrare nulla
  if (formState.action !== 'arealigned') {
    return null;
  }

  // Opzioni per il campo mode
  const modeOptions = [
    {label: 'String', value: 'string'},
    {label: 'Logic', value: 'logic'}
  ];

  return (
    <Grid container spacing={2}>
      {/* Campo Mode */}
      <Grid item xs={6}>
        <MySelect 
          label="Mode"
          options={modeOptions}
          value={formState.mode}
          onChange={(event) => handleChangeSelect(event, "mode")}
        />
      </Grid>
    </Grid>
  );
}

export default AreAlignedFields;