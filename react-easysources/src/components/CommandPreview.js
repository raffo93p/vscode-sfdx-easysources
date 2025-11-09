import React from 'react';
import { Alert } from '@mui/material';

/**
 * Componente per mostrare il preview del comando
 */
function CommandPreview({ formState, settings, workspacePath }) {
  const resolvePath = (relativePath, workspacePath) => {
    if (!relativePath || !workspacePath) return relativePath;
    
    // Se è già un path assoluto, ritornalo così com'è
    if (relativePath.startsWith('/') || relativePath.match(/^[A-Za-z]:\\/)) {
      return relativePath;
    }
    
    // Altrimenti combinalo con il workspace path
    return workspacePath + '/' + relativePath.replace(/^\.\//, '');
  };

  const getCommandPreview = () => {
    if (!formState.metadata || !formState.action) {
      return 'Select metadata and action to see command preview';
    }

    if (!settings) {
      return 'Settings not loaded - make sure easysources-settings.json exists in workspace root';
    }

    if (!workspacePath) {
      return 'Workspace path not available - paths cannot be resolved';
    }

    const metadataApiMapping = {
      'profiles': 'profiles',
      'permissionsets': 'permissionSets',
      'labels': 'labels',
      'applications': 'applications',
      'globalvaluesets': 'globalValueSets',
      'globalvaluesettranslations': 'globalValueSetTranslations',
      'objecttranslations': 'translations',
      'recordtypes': 'recordTypes',
      'translations': 'translations'
    };

    let commandStr = `${metadataApiMapping[formState.metadata]}.${formState.action}(`;
    
    const params = [];
    
    if (formState.sort) {
      params.push(`sort: 'true'`);
    }

    if (formState.selectInput && formState.selectedInput && formState.selectedInput.length > 0) {
      if (formState.metadata !== 'labels' && formState.metadata !== 'recordtypes') {
        params.push(`input: '${formState.selectedInput.map(item => item.value).join(',')}'`);
      }
    }

    if (formState.metadata === 'recordtypes') {
      if (formState.selectedObject) {
        params.push(`object: '${formState.selectedObject}'`);
      }
      
      if (formState.selectRecordtype && formState.selectedRecordtype && formState.selectedRecordtype.length > 0) {
        params.push(`recordtype: '${formState.selectedRecordtype.map(item => item.value).join(',')}'`);
      }
    }

    // Aggiungi i path dalle settings se disponibili (risolti come path assoluti)
    if (settings && workspacePath) {
      if (settings['salesforce-xml-path']) {
        const resolvedXmlPath = resolvePath(settings['salesforce-xml-path'], workspacePath);
        params.push(`'sf-xml': '${resolvedXmlPath}'`);
      }
      if (settings['easysources-csv-path']) {
        const resolvedCsvPath = resolvePath(settings['easysources-csv-path'], workspacePath);
        params.push(`'es-csv': '${resolvedCsvPath}'`);
      }
    }

    if (params.length > 0) {
      commandStr += `{${params.join(', ')}}`;
    }
    
    commandStr += ')';
    
    return commandStr;
  };

  return (
    <Alert severity="info">
      <strong>Command Preview:</strong>
      <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontFamily: 'monospace'}}>
        {getCommandPreview()}
      </pre>
    </Alert>
  );
}

export default CommandPreview;