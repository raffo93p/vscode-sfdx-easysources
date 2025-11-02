import React, { createContext, useContext, useReducer, useEffect}  from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel} from '@mui/material';

import logo from './assets/EasySources_Logo.png';
import { optionsMdt, optionsAct, metadataAction_params} from './utils/Config';
import {getMetadataInputList} from './utils/MdtSelectUtils'

import './App.css'; 
import MultiSelect from './components/MultiSelect';
import {reducer} from "./context/reducer";
import { vscode } from "./index";

import { createTheme, makeStyles, ThemeProvider } from '@mui/material/styles';


export const GlobalContext = createContext();


function App() {

    const [globalState, dispatch] = useReducer(reducer, {
        'vscode' : vscode,
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
    });

    const element = document.querySelector("body");
    const prefersDarkMode = element.classList.contains("vscode-dark");
    const preferredTheme = createTheme({
        palette: {
          // Switching the dark mode on is a single property value change.
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      });

    // Funzione per mostrare settings
    const [settings, setSettings] = React.useState(null);

    useEffect(() => {
        // Prova a leggere il file easysources-settings.json tramite l'API VSCode
        if (globalState.vscode && globalState.vscode.postMessage) {
            globalState.vscode.postMessage({ command: 'READ_SETTINGS_FILE' });
        }
        // Listener per la risposta
        const handler = (event) => {
            const message = event.data;
            if (message.command === 'SETTINGS_FILE_CONTENT') {
                setSettings(message.content);
            }
            if (message.command === 'SETTINGS_FILE_NOT_FOUND') {
                setSettings(null);
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
                    
                </header>
                    
                <div>
                    <p>Welcome to the SFDX EasySources project! This is a test for the react-easysources project.</p>
                    <GeneralForm />
                    
                </div>

            <footer>
                <p>Info</p>
                <p>Command: {globalState.command}</p>
                <p>State: {JSON.stringify(globalState)}</p>
                <p>Settings: {settings ? settings : 'Settings not found'}</p>
            </footer>

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
            globalState.availableInput = getMetadataInputList(globalState.metadata, globalState.vscode);
        }
        if(whatCheckbox === "selectRecordtype" && event.target.checked){
            globalState.availableInput = getMetadataInputList(globalState.metadata, globalState.vscode, globalState.selectedObject);
        }
        if(whatCheckbox === "selectObject" && event.target.checked){
            globalState.availableObjects = getMetadataInputList("object", globalState.vscode);
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

                            <p>Selected: {globalState.selectedInput?.map((option) => option.label).join(", ")}</p>
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


                
                
            </div>
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
