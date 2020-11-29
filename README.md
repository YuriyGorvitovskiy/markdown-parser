# markdown-parser

This parser was developed to support edge case of markdown implementation, when markdown blocks intersect partialy. 

For example:
```_abc **def_ ghi**``` 

Some implementation like Slack treat it as valid and render as: _abc_ _**def**_ **ghi**

Other like GitHub treat it as partialy valid on clean rendering: _abc **def_ ghi**

## Parsing Interface

There is a single method 
```typescript
parse(input: string, rules: MarkRule[]): Mark[]
```
**Mark** is a tree base interface:
```typescript
interface Mark<M extends string> {
    name: M | 'text' | 'root'
    content?: string
    children?: Mark<M>[]
}
```
* **name** - is a type of the mark
* **content** - is textual content that has no sub-marks, like url's reference part, or plain string in _text_ mark.
* **children** - is a list of sub-marks if present

#### Example:
Markdown ```abc _def **ghi** jkl_``` will be converted to:
```javascript
{
  name: 'root',
  childrren: [{
      name: 'text',
      content: 'abc '
    }, {
    name: 'italic', 
    children: [{
      name: 'text',
      content: 'def '
    }, {
      name: 'bold',
      children: [{
        name: 'text',
        content: 'ghi'
      }]
    }, {
      name: 'text',
      content: ' jkl'
    }]
  }]
}
```

**MarkRule** is a parsing rule that will be applied by parse in specified order:
```typescript
type PatternHandler<M extends string> = (match: string[]) => { mark: Mark<M>, text: string };

interface MarkRule<M extends string> {
    readonly pattern: RegExp
    readonly process: PatternHandler<M>
}
```
* **pattern** - is a Regular expresssion that will extract marked section from the text
* **process** - is a function that handle the match, 

Function **process** should return the named tuple:
  * **mark** - new Mark instance with empty **children** array, in case any **text** returned. If **mark** is _null_, no mark will be added to the tree, and parser will continue processing the text as normal.
  * **text** - a child text to be processed further by next parser iteration. If **text** is empty or null, no child will be added to the **mark**. 

#### Example:
Rule to extract link from Slack markdown:
```typescrypt
export const LINK: MarkRule<SlackMark> = {
    // all markdown inside href part should be ignored 
    pattern: /<([^\u001D\u001E]+?)(?:\|(.+?))?>/,
    process: (m) => ({ mark: { name: 'link', content: m[1], children: [] }, text: m[2] }),
}
```

Parser is using special characters to be injected in the text before pattern is applied:
* \u001D character "Group Separator", marks the begining of mark found in previous Rule pass
* \u001E character "Record Separator", marks the end of mark found in previous Rule pass


## Parsing Implementation

Couple cases to consider when 2 rules are applied in different order.

* Rule1 - rule processed first, rule boundaies `{x}` should be converted to tags `<a>x</a>`
* Rule2 - rule processed second `[x]` should be converted to tags `<b>x</b>`

### Case 1

When Rule2 applied it:
1. Adds opening Mark for Rule2

When external Mark inside Rule2 closed:
1. Close Rule2 Mark
1. Close external Mark
1. Open Rule2 Mark

* `[x{y}z]` => `[x<a>y</a>z]` => `<b>x<a>y</a>z</b>`
* `{x[y]z}` => `<a>x[y]z</a>` => `<a>x<b>y</b>z</a>`
* `{x[y}z]` => `<a>x[y</a>z]` => `<a>x<b>y</b></a><b>z</b>`
* `[x{y]z}` => `[x<a>y]z</a>` => `<b>x<a>y</a></b><a>z</a>`

### Case 2

1. If Mark was split, then all non-first parts of the split, will be marked secondary. 
1. All secondary marks without any children can be safely removed

* `{[x}]` => `<a>[z</a>]` => `<a><b>x</b></a>`
* `[{x]}` => `[<a>x]</a>` => `<b><a>x</a></b>`

### Code improvements

#### Allow multiple matching groups per Rule

Parser implementation uses ```regexp.exec(...)``` function and adds *global* flag to pattern. 

Provide simple function implementation to handle single matching group.


## Slack

https://api.slack.com/reference/surfaces/formatting

[Implementation Details](Slack.md)

## Daring Fireball

https://daringfireball.net/projects/markdown/syntax#autolink

## GitHub 

https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown
