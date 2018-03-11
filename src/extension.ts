import * as vscode from 'vscode';

import { TextEditor, Range } from 'vscode';
import Window = vscode.window;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.chooseRule', ruleReplace));
}

class Replacement {
    static defaultFlags = 'gm';
    public find: RegExp;
    public replace: string;

    public constructor(find: string, replace: string, flags: string) {
        this.find = new RegExp(find, flags || Replacement.defaultFlags);
        this.replace = replace || '';
    }
}

class ReplaceRule {
    public name: string;
    public steps: Replacement[];

    public constructor(rule: any) {
        this.name = rule.name;
        let ruleSteps: Replacement[] = [];
        let find = (Array.isArray(rule.find)) ? rule.find : [rule.find];
        let replace = (typeof rule.replace === 'undefined') ? null : rule.replace;
        let flags = (typeof rule.flags === 'undefined') ? null : rule.flags;
        for (let i = 0; i < find.length; i++) {
            let stepFlags = (Array.isArray(flags)) ? flags[i] : flags;
            let stepReplace = (Array.isArray(replace)) ? replace[i] : replace;
            ruleSteps.push(new Replacement(find[i], stepReplace, stepFlags));
        }
        this.steps = ruleSteps;
    }
}

function ruleReplace(textEditor: TextEditor) {
    let config = vscode.workspace.getConfiguration("replacerules");
    let configRules = config.get<any>("rules");
    let items = [];
    for (const r of configRules) {
        if (r.name && r.find) {
            try {
                items.push({
                    label: "Replace Rule: " + r.name,
                    description: "",
                    ruleClass: new ReplaceRule(r)
                });
            } catch (err) {
                Window.showErrorMessage('Error parsing rule ' + r.name + ': ' + err.message);
            }
        }
    }
    vscode.window.showQuickPick(items).then(qpItem => {
        if (!qpItem) return;
        try {
            doReplace(textEditor, qpItem.ruleClass);
        } catch (err) {
            Window.showErrorMessage('Error executing rule ' + qpItem.ruleClass.name + ': ' + err.message);
        }
    });
    return;
}

function doReplace(e: TextEditor, rule: ReplaceRule) {
    let d = e.document;
    let sel = e.selections;
    let replaceRanges: Range[] = [];
    for (const s of sel) {
        if (! s.isEmpty) {
            replaceRanges.push(new Range(s.start, s.end));
        }
    }
    if (replaceRanges.length === 0) {
        let start = d.positionAt(0);
        let end = d.lineAt(d.lineCount - 1).range.end;
        replaceRanges[0] = new Range(start, end);
    }
    e.edit((edit) => {
        for (const range of replaceRanges) {
            for (let i = range.start.line; i <= range.end.line; i++) {
                let singleLineRange = range.intersection(d.lineAt(i).range);
                if (singleLineRange === undefined) {
                    continue;
                }
                let oldText = d.getText(singleLineRange);
                let fText = oldText;
                for (const r of rule.steps) {
                    fText = fText.replace(r.find, r.replace);
                }
                if (fText !== oldText) edit.replace(singleLineRange, fText);
            }
        }
    });
    return;
}
