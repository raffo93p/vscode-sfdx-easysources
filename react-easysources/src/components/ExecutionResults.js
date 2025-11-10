import React from 'react';
import { Grid, Alert } from '@mui/material';
import ResultsTable from './ResultsTable';
import AreAlignedResults from './AreAlignedResults';

/**
 * Componente per visualizzare i risultati dell'esecuzione
 */
function ExecutionResults({ executionResult, executionError, viewDebugInfo, action }) {
  if (executionError) {
    return (
      <Grid container spacing={2} style={{marginTop: '1rem'}}>
        <Grid item xs={12}>
          <Alert severity="error">
            <strong>Execution Error:</strong>
            <div style={{marginTop: '0.5rem'}}>
              {executionError}
            </div>
          </Alert>
        </Grid>
      </Grid>
    );
  }

  if (executionResult) {
    return (
      <>
        {/* Are Aligned Results - Special table for arealigned action */}
        {action === 'arealigned' && (
          executionResult.summary || 
          executionResult.totalItems !== undefined || 
          executionResult.results || 
          (executionResult.result && (executionResult.result.totalItems !== undefined || executionResult.result.results))
        ) && (
          <AreAlignedResults executionResult={executionResult} />
        )}

        {/* Standard Results Table - For other actions */}
        {action !== 'arealigned' && executionResult.items && (
          <Grid container spacing={2} style={{marginTop: '1rem'}}>
            <Grid item xs={12}>
              <ResultsTable items={executionResult.items} />
            </Grid>
          </Grid>
        )}

        {/* Debug Results Display */}
        {viewDebugInfo && (
        <Grid container spacing={2} style={{marginTop: '1rem'}}>
          <Grid item xs={12}>
            <Alert severity="success">
              <strong>Execution Result:</strong>
              <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem'}}>
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </Alert>
          </Grid>
        </Grid>
        )}
      </>
    );
  }

  return null;
}

export default ExecutionResults;