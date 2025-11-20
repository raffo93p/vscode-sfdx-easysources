// this method returns the list of metadata inputs for the metadata selected
// it must comunicate with the backend to read the files

import Logger from './Logger';
import { OUTGOING_MESSAGE_TYPES } from '../constants/MessageTypes';
import { applications, globalvaluesets, globalvaluesettranslations, objecttranslations, permissionsets, profiles, recordtypes, translations, objects } from "./Mock";

// used when 'select input' is selected
export function getMetadataInputList(settings, metadata, vscode, selectedObject, action) {
    Logger.debug('getMetadataInputList:', metadata, 'action:', action);

    const metadataMap = {
        applications,
        globalvaluesets,
        globalvaluesettranslations,
        objecttranslations,
        permissionsets,
        profiles,
        object: objects,
        recordtypes,
        translations
    };

    if (metadata === 'labels') {
        // will never be used since the select input feature is not provided
        return;
    }

    if (metadataMap.hasOwnProperty(metadata)) {
        if (vscode) {
            vscode.postMessage({
                settings, 
                command: OUTGOING_MESSAGE_TYPES.GET_METADATA_INPUT_LIST, 
                metadata, 
                objectName: selectedObject,
                action 
            });
            return [];
        } else {
            return metadataMap[metadata];
        }
    }

    return;

}