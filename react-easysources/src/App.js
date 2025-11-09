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
import MyCheckbox from './components/MyCheckbox';


// Componente interno che usa il context
function AppContent() {
  // Hooks per gestire lo stato dell'applicazione
  const { settings, workspacePath, isLoading } = useSettings();
  const { executeCommand } = useApiExecution();
  const { state } = useAppContext(); // Otteniamo il global state
  
  const { 
    formState, 
    handleChangeSelect, 
    handleChangeCheckbox,
    setSelectedInput,
    setSelectedRecordtype
  } = useFormState(settings);

  // Estraiamo i dati dal global state
  const { 
    availableInput, 
    availableObjects, 
    availableRecordtypes,
    isExecuting,
    executionResult,
    executionError
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
            <MyCheckbox
              checked={formState.viewDebugInfo}
              onChange={(event) => handleChangeCheckbox(event, "viewDebugInfo")}
              label="View Debug Info"
              size={12}
            />
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleDebugState}
              style={{height: 'fit-content'}}
            >
              Debug State
            </Button>
          </div>
        </header>
            
        <div>
          <p>Welcome to the SFDX EasySources project! This is a test for the react-easysources project.</p>
          <GeneralForm 
            formState={formState}
            handleChangeSelect={handleChangeSelect}
            handleChangeCheckbox={handleChangeCheckbox}
            setSelectedInput={setSelectedInput}
            setSelectedRecordtype={setSelectedRecordtype}
            settings={settings}
            workspacePath={workspacePath}
            availableInput={availableInput}
            availableObjects={availableObjects}
            availableRecordtypes={availableRecordtypes}
            isExecuting={isExecuting}
            executionResult={executionResult}
            executionError={executionError}
            onExecuteCommand={executeCommand}
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
