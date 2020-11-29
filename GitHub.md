# Slack

https://api.slack.com/reference/surfaces/formatting

## 1. Code Block 
Code Block surrounded with \`\`\` symbols. All content inside should be preserved as is

#### Pattern
``` /(?<=^|\W)```\n?([^\u001D\u001E]+?)```(?=\W|$)/m ```

#### Example
```` ```\ndef hoge\n  1 + 1\nend\n``` ````

```javascript
{
  name: 'root',
  children: [{
        name: 'code-block',
        content: "def hoge\n  1 + 1\nend\n",
  }]
}
```

## 2. Code Inline 
Code string surrounded with \` symbols. All content inside should be preserved as is

#### Pattern
``` /(?<=^|\W)`([^\u001D\u001E\n]+?)`(?=\W|$)/ ```

#### Example

``` `hoge` fuga `piyo` ```

```javascript
{
  name: 'root',
  children: [{
        name: 'code-inline',
        content: "hoge",
    }, {
        name: 'text',
        content: " fuga ",
    }, {
        name: 'code-inline',
        content: "piyo",
    }]
}
```

## 3. Quote 
String started with \> symbol

#### Pattern
``` /(?<=(?:^|\n))((?:\>[^\n]+?(?:\n|$))+)/m ```

#### Example
``` > 123\n>456\n789\n> ABC ```

```javascript
{
  name: 'root',
  children: [{
        name: 'quote',
        children: [{
            name: 'text',
            content: "123",
        }, {
            name: 'line-break'
        }, {
            name: 'text',
            content: "456",
        }, {
            name: 'line-break'
        }]
    }, {
        name: 'text',
        content: "789",
    }, {
        name: 'line-break',
    }, {
        name: 'quote',
        children: [{
            name: 'text',
            content: "ABC",
        }]
    }]
}
```

## 4. Link 
String surrounded with \< \> symbols  with optional \| separator for presentation part

#### Pattern
``` /<([^\u001D\u001E]+?)(?:\|(.+?))?>/ ```

#### Example
``` 123 <!456> 789 ```

```javascript
{
  name: 'root',
  children: [{
    name: 'text',
    content: "123 ",
  }, {
    name: 'link',
    content: "!456",
  }, {
    name: 'text',
    content: " 789",
  }]
}
```

## 5. Emoji 
String surrounded with \: symbols

#### Pattern
``` /:([a-z0-9-+_]+):/ ```

#### Example
``` 123:smile-456:789 ```

```javascript
{
  name: 'root',
  children: [{
        name: 'text',
        content: "123",
    }, {
        name: 'emoji',
        content: "smile-456",
    }, {
        name: 'text',
        content: "789",
    }]
}
```

## 6. Bold 
String surrounded with \* symbols

#### Pattern
``` /(?<=^|\W)\*(.+?)\*(?=\W|$)/ ```

#### Example
``` hoge *fuga* poyo ```

```javascript
{
  name: 'root',
  children: [{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'bold',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }]
}
```

## 7. Italic 
String surrounded with \_ symbols

#### Pattern
``` /(?<=^|\W)_(.+?)_(?=\W|$)/ ```

#### Example
``` hoge _fuga_ poyo ```

```javascript
{
  name: 'root',
  children: [{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'italic',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }]
}
```

## 8. Strike 
String surrounded with \~ symbols

#### Pattern
``` /(?<=^|\W)\~(.+?)\~(?=\W|$)/ ```

#### Example
``` hoge ~fuga~ poyo ```

```javascript
{
  name: 'root',
  children: [{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'strike',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }]
}
```

## 9. Line Break 
Symbol \n separate lines

#### Pattern
``` /\n/m ```

#### Example
``` 123\n456\n789 ```

```javascript
{
  name: 'root',
  children: [{
        name: 'text',
        content: "123",
    }, {
        name: 'line-break'
    }, {
        name: 'text',
        content: "456",
    }, {
        name: 'line-break'
    }, {
        name: 'text',
        content: "789",
    }]
}
```
