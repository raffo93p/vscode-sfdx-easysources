import { WebviewMessageService, IncomingMessage } from '../services/WebviewMessageService';
import { SettingsService } from '../services/SettingsService';
import { ApiService } from '../services/ApiService';
import { getMetadataList } from '../utilities/selectUtils';
import { window, workspace } from 'vscode';

/**
 * Gestisce i messaggi in arrivo dal webview
 */
export class MessageHandler {
  private messageService: WebviewMessageService;

  constructor(messageService: WebviewMessageService) {
    this.messageService = messageService;
  }

  /**
   * Gestisce un messaggio in arrivo dal webview
   * @param message Messaggio ricevuto
   */
  async handleMessage(message: IncomingMessage): Promise<void> {
    const command = message.command;
    
    console.log(`Handling message: ${command}`);

    switch (command) {
      case "hello":
        this.handleHello(message);
        break;
      case "ciao":
        this.handleCiao(message);
        break;
      case "squarePushed":
        this.handleSquarePushed(message);
        break;
      case "DEBUG_LOG":
        this.handleDebugLog(message);
        break;
      case "GET_METADATA_INPUT_LIST":
        await this.handleGetMetadataInputList(message);
        break;
      case "READ_SETTINGS_FILE":
        this.handleReadSettingsFile();
        break;
      case "EXECUTE_API":
        await this.handleExecuteApi(message);
        break;
      default:
        console.warn(`Unknown command: ${command}`);
        break;
    }
  }

  private handleHello(message: IncomingMessage): void {
    window.showInformationMessage(message.text);
  }

  private handleCiao(message: IncomingMessage): void {
    console.log('ciao');
    window.showInformationMessage(message.text);
  }

  private handleSquarePushed(message: IncomingMessage): void {
    console.log('squarePushed');
    window.showInformationMessage(message.text);
  }

  private handleDebugLog(message: IncomingMessage): void {
    console.log('DEBUG_LOG');
    console.log(message.data);
  }

  private async handleGetMetadataInputList(message: IncomingMessage): Promise<void> {
    console.log('GET_METADATA_INPUT_LIST');
    console.log('Message: ', message, 'objectName:', message.objectName);

    const workspaceFolder = workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      this.messageService.sendSettingsNotFound();
      return;
    }
    
    const workspacePath = workspaceFolder.uri.fsPath;
    const metadataList = getMetadataList(
      workspacePath, 
      message.settings, 
      message.metadata, 
      message.objectName
    );
    
    this.messageService.sendMetadataInputListResponse(message.metadata, metadataList);
  }

  private handleReadSettingsFile(): void {
    console.log('READ_SETTINGS_FILE');
    
    const { settings, workspacePath } = SettingsService.readSettingsFile();
    
    if (settings && workspacePath) {
      this.messageService.sendSettingsContent(settings, workspacePath);
      console.log('Settings file content sent to webview: ', JSON.stringify(settings, null, 2));
    } else {
      this.messageService.sendSettingsNotFound();
    }
  }

  private async handleExecuteApi(message: IncomingMessage): Promise<void> {
    console.log('EXECUTE_API');
    
    try {
      const { apiNamespace, action, params, settings } = message;
      
      const workspaceFolder = workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        throw new Error('No workspace folder found');
      }
      
      const workspacePath = workspaceFolder.uri.fsPath;
      
      const result = await ApiService.executeApiCommand({
        apiNamespace,
        action,
        params,
        settings,
        workspacePath
      });
      if(result['result'] === 'OK'){
        this.messageService.sendApiExecutionResult(result);
      } else if (result['result'] === 'ERROR' || result['result'] === 'KO') {
        this.messageService.sendApiExecutionError(result['error'] || 'API execution error');
      }
      window.showInformationMessage(`${apiNamespace}.${action} executed successfully!`);
      
    } catch (error) {
      console.error('Error executing API command:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.messageService.sendApiExecutionError(errorMessage);
      window.showErrorMessage(`API execution failed: ${errorMessage}`);
    }
  }
}