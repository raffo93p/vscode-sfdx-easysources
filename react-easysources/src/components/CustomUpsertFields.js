import React from 'react';
import { Grid } from '@mui/material';
import MySelect from './MySelect';
import MyTextField from './MyTextField';
import { getCustomUpsertTypeOptions, getHeadersForType } from '../utils/CustomUpsertConfig';

/**
 * Componente per i campi specifici dell'azione Custom Upsert
 */
function CustomUpsertFields({ 
  formState, 
  handleChangeSelect,
  handleChangeText
}) {
  // Se non è customupsert, non mostrare nulla
  if (formState.action !== 'customupsert') {
    return null;
  }

  // Ottieni le opzioni per la select del tipo
  const typeOptions = getCustomUpsertTypeOptions();
  
  // Ottieni gli headers per il tipo selezionato
  const headers = formState.customUpsertType ? getHeadersForType(formState.customUpsertType) : [];

  return (
    <Grid container spacing={2}>
      {/* Campo Type - Select del tipo di permesso/visibilità */}
      <Grid item xs={12}>
        <MySelect 
          label="Type"
          options={typeOptions}
          value={formState.customUpsertType || ''}
          onChange={(event) => handleChangeSelect(event, "customUpsertType")}
        />
      </Grid>
      
      {/* Campi dinamici basati sugli headers del tipo selezionato */}
      {formState.customUpsertType && headers.length > 0 && (
        <>
          {headers.map((header, index) => (
            <Grid item xs={6} key={header}>
              <MyTextField
                label={formatHeaderLabel(header)}
                value={formState.customUpsertValues?.[header] || ''}
                onChange={(event) => handleChangeText(event, `customUpsertValue_${header}`)}
                placeholder={`Enter ${formatHeaderLabel(header).toLowerCase()}`}
                lowZIndex={true}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

/**
 * Formatta il nome dell'header in una label leggibile
 * @param {string} header - Nome dell'header
 * @returns {string} Label formattata
 */
function formatHeaderLabel(header) {
  // Converti camelCase in parole separate con maiuscole
  return header
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export default CustomUpsertFields;
