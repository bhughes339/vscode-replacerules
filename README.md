# Replace Rules

[![Version](https://vsmarketplacebadge.apphb.com/version/bhughes339.replacerules.svg)](https://marketplace.visualstudio.com/items?itemName=bhughes339.replacerules)

Create search/replace rules. A "rule" is one or more search/replace patterns that can be applied to a selection of text (or the entire document).

Replace Rules uses Javascript regular expressions for searching and replacing. Some features, such as lookbehind (e.g. `(?<=)`), are not supported in Javascript regex. [Click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for a quick primer on Javascript regex.

Inspired by the Sublime Text plugin [RegReplace](https://github.com/facelessuser/RegReplace).

## Getting started

Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> and select the rule you'd like to run across your selection or document. Alternatively, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **Replace Rules: Run Rule...**

## Rule definitions

`replacerules.rules` is an array of objects, each of which represents a single search/replace rule. A rule consists of the following components:

- `name` - (Required) The description of the rule that will appear in the command palette.
- `find` - (Required) A sequence of regular expressions to be searched on. Can be a single string or an array of strings.
- `replace` - (Optional) A sequence of regular expressions used as replacements. Can be a single string or an array of strings. If this is an empty string or unspecified, each `find` will be deleted rather than replaced.
- `flags` - (Optional) A set of regex flags to apply to the rule. If only one set of flags is specified, it will be applied to all `finds` in the rule. The default flags are gm (global, multiline).
- `languages` - (Optional) A set of workspace language ids that the rule is restricted to. For example, a rule with `languages` set to 'typescript' will only appear in the **Run Rule...** menu if TypeScript is the active language on the active document.

## Example ruleset

```json
"replacerules.rules": [
    {
        "name": "Remove trailing and leading whitespace",
        "find": "^\\s*(.*)\\s*$",
        "replace": "$1"
    }
]
```
