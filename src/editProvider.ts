import * as vscode from 'vscode';

import { TextEditor, Range } from 'vscode';
import Window = vscode.window;

export default class ReplaceRulesEditProvider {
    private textEditor: TextEditor;
    private configRules: any;
    private configRuleSets: any;

    public async chooseRule() {
        let configRules = this.configRules;
        let items = [];
        for (const r in configRules) {
            let rule = configRules[r];
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

    public async chooseRuleSet() {
        let configRuleSets = this.configRuleSets
        let items = [];
        for (const r in configRuleSets) {
            let ruleSet = configRuleSets[r];
            if (Array.isArray(ruleSet.rules)) {
                try {
                    items.push({
                        label: "Ruleset: " + r,
                        description: "",
                        ruleSetName: r
                    });
                } catch (err) {
                    Window.showErrorMessage('Error parsing ruleset ' + r + ': ' + err.message);
                }
            }
        }
        vscode.window.showQuickPick(items).then(qpItem => {
            if (qpItem) this.runRuleSet(qpItem.ruleSetName);
        });
        return;
    }

    public async runSingleRule(ruleName: string) {
        let rule = this.configRules[ruleName];
        if (rule) {
            try {
                this.doReplace(new ReplaceRule(rule));
            } catch (err) {
                Window.showErrorMessage('Error executing rule ' + ruleName + ': ' + err.message);
            }
        }
    }

    public async runRuleSet(ruleSetName: string) {
        let ruleSet = this.configRuleSets[ruleSetName];
        if (ruleSet) {
            let ruleObject: ReplaceRule | undefined;
            try {
                ruleSet.rules.forEach((r: string) => {
                    if (ruleObject === undefined) {
                        ruleObject = new ReplaceRule(this.configRules[r]);
                    } else {
                        ruleObject.appendRule(this.configRules[r])
                    }
                });
                if (ruleObject) this.doReplace(ruleObject);
            } catch (err) {
                Window.showErrorMessage('Error executing ruleset ' + ruleSetName + ': ' + err.message);
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
        let config = vscode.workspace.getConfiguration("replacerules");
        this.configRules = config.get<any>("rules");
        this.configRuleSets = config.get<any>("rulesets");
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
        if (flags) {
            flags = (flags.search('g') === -1) ? flags + 'g' : flags;
        }
        this.find = new RegExp(find, flags || Replacement.defaultFlags);
        this.replace = replace || '';
    }
}

class ReplaceRule {
    public steps: Replacement[];

    public constructor(rule: any) {
        let ruleSteps: Replacement[] = [];
        let find = objToArray(rule.find);
        for (let i = 0; i < find.length; i++) {
            ruleSteps.push(new Replacement(find[i], objToArray(rule.replace)[i], objToArray(rule.flags)[i]));
        }
        this.steps = ruleSteps;
    }

    public appendRule(newRule: any) {
        let find = objToArray(newRule.find);
        for (let i = 0; i < find.length; i++) {
            this.steps.push(new Replacement(find[i], objToArray(newRule.replace)[i], objToArray(newRule.flags)[i]));
        }
    }
}
