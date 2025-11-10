/**
 * Servizio per gestire la costruzione e l'esecuzione dei comandi API
 */
export class CommandService {
  
  /**
   * Mappatura dei nomi metadata alla nomenclatura API
   */
  static metadataApiMapping = {
    'profiles': 'profiles',
    'permissionsets': 'permissionSets',
    'labels': 'labels',
    'applications': 'applications',
    'globalvaluesets': 'globalValueSets',
    'globalvaluesettranslations': 'globalValueSetTranslations',
    'objecttranslations': 'objectTranslations', 
    'recordtypes': 'recordTypes',
    'translations': 'translations'
  };

  /**
   * Costruisce i parametri per l'API basandosi sullo stato del form
   * @param {Object} formState - Stato del form
   * @returns {Object} Parametri per l'API
   */
  static buildApiParams(formState) {
    const apiParams = {};
    
    // Aggiungi sort se presente
    if (formState.sort) {
      apiParams.sort = 'true';
    }

    // Aggiungi input se selezionato (per tutti tranne labels e recordtypes)
    if (formState.selectInput && formState.selectedInput && formState.selectedInput.length > 0) {
      if (formState.metadata !== 'labels' && formState.metadata !== 'recordtypes') {
        apiParams.input = formState.selectedInput.map(item => item.value).join(',');
      }
    }

    // Per recordtypes, aggiungi object se selezionato
    if (formState.metadata === 'recordtypes') {
      if (formState.selectedObject) {
        apiParams.object = formState.selectedObject;
      }
      
      // Aggiungi recordtype specifici se selezionati
      if (formState.selectRecordtype && formState.selectedRecordtype && formState.selectedRecordtype.length > 0) {
        apiParams.recordtype = formState.selectedRecordtype.map(item => item.value).join(',');
      }
    }

    // Aggiungi campi specifici per l'azione delete
    if (formState.action === 'delete') {
      if (formState.metadata === 'recordtypes') {
        // Campi specifici per recordtypes
        if (formState.picklist) {
          apiParams.picklist = formState.picklist;
        }
        if (formState.apiname) {
          apiParams.apiname = formState.apiname;
        }
      } else {
        // Campi per profiles e permissionsets
        if (formState.type) {
          apiParams.type = formState.type;
        }
        if (formState.tagid) {
          apiParams.tagid = formState.tagid;
        }
      }
    }

    return apiParams;
  }

  /**
   * Costruisce il comando completo per l'esecuzione
   * @param {Object} formState - Stato del form
   * @param {Object} settings - Settings dell'applicazione
   * @returns {Object} Comando per l'esecuzione
   */
  static buildExecutionCommand(formState, settings) {
    const apiParams = this.buildApiParams(formState);
    
    return {
      command: 'EXECUTE_API',
      apiNamespace: this.metadataApiMapping[formState.metadata],
      action: formState.action,
      params: apiParams,
      settings: settings // Aggiungi le settings per i path
    };
  }

  /**
   * Valida se il comando può essere eseguito
   * @param {Object} formState - Stato del form
   * @param {Object} settings - Settings dell'applicazione
   * @returns {boolean} True se può essere eseguito
   */
  static canExecute(formState, settings) {
    return !!(formState.metadata && formState.action && settings);
  }

  /**
   * Ottiene il messaggio di errore se il comando non può essere eseguito
   * @param {Object} formState - Stato del form
   * @param {Object} settings - Settings dell'applicazione
   * @returns {string|null} Messaggio di errore o null se tutto ok
   */
  static getValidationError(formState, settings) {
    if (!formState.metadata || !formState.action) {
      return 'Please select both metadata and action';
    }

    if (!settings) {
      return 'Settings not loaded. Make sure easysources-settings.json exists in workspace root.';
    }

    return null;
  }

  /**
   * Risolve un path relativo utilizzando il workspace path
   * @param {string} relativePath - Path relativo
   * @param {string} workspacePath - Path del workspace
   * @returns {string} Path risolto
   */
  static resolvePath(relativePath, workspacePath) {
    if (!relativePath || !workspacePath) return relativePath;
    
    // Se è già un path assoluto, ritornalo così com'è
    if (relativePath.startsWith('/') || relativePath.match(/^[A-Za-z]:\\/)) {
      return relativePath;
    }
    
    // Altrimenti combinalo con il workspace path
    return workspacePath + '/' + relativePath.replace(/^\.\//, '');
  }

  /**
   * Costruisce il preview del comando per il debug
   * @param {Object} formState - Stato del form
   * @param {Object} settings - Settings dell'applicazione
   * @param {string} workspacePath - Path del workspace
   * @returns {string} Preview del comando
   */
  static buildCommandPreview(formState, settings, workspacePath) {
    if (!formState.metadata || !formState.action) {
      return 'Select metadata and action to see command preview';
    }

    if (!settings) {
      return 'Settings not loaded - make sure easysources-settings.json exists in workspace root';
    }

    if (!workspacePath) {
      return 'Workspace path not available - paths cannot be resolved';
    }

    const apiParams = this.buildApiParams(formState);
    let commandStr = `${this.metadataApiMapping[formState.metadata]}.${formState.action}(`;
    
    const params = [];
    
    // Converti i parametri API in formato stringa per il preview
    Object.keys(apiParams).forEach(key => {
      params.push(`${key}: '${apiParams[key]}'`);
    });

    // Aggiungi i path dalle settings se disponibili (risolti come path assoluti)
    if (settings && workspacePath) {
      if (settings['salesforce-xml-path']) {
        const resolvedXmlPath = this.resolvePath(settings['salesforce-xml-path'], workspacePath);
        params.push(`'sf-xml': '${resolvedXmlPath}'`);
      }
      if (settings['easysources-csv-path']) {
        const resolvedCsvPath = this.resolvePath(settings['easysources-csv-path'], workspacePath);
        params.push(`'es-csv': '${resolvedCsvPath}'`);
      }
    }

    if (params.length > 0) {
      commandStr += `{${params.join(', ')}}`;
    }
    
    commandStr += ')';
    
    return commandStr;
  }
}