import React from 'react';
import { Alert } from '@mui/material';
import { CommandService } from '../services/CommandService';

/**
 * Componente per mostrare il preview del comando
 */
function ApiPreview({ formState, settings, workspacePath }) {
  return (
    <Alert severity="info">
      <strong>Api Preview:</strong>
      <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontFamily: 'monospace'}}>
        {CommandService.buildApiPreview(formState, settings, workspacePath)}
      </pre>
    </Alert>
  );
}

export default ApiPreview;