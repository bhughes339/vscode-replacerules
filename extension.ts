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
        readRulesAndExec(getRulePath(context));
    });
    vscode.commands.registerCommand('extension.editRules', function() {
        let path = getRulePath(context);
        let fs = require('fs');
        fs.stat(path, function(err, stats) {
            let f = vscode.Uri.file(path);
            f = (stats) ? f : f.with( { scheme: 'untitled'} );
            Window.showTextDocument(f).then(function(e) {
                if (!stats) newRuleFile(context, e);
            });
        });
    });
}

function getRulePath(context: ExtensionContext) {
    let isInsiders = context.extensionPath.includes('insiders');
    let userPath = process.env.APPDATA;
    let osType = 'win';
    if (!userPath) {
        if (process.platform == 'darwin') {
            userPath = process.env.HOME + '/Library/Application Support';
            osType = 'mac';
        } else if (process.platform == 'linux') {
            let os = require("os");
            userPath = os.homedir() + '/.config';
            osType = 'linux';
        } else {
            userPath = '/var/local';
            osType = 'linux';
        }
    }
    let usr = isInsiders ? '/Code - Insiders/User/replacerules.json' : '/Code/User/replacerules.json';
    return userPath.concat(usr);
}

function readRulesAndExec(path: string) {
    let fs = require('fs');
    fs.readFile(path, { encoding: 'utf8' }, function(err, data) {
        if (err) console.log(err);
        if (data) {
            let rules = JSON.parse(data);
            if (Array.isArray(rules)) chooseRule(rules);    
        }
    });
}

function chooseRule(rules) {
    let items: vscode.QuickPickItem[] = [];
    for (let i = 0; i < rules.length; i++) {
        if (rules[i].name && rules[i].find)
            items.push({
                label: rules[i].name,
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
        if (!thisRule.replace) thisRule.replace = "";
        let ruleReplaces = (Array.isArray(thisRule.replace)) ? thisRule.replace : [thisRule.replace];
        if ((ruleReplaces.length > 1) && (ruleFinds.length !== ruleReplaces.length)) {
            Window.showErrorMessage("Replace string array size needs to equal Find string array size (or 1)");
            return;
        }
        let find = [];
        for (let i = 0; i < ruleFinds.length; i++) {
            try {
                find.push(new RegExp(ruleFinds[i], 'g'));
            } catch (err) {
                if (err.name === "SyntaxError") Window.showErrorMessage("Invalid regular expression");
            }
        }
        doReplace(e, d, sel, find, ruleReplaces);
    });
}

function newRuleFile(context: ExtensionContext, e: TextEditor) {
    Window.showInformationMessage("replacerules.json not found. Using default settings...");
    let f = context.extensionPath + '/replacerules.json';
    vscode.workspace.openTextDocument(f).then(function(d) {
        let srcText = d.getText();
        let destDoc = e.document;
        e.edit(function (edit) {
            edit.insert(destDoc.positionAt(0), srcText);
        });
    });
}

function doReplace(e: TextEditor, d: TextDocument, sel: Selection[], findArray: RegExp[], replaceArray: string[]) {
	e.edit(function (edit) {
		for (var i = 0; i < sel.length; i++) {
            for (var j = sel[i].start.line; j <= sel[i].end.line; j++) {
                let dirtyLine = d.lineAt(j).text;
                for (var k = 0; k < findArray.length; k++) {
                    let find = findArray[k];
                    let replace = (replaceArray[k]) ? replaceArray[k] : replaceArray[0];
                    try {
                        dirtyLine = dirtyLine.replace(find, replace);
                    } catch (err) {
                        console.log(err);
                    }
                }
                edit.replace(d.lineAt(j).range, dirtyLine);
            }
        }
	});
}