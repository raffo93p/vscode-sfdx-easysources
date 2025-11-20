import { useEffect } from 'react';
import { vscode } from '../index';
import { useAppContext } from '../context/AppContext';
import { OUTGOING_MESSAGE_TYPES, INCOMING_MESSAGE_TYPES, ACTION_TYPES } from '../constants/MessageTypes';

/**
 * Hook personalizzato per gestire le settings - ora usa il global state
 */
export function useSettings() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    // Prova a leggere il file easysources-settings.json tramite l'API VSCode
    if (vscode && vscode.postMessage) {
      vscode.postMessage({ command: OUTGOING_MESSAGE_TYPES.READ_SETTINGS_FILE });
    }

    // Listener per la risposta
    const handler = (event) => {
      const message = event.data;
      if (message.command === INCOMING_MESSAGE_TYPES.SETTINGS_FILE_CONTENT) {
        dispatch({ 
          type: ACTION_TYPES.SET_SETTINGS, 
          payload: {
            settings: JSON.parse(message.content),
            workspacePath: message.workspacePath
          }
        });
      }
      if (message.command === INCOMING_MESSAGE_TYPES.SETTINGS_FILE_NOT_FOUND) {
        dispatch({ 
          type: ACTION_TYPES.SET_SETTINGS, 
          payload: {
            settings: null,
            workspacePath: null
          }
        });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [dispatch]);

  // Non restituiamo più nulla, i dati sono nel Context
  return {};
}

/**
 * Hook per gestire l'esecuzione delle API - ora usa il global state
 */
export function useApiExecution() {
  const { dispatch } = useAppContext();
  
  const executeCommand = (commandData) => {
    // Impostiamo lo stato di esecuzione nel global state
    dispatch({ type: ACTION_TYPES.SET_EXECUTING});
    
    if (vscode && vscode.postMessage) {
      vscode.postMessage(commandData);
    }
  };

  return {
    executeCommand
  };
}