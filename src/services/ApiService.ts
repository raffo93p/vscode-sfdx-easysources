import { SettingsService, EasySourcesSettings } from './SettingsService';
import { Logger } from '../utilities/Logger';

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
   * @throws Error se l'API namespace o action non sono validi, o se l'esecuzione fallisce
   */
  static async executeApiCommand(executionParams: ApiExecutionParams): Promise<any> {
    const { apiNamespace, action, params, settings, workspacePath } = executionParams;
    
    Logger.log(`Executing ${apiNamespace}.${action}`);
    Logger.debug('API params:', params);
    Logger.debug('Settings:', settings);

    // Validate API namespace
    const api = this.API_MAP[apiNamespace];
    if (!api) {
      const error = `Unknown API namespace: ${apiNamespace}. Supported: ${this.getSupportedApiNamespaces().join(', ')}`;
      Logger.error(error);
      throw new Error(error);
    }

    // Validate API action
    const method = api[action];
    if (!method) {
      const availableActions = Object.keys(api).join(', ');
      const error = `Unknown action: ${action} for ${apiNamespace}. Available actions: ${availableActions}`;
      Logger.error(error);
      throw new Error(error);
    }

    try {
      // Prepara i parametri finali includendo i path da settings se disponibili
      const finalParams = SettingsService.prepareApiParams(settings, workspacePath, params);
      
      Logger.debug('Final params with resolved paths:', finalParams);

      // Esegui il comando API
      const result = await method(finalParams);
      
      // Validate result
      if (!result) {
        throw new Error(`API ${apiNamespace}.${action} returned empty result`);
      }

      Logger.log(`API execution completed for ${apiNamespace}.${action}`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Logger.error(`API execution failed for ${apiNamespace}.${action}:`, errorMessage);
      throw new Error(`Failed to execute ${apiNamespace}.${action}: ${errorMessage}`);
    }
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