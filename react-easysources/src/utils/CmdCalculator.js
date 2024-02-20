import { isBlank } from './StringUtils';

export function calculateCommand(state){
    const sfCmd = 'sfdx';

    if(isBlank(state.metadata) || isBlank(state.action)){
        return '';
    }

    var cmdString = `${sfCmd} easysources:${state.metadata}:${state.action}`;


    return cmdString;

}