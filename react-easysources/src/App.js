import React from 'react';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import logo from './assets/EasySources_Logo.png';
import './App.css'; 
import GeneralForm from './components/GeneralForm';
import { useSettings, useApiExecution } from './hooks/useSettings';
import { useFormState } from './hooks/useFormState';
import { useAppContext, AppProvider } from './context/AppContext';
import { vscode } from "./index";
import MyCheckbox from './components/base/MyCheckbox';
import { CommandService } from './services/CommandService';


// Componente interno che usa il context
function AppContent() {
  // Hooks per gestire lo stato dell'applicazione
  useSettings(); // Carica le settings nel Context
  const { executeCommand } = useApiExecution();
  const { state } = useAppContext();
  
  const { 
    formState, 
    handleChangeSelect, 
    handleChangeCheckbox,
    handleChangeText,
    setSelectedInput,
    setSelectedRecordtype
  } = useFormState();

  // Estraiamo i dati dal global state
  const { 
    settings,
    workspacePath,
    availableInput, 
    availableObjects, 
    availableRecordtypes,
    isExecuting,
    executionResult,
    executionError,
    isLoading
  } = state;

  // Theme configuration
  const element = document.querySelector("body");
  const prefersDarkMode = element.classList.contains("vscode-dark");
  const preferredTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  });

  // Debug helper
  const handleDebugState = () => {
    if (vscode && vscode.postMessage) {
      vscode.postMessage({ 
        command: 'DEBUG_LOG', 
        data: JSON.stringify({ 
          formState, 
          settings, 
          workspacePath,
          availableInput,
          availableObjects,
          availableRecordtypes,
          isExecuting,
          executionResult,
          executionError
        }, null, 2) 
      });
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <ThemeProvider theme={preferredTheme}>
      <div className="HomePage">
        <header className="HomePage-header">
          <img width={60} src={logo} alt="EasySources logo"/> 
          <h1 style={{paddingLeft:'1rem'}}>SFDX EasySources</h1>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {formState.viewDebugInfo && (
              <Button 
                size="small" 
                variant="outlined" 
                onClick={handleDebugState}
                style={{height: 'fit-content'}}
              >
                Debug State
              </Button>
            )}
            <MyCheckbox
              checked={formState.viewDebugInfo}
              onChange={(event) => handleChangeCheckbox(event, "viewDebugInfo")}
              label="View Debug Info"
              size={12}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                const validationError = CommandService.getValidationError(formState, settings);
                if (validationError) {
                  console.error(validationError);
                  return;
                }
                try {
                  const commandData = CommandService.buildExecutionCommand(formState, settings);
                  console.log('Executing command:', commandData);
                  executeCommand(commandData);
                } catch (error) {
                  console.error('Error building command:', error);
                }
              }}
              disabled={!formState.metadata || !formState.action || !settings || isExecuting}
              style={{height: 'fit-content'}}
            >
              {isExecuting ? 'Executing...' : 'Execute Command'}
            </Button>
          </div>
        </header>
            
        <div>
          <p>Welcome to the SFDX EasySources project! From here you can compose and run sfdx-easy-sources commands.</p>
          <GeneralForm 
            formState={formState}
            handleChangeSelect={handleChangeSelect}
            handleChangeCheckbox={handleChangeCheckbox}
            handleChangeText={handleChangeText}
            setSelectedInput={setSelectedInput}
            setSelectedRecordtype={setSelectedRecordtype}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

// Componente App principale con Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
