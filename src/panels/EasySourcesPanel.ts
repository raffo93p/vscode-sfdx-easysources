import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext } from "vscode";
import { WebviewMessageService } from '../services/WebviewMessageService';
import { WebviewContentService } from '../services/WebviewContentService';
import { MessageHandler } from '../handlers/MessageHandler';
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
  private _messageService: WebviewMessageService;
  private _messageHandler: MessageHandler;
  private _contentService: WebviewContentService;

  /**
   * The EasySourcesPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param context The extension context
   */
  private constructor(panel: WebviewPanel, context: ExtensionContext) {
    this._panel = panel;

    // Inizializza i servizi
    this._messageService = new WebviewMessageService(this._panel.webview);
    this._messageHandler = new MessageHandler(this._messageService);
    this._contentService = new WebviewContentService(context);

    // Set an event listener to listen for when the panel is disposed
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._contentService.getWebviewContent();

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
          
          // Retain context when hidden to preserve state
          retainContextWhenHidden: true,
          
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




  /**
   * Sets up an event listener to listen for messages passed from the webview context
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        await this._messageHandler.handleMessage(message);
      },
      undefined,
      this._disposables
    );
  }



  
}