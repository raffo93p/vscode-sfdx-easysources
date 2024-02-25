import {readdirSync} from 'fs';
import { join } from 'path';

export function getMetadataList(metadata : string) {
    const defaultPath = 'force-app/main/default/';
    // read files from directory
    const files = readdirSync(join(defaultPath, metadata), { withFileTypes: true })
            .filter(item => !item.isDirectory() && item.name.endsWith('app-meta.xml'))
            .map((item) => {
                return {label: item.name.replace('.app-meta.xml',''), value: item.name.replace('.app-meta.xml','')}
            });
    return files;
}