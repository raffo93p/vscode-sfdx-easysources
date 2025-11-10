import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  Alert,
  Box,
  Typography
} from '@mui/material';

/**
 * Componente per mostrare i risultati dell'azione Are Aligned in formato tabellare
 */
function AreAlignedResults({ executionResult }) {

  // Se non c'è un result, non mostrare nulla
  if (!executionResult) {
    return null;
  }

  // Nuovo formato: {result, summary: {totalItems, alignedItems, ...}, items: {itemName: {result, error}}}
  let summaryData = null;
  let itemsData = null;
  let resultsArray = [];

  if (executionResult.summary && executionResult.items) {
    // Nuovo formato
    summaryData = executionResult.summary;
    itemsData = executionResult.items;
    
    // Converti gli items da oggetto ad array per la tabella
    resultsArray = Object.keys(itemsData).map(itemName => {
      const item = itemsData[itemName];
      return {
        itemName: itemName,
        isAligned: item.result === 'OK',
        isWarning: item.result === 'WARN',
        differences: item.error ? [item.error] : []
      };
    });
  } else {
    // Formato precedente per backward compatibility
    let resultData = executionResult;
    if (executionResult.result && typeof executionResult.result === 'object') {
      resultData = executionResult.result;
    }

    if (!resultData.results && resultData.totalItems === undefined) {
      return null;
    }

    summaryData = {
      totalItems: resultData.totalItems,
      alignedItems: resultData.alignedItems,
      misalignedItems: resultData.misalignedItems,
      warningItems: resultData.warningItems
    };
    resultsArray = resultData.results || [];
  }



  const { totalItems, alignedItems, misalignedItems, warningItems } = summaryData;

  // Se non ci sono risultati individuali, mostra solo il summary
  if (!resultsArray || resultsArray.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          <Typography variant="h6" component="div" gutterBottom>
            Are Aligned Results Summary
          </Typography>
          <Typography variant="body2">
            Total Items: {totalItems || 0} | 
            Aligned: {alignedItems || 0} | 
            Misaligned: {misalignedItems || 0} | 
            Warnings: {warningItems || 0}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            No detailed results available.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Summary */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          Are Aligned Results Summary
        </Typography>
        <Typography variant="body2">
          Total Items: {totalItems || 0} | 
          Aligned: {alignedItems || 0} | 
          Misaligned: {misalignedItems || 0} | 
          Warnings: {warningItems || 0}
        </Typography>
      </Alert>

      {/* Detailed Results Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell><strong>Differences</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultsArray.map((result, index) => (
              <TableRow 
                key={index}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {result.itemName || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={
                      result.isAligned ? 'Aligned' : 
                      result.isWarning ? 'Warning' : 'Misaligned'
                    }
                    color={
                      result.isAligned ? 'success' : 
                      result.isWarning ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {result.differences && result.differences.length > 0 ? (
                    <Box>
                      {result.differences.map((diff, diffIndex) => (
                        <Typography 
                          key={diffIndex}
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.8rem',
                            color: result.isAligned ? 'text.secondary' : 
                                   result.isWarning ? 'warning.main' : 'error.main',
                            mb: diffIndex < result.differences.length - 1 ? 0.5 : 0
                          }}
                        >
                          {diff}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No differences
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AreAlignedResults;