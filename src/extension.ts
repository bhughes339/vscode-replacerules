import * as vscode from 'vscode';

import ReplaceRulesEditProvider from './editProvider';

export function activate(context: vscode.ExtensionContext) {
    convertRules();
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

function convertRules() {
    let config = vscode.workspace.getConfiguration("replacerules");
    let configScopes = config.inspect("rules");
    if (configScopes) {
        let scopeRules = configScopes.globalValue;
        if (Array.isArray(scopeRules)) {
            config.update("oldrules", scopeRules, vscode.ConfigurationTarget.Global);
            let newRules = oldRulesToNew(scopeRules);
            config.update("rules", newRules, vscode.ConfigurationTarget.Global);
            configFixMessage("global");
        }
        scopeRules = configScopes.workspaceValue;
        if (Array.isArray(scopeRules)) {
            config.update("oldrules", scopeRules, vscode.ConfigurationTarget.Workspace);
            let newRules = oldRulesToNew(scopeRules);
            config.update("rules", newRules, vscode.ConfigurationTarget.Workspace);
            configFixMessage("workspace");
        }
        scopeRules = configScopes.workspaceFolderValue;
        if (Array.isArray(scopeRules)) {
            config.update("oldrules", scopeRules, vscode.ConfigurationTarget.WorkspaceFolder);
            let newRules = oldRulesToNew(scopeRules);
            config.update("rules", newRules, vscode.ConfigurationTarget.WorkspaceFolder);
            configFixMessage("workspace folder");
        }
    }
    function configFixMessage(scope: string) {
        vscode.window.showInformationMessage(`Replace Rules: Your ${scope} replacerules.rules configuration has been automatically converted to the new format introduced in version 0.2.0. View release notes for more details.`);
    }
}

function oldRulesToNew(ruleObj: any[]) {
    let newRules = {};
    for (const r of ruleObj) {
        let ruleName: string = (r.name) ? r.name : "Replace Rule";
        (<any>newRules)[ruleName] = r;
        delete (<any>newRules)[ruleName].name;
    }
    return newRules;
}
