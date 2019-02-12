import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.chooseRule', ruleReplace));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.chooseRuleGlobal', ruleReplaceGlobal));

}

function ruleReplace(textEditor: vscode.TextEditor) {
    new ReplaceRulesEditProvider(textEditor).chooseRule(false);
    return;
}

function ruleReplaceGlobal(textEditor: vscode.TextEditor) {
    new ReplaceRulesEditProvider(textEditor).chooseRule(true);
    return;
}