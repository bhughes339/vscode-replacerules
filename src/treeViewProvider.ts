import * as vscode from 'vscode';

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> 
        = new vscode.EventEmitter<TreeItem | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    data: TreeItem[] = [];

    constructor(private key: string) { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
  
    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
      return element;
    }
  
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        this.data = []
        const config : any = vscode.workspace.getConfiguration().get('replacerules');
        if(!config || !config[this.key]) return
        for (const k in config[this.key]) {
            this.data.push(new TreeItem(k));
        }
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