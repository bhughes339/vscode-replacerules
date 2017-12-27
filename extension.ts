'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import ExtensionContext = vscode.ExtensionContext;
import Window = vscode.window;
import Selection = vscode.Selection;
import TextDocument = vscode.TextDocument;
import TextEditor = vscode.TextEditor;

export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "vscode-replacerules" is now active!');
    vscode.commands.registerCommand('extension.chooseRule', function() {
        readRulesAndExec();
    });
}

function readRulesAndExec() {
    let config = vscode.workspace.getConfiguration("replacerules");
    let configRules = config.get<any>("rules");
    chooseRule(configRules);
}

function chooseRule(rules) {
    let items: vscode.QuickPickItem[] = [];
    for (let i = 0; i < rules.length; i++) {
        let currentRule = rules[i];
        if (currentRule.name && currentRule.find)
        items.push({
            label: currentRule.name,
            description: "Replace Rule "+i
        });
    }
    Window.showQuickPick(items).then(function (selection) {
        if (!selection) return;
        let e = Window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        if (sel.length === 1 && sel[0].isEmpty) {
            let start = d.positionAt(0);
            let end = d.lineAt(d.lineCount-1).range.end;
            sel[0] = new Selection(start, end);
        }
        let index = selection.description.slice(13);
        let thisRule = rules[index];
        let ruleFinds = (Array.isArray(thisRule.find)) ? thisRule.find : [thisRule.find];
        if (!thisRule.flags) thisRule.flags = "";
        let ruleFlags = (Array.isArray(thisRule.flags)) ? thisRule.flags : [thisRule.flags];
        if (!thisRule.replace) thisRule.replace = "";
        let ruleReplaces = (Array.isArray(thisRule.replace)) ? thisRule.replace : [thisRule.replace];
        if ((ruleReplaces.length > 1) && (ruleFinds.length !== ruleReplaces.length)) {
            Window.showErrorMessage("Replace string array size needs to equal Find string array size (or 1)");
            return;
        }
        let find = [];
        for (let i = 0; i < ruleFinds.length; i++) {
            let flags = (ruleFlags[i]) ? ruleFlags[i] : ((ruleFlags[0]) ? ruleFlags[0] : 'gm');
            try {
                find.push(new RegExp(ruleFinds[i], flags));
            } catch (err) {
                if (err.name === "SyntaxError") Window.showErrorMessage("Invalid regular expression");
                return;
            }
        }
        doReplace(e, d, sel, find, ruleReplaces);
    });
}

function doReplace(e: TextEditor, d: TextDocument, sel: Selection[], findArray: RegExp[], replaceArray: string[]) {
	e.edit(function (edit) {
		for (var i = 0; i < sel.length; i++) {
            let fText = d.getText(sel[i]);
            for (var k = 0; k < findArray.length; k++) {
                let find = findArray[k];
                let replace = (replaceArray[k]) ? replaceArray[k] : replaceArray[0];
                try {
                    fText = fText.replace(find, replace);
                } catch (err) {
                    console.log(err);
                }
            }
            edit.replace(sel[i], fText);
        }
	});
}