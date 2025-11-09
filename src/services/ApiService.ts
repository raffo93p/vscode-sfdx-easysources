import { SettingsService, EasySourcesSettings } from './SettingsService';

// Import the sfdx-easy-sources API
const {
  profiles, permissionSets, labels, applications, 
  globalValueSets, globalValueSetTranslations, objectTranslations, translations, recordTypes
} = require('sfdx-easy-sources');

export interface ApiExecutionParams {
  apiNamespace: string;
  action: string;
  params: any;
  settings: EasySourcesSettings;
  workspacePath: string;
}

export class ApiService {
  private static readonly API_MAP: { [key: string]: any } = {
    'profiles': profiles,
    'permissionSets': permissionSets,
    'labels': labels,
    'applications': applications,
    'globalValueSets': globalValueSets,
    'globalValueSetTranslations': globalValueSetTranslations,
    'objectTranslations': objectTranslations,
    'translations': translations,
    'recordTypes': recordTypes
  };

  /**
   * Esegue un comando API
   * @param executionParams Parametri per l'esecuzione dell'API
   * @returns Risultato dell'esecuzione dell'API
   */
  static async executeApiCommand(executionParams: ApiExecutionParams): Promise<any> {
    const { apiNamespace, action, params, settings, workspacePath } = executionParams;
    
    console.log(`Executing ${apiNamespace}.${action} with params:`, params);
    console.log(`Using settings:`, settings);

    const api = this.API_MAP[apiNamespace];
    if (!api) {
      throw new Error(`Unknown API namespace: ${apiNamespace}`);
    }

    const method = api[action];
    if (!method) {
      throw new Error(`Unknown action: ${action} for ${apiNamespace}`);
    }

    // Prepara i parametri finali includendo i path da settings se disponibili
    const finalParams = SettingsService.prepareApiParams(settings, workspacePath, params);
    
    console.log('Final params with resolved paths:', finalParams);

    // Esegui il comando API
    const result = await method(finalParams);
    
    console.log(`API execution result:`, result);
    return result;
  }

  /**
   * Valida se un namespace API è supportato
   * @param apiNamespace Nome del namespace
   * @returns True se supportato, false altrimenti
   */
  static isApiNamespaceSupported(apiNamespace: string): boolean {
    return apiNamespace in this.API_MAP;
  }

  /**
   * Ottiene la lista dei namespace API supportati
   * @returns Array dei namespace supportati
   */
  static getSupportedApiNamespaces(): string[] {
    return Object.keys(this.API_MAP);
  }
}