import { useState, useEffect } from 'react';
import { vscode } from '../index';
import { useAppContext } from '../context/AppContext';

/**
 * Hook personalizzato per gestire le settings
 */
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [workspacePath, setWorkspacePath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prova a leggere il file easysources-settings.json tramite l'API VSCode
    if (vscode && vscode.postMessage) {
      vscode.postMessage({ command: 'READ_SETTINGS_FILE' });
    }

    // Listener per la risposta
    const handler = (event) => {
      const message = event.data;
      if (message.command === 'SETTINGS_FILE_CONTENT') {
        setSettings(JSON.parse(message.content));
        setWorkspacePath(message.workspacePath);
        setIsLoading(false);
      }
      if (message.command === 'SETTINGS_FILE_NOT_FOUND') {
        setSettings(null);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return { settings, workspacePath, isLoading };
}

/**
 * Hook per gestire l'esecuzione delle API - ora usa il global state
 */
export function useApiExecution() {
  const { dispatch } = useAppContext();
  
  const executeCommand = (commandData) => {
    // Impostiamo lo stato di esecuzione nel global state
    dispatch({ type: 'SET_EXECUTING', payload: true });
    
    if (vscode && vscode.postMessage) {
      vscode.postMessage(commandData);
    }
  };

  return {
    executeCommand
  };
}

/**
 * Hook per gestire la lista dei metadata
 */
export function useMetadataList() {
  const [availableInput, setAvailableInput] = useState([]);
  const [availableObjects, setAvailableObjects] = useState([]);
  const [availableRecordtypes, setAvailableRecordtypes] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const message = event.data;
      
      if (message.command === 'GET_METADATA_INPUT_LIST_RESPONSE') {
        // Determina se è per input generico, objects o recordtypes
        if (message.metadata === 'object') {
          setAvailableObjects(message.metadataList);
        } else if (message.metadata === 'recordtypes') {
          setAvailableRecordtypes(message.metadataList);
        } else {
          setAvailableInput(message.metadataList);
        }
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return {
    availableInput,
    availableObjects, 
    availableRecordtypes,
    setAvailableInput,
    setAvailableObjects,
    setAvailableRecordtypes
  };
}