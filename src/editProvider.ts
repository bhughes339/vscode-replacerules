import * as vscode from 'vscode';

import { TextEditor, Range } from 'vscode';
import Window = vscode.window;

export default class ReplaceRulesEditProvider {
    private textEditor: TextEditor;

    public async chooseRule() {
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
                this.doReplace(qpItem.ruleClass);
            } catch (err) {
                Window.showErrorMessage('Error executing rule ' + qpItem.ruleClass.name + ': ' + err.message);
            }
        });
        return;
    }

    private async doReplace(rule: ReplaceRule) {
        let e = this.textEditor;
        let d = e.document;
        let sel = e.selections;
        let replaceRanges: Range[] = [];
        for (const s of sel) {
            if (!s.isEmpty) {
                replaceRanges.push(new Range(s.start, s.end));
            }
        }
        if (replaceRanges.length === 0) {
            let start = d.positionAt(0);
            let end = d.lineAt(d.lineCount - 1).range.end;
            replaceRanges[0] = new Range(start, end);
        }
        let editOptions = {undoStopBefore: false, undoStopAfter: false};
        for (const range of replaceRanges) {
            let startOffset = d.offsetAt(range.start);
            for (const r of rule.steps) {
                let findText = d.getText(range);
                await e.edit((edit) => {
                    let match;
                    let findReg = new RegExp(r.find);
                    while (match = findReg.exec(findText)) {
                        let matchStart = startOffset + match.index;
                        let matchRange = new Range(d.positionAt(matchStart), d.positionAt(matchStart + match[0].length));
                        edit.replace(matchRange, match[0].replace(r.find, r.replace));
                    }
                }, editOptions);
            }
        }
        return;
    }

    constructor(textEditor: TextEditor) {
        this.textEditor = textEditor;
    }
}

const objToArray = (obj: any) => {
    return (Array.isArray(obj)) ? obj : Array(obj);
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
        let find = objToArray(rule.find);
        for (let i = 0; i < find.length; i++) {
            ruleSteps.push(new Replacement(find[i], objToArray(rule.replace)[i], objToArray(rule.flags)[i]));
        }
        this.steps = ruleSteps;
    }
}
