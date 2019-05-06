# Replace Rules

[![Version](https://vsmarketplacebadge.apphb.com/version/bhughes339.replacerules.svg)](https://marketplace.visualstudio.com/items?itemName=bhughes339.replacerules)

Create search/replace rules. A "rule" is one or more search/replace patterns that can be applied to a selection of text (or the entire document).

Replace Rules uses Javascript regular expressions for searching and replacing. Some features, such as lookbehind (e.g. `(?<=)`), are not supported in Javascript regex. [Click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for a quick primer on Javascript regex.

Inspired by the Sublime Text plugin [RegReplace](https://github.com/facelessuser/RegReplace).

## Getting started

Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> and select the rule you'd like to run across your selection or document. Alternatively, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **Replace Rules: Run Rule...**

## Configuration options

### Rules

`replacerules.rules` is a dictionary of objects, each of which represents a single search/replace rule. A rule consists of the following components:

- Object key - (Required) The description of the rule that will appear in the command palette.
- `find` - (Required) A sequence of regular expressions to be searched on. Can be a single string or an array of strings.
- `replace` - (Optional) A sequence of regular expressions used as replacements. Can be a single string or an array of strings. If this is an empty string or unspecified, each `find` will be deleted rather than replaced.
- `flags` - (Optional) A set of regex flags to apply to the rule. If only one set of flags is specified, it will be applied to all `finds` in the rule. The default flags are gm (global, multiline).
- `languages` - (Optional) An array of workspace language ids that the rule is restricted to. For example, a rule with `languages` set to 'typescript' will only appear in the **Run Rule...** menu if TypeScript is the active language on the active document.

### Rulesets

`replacerules.rulesets` is a dictionary of objects that run a sequence of rules defined in `replacerules.rules`. The rules are run in the order they are listed in the `rules` option:

- Object key - (Required) The description of the ruleset that will appear in the command palette.
- `rules` - (Required) An array of rules to be run when the ruleset is called.

## Example configuration

**Note:** The configuration format has changed in version 0.2.0. Your old configs will be automatically converted to the new format. Please see release notes for more details.

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
    "command": "replacerules.runRuleSet",
    "when": "editorTextFocus && !editorReadonly",
    "args": {
        "ruleSet": "Remove lots of stuff"
    }
}
```
