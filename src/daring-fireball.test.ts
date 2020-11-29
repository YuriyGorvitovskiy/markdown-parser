import { parse, DARING_FIREBALL_RULES } from "."

test("Slack html-block parser.", () => {
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