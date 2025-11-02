import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, workspace} from "vscode";
import { getUri } from "../utilities/getUri";
import * as path from 'path';
import * as fs from 'fs';
import { getNonce } from "../utilities/getNonce";
import { applications } from "../mock/Mock";
import { getMetadataList } from "../utilities/selectUtils";
/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class EasySourcesPanel {
  public static currentPanel: EasySourcesPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

	private readonly _extensionPath: string;

  /**
   * The EasySourcesPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;

    this._extensionPath = context.extensionPath;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    // this._panel.webview.html = this._getWebviewContent2(this._panel.webview, context.extensionUri);
    // this._panel.webview.html = this._getWebviewContent3(this._panel.webview, context.extensionPath);

    this._panel.webview.html = this.getWebviewContent('ciao');
    // const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'src', 'html', 'webview.html');
    // const htmlContent = fs.readFileSync(htmlPath.fsPath, 'utf8');

    // this._panel.webview.html = htmlContent;

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);


 
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(context: ExtensionContext) {
    if (EasySourcesPanel.currentPanel) {
      // If the webview panel already exists reveal it
      EasySourcesPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showEasySources",
        // Panel title
        "SFDX EasySources",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [
            Uri.joinPath(context.extensionUri, "out"),
            Uri.joinPath(context.extensionUri, "react-easysources/build")
          ],
        }
      );

      EasySourcesPanel.currentPanel = new EasySourcesPanel(panel, context);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    EasySourcesPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getWebviewContent(filepath: string): string {
    const manifest = require(path.join(this._extensionPath, "react-easysources", 'build', 'asset-manifest.json'));
		const mainScript = manifest['files']['main.js'];
		const mainStyle = manifest['files']['main.css'];

		const scriptPathOnDisk = Uri.file(path.join(this._extensionPath, "react-easysources", 'build', mainScript));
		const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
		const stylePathOnDisk = Uri.file(path.join(this._extensionPath, "react-easysources", 'build', mainStyle));
		const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${Uri.file(path.join(this._extensionPath, "react-easysources", 'build')).with({ scheme: 'vscode-resource' })}/">
        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
			  </script>
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }


  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "hello":
            // Code that should run in response to the hello message command
            window.showInformationMessage(text);
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
          case "ciao":
            console.log('ciao');
            window.showInformationMessage(text);
            return;
          case "squarePushed":
            console.log('squarePushed');
            window.showInformationMessage(text);
            return;
          case "GET_METADATA_INPUT_LIST":
            console.log('GET_METADATA_INPUT_LIST');
            console.log('Message: ', message, 'objectName:', message.objectName);

            const workspaceFolder = workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
              this._panel.webview.postMessage({ command: 'SETTINGS_FILE_NOT_FOUND' });
              return;
            }
            const workspacePath = workspaceFolder.uri.fsPath;

            this._panel.webview.postMessage({ 
              command: 'GET_METADATA_INPUT_LIST_RESPONSE', 
              metadata: message.metadata,
              metadataList : getMetadataList(workspacePath, message.metadata, message.objectName)
            });
            return;
          case "READ_SETTINGS_FILE":
            console.log('READ_SETTINGS_FILE');
            this._readSettingsFile();
            return;
          default:
              break;
        }
      },
      undefined,
      this._disposables
    );
  }

  private _readSettingsFile() {
    try {
      // Prova a trovare il workspace corrente
      const workspaceFolder = workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        this._panel.webview.postMessage({ command: 'SETTINGS_FILE_NOT_FOUND' });
        return;
      }

      // Costruisce il percorso del file settings
      const settingsPath = path.join(workspaceFolder.uri.fsPath, 'easysources-settings.json');
      
      // Verifica se il file esiste
      if (fs.existsSync(settingsPath)) {
        // Legge il contenuto del file
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        try {
          // Prova a parsare il JSON per verificare che sia valido
          const parsedSettings = JSON.parse(settingsContent);
          this._panel.webview.postMessage({ 
            command: 'SETTINGS_FILE_CONTENT', 
            content: JSON.stringify(parsedSettings, null, 2) 
          });
        } catch (parseError) {
          // Se il JSON non è valido, invia comunque il contenuto raw
          this._panel.webview.postMessage({ 
            command: 'SETTINGS_FILE_CONTENT', 
            content: settingsContent 
          });
        }
      } else {
        this._panel.webview.postMessage({ command: 'SETTINGS_FILE_NOT_FOUND' });
      }
    } catch (error) {
      console.error('Error reading settings file:', error);
      this._panel.webview.postMessage({ command: 'SETTINGS_FILE_NOT_FOUND' });
    }
  }

  
}