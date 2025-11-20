import { isBlank } from './StringUtils';

/**
 * Calcola il comando da visualizzare nel formato "sf easysources <metadata> <action> parametri"
 * Utilizza la stessa logica di CommandService.buildApiParams per costruire i parametri
 */
export function calculateCommand(formState) {
    if (isBlank(formState.metadata) || isBlank(formState.action)) {
        return '';
    }

    let cmdString = `sf easysources ${formState.metadata} ${formState.action}`;

    /*
    * I'm going to deprecate the --sort flag
    // Sort
    if (formState.sort) {
        cmdString = `${cmdString} --sort`;
    }
    */
   
    // Input (per tutti tranne labels e recordtypes)
    if (formState.selectInput && formState.selectedInput && formState.selectedInput.length > 0) {
        if (formState.metadata !== 'labels' && formState.metadata !== 'recordtypes') {
            const selectedInput = formState.selectedInput
                .map(input => input.value)
                .sort()
                .join(',');
            cmdString = `${cmdString} --input "${selectedInput}"`;
        }
    }

    // Object (per recordtypes)
    if (formState.metadata === 'recordtypes') {
        if (formState.selectedObject) {
            cmdString = `${cmdString} --object "${formState.selectedObject}"`;
        }

        // RecordType specifici
        if (formState.selectRecordtype && formState.selectedRecordtype && formState.selectedRecordtype.length > 0) {
            const selectedRecordtype = formState.selectedRecordtype
                .map(input => input.value)
                .sort()
                .join(',');
            cmdString = `${cmdString} --recordtype "${selectedRecordtype}"`;
        }
    }

    // Parametri specifici per l'azione delete
    if (formState.action === 'delete') {
        if (formState.metadata === 'recordtypes') {
            // Campi specifici per recordtypes
            if (formState.picklist) {
                cmdString = `${cmdString} --picklist "${formState.picklist}"`;
            }
            if (formState.apiname) {
                cmdString = `${cmdString} --apiname "${formState.apiname}"`;
            }
        } else {
            // Campi per profiles e permissionsets
            if (formState.type) {
                cmdString = `${cmdString} --type "${formState.type}"`;
            }
            if (formState.tagid) {
                cmdString = `${cmdString} --tagid "${formState.tagid}"`;
            }
        }
    }

    // Parametri specifici per l'azione arealigned
    if (formState.action === 'arealigned') {
        if (formState.mode) {
            cmdString = `${cmdString} --mode "${formState.mode}"`;
        }
    }

    // Parametri specifici per l'azione customupsert
    if (formState.action === 'customupsert') {
        if (formState.customUpsertType) {
            cmdString = `${cmdString} --type "${formState.customUpsertType}"`;
        }
        if (formState.customUpsertValues) {
            const content = {};
            Object.keys(formState.customUpsertValues).forEach(key => {
                if (formState.customUpsertValues[key]) {
                    content[key] = formState.customUpsertValues[key];
                }
            });
            
            if (Object.keys(content).length > 0) {
                cmdString = `${cmdString} --content '${JSON.stringify(content)}'`;
            }
        }
    }

    return cmdString;
}