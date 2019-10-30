import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRule', runSingleRule));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRuleset', runRuleset));
}

function runSingleRule(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    if (args) {
        let ruleName = args['ruleName'];
        new ReplaceRulesEditProvider(textEditor).runSingleRule(ruleName);
    } else {
        new ReplaceRulesEditProvider(textEditor).chooseRule();
    }
    return;
}

function runRuleset(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    if (args) {
        let rulesetName = args['rulesetName'];
        new ReplaceRulesEditProvider(textEditor).runRuleset(rulesetName);
    } else {
        new ReplaceRulesEditProvider(textEditor).chooseRuleset();
    }
    return;
}
