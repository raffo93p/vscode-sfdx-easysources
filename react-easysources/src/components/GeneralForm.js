import React from 'react';
import { Grid, Divider } from '@mui/material';
import { optionsMdt, optionsAct } from '../utils/Config';
import MyMultiSelect from './base/MyMultiSelect';
import MySelect from './base/MySelect';
import MyCheckbox from './base/MyCheckbox';
import ApiPreview from './preview/ApiPreview';
import CommandPreview from './preview/CommandPreview';
import ExecutionResults from './ExecutionResults';
import FormStateDebug from './preview/FormStateDebug';
import DeleteFields from './fields/DeleteFields';
import AreAlignedFields from './fields/AreAlignedFields';
import CustomUpsertFields from './fields/CustomUpsertFields';
import { useAppContext } from '../context/AppContext';
import { ACTION_DESCRIPTIONS } from '../constants/ActionDescriptions';

/**
 * Componente principale del form per configurare ed eseguire i comandi
 */
function GeneralForm({ 
  formState, 
  handleChangeSelect, 
  handleChangeCheckbox,
  handleChangeText,
  setSelectedInput,
  setSelectedRecordtype
}) {
  // Leggiamo solo i dati necessari dal Context
  const { state } = useAppContext();
  const { 
    availableInput,
    availableObjects,
    availableRecordtypes
  } = state;

  return (
    <div>
      <Grid container spacing={2}>
        {/* First Row - Metadata and Action on the left, Specify Metadata on the right */}
        <Grid item xs={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <MySelect 
                label="Metadata"
                options={optionsMdt}
                value={formState.metadata}
                onChange={(event) => handleChangeSelect(event, "metadata")}
              />
            </Grid>
            <Grid item xs={6}>
              <MySelect 
                label="Action"
                options={optionsAct[formState.metadata]}
                value={formState.action}
                onChange={(event) => handleChangeSelect(event, "action")}
                helpText={ACTION_DESCRIPTIONS[formState.action]}
              />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Specify Metadata checkbox on the right (only if not labels or recordtypes) */}
        {formState.metadata !== 'labels' && formState.metadata !== 'recordtypes' && (
          <Grid item xs={4}>
            <MyCheckbox
              checked={formState.selectInput}
              onChange={(event) => handleChangeCheckbox(event, "selectInput")}
              label={"Select " + formState.metadata}
            />
          </Grid>
        )}

        {/* MyMultiSelect for generic input (full width) */}
        {formState.selectInput && (
          <Grid item xs={12}>
            <MyMultiSelect 
              metadata={formState.metadata}
              optionList={availableInput}
              selectedOptions={formState.selectedInput}
              setSelectedOptions={setSelectedInput}
            />
          </Grid>
        )}

        {/* Specify Object checkbox on the right (only for recordtypes and when selectInput is not shown) */}
        {(formState.metadata === 'recordtypes') && (
          <Grid item xs={4}>
            <MyCheckbox
              checked={formState.selectObject}
              onChange={(event) => handleChangeCheckbox(event, "selectObject")}
              label="Select object"
            />
          </Grid>
        )}

        {/* Object Selection */}
        {formState.selectObject && (
          <Grid item xs={8}>
            <MySelect 
              label="Object"
              options={availableObjects}
              value={formState.selectedObject}
              onChange={(event) => handleChangeSelect(event, "selectedObject")}
            />
          </Grid>
        )}

        {/* RecordType - Select RecordType checkbox (right of Object select) */}
        {formState.selectObject && formState.selectedObject && formState.selectedObject !== '' && (
          <Grid item xs={4}>
            <MyCheckbox
              checked={formState.selectRecordtype}
              onChange={(event) => handleChangeCheckbox(event, "selectRecordtype")}
              label="Select record types"
            />
          </Grid>
        )}

        {/* RecordType MyMultiSelect (full width) */}
        {formState.selectObject && formState.selectedObject && formState.selectRecordtype && (
          <Grid item xs={12}>
            <MyMultiSelect 
              metadata="recordtypes"
              optionList={availableRecordtypes}
              selectedOptions={formState.selectedRecordtype}
              setSelectedOptions={setSelectedRecordtype}
            />
          </Grid>
        )}

        {/* Delete Fields - Mostra i campi specifici per l'azione Delete */}
        {formState.action === 'delete' && (
          <Grid item xs={12} style={{marginTop: '1rem'}}>
            <DeleteFields 
              formState={formState}
              handleChangeSelect={handleChangeSelect}
              handleChangeText={handleChangeText}
            />
          </Grid>
        )}

        {/* Are Aligned Fields - Mostra i campi specifici per l'azione Are Aligned */}
        {formState.action === 'arealigned' && (
          <Grid item xs={12} style={{marginTop: '1rem'}}>
            <AreAlignedFields 
              formState={formState}
              handleChangeSelect={handleChangeSelect}
            />
          </Grid>
        )}

        {/* Custom Upsert Fields - Mostra i campi specifici per l'azione Custom Upsert */}
        {formState.action === 'customupsert' && (
          <Grid item xs={12} style={{marginTop: '1rem'}}>
            <CustomUpsertFields 
              formState={formState}
              handleChangeSelect={handleChangeSelect}
              handleChangeText={handleChangeText}
            />
          </Grid>
        )}
      </Grid>

      {/* Divider between form and preview */}
      <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />

      {/* Command Calculated - Always show in real-time */}
      <CommandPreview formState={formState} />

      {/* Command Preview - only show if debug info is enabled */}
      {formState.viewDebugInfo && (
        <Grid container spacing={2} style={{marginTop: '1rem'}}>
          <Grid item xs={12}>
            <ApiPreview formState={formState} />
          </Grid>
        </Grid>
      )}

      {/* Divider between preview and results */}
      <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />

      {/* Results Display */}
      <ExecutionResults 
        viewDebugInfo={formState.viewDebugInfo}
        action={formState.action}
      />

      {/* Form State Debug Info - only show if debug info is enabled */}
      {formState.viewDebugInfo && (
        <FormStateDebug formState={formState} />
      )}
    </div>
  );
}

export default GeneralForm;