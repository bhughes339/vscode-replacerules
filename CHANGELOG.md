# Change Log

## 0.2.3
- Add per-rule language filter support

## 0.2.2
- Add an extension icon

## 0.2.1
- Remove default `replacerules.rules` setting

## 0.2.0
- New format for `replacerules.rules` configuration setting
  - Any existing `replacerules.rules` will be automatically converted to the new format.
  - The old format will be backed up to `replacerules.oldrules` in case there is any data loss during the conversion. This can be safely removed from your configurations at any time.
- Add support for rulesets (`replacerules.rulesets`) which run multiple rules in sequence. See README for format
- Allow specific rules and rulesets to be bound to keyboard shortcuts
  - Rules - `{command: 'replacerules.runRule', args: ruleName: { <name of rule> }}`
  - Rulesets - `{command: 'replacerules.runRuleSet', args: ruleSet: { <name of ruleset> }}`

## 0.1.7
- Improve support for newlines in rules
- Better find/replace logic

## 0.1.6
- Add per-language support for rules

## 0.1.5
- Code rewrite
- Restrict rules to be applied line-by-line
- Fix cursor being shifted after rules were executed

## 0.1.4
- Bugfix and change config to array

## 0.1.3
- Add support for regex flags per-rule (default: gm)

## 0.1.2
- Use settings object instead of separate json file

## 0.1.1
- Package data improvements
- Added keyboard shortcut (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd>)

## 0.1.0
- Initial release
