import React from 'react';
import { Grid, Button } from '@mui/material';
import { optionsMdt, optionsAct } from '../utils/Config';
import MultiSelect from './MultiSelect';
import MySelect from './MySelect';
import MyCheckbox from './MyCheckbox';
import CommandPreview from './CommandPreview';
import ExecutionResults from './ExecutionResults';
import FormStateDebug from './FormStateDebug';
import { CommandService } from '../services/CommandService';

/**
 * Componente principale del form per configurare ed eseguire i comandi
 */
function GeneralForm({ 
  formState, 
  handleChangeSelect, 
  handleChangeCheckbox,
  setSelectedInput,
  setSelectedRecordtype,
  settings, 
  workspacePath,
  availableInput,
  availableObjects,
  availableRecordtypes,
  isExecuting,
  executionResult,
  executionError,
  onExecuteCommand
}) {

  const executeCommand = async () => {
    const validationError = CommandService.getValidationError(formState, settings);
    if (validationError) {
      // In una app reale useresti un toast o notification system
      console.error(validationError);
      return;
    }

    try {
      const commandData = CommandService.buildExecutionCommand(formState, settings);
      console.log('Executing command:', commandData);
      
      onExecuteCommand(commandData);
    } catch (error) {
      console.error('Error building command:', error);
    }
  };

  const canExecute = () => {
    return CommandService.canExecute(formState, settings) && !isExecuting;
  };

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

        {/* Multiselect for generic input (full width) */}
        {formState.selectInput && (
          <Grid item xs={12}>
            <MultiSelect 
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

        {/* RecordType multiselect (full width) */}
        {formState.selectObject && formState.selectedObject && formState.selectRecordtype && (
          <Grid item xs={12}>
            <MultiSelect 
              metadata="recordtypes"
              optionList={availableRecordtypes}
              selectedOptions={formState.selectedRecordtype}
              setSelectedOptions={setSelectedRecordtype}
            />
          </Grid>
        )}
      </Grid>

      {/* Command Preview - only show if debug info is enabled */}
      {formState.viewDebugInfo && (
        <Grid container spacing={2} style={{marginTop: '1rem'}}>
          <Grid item xs={12}>
            <CommandPreview 
              formState={formState}
              settings={settings}
              workspacePath={workspacePath}
            />
          </Grid>
        </Grid>
      )}

      {/* Execute Button */}
      <Grid container spacing={2} style={{marginTop: '1rem'}}>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={executeCommand}
            disabled={!canExecute()}
            fullWidth
          >
            {isExecuting ? 'Executing...' : 'Execute Command'}
          </Button>
        </Grid>
      </Grid>

      {/* Results Display */}
      <ExecutionResults 
        executionResult={executionResult}
        executionError={executionError}
        viewDebugInfo={formState.viewDebugInfo}
      />

      {/* Form State Debug Info - only show if debug info is enabled */}
      {formState.viewDebugInfo && (
        <FormStateDebug
          formState={formState}
          settings={settings}
          workspacePath={workspacePath}
          availableInput={availableInput}
          availableObjects={availableObjects}
          availableRecordtypes={availableRecordtypes}
          isExecuting={isExecuting}
          executionResult={executionResult}
          executionError={executionError}
        />
      )}
    </div>
  );
}

export default GeneralForm;