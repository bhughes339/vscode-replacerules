# Replace Rules

[![Version](https://vsmarketplacebadge.apphb.com/version/bhughes339.replacerules.svg)](https://marketplace.visualstudio.com/items?itemName=bhughes339.replacerules)

Create search/replace rules. A "rule" is one or more search/replace patterns that can be applied to a selection of text (or the entire document).

Replace Rules uses Javascript regular expressions for searching and replacing. Some features, such as lookbehind (e.g. `(?<=)`), are not supported in Javascript regex. [Click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for a quick primer on Javascript regex.

## Getting started

Replace Rules uses the configuration file `replacerules.json` to store rules. This file is located in your VSCode "User" folder.

- The **Replace Rules: Edit Rules** command will initialize this file if it does not already exist

Once you have one or more rules defined in `replacerules.json`, open the Command Palette (`Ctrl+Shift+P`) and select **Run Replace Rule...**

## Rule definitions

`replacerules.json` is an array of objects, each of which represents a single search/replace rule. A rule consists of the following components:

- `name` - The description of the rule that will appear in the command pallette
- `find` - A sequence of regular expressions to be searched on. Can be a single string or an array of strings.
- `replace` - An optional sequence of regular expressions used as replacements. Can be a single string or an array of strings. If this is an empty string or null, each `find` will be deleted rather than replaced.

**NOTE:** In the case of arrays, each `find` must have a corresponding `replace`. You can also use a single `replace`, which will be used for each instance of `find`.

## Example ruleset

```json
[
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