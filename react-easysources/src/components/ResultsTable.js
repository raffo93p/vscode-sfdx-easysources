import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

/**
 * Componente per visualizzare i risultati dell'esecuzione in formato tabella
 */
function ResultsTable({ items }) {
  const getStatusIcon = (result) => {
    switch (result) {
      case 'OK':
        return <CheckCircle style={{ color: 'green' }} />;
      case 'WARN':
        return <Warning style={{ color: 'orange' }} />;
      case 'KO':
        return <Error style={{ color: 'red' }} />;
      default:
        return <Error style={{ color: 'red' }} />;
    }
  };

  const hasAnyErrors = Object.values(items).some(item => 
    item.result === 'KO' || item.result === 'WARN' || item.error
  );

  return (
    <TableContainer component={Paper} style={{ marginBottom: '1rem' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Resource</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            {hasAnyErrors && <TableCell><strong>Message</strong></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(items).map(([resourceName, resourceData]) => (
            <TableRow key={resourceName}>
              <TableCell>{resourceName}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusIcon(resourceData.result)}
                  <span>{resourceData.result}</span>
                </div>
              </TableCell>
              {hasAnyErrors && (
                <TableCell>
                  {resourceData.error || '-'}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultsTable;