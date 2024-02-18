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



export const metadataAction_params = {
    'applications': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'updatekey': {
            'sort': true,
            'selectInput': false
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'globalvaluesets': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'updatekey': {
            'sort': true,
            'selectInput': false
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'globalvaluesettranslations': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'updatekey': {
            'sort': true,
            'selectInput': false
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'labels': {
        'split': {
            'sort': true
        },
        'upsert': {
            'sort': true
        },
        'updatekey': {
            'sort': true
        },
        'merge': {
            'sort': true
        }
    },
    'objecttranslations': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'minify': {
            'sort': true,
            'selectInput': false
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'permissionsets': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'updatekey': {
            'sort': true,
            'selectInput': false
        },
        'delete': {
            'sort': true,
            'selectInput': false,
            // TODO
            'type': [{label: 'Field Permissions', value: 'fieldpermissions'}, {label: 'Object Permissions', value: 'objectpermissions'}, {label: 'System Permissions', value: 'systempermissions'}],
            'tagid': [{label: 'Field Permissions', value: 'fieldpermissions'}, {label: 'Object Permissions', value: 'objectpermissions'}, {label: 'System Permissions', value: 'systempermissions'}]
        },
        'minify': {
            'sort': true,
            'selectInput': false
        },
        'clean': {
            'sort': true,
            'selectInput': false,
            'orgname': '', // TODO
            'mode': [{label: 'Clean', value: 'clean'}, {label: 'Interactive', value: 'interactive'}, {label: 'Log', value: 'log'}],
            'target': [{label: 'Org', value: 'org'}, {label: 'Local', value: 'local'}, {label: 'Both', value: 'both'}],
            'include-standard-fields': false,
            'include-standard-tabs': false,
            'skip-manifest-creation': false,
            'skip-types': ['Settings'] // TODO
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'profiles': {
        'split': {
            'sort': true,
            'selectInput': false
        },
        'upsert': {
            'sort': true,
            'selectInput': false
        },
        'updatekey': {
            'sort': true,
            'selectInput': false
        },
        'delete': {
            'sort': true,
            'selectInput': false,
            'type': [{label: 'Field Permissions', value: 'fieldpermissions'}, {label: 'Object Permissions', value: 'objectpermissions'}, {label: 'System Permissions', value: 'systempermissions'}],
            'tagid': [{label: 'Field Permissions', value: 'fieldpermissions'}, {label: 'Object Permissions', value: 'objectpermissions'}, {label: 'System Permissions', value: 'systempermissions'}]
        },
        'minify': {
            'sort': true,
            'selectInput': false
        },
        'clean': {
            'sort': true,
            'selectInput': false,
            'orgname': '', // TODO
            'mode': [{label: 'Clean', value: 'clean'}, {label: 'Interactive', value: 'interactive'}, {label: 'Log', value: 'log'}],
            'target': [{label: 'Org', value: 'org'}, {label: 'Local', value: 'local'}, {label: 'Both', value: 'both'}],
            'include-standard-fields': false,
            'include-standard-tabs': false,
            'skip-manifest-creation': false,
            'skip-types': ['Settings'] // TODO
        },
        'merge': {
            'sort': true,
            'selectInput': false
        }
    },
    'recordtypes': {
        'split': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        },
        'upsert': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        },
        'updatekey': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        },
        'delete': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        },
        'clean': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        },
        'merge': {
            'sort': true,
            'selectObject': false,
            'selectRecordtype': false
        }
    },

}