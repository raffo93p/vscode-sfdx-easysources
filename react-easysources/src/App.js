import React from 'react';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import logo from './assets/logo.png';
import './App.css'; 
import GeneralForm from './components/GeneralForm';
import { useSettings, useApiExecution } from './hooks/useSettings';
import { useFormState } from './hooks/useFormState';
import { useAppContext, AppProvider } from './context/AppContext';
import MyCheckbox from './components/base/MyCheckbox';
import { CommandService } from './services/CommandService';
import Logger from './utils/Logger';


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
    isExecuting,
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

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <ThemeProvider theme={preferredTheme}>
      <div className="HomePage">
        <header className="HomePage-header">
          <img width={60} src={logo} alt="EasySources logo"/> 
          <h1 style={{paddingLeft:'1rem'}}>SF EasySources</h1>
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <MyCheckbox
              checked={formState.invertedMode}
              onChange={(event) => handleChangeCheckbox(event, "invertedMode")}
              label="Action First"
              size={12}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                const validationError = CommandService.getValidationError(formState, settings);
                if (validationError) {
                  Logger.error('Validation error:', validationError);
                  return;
                }
                try {
                  const commandData = CommandService.buildExecutionCommand(formState, settings);
                  Logger.log('Executing command:', commandData);
                  executeCommand(commandData);
                } catch (error) {
                  Logger.error('Error building command:', error);
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
          <p>Welcome to the SF EasySources project! From here you can compose and run sfdx-easy-sources commands.</p>
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
