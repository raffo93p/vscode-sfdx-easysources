/**
 * Configurazione per l'azione customupsert
 * Contiene le definizioni di headers e chiavi per ogni tipo di permesso/visibilità
 */
export const customUpsertConfig = {
  applicationVisibilities: {
    headers: ['application', 'default', 'visible'],
    key: 'application'
  },
  classAccesses: {
    headers: ['apexClass', 'enabled'],
    key: 'apexClass'
  },
  customMetadataTypeAccesses: {
    headers: ['enabled', 'name'],
    key: 'name'
  },
  customPermissions: {
    headers: ['enabled', 'name'],
    key: 'name'
  },
  customSettingAccesses: {
    headers: ['enabled', 'name'],
    key: 'name'
  },
  fieldPermissions: {
    headers: ['editable', 'field', 'readable'],
    key: 'field'
  },
  flowAccesses: {
    headers: ['enabled', 'flow'],
    key: 'flow'
  },
  layoutAssignments: {
    headers: ['layout', 'recordType'],
    key: ['layout', 'recordType']
  },
  objectPermissions: {
    headers: [
      'allowCreate',
      'allowDelete',
      'allowEdit',
      'allowRead',
      'modifyAllRecords',
      'object',
      'viewAllRecords'
    ],
    key: 'object'
  },
  pageAccesses: {
    headers: ['apexPage', 'enabled'],
    key: 'apexPage'
  },
  recordTypeVisibilities: {
    headers: ['default', 'personAccountDefault', 'recordType', 'visible'],
    key: 'recordType'
  },
  tabVisibilities: {
    headers: ['tab', 'visibility'],
    key: 'tab'
  },
  userPermissions: {
    headers: ['enabled', 'name'],
    key: 'name'
  }
};

/**
 * Ottiene la lista delle opzioni per la select del tipo
 * @returns {Array} Array di oggetti con label e value
 */
export const getCustomUpsertTypeOptions = () => {
  return Object.keys(customUpsertConfig).map(key => ({
    label: formatLabel(key),
    value: key
  }));
};

/**
 * Formatta il nome della chiave in una label leggibile
 * @param {string} key - Chiave da formattare
 * @returns {string} Label formattata
 */
function formatLabel(key) {
  // Converti camelCase in parole separate con maiuscole
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Ottiene gli headers per un tipo specifico
 * @param {string} type - Tipo selezionato
 * @returns {Array} Array di headers
 */
export const getHeadersForType = (type) => {
  return customUpsertConfig[type]?.headers || [];
};

/**
 * Ottiene la chiave per un tipo specifico
 * @param {string} type - Tipo selezionato
 * @returns {string|Array} Chiave o array di chiavi
 */
export const getKeyForType = (type) => {
  return customUpsertConfig[type]?.key || '';
};
