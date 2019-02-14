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
        let editOptions = {undoStopBefore: false, undoStopAfter: false};
        let numSelections = e.selections.length;
        for (const x of Array(numSelections).keys()) {
            let sel = e.selections[x];
            let range: Range;
            if (numSelections === 1 && sel.isEmpty) {
                range = new Range(d.positionAt(0), d.lineAt(d.lineCount - 1).range.end);
            } else {
                range = new Range(sel.start, sel.end);
            }
            for (const r of rule.steps) {
                let findText = d.getText(range);
                findText = findText.replace(new RegExp(/\r\n/, 'g'), "\n");
                await e.edit((edit) => {
                    edit.replace(range, findText.replace(r.find, r.replace));
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
