import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

/**
 * Componente riutilizzabile per mostrare un tooltip di aiuto
 */
function HelpTooltip({ title }) {
  return (
    <Tooltip title={title} placement="right" arrow>
      <IconButton 
        size="small" 
        sx={{ 
          padding: '2px',
          marginBottom: '4px',
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <HelpOutline fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

export default HelpTooltip;
