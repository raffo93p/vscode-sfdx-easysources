import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Logger from '../utils/Logger';
import { ACTION_TYPES, INCOMING_MESSAGE_TYPES, LIST_TYPES, METADATA_TYPES } from '../constants/MessageTypes';

// Initial state per il global state
export const initialState = {
  availableInput: [],
  availableObjects: [], 
  availableRecordtypes: [],
  executionResult: null,
  executionError: null,
  executedAction: null,
  isLoading: false,
  isExecuting: false,
  settings: null,
  workspacePath: null
};

// Reducer per gestire il global state
export function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_STATE:
        return {
            ...state,
            ...action.payload
        };
    
    case ACTION_TYPES.SET_SETTINGS:
      return {
        ...state,
        settings: action.payload.settings,
        workspacePath: action.payload.workspacePath,
        isLoading: false
      };
    
    case ACTION_TYPES.UPDATE_AVAILABLE_LIST:
      // Generico per availableInput, availableObjects, availableRecordtypes
      return {
        ...state,
        [action.listType]: action.payload || [],
        isLoading: false
      };
    
    case ACTION_TYPES.SET_EXECUTION_RESULT:
      return {
        ...state,
        executionResult: action.payload,
        executionError: null,
        isExecuting: false
      };
    
    case ACTION_TYPES.SET_EXECUTION_ERROR:
      return {
        ...state,
        executionError: action.payload,
        executionResult: null,
        isExecuting: false
      };
    
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ACTION_TYPES.SET_EXECUTING:
      return {
        ...state,
        isExecuting: true,
        executedAction: action.executedAction || null,
        executionResult: null,
        executionError: null
      };
    
    case ACTION_TYPES.RESET_EXECUTION_STATE:
      return {
        ...state,
        executionResult: null,
        executionError: null,
        isExecuting: false
      };
    
    case ACTION_TYPES.CLEAR_LISTS:
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
        case INCOMING_MESSAGE_TYPES.GET_METADATA_INPUT_LIST_RESPONSE:
          Logger.debug('GET_METADATA_INPUT_LIST_RESPONSE', message.metadataList);
          
          // Determina quale lista aggiornare basandosi sul tipo di metadata
          let listType;
          if (message.metadata === METADATA_TYPES.OBJECT) {
            listType = LIST_TYPES.AVAILABLE_OBJECTS;
          } else if (message.metadata === METADATA_TYPES.RECORD_TYPES) {
            listType = LIST_TYPES.AVAILABLE_RECORDTYPES;
          } else {
            listType = LIST_TYPES.AVAILABLE_INPUT;
          }
          
          dispatch({ 
            type: ACTION_TYPES.UPDATE_AVAILABLE_LIST,
            listType,
            payload: message.metadataList 
          });
          break;
          
        case INCOMING_MESSAGE_TYPES.API_EXECUTION_RESULT:
          Logger.log('API_EXECUTION_RESULT');
          dispatch({ 
            type: ACTION_TYPES.SET_EXECUTION_RESULT, 
            payload: message.result 
          });
          break;
        
        case INCOMING_MESSAGE_TYPES.API_EXECUTION_ERROR:
          Logger.error('API_EXECUTION_ERROR', message.error);
          dispatch({ 
            type: ACTION_TYPES.SET_EXECUTION_ERROR, 
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