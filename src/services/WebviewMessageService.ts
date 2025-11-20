import { Webview } from 'vscode';
import { OUTGOING_MESSAGE_TYPES } from '../constants/MessageTypes';

export type WebviewMessageCommand = 
  | 'SETTINGS_FILE_CONTENT'
  | 'SETTINGS_FILE_NOT_FOUND'
  | 'GET_METADATA_INPUT_LIST_RESPONSE'
  | 'API_EXECUTION_RESULT'
  | 'API_EXECUTION_ERROR';

export interface WebviewMessage {
  command: WebviewMessageCommand;
  [key: string]: any;
}

export interface IncomingMessage {
  command: string;
  [key: string]: any;
}

/**
 * Servizio per gestire la comunicazione con il webview
 */
export class WebviewMessageService {
  private webview: Webview;

  constructor(webview: Webview) {
    this.webview = webview;
  }

  /**
   * Invia un messaggio al webview
   * @param message Messaggio da inviare
   */
  postMessage(message: WebviewMessage): void {
    this.webview.postMessage(message);
  }

  /**
   * Invia le impostazioni al webview
   * @param settings Contenuto delle impostazioni
   * @param workspacePath Path del workspace (opzionale)
   */
  sendSettingsContent(settings: any, workspacePath?: string): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.SETTINGS_FILE_CONTENT as WebviewMessageCommand,
      content: JSON.stringify(settings, null, 2),
      workspacePath
    });
  }

  /**
   * Invia notifica che il file settings non è stato trovato
   */
  sendSettingsNotFound(): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.SETTINGS_FILE_NOT_FOUND as WebviewMessageCommand
    });
  }

  /**
   * Invia la risposta per la lista dei metadata
   * @param metadata Tipo di metadata
   * @param metadataList Lista dei metadata
   */
  sendMetadataInputListResponse(metadata: string, metadataList: any[]): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.GET_METADATA_INPUT_LIST_RESPONSE as WebviewMessageCommand,
      metadata,
      metadataList
    });
  }

  /**
   * Invia il risultato dell'esecuzione dell'API
   * @param result Risultato dell'esecuzione
   */
  sendApiExecutionResult(result: any): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.API_EXECUTION_RESULT as WebviewMessageCommand,
      result
    });
  }

  /**
   * Invia l'errore dell'esecuzione dell'API
   * @param error Messaggio di errore
   */
  sendApiExecutionError(error: string): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.API_EXECUTION_ERROR as WebviewMessageCommand,
      error
    });
  }
}