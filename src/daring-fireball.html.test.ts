import { parse, DARING_FIREBALL_RULES } from "."

test("HTML Block", () => {
    // Setup
    const source = `This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'This is a regular paragraph.'
        }]
    }, {
        name: 'html-block',
        content: '<table>\n    <tr>\n        <td>Foo</td>\n    </tr>\n</table>',
        children: []
    }, {
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'This is another regular paragraph.'
        }]
    }])
})

test("HTML tags with content and text", () => {
    // Setup
    const source = '<a href="github.com" title="Link Title">GitHub</a>'

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'html-tag',
        tag: 'a',
        content: 'href="github.com" title="Link Title"',
        children: [{
            name: 'text',
            content: 'GitHub'
        }]
    }])
})

test("HTML singleton tags", () => {
    // Setup
    const source = '<b>Bold<br>Text</b>'

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'html-tag',
        tag: 'b',
        content: undefined,
        children: [{
            name: 'text',
            content: 'Bold'
        }, {
            name: 'html-tag',
            tag: 'br',
            content: undefined,
            children: [],
        }, {
            name: 'text',
            content: 'Text'
        }]
    }])
})

test("HTML nesteed tags.", () => {
    // Setup
    const source = '<table><tl><td>1</td><td>2</td></tl></table>'

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'html-tag',
        tag: 'table',
        content: undefined,
        children: [{
            name: 'html-tag',
            tag: 'tl',
            children: [{
                name: 'html-tag',
                tag: 'td',
                children: [{
                    name: 'text',
                    content: '1',
                }]
            }, {
                name: 'html-tag',
                tag: 'td',
                children: [{
                    name: 'text',
                    content: '2',
                }]
            }]
        }]
    }])
})

test("HTML escaped symbols and entities.", () => {
    // Execute
    const result1 = parse("Winking: &#128521;", DARING_FIREBALL_RULES)
    const result2 = parse("Smirking: &#x1F60F;", DARING_FIREBALL_RULES)
    const result3 = parse("Grinning: &#X1F600;", DARING_FIREBALL_RULES)
    const result4 = parse("Empty: &emptyset;", DARING_FIREBALL_RULES)
    const result5 = parse("http://images.google.com/images?num=30&amp;q=larry+bird", DARING_FIREBALL_RULES)
    const result6 = parse("&copy;", DARING_FIREBALL_RULES)
    const result7 = parse("AT&T", DARING_FIREBALL_RULES)
    const result8 = parse("4 < 5", DARING_FIREBALL_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'text',
        content: 'Winking: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(128521),
    }])

    expect(result2.children).toMatchObject([{
        name: 'text',
        content: 'Smirking: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(0x1F60F),
    }])

    expect(result3.children).toMatchObject([{
        name: 'text',
        content: 'Grinning: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(0x1F600),
    }])

    expect(result4.children).toMatchObject([{
        name: 'text',
        content: 'Empty: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(8709),
    }])

    expect(result5.children).toMatchObject([{
        name: 'text',
        content: 'http://images.google.com/images?num=30'
    }, {
        name: 'escaped',
        content: "&",
    }, {
        name: 'text',
        content: 'q=larry+bird'
    }])

    expect(result6.children).toMatchObject([{
        name: 'escaped',
        content: "©",
    }])

    expect(result7.children).toMatchObject([{
        name: 'text',
        content: "AT&T",
    }])

    expect(result8.children).toMatchObject([{
        name: 'text',
        content: "4 < 5",
    }])
})
