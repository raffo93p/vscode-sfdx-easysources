// this method returns the list of metadata inputs for the metadata selected
// it must comunicate with the backend to read the files

import { applications, globalvaluesets, globalvaluesettranslations, objecttranslations, permissionsets, profiles, recordtypes, translations, objects } from "./Mock";

// used when 'select input' is selected
export function getMetadataInputList(metadata) {
    switch (metadata) {
        case 'applications':
            return applications
        case 'globalvaluesets':
            return globalvaluesets;
        case 'globalvaluesettranslations':
            return globalvaluesettranslations;
        case 'labels':
            // will never be used since the select input feature is not provided
            return;
        case 'objecttranslations':
            return objecttranslations;
        case 'permissionsets':
            return permissionsets;
        case 'profiles':
            return profiles;
        case 'object':
            return objects;
        case 'recordtypes':
            return recordtypes;
        case 'translations':
            return translations;
        default:
            return;
    }

}