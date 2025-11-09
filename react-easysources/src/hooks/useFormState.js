import { useState } from 'react';
import { metadataAction_params } from '../utils/Config';
import { getMetadataInputList } from '../utils/MdtSelectUtils';
import { vscode } from '../index';
import { useAppContext } from '../context/AppContext';

/**
 * Hook per gestire lo stato del form principale
 */
export function useFormState(settings) {
  const { dispatch } = useAppContext();
  
  const [formState, setFormState] = useState({
    metadata: '',
    action: '',
    sort: null,
    selectInput: null,
    selectedInput: null,
    selectObject: null,
    selectedObject: null,
    selectRecordtype: null,
    selectedRecordtype: null,
    viewDebugInfo: false
  });

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const setSelectedInput = (selected) => {
    setFormState(prev => ({ ...prev, selectedInput: selected }));
  };

  const setSelectedRecordtype = (selected) => {
    setFormState(prev => ({ ...prev, selectedRecordtype: selected }));
  };

  const handleChangeSelect = (event, whatSelect) => {
    const value = event.target.value;
    
    const updates = { [whatSelect]: value };

    if (whatSelect === "metadata") {
      // Reset all dependent fields when metadata changes
      updates.action = '';
      updates.sort = null;
      updates.selectInput = null;
      updates.selectedInput = null;
      updates.selectObject = null;
      updates.selectRecordtype = null;
      updates.selectedObject = null;
      updates.selectedRecordtype = null;
      
      // Reset global state
      dispatch({ type: 'RESET_EXECUTION_STATE' });
      dispatch({ type: 'CLEAR_LISTS' });
    }

    if (whatSelect === "selectedObject") {
      // When object changes, clear recordtypes
      updates.selectRecordtype = false;
      updates.selectedRecordtype = null;
    }

    if (whatSelect === "action") {
      const metadata = formState.metadata;
      const action = value;
      
      updates.sort = metadataAction_params[metadata]?.[action]?.sort ?? null;
      updates.selectInput = metadataAction_params[metadata]?.[action]?.selectInput ?? null;
      updates.selectObject = metadataAction_params[metadata]?.[action]?.selectObject ?? null;
      updates.selectRecordtype = metadataAction_params[metadata]?.[action]?.selectRecordtype ?? null;
    }

    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleChangeCheckbox = (event, whatCheckbox) => {
    const checked = event.target.checked;
    const updates = { [whatCheckbox]: checked };

    if (whatCheckbox === "selectInput" && checked) {
      dispatch({ type: 'SET_LOADING', payload: true });
      getMetadataInputList(settings, formState.metadata, vscode);
    }

    if (whatCheckbox === "selectRecordtype" && checked) {
      dispatch({ type: 'SET_LOADING', payload: true });
      getMetadataInputList(settings, formState.metadata, vscode, formState.selectedObject);
    }

    if (whatCheckbox === "selectObject" && checked) {
      dispatch({ type: 'SET_LOADING', payload: true });
      getMetadataInputList(settings, "object", vscode);
    }

    setFormState(prev => ({ ...prev, ...updates }));
  };

  return {
    formState,
    updateField,
    handleChangeSelect,
    handleChangeCheckbox,
    setSelectedInput,
    setSelectedRecordtype
  };
}