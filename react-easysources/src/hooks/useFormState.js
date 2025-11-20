import { useState, useEffect } from 'react';
import { metadataAction_params } from '../utils/Config';
import { getMetadataInputList } from '../utils/MdtSelectUtils';
import { vscode } from '../index';
import { useAppContext } from '../context/AppContext';
import { ACTION_TYPES } from '../constants/MessageTypes';

/**
 * Hook per gestire lo stato del form principale
 */
export function useFormState() {
  const { dispatch, state } = useAppContext();
  const { settings, availableInput, availableRecordtypes } = state;
  
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
    // Campi per l'azione delete - profiles/permissionsets
    type: '',
    tagid: '',
    // Campi per l'azione delete - recordtypes
    picklist: '',
    apiname: '',
    // Campo per l'azione arealigned
    mode: 'string',
    // Campi per l'azione customupsert
    customUpsertType: '',
    customUpsertValues: {},
    viewDebugInfo: false
  });

  const updateField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const setSelectedInput = (selected) => {
    setFormState(prev => ({ ...prev, selectedInput: selected.sort() }));
  };

  const setSelectedRecordtype = (selected) => {
    setFormState(prev => ({ ...prev, selectedRecordtype: selected.sort() }));
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
      updates.type = '';
      updates.tagid = '';
      updates.picklist = '';
      updates.apiname = '';
      updates.mode = 'string';
      updates.customUpsertType = '';
      updates.customUpsertValues = {};
      
      // Reset global state
      dispatch({ type: ACTION_TYPES.RESET_EXECUTION_STATE });
      dispatch({ type: ACTION_TYPES.CLEAR_LISTS });
    }

    if (whatSelect === "selectedObject") {
      // When object changes, clear recordtypes
      updates.selectRecordtype = false;
      updates.selectedRecordtype = null;
    }

    if (whatSelect === "customUpsertType") {
      // When customUpsertType changes, clear customUpsertValues
      updates.customUpsertValues = {};
    }

    if (whatSelect === "action") {
      const metadata = formState.metadata;
      const action = value;
      
      const actionConfig = metadataAction_params[metadata]?.[action];
      
      updates.sort = actionConfig?.sort ?? null;
      updates.selectInput = actionConfig?.selectInput ?? null;
      updates.selectObject = actionConfig?.selectObject ?? null;
      updates.selectRecordtype = actionConfig?.selectRecordtype ?? null;
      
      // Reset campi specifici quando cambia action
      updates.type = '';
      updates.tagid = '';
      updates.picklist = '';
      updates.apiname = '';
      updates.mode = actionConfig?.mode ?? 'string';
      updates.customUpsertType = '';
      updates.customUpsertValues = {};
      
      // Ricarica le liste se le checkbox sono già spuntate
      // Questo perché cambiando action, le liste disponibili potrebbero cambiare (XML vs CSV)
      const needsReload = formState.selectInput || formState.selectObject || formState.selectRecordtype;
      
      if (needsReload) {
        // Triggera il reload delle liste (verrà gestito in useEffect)
        updates._reloadLists = true;
      }
    }

    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleChangeCheckbox = (event, whatCheckbox) => {
    const checked = event.target.checked;
    const updates = { [whatCheckbox]: checked };

    if (whatCheckbox === "selectInput" && checked) {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      getMetadataInputList(settings, formState.metadata, vscode, null, formState.action);
    }

    if (whatCheckbox === "selectRecordtype" && checked) {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      getMetadataInputList(settings, formState.metadata, vscode, formState.selectedObject, formState.action);
    }

    if (whatCheckbox === "selectObject" && checked) {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      getMetadataInputList(settings, "object", vscode, null, formState.action);
    }

    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleChangeText = (event, whatField) => {
    const value = event.target.value;
    
    // Se il campo inizia con 'customUpsertValue_', aggiorna l'oggetto customUpsertValues
    if (whatField.startsWith('customUpsertValue_')) {
      const headerName = whatField.replace('customUpsertValue_', '');
      setFormState(prev => ({
        ...prev,
        customUpsertValues: {
          ...prev.customUpsertValues,
          [headerName]: value
        }
      }));
    } else {
      setFormState(prev => ({ ...prev, [whatField]: value }));
    }
  };

  // Effetto per ricaricare le liste quando cambia l'action e per filtrare i selected
  useEffect(() => {
    // Ricarica le liste se necessario
    if (formState._reloadLists) {
      // Rimuovi il flag
      setFormState(prev => {
        const newState = { ...prev };
        delete newState._reloadLists;
        return newState;
      });

      // Ricarica le liste attive
      if (formState.selectInput) {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        getMetadataInputList(settings, formState.metadata, vscode, null, formState.action);
      }
      if (formState.selectObject) {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        getMetadataInputList(settings, "object", vscode, null, formState.action);
      }
      if (formState.selectRecordtype && formState.selectedObject) {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        getMetadataInputList(settings, formState.metadata, vscode, formState.selectedObject, formState.action);
      }
    }
  }, [formState._reloadLists, formState.selectInput, formState.selectObject, formState.selectRecordtype, formState.selectedObject, formState.metadata, formState.action, settings, dispatch]);

  // Effetto per filtrare i selected quando cambiano le liste available
  useEffect(() => {
    if (formState.selectedInput && formState.selectedInput.length > 0) {
      const filtered = formState.selectedInput.filter(item => availableInput.includes(item));
      if (filtered.length !== formState.selectedInput.length) {
        setFormState(prev => ({ ...prev, selectedInput: filtered.length > 0 ? filtered : null }));
      }
    }
  }, [availableInput, formState.selectedInput]);

  useEffect(() => {
    if (formState.selectedRecordtype && formState.selectedRecordtype.length > 0) {
      const filtered = formState.selectedRecordtype.filter(item => availableRecordtypes.includes(item));
      if (filtered.length !== formState.selectedRecordtype.length) {
        setFormState(prev => ({ ...prev, selectedRecordtype: filtered.length > 0 ? filtered : null }));
      }
    }
  }, [availableRecordtypes, formState.selectedRecordtype]);

  return {
    formState,
    updateField,
    handleChangeSelect,
    handleChangeCheckbox,
    handleChangeText,
    setSelectedInput,
    setSelectedRecordtype
  };
}