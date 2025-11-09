import React, { createContext, useContext, useReducer, useEffect}  from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

import logo from './assets/EasySources_Logo.png';
import { optionsMdt, optionsAct, metadataAction_params} from './utils/Config';
import {getMetadataInputList} from './utils/MdtSelectUtils'

import './App.css'; 
import MultiSelect from './components/MultiSelect';
import {reducer} from "./context/reducer";
import { vscode } from "./index";

import { createTheme, ThemeProvider } from '@mui/material/styles';


export const GlobalContext = createContext();


function App() {

    const [globalState, dispatch] = useReducer(reducer, {
        'vscode' : vscode,
        settings: null,
        workspacePath: null,
        command: null,
        selectInput: null,
        selectedInput: null,
        selectObject: null,
        selectedObject: '',
        selectRecordtype: null,
        selectedRecordtype: null,
        metadata: '',
        action: '',
        sort: null,
        availableInput: [],
        availableObjects: [],
        availableRecordtypes: [],
        isExecuting: false,
        executionResult: null,
        executionError: null,
    });

    const element = document.querySelector("body");
    const prefersDarkMode = element.classList.contains("vscode-dark");
    const preferredTheme = createTheme({
        palette: {
          // Switching the dark mode on is a single property value change.
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      });

    // Settings are managed in globalState

    useEffect(() => {
        // Prova a leggere il file easysources-settings.json tramite l'API VSCode
        if (globalState.vscode && globalState.vscode.postMessage) {
            globalState.vscode.postMessage({ command: 'READ_SETTINGS_FILE' });
        }
        // Listener per la risposta
        const handler = (event) => {
            const message = event.data;
            if (message.command === 'SETTINGS_FILE_CONTENT') {
                //setSettings(message.content);
                dispatch({type: 'UPDATE_STATE', payload: {
                    settings: JSON.parse(message.content),
                    workspacePath: message.workspacePath
                }});
            }
            if (message.command === 'SETTINGS_FILE_NOT_FOUND') {
                dispatch({type: 'UPDATE_STATE', payload: {settings: null}});
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [globalState.vscode]);

    return (
        <ThemeProvider theme={preferredTheme}>
        <GlobalContext.Provider value={{ globalState, dispatch }}>
            <div className="HomePage">
                <header className="HomePage-header">
                    <img width={60} src={logo}  alt="EasySources logo"/> 
                    <h1 style={{paddingLeft:'1rem'}}>SFDX EasySources</h1>
                    <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => {
                            if (globalState.vscode && globalState.vscode.postMessage) {
                                globalState.vscode.postMessage({ 
                                    command: 'DEBUG_LOG', 
                                    data: JSON.stringify(globalState, null, 2) 
                                });
                            }
                        }}
                        style={{marginLeft: 'auto', height: 'fit-content'}}
                    >
                        Debug State
                    </Button>
                </header>
                    
                <div>
                    <p>Welcome to the SFDX EasySources project! This is a test for the react-easysources project.</p>
                    <GeneralForm />
                    
                </div>

            {/* <footer>
                <p>Info</p>
                <p>Command: {globalState.command}</p>
                <p>Metadata: {globalState.metadata}, Action: {globalState.action}</p>
                <p>Settings: {globalState.settings ? 'Loaded' : 'Settings not found'}</p>
                {globalState.executionResult && <p>Last Execution: Success</p>}
                {globalState.executionError && <p>Last Execution: Error - {globalState.executionError}</p>}
            </footer> */}

            </div>
        </GlobalContext.Provider>
        </ThemeProvider>
    );
}


export default App;


function GeneralForm(){
    
    const { globalState, dispatch } = useContext(GlobalContext);

    const handleChangeSelect = (event, whatSelect) => {

       globalState[whatSelect] = event.target.value;

        if(whatSelect === "metadata"){
            globalState.action = '';
            globalState.sort = null;
            globalState.selectInput = null;
            globalState.selectedInput = null;
            globalState.selectObject = null;
            globalState.selectRecordtype = null;
            globalState.selectedObject = '';
            globalState.selectedRecordtype = null;
            
            globalState.availableInput = [];
            globalState.availableObjects = [];
            globalState.availableRecordtypes = [];
        }

        if(whatSelect === "selectedObject"){
            // Quando si cambia oggetto, pulire i recordtypes
            globalState.selectRecordtype = false;
            globalState.selectedRecordtype = null;
            globalState.availableRecordtypes = [];
        }

        if(whatSelect === "action"){
            const metadata = globalState.metadata;
            const action = event.target.value;
            
            globalState.sort = metadataAction_params[metadata]?.[action]?.sort ?? null;
            globalState.selectInput = metadataAction_params[metadata]?.[action]?.selectInput ?? null;
            globalState.selectObject = metadataAction_params[metadata]?.[action]?.selectObject ?? null;
            globalState.selectRecordtype = metadataAction_params[metadata]?.[action]?.selectRecordtype ?? null;

        }
        dispatch({type: 'UPDATE_STATE'});
    }

    const handleChangeCheckbox = (event, whatCheckbox) => {
        globalState[whatCheckbox] = event.target.checked;
        if(whatCheckbox === "selectInput" && event.target.checked){
            globalState.availableInput = getMetadataInputList(globalState.settings, globalState.metadata, globalState.vscode);
        }
        if(whatCheckbox === "selectRecordtype" && event.target.checked){
            globalState.availableInput = getMetadataInputList(globalState.settings, globalState.metadata, globalState.vscode, globalState.selectedObject);
        }
        if(whatCheckbox === "selectObject" && event.target.checked){
            globalState.availableObjects = getMetadataInputList(globalState.settings, "object", globalState.vscode);
        }
        dispatch({type: 'UPDATE_STATE'});
    }

    const setSelected = (selected) => {
        globalState["selectedInput"] = selected;
        dispatch({type: 'UPDATE_STATE'});
    }

    const setSelectedRecordtype = (selected) => {
        globalState["selectedRecordtype"] = selected;
        dispatch({type: 'UPDATE_STATE'});
    }

    const executeCommand = async () => {
        if (!globalState.metadata || !globalState.action) {
            dispatch({type: 'UPDATE_STATE', payload: {executionError: 'Please select both metadata and action'}});
            return;
        }

        if (!globalState.settings) {
            dispatch({type: 'UPDATE_STATE', payload: {executionError: 'Settings not loaded. Make sure easysources-settings.json exists in workspace root.'}});
            return;
        }

        dispatch({type: 'UPDATE_STATE', payload: {isExecuting: true, executionResult: null, executionError: null}});

        try {
            // Mappatura dei nomi metadata alla nomenclatura API
            const metadataApiMapping = {
                'profiles': 'profiles',
                'permissionsets': 'permissionSets',
                'labels': 'labels',
                'applications': 'applications',
                'globalvaluesets': 'globalValueSets',
                'globalvaluesettranslations': 'globalValueSetTranslations',
                'objecttranslations': 'translations', // Object Translations usa la stessa API di Translations
                'recordtypes': 'recordTypes',
                'translations': 'translations'
            };

            // Costruisci i parametri per l'API
            const apiParams = {};
            
            // Aggiungi sort se presente
            if (globalState.sort) {
                apiParams.sort = 'true';
            }

            // Aggiungi input se selezionato (per tutti tranne labels e recordtypes)
            if (globalState.selectInput && globalState.selectedInput && globalState.selectedInput.length > 0) {
                if (globalState.metadata !== 'labels' && globalState.metadata !== 'recordtypes') {
                    apiParams.input = globalState.selectedInput.map(item => item.value).join(',');
                }
            }

            // Per recordtypes, aggiungi object se selezionato
            if (globalState.metadata === 'recordtypes') {
                if (globalState.selectedObject) {
                    apiParams.object = globalState.selectedObject;
                }
                
                // Aggiungi recordtype specifici se selezionati
                if (globalState.selectRecordtype && globalState.selectedRecordtype && globalState.selectedRecordtype.length > 0) {
                    apiParams.recordtype = globalState.selectedRecordtype.map(item => item.value).join(',');
                }
            }

            // Invia il comando a VSCode per eseguire l'API
            const commandData = {
                command: 'EXECUTE_API',
                apiNamespace: metadataApiMapping[globalState.metadata],
                action: globalState.action,
                params: apiParams,
                settings: globalState.settings // Aggiungi le settings per i path
            };

            console.log('Executing command:', commandData);
            globalState.vscode.postMessage({ 
                command: 'DEBUG_LOG', 
                data: JSON.stringify(commandData, null, 2) 
            });
            globalState.vscode.postMessage(commandData);

        } catch (error) {
            dispatch({type: 'UPDATE_STATE', payload: {
                isExecuting: false, 
                executionError: error.message || 'An error occurred during execution'
            }});
        }
    }

    const canExecute = () => {
        return globalState.metadata && globalState.action && !globalState.isExecuting && globalState.settings;
    }

    const resolvePath = (relativePath, workspacePath) => {
        if (!relativePath || !workspacePath) return relativePath;
        
        // Se è già un path assoluto, ritornalo così com'è
        if (relativePath.startsWith('/') || relativePath.match(/^[A-Za-z]:\\/)) {
            return relativePath;
        }
        
        // Altrimenti combinalo con il workspace path
        // Simuliamo path.join in JavaScript
        return workspacePath + '/' + relativePath.replace(/^\.\//, '');
    }

    const getCommandPreview = () => {
        if (!globalState.metadata || !globalState.action) {
            return 'Select metadata and action to see command preview';
        }

        if (!globalState.settings) {
            return 'Settings not loaded - make sure easysources-settings.json exists in workspace root';
        }

        if (!globalState.workspacePath) {
            return 'Workspace path not available - paths cannot be resolved';
        }

        const metadataApiMapping = {
            'profiles': 'profiles',
            'permissionsets': 'permissionSets',
            'labels': 'labels',
            'applications': 'applications',
            'globalvaluesets': 'globalValueSets',
            'globalvaluesettranslations': 'globalValueSetTranslations',
            'objecttranslations': 'translations', // Object Translations usa la stessa API di Translations
            'recordtypes': 'recordTypes',
            'translations': 'translations'
        };

        let commandStr = `${metadataApiMapping[globalState.metadata]}.${globalState.action}(`;
        
        const params = [];
        
        if (globalState.sort) {
            params.push(`sort: 'true'`);
        }

        if (globalState.selectInput && globalState.selectedInput && globalState.selectedInput.length > 0) {
            if (globalState.metadata !== 'labels' && globalState.metadata !== 'recordtypes') {
                params.push(`input: '${globalState.selectedInput.map(item => item.value).join(',')}'`);
            }
        }

        if (globalState.metadata === 'recordtypes') {
            if (globalState.selectedObject) {
                params.push(`object: '${globalState.selectedObject}'`);
            }
            
            if (globalState.selectRecordtype && globalState.selectedRecordtype && globalState.selectedRecordtype.length > 0) {
                params.push(`recordtype: '${globalState.selectedRecordtype.map(item => item.value).join(',')}'`);
            }
        }

        // Aggiungi i path dalle settings se disponibili (risolti come path assoluti)
        if (globalState.settings && globalState.workspacePath) {
            if (globalState.settings['salesforce-xml-path']) {
                const resolvedXmlPath = resolvePath(globalState.settings['salesforce-xml-path'], globalState.workspacePath);
                params.push(`'sf-xml': '${resolvedXmlPath}'`);
            }
            if (globalState.settings['easysources-csv-path']) {
                const resolvedCsvPath = resolvePath(globalState.settings['easysources-csv-path'], globalState.workspacePath);
                params.push(`'es-csv': '${resolvedCsvPath}'`);
            }
        }

        if (params.length > 0) {
            commandStr += `{${params.join(', ')}}`;
        }
        
        commandStr += ')';
        
        return commandStr;
    }

    useEffect(()=>{
        console.log('Inside messageEventListener useEffect() App.js');
          const messageEventListener= (event) => {
            const message = event.data; // The json data that the extension sent
            //console.log(event.data);
            switch (message.command) {
                case 'GET_METADATA_INPUT_LIST_RESPONSE':
                    console.log('GET_METADATA_INPUT_LIST_RESPONSE');
                    console.log(JSON.stringify(message.metadataList));
                    // Determina se è per input generico, objects o recordtypes
                    if (message.metadata === 'object') {
                        dispatch({type: 'UPDATE_STATE', payload: {availableObjects: message.metadataList}});
                    } else if (message.metadata === 'recordtypes') {
                        dispatch({type: 'UPDATE_STATE', payload: {availableRecordtypes: message.metadataList}});
                    } else {
                        dispatch({type: 'UPDATE_STATE', payload: {availableInput: message.metadataList}});
                    }
                    break;
                
                case 'API_EXECUTION_RESULT':
                    console.log('API_EXECUTION_RESULT');
                    dispatch({type: 'UPDATE_STATE', payload: {
                        isExecuting: false,
                        executionResult: message.result,
                        executionError: null
                    }});
                    break;
                
                case 'API_EXECUTION_ERROR':
                    console.log('API_EXECUTION_ERROR');
                    dispatch({type: 'UPDATE_STATE', payload: {
                        isExecuting: false,
                        executionResult: null,
                        executionError: message.error
                    }});
                    break;
      
                default:
                  break;
                
            }
          }
      
          window.addEventListener('message', messageEventListener);
          return ()=>{
            window.removeEventListener('message', messageEventListener);
          };
      },[globalState.vscode, dispatch]);
    
    
        return(

            <div>
                <Grid container spacing={2}>

                    {/* Left Column */}
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <MySelect 
                                    label="Metadata"
                                    options={optionsMdt}
                                    value={globalState.metadata}
                                    onChange={(event) => handleChangeSelect(event, "metadata")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <MySelect 
                                    label="Action"
                                    options={optionsAct[globalState.metadata]}
                                    value={globalState.action}
                                    onChange={(event) => handleChangeSelect(event, "action")}
                                />
                            </Grid>
                            
                            <MyCheckbox
                                checked={globalState.sort}
                                onChange={(event) => handleChangeCheckbox(event, "sort")}
                                label="Sort"
                            />

                        </Grid>
                        
                    </Grid>
                    {/* End Left Column */}

                    {/* Right Column */}
                    <Grid item xs={6}>

                        {/* Generic input selection */}
                        <MyCheckbox
                            checked={globalState.selectInput}
                            onChange={(event) => handleChangeCheckbox(event, "selectInput")}
                            label={"Run on specific " + globalState.metadata}
                        />

                        {/* Multiselect for generic input */}
                        { globalState.selectInput ? 
                        <div>
                            <MultiSelect 
                                metadata = {globalState.metadata}
                                optionList={globalState.availableInput}
                                selectedOptions={globalState.selectedInput}
                                setSelectedOptions={setSelected}
                            />

                            {/* <p>Selected: {globalState.selectedInput?.map((option) => option.label).join(", ")}</p> */}
                        </div>
                        : null
                        }

                         {/* RecordType - Select Object */}
                        <MyCheckbox
                            // size = {3}
                            checked={globalState.selectObject}
                            onChange={(event) => handleChangeCheckbox(event, "selectObject")}
                            label="Run on specific object"
                        />

                        { globalState.selectObject ? 
                            <MySelect 
                                    label="Object"
                                    options={globalState.availableObjects}
                                    value={globalState.selectedObject}
                                    onChange={(event) => handleChangeSelect(event, "selectedObject")}
                                />
                                : null
                        }

                        {/* RecordType - Select RecordType */}
                        {
                            globalState.selectObject && globalState.selectedObject && globalState.selectedObject !== '' ?
                            <div>
                                <MyCheckbox
                                    // size = {3}
                                    checked={globalState.selectRecordtype}
                                    onChange={(event) => handleChangeCheckbox(event, "selectRecordtype")}
                                    label="Run on specific record types"
                                />
                            </div>
                            : null
                        }

                        { globalState.selectObject && globalState.selectedObject && globalState.selectRecordtype ? 
                            <div>
                                <MultiSelect 
                                    metadata = "recordtypes"
                                    optionList={globalState.availableRecordtypes}
                                    selectedOptions={globalState.selectedRecordtype}
                                    setSelectedOptions={setSelectedRecordtype}
                                />
                            </div>
                            : null
                        }

                        

                    </Grid> 
                    {/* End Right Column*/}
                   
            
                </Grid>

                {/* Command Preview */}
                <Grid container spacing={2} style={{marginTop: '1rem'}}>
                    <Grid item xs={12}>
                        <Alert severity="info">
                            <strong>Command Preview:</strong>
                            <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontFamily: 'monospace'}}>
                                {getCommandPreview()}
                            </pre>
                        </Alert>
                    </Grid>
                </Grid>

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
                            {globalState.isExecuting ? 'Executing...' : 'Execute Command'}
                        </Button>
                    </Grid>
                </Grid>

                {/* Results Table */}
                {globalState.executionResult && globalState.executionResult.items && (
                    <Grid container spacing={2} style={{marginTop: '1rem'}}>
                        <Grid item xs={12}>
                            <ResultsTable items={globalState.executionResult.items} />
                        </Grid>
                    </Grid>
                )}

                {/* Results Display */}
                {globalState.executionResult && (
                    <Grid container spacing={2} style={{marginTop: '1rem'}}>
                        <Grid item xs={12}>
                            <Alert severity="success">
                                <strong>Execution Result:</strong>
                                <pre style={{whiteSpace: 'pre-wrap', marginTop: '0.5rem'}}>
                                    {JSON.stringify(globalState.executionResult, null, 2)}
                                </pre>
                            </Alert>
                        </Grid>
                    </Grid>
                )}

                {globalState.executionError && (
                    <Grid container spacing={2} style={{marginTop: '1rem'}}>
                        <Grid item xs={12}>
                            <Alert severity="error">
                                <strong>Execution Error:</strong>
                                <div style={{marginTop: '0.5rem'}}>
                                    {globalState.executionError}
                                </div>
                            </Alert>
                        </Grid>
                    </Grid>
                )}


                
                
            </div>
        );
    }

// ResultsTable component to display execution results in a table format
function ResultsTable({ items }) {
    const getStatusIcon = (result, hasError = false) => {
        switch (result) {
            case 'OK':
                return <CheckCircle style={{ color: 'green' }} />;
            case 'WARN':
                return <Warning style={{ color: 'orange' }} />;
            case 'KO':
                return <Error style={{ color: 'red' }} />;
            default:
                return <Error style={{ color: 'red' }} />;
        }
    };

    const hasAnyErrors = Object.values(items).some(item => 
        item.result === 'KO' || item.result === 'WARN' || item.error
    );

    return (
        <TableContainer component={Paper} style={{ marginBottom: '1rem' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Resource</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        {hasAnyErrors && <TableCell><strong>Message</strong></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(items).map(([resourceName, resourceData]) => (
                        <TableRow key={resourceName}>
                            <TableCell>{resourceName}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {getStatusIcon(resourceData.result, !!resourceData.error)}
                                    <span>{resourceData.result}</span>
                                </div>
                            </TableCell>
                            {hasAnyErrors && (
                                <TableCell>
                                    {resourceData.error || '-'}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

    



class MySelect extends React.Component{

    render(){
        return (
            
                <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.props.value}
                    label={this.props.label}
                    onChange={this.props.onChange}
                >
                    {this.props.options?.map((option, index) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))}
                </Select>
                </FormControl>
        );
    }
}

class MyCheckbox extends React.Component{
    render(){
        return(
            this.props.checked !== null && this.props.checked !== undefined ? 
                <Grid item xs={this.props.size || 6}>
                        <FormControlLabel control={
                            <Checkbox 
                                checked={this.props.checked} 
                                onChange={this.props.onChange} /> 
                        } label={this.props.label} />
                </Grid>
            : null
            
        );
    }
}
