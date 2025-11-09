import { useState } from 'react';
import { metadataAction_params } from '../utils/Config';
import { getMetadataInputList } from '../utils/MdtSelectUtils';
import { vscode } from '../index';

/**
 * Hook per gestire lo stato del form principale
 */
export function useFormState(settings) {
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
    viewDebugInfo: false,
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
      updates.selectedObject = '';
      updates.selectedRecordtype = null;
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
      // Load metadata input list
      getMetadataInputList(settings, formState.metadata, vscode);
      // This would typically trigger a side effect to update availableInput
    }

    if (whatCheckbox === "selectRecordtype" && checked) {
      // Load recordtype list for selected object
      getMetadataInputList(settings, formState.metadata, vscode, formState.selectedObject);
      // This would typically trigger a side effect to update availableRecordtypes
    }

    if (whatCheckbox === "selectObject" && checked) {
      // Load objects list
      getMetadataInputList(settings, "object", vscode);
      // This would typically trigger a side effect to update availableObjects  
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