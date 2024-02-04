import logo from './assets/EasySources_Logo.jpeg';
import ComponentList from './ComponentList';
import './HomePage.css'; 
import { FormControl, InputLabel, Select, MenuItem, Box, Grid} from '@mui/material';
import React from 'react';

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
                <ComponentList />
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
        };
    }
    optionsMdt = [{label: 'Profiles', value: 'profiles'}, {label: 'Permission Sets', value: 'permissionSets'}, {label: 'Labels', value: 'labels'}];

    handleChangeMdt = (event, whatSelect) => {
        console.log('handleChangeMdt')
        console.log(whatSelect)
        this.setState({metadata: event.target.value});
    }

    handleChangeAction = (event) => {
        this.setState({action: event.target.value});
    }


    render(){
        return(
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <SelectMDT 
                                    label="Metadata"
                                    options={this.optionsMdt}
                                    value={this.state.metadata}
                                    onChange={(event) => this.handleChangeMdt(event, "metadata")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <SelectAction onChange={(event) => this.handleChangeAction(event)}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <p>xs=6 md=4</p>
                    </Grid>
            
                </Grid>
                
                
            </div>
        );
    }
}

class SelectMDT extends React.Component{

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

class SelectAction extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            action: '',
        };
    }

    handleChange = (event) => {
        this.setState({action: event.target.value});
    };

    render(){
        return (
                <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.action}
                    label="Age"
                    onChange={this.handleChange}
                >
                    <MenuItem value={"split"}>Split</MenuItem>
                    <MenuItem value={"upsert"}>Upsert</MenuItem>
                    <MenuItem value={"merge"}>Merge</MenuItem>
                </Select>
                </FormControl>
        );
    }
}
