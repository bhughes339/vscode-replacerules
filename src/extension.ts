import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRule', runSingleRule));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.runRuleset', runRuleset));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('replacerules.pasteAndReplace', pasteReplace));
}

function runSingleRule(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let ruleName = args['ruleName'];
        editP.runSingleRule(ruleName);
    } else {
        editP.pickRuleAndRun();
    }
    return;
}

function runRuleset(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let rulesetName = args['rulesetName'];
        editP.runRuleset(rulesetName);
    } else {
        editP.pickRulesetAndRun();
    }
    return;
}

function pasteReplace(textEditor: vscode.TextEditor, _edit: vscode.TextEditorEdit, args?: any) {
    let editP = new ReplaceRulesEditProvider(textEditor);
    if (args) {
        let ruleName = args['ruleName'];
        editP.pasteReplace(ruleName);
    } else {
        editP.pickRuleAndPaste();
    }
    return;
}
