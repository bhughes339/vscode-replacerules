import * as vscode from 'vscode';

import { TextEditor, Range } from 'vscode';
import Window = vscode.window;

export default class ReplaceRulesEditProvider {
    private textEditor: TextEditor;
    private configRules: any;
    private configRulesets: any;

    public async chooseRule() {
        let language = this.textEditor.document.languageId;
        let configRules = this.configRules;
        let items = [];
        for (const r in configRules) {
            let rule = configRules[r];
            if (Array.isArray(rule.languages) && rule.languages.indexOf(language) === -1) {
                continue;
            }
            if (rule.find) {
                try {
                    items.push({
                        label: "Replace Rule: " + r,
                        description: "",
                        ruleName: r
                    });
                } catch (err) {
                    Window.showErrorMessage('Error parsing rule ' + r + ': ' + err.message);
                }
            }
        }
        vscode.window.showQuickPick(items).then(qpItem => {
            if (qpItem) this.runSingleRule(qpItem.ruleName);
        });
        return;
    }

    public async chooseRuleset() {
        let configRulesets = this.configRulesets
        let items = [];
        for (const r in configRulesets) {
            let ruleset = configRulesets[r];
            if (Array.isArray(ruleset.rules)) {
                try {
                    items.push({
                        label: "Ruleset: " + r,
                        description: "",
                        rulesetName: r
                    });
                } catch (err) {
                    Window.showErrorMessage('Error parsing ruleset ' + r + ': ' + err.message);
                }
            }
        }
        vscode.window.showQuickPick(items).then(qpItem => {
            if (qpItem) this.runRuleset(qpItem.rulesetName);
        });
        return;
    }

    public async runSingleRule(ruleName: string) {
        let rule = this.configRules[ruleName];
        if (rule) {
            let language = this.textEditor.document.languageId;
            if (Array.isArray(rule.languages) && rule.languages.indexOf(language) === -1) {
                return;
            }
            try {
                this.doReplace(new ReplaceRule(rule));
            } catch (err) {
                Window.showErrorMessage('Error executing rule ' + ruleName + ': ' + err.message);
            }
        }
    }

    public async runRuleset(rulesetName: string) {
        let language = this.textEditor.document.languageId;
        let ruleset = this.configRulesets[rulesetName];
        if (ruleset) {
            let ruleObject = new ReplaceRule({find: ''});
            try {
                ruleset.rules.forEach((r: string) => {
                    let rule = this.configRules[r];
                    if (rule) {
                        if (Array.isArray(rule.languages) && rule.languages.indexOf(language) === -1) {
                            return;
                        }
                        ruleObject.appendRule(this.configRules[r])
                    }
                });
                if (ruleObject) this.doReplace(ruleObject);
            } catch (err) {
                Window.showErrorMessage('Error executing ruleset ' + rulesetName + ': ' + err.message);
            }
        }
    }

    private async doReplace(rule: ReplaceRule) {
        let e = this.textEditor;
        let d = e.document;
        let editOptions = {undoStopBefore: false, undoStopAfter: false};
        let numSelections = e.selections.length;
        for (const x of Array(numSelections).keys()) {
            let sel = e.selections[x];
            let index = (numSelections === 1 && sel.isEmpty) ? -1 : x;
            let range = rangeUpdate(e, d, index);
            for (const r of rule.steps) {
                let findText = d.getText(range).replace(new RegExp(/\r\n/, 'g'), "\n");
                await e.edit((edit) => {
                    edit.replace(range, findText.replace(r.find, r.replace));
                }, editOptions);
                range = rangeUpdate(e, d, index);
            }
        }
        return;
    }

    constructor(textEditor: TextEditor) {
        this.textEditor = textEditor;
        let config = vscode.workspace.getConfiguration("replacerules");
        this.configRules = config.get<any>("rules");
        this.configRulesets = config.get<any>("rulesets");
    }
}

const objToArray = (obj: any) => {
    return (Array.isArray(obj)) ? obj : Array(obj);
}

const rangeUpdate = (e: TextEditor, d: vscode.TextDocument, index: number) => {
    if (index === -1) {
        return new Range(d.positionAt(0), d.lineAt(d.lineCount - 1).range.end)
    } else {
        let sel = e.selections[index];
        return new Range(sel.start, sel.end);
    }
}

class Replacement {
    static defaultFlags = 'gm';
    public find: RegExp;
    public replace: string;

    public constructor(find: string, replace: string, flags: string) {
        if (flags) {
            flags = (flags.search('g') === -1) ? flags + 'g' : flags;
        }
        this.find = literal ? find : (new RegExp(find, flags || Replacement.defaultFlags));
        this.replace = replace || '';
    }
}

class ReplaceRule {
    public steps: Replacement[];

    public constructor(rule: any) {
        let ruleSteps: Replacement[] = [];
        let find = objToArray(rule.find);
        for (let i = 0; i < find.length; i++) {
            ruleSteps.push(new Replacement(find[i], objToArray(rule.replace)[i], objToArray(rule.flags)[i],objToArray(rule.literal)[i]));
        }
        this.steps = ruleSteps;
    }

    public appendRule(newRule: any) {
        let find = objToArray(newRule.find);
        for (let i = 0; i < find.length; i++) {
            this.steps.push(new Replacement(find[i], objToArray(newRule.replace)[i], objToArray(newRule.flags)[i], objToArray(rule.literal)[i]));
        }
    }
}
