import React, { useState } from 'react';
import { Box, Typography, IconButton, Snackbar } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { CommandService } from '../../services/CommandService';

/**
 * Componente per visualizzare il comando calcolato in tempo reale
 */
function CommandPreview({ formState }) {
  const [showCopied, setShowCopied] = useState(false);
  const commandString = CommandService.buildCliCommand(formState);

  if (!commandString) {
    return null;
  }

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(commandString);
    setShowCopied(true);
  };

  const handleCloseCopied = () => {
    setShowCopied(false);
  };

  return (
    <>
      <Box 
        sx={{
          marginTop: '1rem',
          padding: '12px 16px',
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(128, 128, 128, 0.2)',
          position: 'relative'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="4px">
          <Typography variant="caption" component="div" style={{opacity: 0.7}}>
            Command Preview:
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleCopyCommand}
            title="Copy command"
            sx={{ padding: '4px' }}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
        <Box 
          component="code"
          sx={{
            fontFamily: 'monospace',
            fontSize: '14px',
            display: 'block',
            wordBreak: 'break-all'
          }}
        >
          {commandString}
        </Box>
      </Box>
      
      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={handleCloseCopied}
        message="Command copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

export default CommandPreview;
