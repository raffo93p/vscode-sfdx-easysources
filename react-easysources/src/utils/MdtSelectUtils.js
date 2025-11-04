// this method returns the list of metadata inputs for the metadata selected
// it must comunicate with the backend to read the files

import { applications, globalvaluesets, globalvaluesettranslations, objecttranslations, permissionsets, profiles, recordtypes, translations, objects } from "./Mock";

// used when 'select input' is selected
export function getMetadataInputList(settings, metadata, vscode, selectedObject) {
    console.log('getMetadataInputList: ' + metadata);

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
            vscode.postMessage({settings, command: 'GET_METADATA_INPUT_LIST', metadata, objectName: selectedObject });
            return [];
        } else {
            return metadataMap[metadata];
        }
    }

    return;

}