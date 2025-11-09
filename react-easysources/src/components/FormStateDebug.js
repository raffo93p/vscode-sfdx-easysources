import React from 'react';
import { Grid, Alert } from '@mui/material';

/**
 * Componente per visualizzare il form state in modalità debug
 */
function FormStateDebug({ formState, settings, workspacePath, availableInput, availableObjects, availableRecordtypes, isExecuting, executionResult, executionError }) {
  const debugData = {
    formState,
    settings: settings ? 'Loaded' : 'Not loaded',
    workspacePath,
    availableInput: availableInput ? availableInput.length : 0,
    availableObjects: availableObjects ? availableObjects.length : 0,
    availableRecordtypes: availableRecordtypes ? availableRecordtypes.length : 0,
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