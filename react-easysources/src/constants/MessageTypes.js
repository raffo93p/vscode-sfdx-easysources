/**
 * Constants for message types and action types in the React application
 */

/**
 * Message types sent FROM React app TO extension
 */
export const OUTGOING_MESSAGE_TYPES = {
  DEBUG_LOG: 'DEBUG_LOG',
  GET_METADATA_INPUT_LIST: 'GET_METADATA_INPUT_LIST',
  READ_SETTINGS_FILE: 'READ_SETTINGS_FILE',
  EXECUTE_API: 'EXECUTE_API',
};

/**
 * Message types received FROM extension TO React app
 */
export const INCOMING_MESSAGE_TYPES = {
  SETTINGS_FILE_CONTENT: 'SETTINGS_FILE_CONTENT',
  SETTINGS_FILE_NOT_FOUND: 'SETTINGS_FILE_NOT_FOUND',
  GET_METADATA_INPUT_LIST_RESPONSE: 'GET_METADATA_INPUT_LIST_RESPONSE',
  API_EXECUTION_RESULT: 'API_EXECUTION_RESULT',
  API_EXECUTION_ERROR: 'API_EXECUTION_ERROR',
};

/**
 * All message types (union of incoming and outgoing)
 */
export const MESSAGE_TYPES = {
  ...OUTGOING_MESSAGE_TYPES,
  ...INCOMING_MESSAGE_TYPES,
};

/**
 * Redux-like action types for AppContext reducer
 */
export const ACTION_TYPES = {
  UPDATE_STATE: 'UPDATE_STATE',
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_AVAILABLE_LIST: 'UPDATE_AVAILABLE_LIST',
  SET_EXECUTION_RESULT: 'SET_EXECUTION_RESULT',
  SET_EXECUTION_ERROR: 'SET_EXECUTION_ERROR',
  SET_LOADING: 'SET_LOADING',
  SET_EXECUTING: 'SET_EXECUTING',
  RESET_EXECUTION_STATE: 'RESET_EXECUTION_STATE',
  CLEAR_LISTS: 'CLEAR_LISTS',
};

/**
 * List types for UPDATE_AVAILABLE_LIST action
 */
export const LIST_TYPES = {
  AVAILABLE_INPUT: 'availableInput',
  AVAILABLE_OBJECTS: 'availableObjects',
  AVAILABLE_RECORDTYPES: 'availableRecordtypes',
};

/**
 * Metadata types
 */
export const METADATA_TYPES = {
  APPLICATIONS: 'applications',
  GLOBAL_VALUE_SETS: 'globalvaluesets',
  GLOBAL_VALUE_SET_TRANSLATIONS: 'globalvaluesettranslations',
  LABELS: 'labels',
  OBJECT: 'object',
  OBJECT_TRANSLATIONS: 'objecttranslations',
  PERMISSION_SETS: 'permissionsets',
  PROFILES: 'profiles',
  RECORD_TYPES: 'recordtypes',
  TRANSLATIONS: 'translations',
};
