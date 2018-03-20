import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.chooseRule', ruleReplace));
}

function ruleReplace(textEditor: vscode.TextEditor) {
    new ReplaceRulesEditProvider(textEditor).chooseRule();
    return;
}
