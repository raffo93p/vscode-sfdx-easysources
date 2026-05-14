import { Webview } from 'vscode';
import { OUTGOING_MESSAGE_TYPES } from '../constants/MessageTypes';

type OutgoingMessageType = typeof OUTGOING_MESSAGE_TYPES[keyof typeof OUTGOING_MESSAGE_TYPES];

export interface WebviewMessage {
  command: OutgoingMessageType;
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
   */
  postMessage(message: WebviewMessage): void {
    this.webview.postMessage(message);
  }

  sendSettingsContent(settings: any, workspacePath?: string): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.SETTINGS_FILE_CONTENT,
      content: JSON.stringify(settings, null, 2),
      workspacePath
    });
  }

  sendSettingsNotFound(): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.SETTINGS_FILE_NOT_FOUND
    });
  }

  sendMetadataInputListResponse(metadata: string, metadataList: any[]): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.GET_METADATA_INPUT_LIST_RESPONSE,
      metadata,
      metadataList
    });
  }

  sendApiExecutionResult(result: any): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.API_EXECUTION_RESULT,
      result
    });
  }

  sendApiExecutionError(error: string): void {
    this.postMessage({
      command: OUTGOING_MESSAGE_TYPES.API_EXECUTION_ERROR,
      error
    });
  }
}