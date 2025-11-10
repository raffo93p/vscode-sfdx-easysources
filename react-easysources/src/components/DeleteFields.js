import React from 'react';
import { Grid } from '@mui/material';
import MySelect from './MySelect';
import MyTextField from './MyTextField';
import { metadataAction_params } from '../utils/Config';

/**
 * Componente per i campi specifici dell'azione Delete
 */
function DeleteFields({ 
  formState, 
  handleChangeSelect,
  handleChangeText
}) {
  // Ottieni la configurazione per il tipo di metadata e azione corrente
  const deleteConfig = metadataAction_params[formState.metadata]?.delete;
  
  // Se non è delete o non c'è configurazione, non mostrare nulla
  if (formState.action !== 'delete' || !deleteConfig) {
    return null;
  }

  // Determina se è recordtypes per mostrare campi diversi
  const isRecordTypes = formState.metadata === 'recordtypes';

  if (isRecordTypes) {
    // Campi specifici per recordtypes: picklist e apiname
    return (
      <Grid container spacing={2}>
        {/* Campo Picklist */}
        <Grid item xs={6}>
          <MyTextField
            label="Picklist"
            value={formState.picklist}
            onChange={(event) => handleChangeText(event, "picklist")}
            placeholder="Enter picklist name"
            lowZIndex={true}
          />
        </Grid>
        
        {/* Campo API Name */}
        <Grid item xs={6}>
          <MyTextField
            label="API Name"
            value={formState.apiname}
            onChange={(event) => handleChangeText(event, "apiname")}
            placeholder="Enter API name"
            lowZIndex={true}
          />
        </Grid>
      </Grid>
    );
  }

  // Campi per profiles e permissionsets: type e tagid
  const typeOptions = deleteConfig.type || [];

  return (
    <Grid container spacing={2}>
      {/* Campo Type */}
      <Grid item xs={6}>
        <MySelect 
          label="Type"
          options={typeOptions}
          value={formState.type}
          onChange={(event) => handleChangeSelect(event, "type")}
        />
      </Grid>
      
      {/* Campo Tag ID */}
      <Grid item xs={6}>
        <MyTextField
          label="Tag ID"
          value={formState.tagid}
          onChange={(event) => handleChangeText(event, "tagid")}
          placeholder="Enter tag ID"
          lowZIndex={true}
        />
      </Grid>
    </Grid>
  );
}

export default DeleteFields;