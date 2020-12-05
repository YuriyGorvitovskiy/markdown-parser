import { parse, DARING_FIREBALL_RULES } from "."

test("Paragraph", () => {
    // Setup
    const source = `This is
paragraph

`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'This is\nparagraph'
        }]
    }])
})

test("Line-break", () => {
    // Setup
    const source = `This is line  
break`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'This is line'
    }, {
        name: 'line-break',
    }, {
        name: 'text',
        content: 'break'
    }])

})

test("2 Paragraphs with line-break", () => {
    // Setup
    const source = `This is   
paragraph
    \t

And another paragraph
\t
`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
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

