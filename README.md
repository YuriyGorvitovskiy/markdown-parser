# markdown-parser

## Parsing Suggestions

Couple cases to consider when 2 rules are applied in different order.

* Rule1 - rule processed first, rule boundaies `{x}` should be converted to tags `<a>x</a>`
* Rule2 - rule processed second `[x]` should be converted to tags `<b>x</b>`

## Case 1

### 1.2.2 Implementation:
When Rule2 applied it:
1. Close all external Marks 
1. Open Mark for Rule2
1. Open Marks for external Marks

When any Mark inside Rule2 closed:
1. Close Mark

* `[x{y}z]` => `[x<a>y</a>z]` => `<b>x<a>y</a>z</b>`
* `{x[y]z}` => `<a>x[y]z</a>` => `<a>x</a><b><a>y</a></b><a>z</a>`
* `{x[y}z]` => `<a>x[y</a>z]` => `<a>x</a><b><a>y</a>z</b>`
* `[x{y]z}` => `[x<a>y]z</a>` => `<b>x<a>y</a></b><a>z</a>`

### Proposed implementation:
When Rule2 applied it:
1. Add opening Mark for Rule2

When external Mark inside Rule2 closed:
1. Close Rule2 Mark
1. Close external Mark
1. Open Rule2 Mark

* `[x{y}z]` => `[x<a>y</a>z]` => `<b>x<a>y</a>z</b>`
* `{x[y]z}` => `<a>x[y]z</a>` => `<a>x<b>y</b>z</a>`
* `{x[y}z]` => `<a>x[y</a>z]` => `<a>x<b>y</b></a><b>z</b>`
* `[x{y]z}` => `[x<a>y]z</a>` => `<b>x<a>y</a></b><a>z</a>`

## Case 2

### 1.2.2 Implementation:
* `{[x}]` => `<a>[x</a>]` => `<a></a><b><a>x</a></b>`
* `[{x]}` => `[<a>x]</a>` => `<b><a>x</a></b><a></a>`

### Proposed implementation:
1. If Mark was split, then all non-first parts of the split, will be marked secondary. 
1. All secondary marks without and children can be safely removed

* `{[x}]` => `<a>[z</a>]` => `<a><b>x</b></a>`
* `[{x]}` => `[<a>x]</a>` => `<b><a>x</a></b>`

## Code improvements
### Allow multiple matching groups per Rule
That will required to switch implementation from string.split(...) to regexp.exec(...) 

### Allow rules to process matching
Each rule should define function `process: (matches: string[]) => {mark: Mark, text: string}`:
* mark - a new Mark to be added
* text - internal text inside mark
* null - didn't match, treat `match[0]` as text, without new mark to be added 

Provide simple function implementation to handle single matching group.

