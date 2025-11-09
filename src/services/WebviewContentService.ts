import { Uri, ExtensionContext } from 'vscode';
import * as path from 'path';
import { getNonce } from '../utilities/getNonce';

/**
 * Servizio per generare il contenuto HTML del webview
 */
export class WebviewContentService {
  private extensionPath: string;

  constructor(context: ExtensionContext) {
    this.extensionPath = context.extensionPath;
  }

  /**
   * Genera il contenuto HTML per il webview React
   * @returns String contenente l'HTML da renderizzare
   */
  getWebviewContent(): string {
    const manifest = require(path.join(this.extensionPath, "react-easysources", 'build', 'asset-manifest.json'));
    const mainScript = manifest['files']['main.js'];
    const mainStyle = manifest['files']['main.css'];

    const scriptPathOnDisk = Uri.file(path.join(this.extensionPath, "react-easysources", 'build', mainScript));
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
    const stylePathOnDisk = Uri.file(path.join(this.extensionPath, "react-easysources", 'build', mainStyle));
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <title>SFDX EasySources</title>
        <link rel="stylesheet" type="text/css" href="${styleUri}">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
        <base href="${Uri.file(path.join(this.extensionPath, "react-easysources", 'build')).with({ scheme: 'vscode-resource' })}/">
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
}