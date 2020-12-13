import { parse, DARING_FIREBALL } from "."

test("Ordered list with sequential numbers", () => {
    // Setup
    const source = `1.  Bird
2.  McHale
3.  Parish`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'ordered-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Bird`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `McHale`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Parish`,
            }]
        }]
    }])
})

test("Ordered list with same number", () => {
    // Setup
    const source = `1. Bird
1. McHale
1. Parish`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'ordered-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Bird`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `McHale`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Parish`,
            }]
        }]
    }])
})

test("Ordered list with random numbers", () => {
    // Setup
    const source = `3. Bird
1. McHale
8. Parish
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'ordered-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Bird`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `McHale`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Parish`,
            }]
        }]
    }])
})

test("Ordered list with indented paragraphs", () => {
    // Setup
    const source = `1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'ordered-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `This is a list item with two paragraphs. Lorem ipsum dolor
sit amet, consectetuer adipiscing elit. Aliquam hendrerit
mi posuere lectus.`
                }]
            }, {
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `Vestibulum enim wisi, viverra nec, fringilla in, laoreet
vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
sit amet velit.`
                }]
            }]

        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Suspendisse id sem consectetuer libero luctus adipiscing.`
            }]
        }]
    }])
})

test("Ordered list with long number", () => {
    // Setup
    const source = `1986. What a great season.`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'ordered-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `What a great season.`
            }]
        }]
    }])
})


test("Like ordered list with . escaped", () => {
    // Setup
    const source = `1986\\. What a great season.`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: `1986\\. What a great season.`
    }])
})
