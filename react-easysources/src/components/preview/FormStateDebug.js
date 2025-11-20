import React from 'react';
import { Grid, Alert } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

/**
 * Componente per visualizzare il form state in modalità debug
 */
function FormStateDebug({ formState }) {
  const { state } = useAppContext();
  const { settings, workspacePath, availableInput, availableObjects, availableRecordtypes, isExecuting, executionResult, executionError } = state;
  
  const debugData = {
    formState,
    settings: settings ? 'Loaded' : 'Not loaded',
    workspacePath,
    availableInput: availableInput,
    availableObjects: availableObjects,
    availableRecordtypes: availableRecordtypes,
    isExecuting,
    hasExecutionResult: !!executionResult,
    hasExecutionError: !!executionError,
  };

  return (
    <Grid container spacing={2} style={{marginTop: '2rem'}}>
      <Grid item xs={12}>
        <Alert severity="info">
          <strong>Form State Debug Info:</strong>
          <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '12px'}}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </Alert>
      </Grid>
    </Grid>
  );
}

export default FormStateDebug;