# Replace Rules

[![Version](https://vsmarketplacebadge.apphb.com/version/bhughes339.replacerules.svg)](https://marketplace.visualstudio.com/items?itemName=bhughes339.replacerules)

Create search/replace rules. A "rule" is one or more search/replace patterns that can be applied to the entire document, or one or more selections of text.

Replace Rules uses JavaScript regular expressions for searching and replacing. [Click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for an overview of JavaScript RegEx.

Inspired by the Sublime Text plugin [RegReplace](https://github.com/facelessuser/RegReplace).

## Getting started

Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> and select the rule you'd like to run across your selection or document. Alternatively, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **Replace Rules: Run Rule...**

## Configuration options

### Rules

`replacerules.rules` is a dictionary of objects, each of which represents a single find/replace rule. A rule consists of the following components:

- Object key - (Required) The description of the rule that will appear in the command palette.
- `find` - (Required) A sequence of regular expressions to be searched on. Can be a single string or an array of strings.
- `replace` - (Optional) A sequence of regular expressions used as replacements. Can be a single string or an array of strings. If this is an empty string or unspecified, each instance of `find` will be deleted.
- `flags` - (Optional) A set of RegEx flags to apply to the rule. If only one set of flags is specified, it will be applied to all `finds` in the rule. The default flags are "gm" (global, multi-line). A list of compatible flags can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags).
- `languages` - (Optional) An array of workspace language ids that the rule is restricted to. For example, a rule with `languages` set to 'typescript' will only appear in the **Run Rule...** menu if TypeScript is the selected language for the active document.
- `literal` - (Optional) Perform a non-RegEx, literal search and replace.

### Rulesets

`replacerules.rulesets` is a dictionary of objects that run a sequence of rules defined in `replacerules.rules`. The rules are run in the order they are listed in the `rules` option:

- Object key - (Required) The description of the ruleset that will appear in the command palette.
- `rules` - (Required) An array of rules to be run when the ruleset is called.

## Example configuration

**Note:** The Replace Rules configuration object format changed in version 0.2.0. If you encounter issues with rules not loading and have not used the extension since the format change, use [this tool](https://bhughes339.github.io/vscode-replacerules/convert.html) to convert your rules object to the new format.

```json
"replacerules.rules": {
    "Remove trailing and leading whitespace": {
        "find": "^\\s*(.*)\\s*$",
        "replace": "$1"
    },
    "Remove blank lines": {
        "find": "^\\n",
        "replace": "",
        "languages": [
            "typescript"
        ]
    }
}

"replacerules.rulesets": {
    "Remove lots of stuff": {
        "rules": [
            "Remove trailing and leading whitespace",
            "Remove blank lines"
        ]
    }
}
```

## Keyboard shortcuts

Bind a specific rule or ruleset to a key combination by adding an entry to `keybindings.json`

Rule:
```json
{
    "key": "ctrl+shift+/",
    "command": "replacerules.runRule",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
        "ruleName": "Remove trailing and leading whitespace"
    }
}
```

Ruleset:
```json
{
    "key": "ctrl+shift+]",
    "command": "replacerules.runRuleset",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
        "rulesetName": "Remove lots of stuff"
    }
}
```

Clipboard Replace:
```json
{
    "key": "ctrl+shift+]",
    "command": "replacerules.pasteAndReplace",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
        "ruleName": "Remove trailing and leading whitespace"
    }
}
```

## Other features

### Replace clipboard and paste

Run a Replace Rule on the clipboard's current contents and pastes the new text into the document. Does not modify the clipboard contents.

- Command palette: **Run Replace Rule on clipboard and paste...**
- Keyboard shortcut: <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd>
  - Additionally, custom keyboard shortcuts can be added to run a specific rule on the clipboard and paste. See the "Clipboard Replace" section under "Keyboard Shortcuts" above.
