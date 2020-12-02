import { parse, DARING_FIREBALL_RULES } from "."

test("Daring Fireball html-block parser.", () => {
    // Execute
    const result1 = parse('<a href="github.com" title="Link Title">GitHub</a>', DARING_FIREBALL_RULES)
    const result2 = parse("<b>Bold<br>Text</b>", DARING_FIREBALL_RULES)
    const result3 = parse("<table><tl><td>1</td><td>2</td></tl></table>", DARING_FIREBALL_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'html-tag',
        tag: 'a',
        content: 'href="github.com" title="Link Title"',
        children: [{
            name: 'text',
            content: 'GitHub'
        }]
    }])

    expect(result2.children).toMatchObject([{
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

    expect(result3.children).toMatchObject([{
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

test("Daring Fireball paragraph and line-break parser.", () => {
    // Execute
    const result1 = parse("This is\nparagraph\n\n", DARING_FIREBALL_RULES)
    const result2 = parse("This is line  \nbreak", DARING_FIREBALL_RULES)
    const result3 = parse("This is   \nparagraph\n \t\n\nAnd another paragraph\n\t\n", DARING_FIREBALL_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'This is\nparagraph'
        }]
    }])

    expect(result2.children).toMatchObject([{
        name: 'text',
        content: 'This is line'
    }, {
        name: 'line-break',
    }, {
        name: 'text',
        content: 'break'
    }])

    expect(result3.children).toMatchObject([{
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'This is'
        }, {
            name: 'line-break',
        }, {
            name: 'text',
            content: 'paragraph'
        }]
    }, {
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'And another paragraph'
        }]
    }])
})

test("Daring Fireball html escaped symbols and entities.", () => {
    // Execute
    const result1 = parse("Winking: &#128521;", DARING_FIREBALL_RULES)
    const result2 = parse("Smirking: &#x1F60F;", DARING_FIREBALL_RULES)
    const result3 = parse("Grinning: &#X1F600;", DARING_FIREBALL_RULES)
    const result4 = parse("Empty: &emptyset;", DARING_FIREBALL_RULES)

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

})