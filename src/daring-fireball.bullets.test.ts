import { parse, DARING_FIREBALL } from "."

test("Bullets with stars", () => {
    // Setup
    const source = `*   Red
*   Green
*   Blue`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Red`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Green`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Blue`,
            }]
        }]
    }])
})

test("Bullets with plus", () => {
    // Setup
    const source = `+   Red
+   Green
+   Blue`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Red`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Green`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Blue`,
            }]
        }]
    }])
})

test("Bullets with dash", () => {
    // Setup
    const source = `-   Red
-   Green
-   Blue
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Red`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Green`,
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Blue`,
            }]
        }]
    }])
})

test("Bullets with indented text", () => {
    // Setup
    const source = `*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing.`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
viverra nec, fringilla in, laoreet vitae, risus.`
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
Suspendisse id sem consectetuer libero luctus adipiscing.`
            }]
        }]
    }])
})

test("Bullets with un-indented text", () => {
    // Setup
    const source = `* Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
viverra nec, fringilla in, laoreet vitae, risus.
* Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
Suspendisse id sem consectetuer libero luctus adipiscing.
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
viverra nec, fringilla in, laoreet vitae, risus.`
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
Suspendisse id sem consectetuer libero luctus adipiscing.`
            }]
        }]
    }])
})


test("Bullets with multiple paragraphs", () => {
    // Setup
    const source = `* This is a list item with two paragraphs.

    This is the second paragraph in the list item. You're
only required to indent the first line. Lorem ipsum dolor
sit amet, consectetuer adipiscing elit.

* Another item in the same list.
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `This is a list item with two paragraphs.`
                }]
            }, {
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `This is the second paragraph in the list item. You're
only required to indent the first line. Lorem ipsum dolor
sit amet, consectetuer adipiscing elit.`
                }]
            }]
        }, {
            name: 'list-item',
            children: [{
                name: 'text',
                content: `Another item in the same list.`
            }]
        }]
    }])
})

test("Bullets with quote", () => {
    // Setup
    const source = `*   A list item with a blockquote:

    > This is a blockquote
    > inside a list item.
`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `A list item with a blockquote:`
                }]
            }, {
                name: 'quote',
                children: [{
                    name: 'text',
                    content: `This is a blockquote
inside a list item.`
                }]
            }]
        }]
    }])
})

test("Bullets with code", () => {
    // Setup
    const source = `*   A list item with a code block:

        <code goes here>`

    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'bullet-list',
        children: [{
            name: 'list-item',
            children: [{
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `A list item with a code block:`
                }]
            }, {
                name: 'code',
                content: `<code goes here>`
            }]
        }]
    }])
})
