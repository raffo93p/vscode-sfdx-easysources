import * as vscode from 'vscode';
import { EasySourcesPanel } from './panels/EasySourcesPanel';

/**
 * This method is called when your extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('SFDX EasySources extension is now active!');

	const disposable = vscode.commands.registerCommand('sfvsc-easy-sources.showPanel', () => {
		EasySourcesPanel.render(context);
	});

	context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated
 */
export function deactivate() {}
