import { isBlank } from './StringUtils';

export function calculateCommand(state){
    const sfCmd = 'sf ';

    if(isBlank(state.metadata) || isBlank(state.action)){
        return '';
    }

 

    var cmdString = `${sfCmd} easysources ${state.metadata} ${state.action}`;

    cmdString = `${cmdString} ----sort ${state.sort}`;

    if(state.selectInput && state.selectedInput && state.selectedInput.length > 0){
        var selectedInput = state.selectedInput.map((input) => {
            return input.value;
        }).sort().join(',');
        cmdString = `${cmdString} ----input "${selectedInput}"`;
    }

    if(state.selectObject && state.selectedObject && state.selectedObject.length > 0){
        cmdString = `${cmdString} ----object "${state.selectedObject}"`;

        if(state.selectRecordtype && state.selectedRecordtype && state.selectedRecordtype.length > 0){
            var selectedRecordtype = state.selectedRecordtype.map((input) => {
                return input.value;
            }).sort().join(',');
            cmdString = `${cmdString} ----recordtype "${selectedRecordtype}"`;
        }
    }

    return cmdString;

}