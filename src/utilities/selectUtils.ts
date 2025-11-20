import {readdirSync} from 'fs';
import { join } from 'path';
import { Logger } from './Logger';

export function getMetadataList(workspacePath: string, settings: any, metadata : string, objectName?: string, action?: string) {
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

    // Determina il path base in base all'azione
    // Per action='merge', usa la cartella CSV, altrimenti usa la cartella XML
    const defaultPath = action === 'merge' 
        ? settings['easysources-csv-path'] 
        : settings['salesforce-xml-path'];
    
    if (!defaultPath) {
        Logger.error(`${action === 'merge' ? 'easysources-csv-path' : 'salesforce-xml-path'} not found in settings`);
        return [];
    }

    Logger.debug('Getting metadata list', { metadata, defaultPath, action });
    
    try {
        // read files from directory
        if(metadata === 'object') {
            const objects = readdirSync(join(workspacePath, defaultPath, metadataFolderMap['object']), { withFileTypes: true })
                .filter(item => item.isDirectory())
                .map(item => item.name);
            return objects;

        } else if(metadata === 'recordtypes') {
            if(!objectName) {
                Logger.warn('Object name is required for recordtypes metadata');
                return [];
            }
            
            // Per recordtypes, la struttura è diversa se stiamo cercando nei CSV (action='merge')
            let recordTypesPath: string;
            if (action === 'merge') {
                // Struttura CSV: objects/<oggetto>/recordTypes/<recordtypes>
                recordTypesPath = join(workspacePath, defaultPath, metadataFolderMap['object'], objectName, metadataFolderMap['recordtypes']);
            } else {
                // Struttura XML: objects/<oggetto>/recordTypes/<recordtypes>
                recordTypesPath = join(workspacePath, defaultPath, metadataFolderMap['object'], objectName, metadataFolderMap['recordtypes']);
            }

            const recordTypes = readdirSync(recordTypesPath, { withFileTypes: true })
                .filter(item => {
                    if (action === 'merge') {
                        // Nella cartella CSV, cerchiamo sottocartelle (ogni recordtype ha la sua cartella)
                        return item.isDirectory();
                    } else {
                        // Nella cartella XML, cerchiamo file .recordType-meta.xml
                        return !item.isDirectory() && item.name.endsWith(metadataFilesuffixMap['recordtypes']);
                    }
                })
                .map(item => {
                    if (action === 'merge') {
                        // Nei CSV restituiamo il nome della cartella
                        return item.name;
                    } else {
                        // Negli XML restituiamo il nome del file senza estensione
                        return item.name.replace(`.${metadataFilesuffixMap['recordtypes']}`, '');
                    }
                });
            return recordTypes;

        } else if(metadata === 'objecttranslations') {
            const objectTranslationsPath = join(workspacePath, defaultPath, metadataFolderMap['objecttranslations']);
            const objectTranslations = readdirSync(objectTranslationsPath, { withFileTypes: true })
                .filter(item => item.isDirectory())
                .map(item => item.name);
            return objectTranslations;

        } else {
            // Per gli altri metadata
            let metadataPath: string;
            let files: string[];
            
            if (action === 'merge') {
                // Nella cartella CSV, i metadata sono organizzati come sottocartelle
                metadataPath = join(workspacePath, defaultPath, metadata);
                files = readdirSync(metadataPath, { withFileTypes: true })
                    .filter(item => item.isDirectory())
                    .map(item => item.name);
            } else {
                // Nella cartella XML, i metadata sono file con estensione specifica
                metadataPath = join(workspacePath, defaultPath, metadata);
                files = readdirSync(metadataPath, { withFileTypes: true })
                    .filter(item => !item.isDirectory() && item.name.endsWith(metadataFilesuffixMap[metadata]))
                    .map(item => item.name.replace(`.${metadataFilesuffixMap[metadata]}`, ''));
            }
            
            return files;
        }
    } catch (error) {
        Logger.error(`Error reading metadata list for ${metadata}:`, error);
        return [];
    }
}