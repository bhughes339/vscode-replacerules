import * as vscode from 'vscode';

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    onDidChangeTreeData?: vscode.Event<TreeItem|null|undefined>|undefined;
  
    data: TreeItem[] = [];

    key: string;
  
    constructor(key: string) {
        this.key = key;
        const config : any = vscode.workspace.getConfiguration().get('replacerules');
        if(!config || !config[key]) return
        for (const k in config[key]) {
            this.data.push(new TreeItem(k));
        }
    }
  
    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
      return element;
    }
  
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }
}

export class RuleTreeDataProvider extends TreeDataProvider {
    constructor() {
        super('rules')
    }
}

export class RuleSetTreeDataProvider extends TreeDataProvider {
    constructor() {
        super('rulesets')
    }
}

class TreeItem extends vscode.TreeItem {
    children: TreeItem[]|undefined;

    constructor(label: string, children?: TreeItem[]) {
        super(
            label,
            children === undefined
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}