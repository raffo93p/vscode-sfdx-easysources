import { calculateCommand } from '../utils/CmdCalculator';

export const reducer = (state, action) => {
	switch (action.type) { 
        case 'UPDATE_STATE':
            //return {...state};
            return {
                ...state,
                command: calculateCommand(state)
            }
        case 'CALCULATE_COMMAND':


            return {
                ...state,
                command: calculateCommand(state)
            }
        case 'SET_METADATA_INPUT':
            return {
                ...state,
                metadataInput: action.payload
            }
        default:
            return state;
    }
        
}