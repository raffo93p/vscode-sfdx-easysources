export const optionsMdt = [
    {label: 'Applications', value: 'applications'},
    {label: 'Global Value Sets', value: 'globalvaluesets'},
    {label: 'Global Value Set Translations', value: 'globalvaluesettranslations'},
    {label: 'Labels', value: 'labels'},
    {label: 'Object Translations', value: 'objecttranslations'},
    {label: 'Permission Sets', value: 'permissionsets'},
    {label: 'Profiles', value: 'profiles'},
    {label: 'Record Types', value: 'recordtypes'},
    {label: 'Translations', value: 'translations'}   
];

// Azioni di base disponibili per tutti i metadata
const baseActions = [
    {label: 'Split (Create CSV from XML)', value: 'split'},
    {label: 'Upsert (Upsert CSV from XML)', value: 'upsert'},
    {label: 'Update _tagId (on CSV)', value: 'updatekey'},
    {label: 'Merge (Create XML from CSV)', value: 'merge'},
    {label: 'Are Aligned (XML and CSV)', value: 'arealigned'}
];

// Azioni aggiuntive per metadata specifici
const additionalActions = {
    minify: {label: 'Minify (on CSV)', value: 'minify'},
    delete: {label: 'Delete (on CSV)', value: 'delete'},
    clean: {label: 'Clean (on CSV)', value: 'clean'}
};

export const optionsAct = {
    '' : [],
    'applications': [...baseActions],
    'globalvaluesets': [...baseActions],
    'globalvaluesettranslations': [...baseActions],
    'labels': [...baseActions],
    'objecttranslations': [
        baseActions[0], // split
        baseActions[1], // upsert
        additionalActions.minify,
        baseActions[3], // merge
        baseActions[4]  // arealigned
    ],
    'permissionsets': [
        ...baseActions,
        additionalActions.delete,
        additionalActions.minify,
        additionalActions.clean
    ],
    'profiles': [
        ...baseActions,
        additionalActions.delete,
        additionalActions.minify,
        additionalActions.clean
    ],
    'recordtypes': [
        baseActions[0], // split
        baseActions[1], // upsert
        baseActions[2], // updatekey
        additionalActions.delete,
        additionalActions.clean,
        baseActions[3], // merge
        baseActions[4]  // arealigned
    ],
    'translations': [...baseActions]
}

function actionBasicParams(sort, canSelectInput) {
    if(canSelectInput){
        return {
            'split': {'sort': sort, 'selectInput': false},
            'upsert': {'sort': sort, 'selectInput': false},
            'updatekey': {'sort': sort, 'selectInput': false},
            'merge': {'sort': sort, 'selectInput': false}
        }
    } else {
        return {
            'split': {'sort': sort},
            'upsert': {'sort': sort},
            'updatekey': {'sort': sort},
            'merge': {'sort': sort}
        }
    }
}

// Configurazione comune per l'azione delete
const deleteActionConfig = {
    sort: true,
    selectInput: false,
    type: [
        {label: 'ApplicationVisibilities', value: 'applicationVisibilities'}, 
        {label: 'ClassAccesses', value: 'classAccesses'}, 
        {label: 'CustomMetadataTypeAccesses', value: 'customMetadataTypeAccesses'},
        {label: 'CustomPermissions', value: 'customPermissions'},
        {label: 'CustomSettingAccesses', value: 'customSettingAccesses'},
        {label: 'FieldPermissions', value: 'fieldPermissions'},
        {label: 'FlowAccesses', value: 'flowAccesses'},
        {label: 'LayoutAssignments', value: 'layoutAssignments'},
        {label: 'ObjectPermissions', value: 'objectPermissions'},
        {label: 'PageAccesses', value: 'pageAccesses'},
        {label: 'RecordTypeVisibilities', value: 'recordTypeVisibilities'},
        {label: 'TabVisibilities', value: 'tabVisibilities'},
        {label: 'UserPermissions', value: 'userPermissions'}
    ],
    tagid: ''
};


// Configurazione per l'azione arealigned
const areAlignedActionConfig = {
    sort: false,
    selectInput: false, // varia per metadata
    mode: 'string' // default value, opzioni: 'string' | 'logic'
};

export const metadataAction_params = {
    'applications': { 
        ...actionBasicParams(true, true),
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'globalvaluesets': { 
        ...actionBasicParams(false, true),
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'globalvaluesettranslations': { 
        ...actionBasicParams(false, true),
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'labels': { 
        ...actionBasicParams(true, false),
        'arealigned': { ...areAlignedActionConfig } // no selectInput
    },
    'objecttranslations': {
        'split': {'sort': true, 'selectInput': false},
        'upsert': {'sort': true, 'selectInput': false},
        'minify': {'sort': true, 'selectInput': false},
        'merge': {'sort': true, 'selectInput': false},
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'permissionsets': {
        ...actionBasicParams(true, true),
        'delete': deleteActionConfig,
        'minify': {'sort': true, 'selectInput': false},
        'clean': {
            'sort': true,
            'selectInput': false,
            'orgname': '', // TODO
            'mode': [{label: 'Clean', value: 'clean'}, {label: 'Log', value: 'log'}],
            'target': [{label: 'Org', value: 'org'}, {label: 'Local', value: 'local'}, {label: 'Both', value: 'both'}],
            'include-standard-fields': false,
            'include-standard-tabs': false,
            'skip-manifest-creation': false,
            'include-types': [],
            'skip-types': ['Settings'] // TODO
        },
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'profiles': {
        ...actionBasicParams(true, true),
        'delete': deleteActionConfig,
        'minify': {'sort': true, 'selectInput': false},
        'clean': {
            'sort': true,
            'selectInput': false,
            'orgname': '', // TODO
            'mode': [{label: 'Clean', value: 'clean'}, {label: 'Log', value: 'log'}],
            'target': [{label: 'Org', value: 'org'}, {label: 'Local', value: 'local'}, {label: 'Both', value: 'both'}],
            'include-standard-fields': false,
            'include-standard-tabs': false,
            'skip-manifest-creation': false,
            'include-types': [],
            'skip-types': ['Settings'] // TODO
        },
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    },
    'recordtypes': {
        'split': {'sort': true, 'selectObject': false, 'selectRecordtype': false},
        'upsert': {'sort': true, 'selectObject': false, 'selectRecordtype': false},
        'updatekey': {'sort': true, 'selectObject': false, 'selectRecordtype': false},
        'delete': { 'sort': true, 
            selectObject: false,
            selectRecordtype: false,
            picklist: '',
            apiname: ''
        },
        'clean': {'sort': true, 'selectObject': false, 'selectRecordtype': false},
        'merge': {'sort': true, 'selectObject': false, 'selectRecordtype': false},
        'arealigned': {
            sort: false,
            selectObject: false,
            selectRecordtype: false,
            mode: 'string'
        }
    },
    'translations': { 
        ...actionBasicParams(false, true),
        'arealigned': { ...areAlignedActionConfig, selectInput: false }
    }

}