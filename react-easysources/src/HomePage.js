import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel} from '@mui/material';

import logo from './assets/EasySources_Logo.png';
import { optionsMdt, optionsAct, metadataAction_params} from './utils/Config';
import {getMetadataInputList} from './utils/MdtSelectUtils'

import './HomePage.css'; 
import MultiSelect from './components/MultiSelect';




function HomePage() {

    return (
        <div className="HomePage">
            <header className="HomePage-header">
                <img width={60} src={logo}  alt="EasySources logo"/> 
                <h1 style={{paddingLeft:'1rem'}}>SFDX EasySources</h1>
                
            </header>
                
            <body>
                <p>Welcome to the EasySources project. This is a test for the react-easysources project.</p>
                <GeneralForm />
                
            </body>
        </div>
    );
}


  
export default HomePage;

// class GeneralForm extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             age: 10,
//         };
//     }
//     render(){
//         return(
//             <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">Age</InputLabel>
//                 <Select
//                     labelId="demo-simple-select-label"
//                     id="demo-simple-select"
//                     value={this.props.age}
//                     label="Age"
//                     onChange={() => this.handleChange}
//                 >
//                     <MenuItem value={10}>Ten</MenuItem>
//                     <MenuItem value={20}>Twenty</MenuItem>
//                     <MenuItem value={30}>Thirty</MenuItem>
//                 </Select>
//             </FormControl>
//         );
//     }
// }

class GeneralForm extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            metadata: '',
            action: '',
            sort: null,
            selectInput: null,
            selectedInput: null,

            // recordTypes
            selectObject: null,
            selectRecordtype: null,
            selectedObject: null,
            selectedRecordtype: null
        };
    }

    handleChangeSelect = (event, whatSelect) => {
        this.setState({[whatSelect]: event.target.value});
        if(whatSelect === "metadata"){
            this.setState({
                action: '',
                sort: null,
                selectInput: null,
                selectedInput: null,

                // recordTypes
                selectObject: null,
                selectRecordtype: null,
                selectedObject: null,
                selectedRecordtype: null
            });
        }

        if(whatSelect === "action"){
            const metadata = this.state.metadata;
            const action = event.target.value;
            this.setState({
                sort: metadataAction_params[metadata]?.[action]?.sort ?? null,
                selectInput: metadataAction_params[metadata]?.[action]?.selectInput ?? null,
                selectObject: metadataAction_params[metadata]?.[action]?.selectObject ?? null,
                selectRecordtype: metadataAction_params[metadata]?.[action]?.selectRecordtype ?? null
            });
        }
    }

    handleChangeCheckbox = (event, whatCheckbox) => {
        this.setState({[whatCheckbox]: event.target.checked});
    }

    setSelected = (selected) => {
        this.setState({selectedInput: selected});
    }

    setSelectedRecordtype = (selected) => {
        this.setState({selectedRecordtype: selected});
    }
    

    render(){
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
                                    value={this.state.metadata}
                                    onChange={(event) => this.handleChangeSelect(event, "metadata")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <MySelect 
                                    label="Action"
                                    options={optionsAct[this.state.metadata]}
                                    value={this.state.action}
                                    onChange={(event) => this.handleChangeSelect(event, "action")}
                                />
                            </Grid>
                            

                            <MyCheckbox
                                checked={this.state.selectInput}
                                onChange={(event) => this.handleChangeCheckbox(event, "selectInput")}
                                label="Select Input"
                            />

                            <MyCheckbox
                                size = {3}
                                checked={this.state.selectObject}
                                onChange={(event) => this.handleChangeCheckbox(event, "selectObject")}
                                label="Select Object"
                            />

                            <MyCheckbox
                                size = {3}
                                checked={this.state.selectRecordtype}
                                onChange={(event) => this.handleChangeCheckbox(event, "selectRecordtype")}
                                label="Select RecordType"
                            />

                            <MyCheckbox
                                checked={this.state.sort}
                                onChange={(event) => this.handleChangeCheckbox(event, "sort")}
                                label="Sort"
                            />

                        </Grid>
                    </Grid>
                    {/* End Left Column */}

                    {/* Right Column */}
                    <Grid item xs={6}>
                        <div>
                            {/* Multiselect for generic input */}
                            { this.state.selectInput ? 
                            <div>
                                <MultiSelect 
                                    metadata = {this.state.metadata}
                                    optionList={getMetadataInputList(this.state.metadata)}
                                    selectedOptions={this.state.selectedInput}
                                    setSelectedOptions={this.setSelected}
                                />

                                <p>Selected: {this.state.selectedInput?.map((option) => option.label).join(", ")}</p>
                            </div>
                            : null
                            }

                             {/* RecordType - Select Object */}
                            { this.state.selectObject ? 
                            <MySelect 
                                    label="Object"
                                    options={getMetadataInputList("object")}
                                    value={this.state.selectedObject}
                                    onChange={(event) => this.handleChangeSelect(event, "selectedObject")}
                                />
                                : null
                            }
                           

                            {/* RecordType - Select RecordType */}
                   
                            { this.state.selectedObject ? 
                            <div>
                                <MultiSelect 
                                    metadata = {this.state.metadata}
                                    optionList={getMetadataInputList(this.state.metadata)}
                                    selectedOptions={this.state.selectedRecordtype}
                                    setSelectedOptions={this.setSelectedRecordtype}
                                />

                                <p>Selected: {this.state.selectedRecordtype?.map((option) => option.label).join(", ")}</p>
                            </div>
                            : null
                            }




                        </div>
                    </Grid> 
                    {/* End Right Column*/}
                   
            
                </Grid>


                <p>State: {JSON.stringify(this.state)}</p>
                
                
            </div>
        );
    }
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
                    {this.props.options.map((option, index) => (
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
