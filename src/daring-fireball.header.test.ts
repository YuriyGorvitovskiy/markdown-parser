import { parse, DARING_FIREBALL_RULES } from "."

test("Header with inderline markers", () => {
    // Setup
    const source = `This is an H1
=============

Paragraph

This is an H2
-------------
`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'header',
        content: '1',
        children: [{
            name: 'text',
            content: 'This is an H1'
        }]
    }, {
        name: 'paragraph',
        children: [{
            name: 'text',
            content: 'Paragraph'
        }]
    }, {
        name: 'header',
        content: '2',
        children: [{
            name: 'text',
            content: 'This is an H2'
        }]
    }])
})

test("Header with leading # markers", () => {
    // Setup
    const source = `# This is an H1

## This is an H2

###### This is an H6

`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'header',
        content: '1',
        children: [{
            name: 'text',
            content: 'This is an H1'
        }]
    }, {
        name: 'header',
        content: '2',
        children: [{
            name: 'text',
            content: 'This is an H2'
        }]
    }, {
        name: 'header',
        content: '6',
        children: [{
            name: 'text',
            content: 'This is an H6'
        }]
    }])
})

test("Header with leading and trailing # markers", () => {
    // Setup
    const source = `# This is an H1 #

## This is an H2 ##

### This is an H3 ######

`
    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'header',
        content: '1',
        children: [{
            name: 'text',
            content: 'This is an H1'
        }]
    }, {
        name: 'header',
        content: '2',
        children: [{
            name: 'text',
            content: 'This is an H2'
        }]
    }, {
        name: 'header',
        content: '3',
        children: [{
            name: 'text',
            content: 'This is an H3'
        }]
    }])
})


