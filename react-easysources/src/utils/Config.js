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

export const optionsAct = {
    '' : [],
    'applications': [     
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Merge', value: 'merge'}
    ],
    'globalvaluesets': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Merge', value: 'merge'}
    ],
    'globalvaluesettranslations': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Merge', value: 'merge'}
    ],
    'labels': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Merge', value: 'merge'}
    ],
    'objecttranslations': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'Minify', value: 'minify'},
        {label: 'Merge', value: 'merge'}
    ],
    'permissionsets': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Delete', value: 'delete'},
        {label: 'Minify', value: 'minify'},
        {label: 'Clean', value: 'clean'},
        {label: 'Merge', value: 'merge'}
    ],
    'profiles': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Delete', value: 'delete'},
        {label: 'Minify', value: 'minify'},
        {label: 'Clean', value: 'clean'},
        {label: 'Merge', value: 'merge'}
    ],
    'recordtypes': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Delete', value: 'delete'},
        {label: 'Clean', value: 'clean'},
        {label: 'Merge', value: 'merge'}
    ],
    'translations': [
        {label: 'Split', value: 'split'},
        {label: 'Upsert', value: 'upsert'},
        {label: 'UpdateKey', value: 'updatekey'},
        {label: 'Merge', value: 'merge'}
    ]
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


export const metadataAction_params = {
    'applications': { ...actionBasicParams(true, true)},
    'globalvaluesets': { ...actionBasicParams(false, true)},
    'globalvaluesettranslations': { ...actionBasicParams(false, true)},
    'labels': { ...actionBasicParams(true, false)},
    'objecttranslations': {
        'split': {'sort': true, 'selectInput': false},
        'upsert': {'sort': true, 'selectInput': false},
        'minify': {'sort': true, 'selectInput': false},
        'merge': {'sort': true, 'selectInput': false},
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
        }
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
        }
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
    },
    'translations': { ...actionBasicParams(false, true)}

}