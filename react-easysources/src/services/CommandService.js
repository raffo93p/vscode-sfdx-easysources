/**
 * Servizio per gestire la costruzione e l'esecuzione dei comandi API
 * Gestisce sia i parametri API che la preview del comando CLI
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
   * Mappatura delle azioni del form (lowercase) alle azioni API (camelCase)
   */
  static actionApiMapping = {
    'split': 'split',
    'upsert': 'upsert', 
    'updatekey': 'updateKey',
    'merge': 'merge',
    'minify': 'minify',
    'delete': 'delete',
    'clean': 'clean',
    'arealigned': 'areAligned',
    'customupsert': 'customUpsert',
    'clearempty': 'clearEmpty'
  };

  /**
   * Costruisce i parametri comuni dal form state
   * @private
   * @param {Object} formState - Stato del form
   * @returns {Object} Parametri estratti dal form
   */
  static _extractFormParams(formState) {
    const params = {};

    // Sort
    if (formState.sort) {
      params.sort = true;
    }

    // Input (per tutti tranne labels e recordtypes)
    if (formState.selectInput && formState.selectedInput && formState.selectedInput.length > 0) {
      if (formState.metadata !== 'labels' && formState.metadata !== 'recordtypes') {
        params.input = formState.selectedInput;
      }
    }

    // Object e recordtype (per recordtypes)
    if (formState.metadata === 'recordtypes') {
      if (formState.selectedObject) {
        params.object = formState.selectedObject;
      }
      
      if (formState.selectRecordtype && formState.selectedRecordtype && formState.selectedRecordtype.length > 0) {
        params.recordtype = formState.selectedRecordtype;
      }
    }

    // Parametri specifici per azione delete
    if (formState.action === 'delete') {
      if (formState.metadata === 'recordtypes') {
        if (formState.picklist) params.picklist = formState.picklist;
        if (formState.apiname) params.apiname = formState.apiname;
      } else {
        if (formState.type) params.type = formState.type;
        if (formState.tagid) params.tagid = formState.tagid;
      }
    }

    // Parametri specifici per azione arealigned
    if (formState.action === 'arealigned') {
      if (formState.mode) params.mode = formState.mode;
    }

    // Parametri specifici per azione customupsert
    if (formState.action === 'customupsert') {
      if (formState.customUpsertType) {
        params.type = formState.customUpsertType;
      }
      if (formState.customUpsertValues) {
        const content = {};
        Object.keys(formState.customUpsertValues).forEach(key => {
          if (formState.customUpsertValues[key]) {
            content[key] = formState.customUpsertValues[key];
          }
        });
        if (Object.keys(content).length > 0) {
          params.content = content;
        }
      }
    }

    return params;
  }

  /**
   * Costruisce i parametri per l'API basandosi sullo stato del form
   * @param {Object} formState - Stato del form
   * @returns {Object} Parametri per l'API
   */
  static buildApiParams(formState) {
    const params = this._extractFormParams(formState);
    const apiParams = {};

    // Converti i parametri in formato API
    Object.keys(params).forEach(key => {
      if (key === 'input' || key === 'recordtype') {
        // Array da convertire in stringa separata da virgole
        apiParams[key] = params[key].join(',');
      } else if (key === 'content') {
        // Oggetto da convertire in JSON string
        apiParams[key] = JSON.stringify(params[key]);
      } else if (key === 'sort') {
        // Boolean da convertire in stringa
        apiParams[key] = 'true';
      } else {
        // Altri parametri passati così come sono
        apiParams[key] = params[key];
      }
    });

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
      action: this.actionApiMapping[formState.action] || formState.action,
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
   * Costruisce il preview dell'api per il debug
   * @param {Object} formState - Stato del form
   * @param {Object} settings - Settings dell'applicazione
   * @param {string} workspacePath - Path del workspace
   * @returns {string} Preview dell'api
   */
  static buildApiPreview(formState, settings, workspacePath) {
    if (!formState.metadata || !formState.action) {
      return 'Select metadata and action to see api preview';
    }

    if (!settings) {
      return 'Settings not loaded - make sure easysources-settings.json exists in workspace root';
    }

    if (!workspacePath) {
      return 'Workspace path not available - paths cannot be resolved';
    }

    const apiParams = this.buildApiParams(formState);
    const apiAction = this.actionApiMapping[formState.action] || formState.action;
    let apiStr = `${this.metadataApiMapping[formState.metadata]}.${apiAction}(`;
    
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
      apiStr += `{${params.join(', ')}}`;
    }
    
    apiStr += ')';
    
    return apiStr;
  }

  /**
   * Costruisce il comando CLI (sf easysources) per display/debug
   * @param {Object} formState - Stato del form
   * @returns {string} Comando formattato per CLI
   */
  static buildCliCommand(formState) {
    if (!formState.metadata || !formState.action) {
      return '';
    }

    const params = this._extractFormParams(formState);
    let cmdString = `sf easysources ${formState.metadata} ${formState.action}`;

    // Costruisci i flag dalla mappa dei parametri
    Object.keys(params).forEach(key => {
      const value = params[key];
      
      if (key === 'sort') {
        // Sort è un flag boolean, non serve valore
        // Deprecato, quindi non lo includiamo
        return;
      }
      
      if (key === 'input' || key === 'recordtype') {
        // Array: sorta e join con virgola
        const sortedValue = value.sort().join(',');
        cmdString += ` --${key} "${sortedValue}"`;
      } else if (key === 'content') {
        // Oggetto: converti in JSON
        cmdString += ` --${key} '${JSON.stringify(value)}'`;
      } else {
        // Stringa semplice
        cmdString += ` --${key} "${value}"`;
      }
    });

    return cmdString;
  }
}