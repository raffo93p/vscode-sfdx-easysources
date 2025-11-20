import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Logger from '../utils/Logger';

// Initial state per il global state
export const initialState = {
  availableInput: [],
  availableObjects: [], 
  availableRecordtypes: [],
  executionResult: null,
  executionError: null,
  isLoading: false,
  isExecuting: false,
  settings: null,
  workspacePath: null
};

// Reducer per gestire il global state
export function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_STATE':
        return {
            ...state,
            ...action.payload
        };
    
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload.settings,
        workspacePath: action.payload.workspacePath,
        isLoading: false
      };
    
    case 'UPDATE_AVAILABLE_INPUT':
      return {
        ...state,
        availableInput: action.payload || [],
        isLoading: false
      };
    
    case 'UPDATE_AVAILABLE_OBJECTS':
      return {
        ...state,
        availableObjects: action.payload || [],
        isLoading: false
      };
    
    case 'UPDATE_AVAILABLE_RECORDTYPES':
      return {
        ...state,
        availableRecordtypes: action.payload || [],
        isLoading: false
      };
    
    case 'SET_EXECUTION_RESULT':
      return {
        ...state,
        executionResult: action.payload,
        executionError: null,
        isExecuting: false
      };
    
    case 'SET_EXECUTION_ERROR':
      return {
        ...state,
        executionError: action.payload,
        executionResult: null,
        isExecuting: false
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_EXECUTING':
      return {
        ...state,
        isExecuting: true,
        executionResult: null,
        executionError: null
      };
    
    case 'RESET_EXECUTION_STATE':
      return {
        ...state,
        executionResult: null,
        executionError: null,
        isExecuting: false
      };
    
    case 'CLEAR_LISTS':
      return {
        ...state,
        availableInput: [],
        availableObjects: [],
        availableRecordtypes: []
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Listener per i messaggi dalla VS Code extension
  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      Logger.debug('Received message from extension:', message);
      
      switch (message.command) {
        case 'GET_METADATA_INPUT_LIST_RESPONSE':
          Logger.debug('GET_METADATA_INPUT_LIST_RESPONSE', message.metadataList);
          
          // Determina se è per input generico, objects o recordtypes
          if (message.metadata === 'object') {
            dispatch({ 
              type: 'UPDATE_AVAILABLE_OBJECTS', 
              payload: message.metadataList 
            });
          } else if (message.metadata === 'recordtypes') {
            dispatch({ 
              type: 'UPDATE_AVAILABLE_RECORDTYPES', 
              payload: message.metadataList 
            });
          } else {
            dispatch({ 
              type: 'UPDATE_AVAILABLE_INPUT', 
              payload: message.metadataList 
            });
          }
          break;
          
        case 'API_EXECUTION_RESULT':
          Logger.log('API_EXECUTION_RESULT');
          dispatch({ 
            type: 'SET_EXECUTION_RESULT', 
            payload: message.result 
          });
          break;
        
        case 'API_EXECUTION_ERROR':
          Logger.error('API_EXECUTION_ERROR', message.error);
          dispatch({ 
            type: 'SET_EXECUTION_ERROR', 
            payload: message.error 
          });
          break;
          
        default:
          Logger.warn('Unknown message command:', message.command);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook per utilizzare il context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}