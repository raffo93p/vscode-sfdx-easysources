import {readdirSync} from 'fs';
import { join } from 'path';
import { Logger } from './Logger';

export function getMetadataList(workspacePath: string, settings: any, metadata : string, objectName?: string) {
    const metadataFolderMap: {[key: string]: string} = {
        'applications': 'applications/',
        'globalvaluesets': 'globalValueSets/',
        'globalvaluesetstranslations': 'globalValueSetTranslations/',
        'labels': 'labels/',
        'object': 'objects/', // Note: 'object' key is used with record types
        'objecttranslations': 'objectTranslations/',
        'permissionsets': 'permissionSets/',
        'profiles': 'profiles/',
        'recordtypes': 'recordTypes/',
        'translations': 'translations/',
    };

    const metadataFilesuffixMap: {[key: string]: string} = {
        'applications': 'app-meta.xml',
        'globalvaluesets': 'globalValueSet-meta.xml',
        'globalvaluesetstranslations': 'globalValueSetTranslation-meta.xml',
        'labels': 'label-meta.xml',
        //'object': 'object-meta.xml',
        //'objecttranslations': 'objectTranslation-meta.xml',
        'permissionsets': 'permissionset-meta.xml',
        'profiles': 'profile-meta.xml',
        'recordtypes': 'recordType-meta.xml',
        'translations': 'translation-meta.xml',
    };

    const defaultPath = settings['salesforce-xml-path'];
    
    if (!defaultPath) {
        Logger.error('salesforce-xml-path not found in settings');
        return [];
    }

    Logger.debug('Getting metadata list', { metadata, defaultPath });
    
    try {
        // read files from directory
        if(metadata === 'object') {
            const objects = readdirSync(join(workspacePath, defaultPath, metadataFolderMap['object']), { withFileTypes: true })
                .filter(item => item.isDirectory())
                .map((item) => {
                    return {label: item.name, value: item.name};
                });
            return objects;

        } else if(metadata === 'recordtypes') {
            if(!objectName) {
                Logger.warn('Object name is required for recordtypes metadata');
                return [];
            }
            const recordTypesPath = join(workspacePath, defaultPath, metadataFolderMap['object'], objectName, metadataFolderMap['recordtypes']);

            const recordTypes = readdirSync(recordTypesPath, { withFileTypes: true })
                .filter(item => !item.isDirectory() && item.name.endsWith(metadataFilesuffixMap['recordtypes']))
                .map((item) => {
                    return {label: item.name.replace(`.${metadataFilesuffixMap['recordtypes']}`,''), value: item.name.replace(`.${metadataFilesuffixMap['recordtypes']}`,'')};
                });
            return recordTypes;

        } else if(metadata === 'objecttranslations') {
            const objectTranslationsPath = join(workspacePath, defaultPath, metadataFolderMap['objecttranslations']);
            const objectTranslations = readdirSync(objectTranslationsPath, { withFileTypes: true })
                .filter(item => item.isDirectory())
                .map((item) => {
                    return {label: item.name, value: item.name};
                });
            return objectTranslations;

        } else {
            const files = readdirSync(join(workspacePath, defaultPath, metadata), { withFileTypes: true })
                    .filter(item => !item.isDirectory() && item.name.endsWith(metadataFilesuffixMap[metadata]))
                    .map((item) => {
                        return {label: item.name.replace(`.${metadataFilesuffixMap[metadata]}`,''), value: item.name.replace(`.${metadataFilesuffixMap[metadata]}`,'')};
                    });
            return files;
        }
    } catch (error) {
        Logger.error(`Error reading metadata list for ${metadata}:`, error);
        return [];
    }
}