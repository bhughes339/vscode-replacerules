# Replace Rules

[![Version](https://vsmarketplacebadge.apphb.com/version/bhughes339.replacerules.svg)](https://marketplace.visualstudio.com/items?itemName=bhughes339.replacerules)

Create search/replace rules. A "rule" is one or more search/replace patterns that can be applied to a selection of text (or the entire document).

Replace Rules uses Javascript regular expressions for searching and replacing. Some features, such as lookbehind (e.g. `(?<=)`), are not supported in Javascript regex. [Click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for a quick primer on Javascript regex.

## Getting started

Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd> and select the rule you'd like to run across your selection or document. Alternatively, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **Run Replace Rule...**

## Rule definitions

`replacerules.rules` is an array of objects, each of which represents a single search/replace rule. A rule consists of the following components:

- `name` - The description of the rule that will appear in the command pallette
- `find` - A sequence of regular expressions to be searched on. Can be a single string or an array of strings.
- `replace` - (optional) A sequence of regular expressions used as replacements. Can be a single string or an array of strings. If this is an empty string or unspecified, each `find` will be deleted rather than replaced.
- `flags` - (optional) A set of regex flags to apply to the rule. If only one set of flags is specified, it will be applied to all `finds` in the rule. The default flags are gm (global, multiline).

**NOTE:** In the case of arrays, each `find` must have a corresponding `replace`. You can also use a single `replace`, which will be used for each instance of `find`.

## Example ruleset

```json
"replacerules.rules": [
    {
        "name": "Remove trailing and leading whitespace",
        "find": [
            "^[ \\t]+",
            "[ \\t]+$"
        ],
        "replace": ""
    }
]
```