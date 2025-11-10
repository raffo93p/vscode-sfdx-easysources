import React from 'react';
import { Alert } from '@mui/material';
import { CommandService } from '../services/CommandService';

/**
 * Componente per mostrare il preview del comando
 */
function CommandPreview({ formState, settings, workspacePath }) {
  return (
    <Alert severity="info">
      <strong>Command Preview:</strong>
      <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontFamily: 'monospace'}}>
        {CommandService.buildCommandPreview(formState, settings, workspacePath)}
      </pre>
    </Alert>
  );
}

export default CommandPreview;