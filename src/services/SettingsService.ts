import * as fs from 'fs';
import * as path from 'path';
import { workspace } from 'vscode';
import { Logger } from '../utilities/Logger';

export interface EasySourcesSettings {
  'salesforce-xml-path'?: string;
  'easysources-csv-path'?: string;
  [key: string]: any;
}

export class SettingsService {
  private static readonly SETTINGS_FILENAME = 'easysources-settings.json';

  /**
   * Legge il file delle settings dal workspace corrente
   * @returns Le settings parsate o null se il file non esiste
   */
  static readSettingsFile(): { settings: EasySourcesSettings | null; workspacePath: string | null } {
    try {
      const workspaceFolder = workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        Logger.warn('No workspace folder found');
        return { settings: null, workspacePath: null };
      }

      const workspacePath = workspaceFolder.uri.fsPath;
      const settingsPath = path.join(workspacePath, this.SETTINGS_FILENAME);
      
      if (!fs.existsSync(settingsPath)) {
        Logger.warn(`Settings file not found at: ${settingsPath}`);
        return { settings: null, workspacePath };
      }

      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      
      if (!settingsContent || settingsContent.trim() === '') {
        Logger.error('Settings file is empty');
        return { settings: null, workspacePath };
      }

      try {
        const parsedSettings = JSON.parse(settingsContent);
        Logger.log('Settings file loaded successfully');
        return { settings: parsedSettings, workspacePath };
      } catch (parseError) {
        Logger.error('Error parsing settings file - invalid JSON:', parseError);
        return { settings: null, workspacePath };
      }
    } catch (error) {
      Logger.error('Error reading settings file:', error);
      return { settings: null, workspacePath: null };
    }
  }

  /**
   * Risolve un path relativo in path assoluto basandosi sul workspace
   * @param relativePath Path relativo o assoluto
   * @param workspacePath Path del workspace
   * @returns Path assoluto risolto
   */
  static resolvePath(relativePath: string, workspacePath: string): string {
    if (!relativePath || !workspacePath) {
      return relativePath;
    }
    
    if (path.isAbsolute(relativePath)) {
      return relativePath;
    }
    
    return path.join(workspacePath, relativePath);
  }

  /**
   * Prepara i parametri API con i path risolti dalle settings
   * @param settings Settings configuration
   * @param workspacePath Workspace path
   * @param baseParams Parametri base dell'API
   * @returns Parametri finali con path risolti
   */
  static prepareApiParams(
    settings: EasySourcesSettings, 
    workspacePath: string, 
    baseParams: any = {}
  ): any {
    const finalParams = { ...baseParams };
    
    if (settings['salesforce-xml-path']) {
      const xmlPath = this.resolvePath(settings['salesforce-xml-path'], workspacePath);
      finalParams['sf-xml'] = xmlPath;
    }
    
    if (settings['easysources-csv-path']) {
      const csvPath = this.resolvePath(settings['easysources-csv-path'], workspacePath);
      finalParams['es-csv'] = csvPath;
    }
    
    return finalParams;
  }
}