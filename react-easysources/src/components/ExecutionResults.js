import React from 'react';
import { Grid, Alert, Typography, Box } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import ResultsTable from './ResultsTable';
import { useAppContext } from '../context/AppContext';

/**
 * Componente per visualizzare i risultati dell'esecuzione
 */
function ExecutionResults({ viewDebugInfo, action }) {
  const { state } = useAppContext();
  const { executionResult, executionError, executedAction } = state;
  
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
    // Determina lo stato del risultato (OK o KO)
    let hasErrors = false;
    if (executionResult.items) {
      hasErrors = Object.values(executionResult.items).some(item => 
        item.result === 'KO' || item.result === 'WARN' || item.error
      );
    }

    return (
      <>
        {/* Results Summary */}
        {(executionResult.items || action === 'arealigned') && (
          <Grid container spacing={2} style={{marginTop: '1rem'}}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6" component="div" style={{fontWeight: 'bold'}}>
                  Results Summary:
                </Typography>
                {executedAction && (
                  <Typography variant="h6" component="span" style={{fontWeight: 'normal', marginRight: '0.5rem'}}>
                    {executedAction}
                  </Typography>
                )}
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={0.5}
                  sx={{
                    color: hasErrors ? '#d32f2f' : '#2e7d32',
                    fontWeight: 'bold'
                  }}
                >
                  {hasErrors ? (
                    <Error fontSize="medium" />
                  ) : (
                    <CheckCircle fontSize="medium" />
                  )}
                  <Typography variant="h6" component="span" style={{fontWeight: 'bold'}}>
                    {hasErrors ? 'KO' : 'OK'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Are Aligned Results - Special table for arealigned action */}
        {action === 'arealigned' && (
          executionResult.summary || 
          executionResult.totalItems !== undefined || 
          executionResult.results || 
          (executionResult.result && (executionResult.result.totalItems !== undefined || executionResult.result.results))
        ) && (
          <ResultsTable executionResult={executionResult} action={action} />
        )}

        {/* Standard Results Table - For other actions */}
        {action !== 'arealigned' && executionResult.items && (
          <Grid container spacing={2} style={{marginTop: '1rem'}}>
            <Grid item xs={12}>
              <ResultsTable items={executionResult.items} action={action} />
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