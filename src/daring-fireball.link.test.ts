import { parse, DARING_FIREBALL_RULES } from "."

test("Link with title and without title.", () => {
    // Setup
    const source = `This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

`

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'paragraph',
        children: [{
            name: 'text',
            content: "This is ",
        }, {
            name: 'link',
            content: "http://example.com/",
            title: "Title",
            children: [{
                name: 'text',
                content: "an example"
            }]
        }, {
            name: 'text',
            content: " inline link.",
        }]
    }, {
        name: 'paragraph',
        children: [{
            name: 'link',
            content: "http://example.net/",
            title: undefined,
            children: [{
                name: 'text',
                content: "This link"
            }]
        }, {
            name: 'text',
            content: " has no title attribute.",
        }]
    }])
})

test("Link with relative path.", () => {
    // Setup
    const source = `See my [About](/about/) page for details.`

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "See my ",
    }, {
        name: 'link',
        content: "/about/",
        title: undefined,
        children: [{
            name: 'text',
            content: "About"
        }]
    }, {
        name: 'text',
        content: " page for details.",
    }])
})

test("Link with relative path.", () => {
    // Setup
    const source = `I get 10 times more traffic from [Google](http://google.com/ "Google")
than from [Yahoo](http://search.yahoo.com/ "Yahoo Search") or
[MSN](http://search.msn.com/ "MSN Search").`

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "I get 10 times more traffic from ",
    }, {
        name: 'link',
        content: "http://google.com/",
        title: "Google",
        children: [{
            name: 'text',
            content: "Google"
        }]
    }, {
        name: 'text',
        content: `
than from `,
    }, {
        name: 'link',
        content: "http://search.yahoo.com/",
        title: "Yahoo Search",
        children: [{
            name: 'text',
            content: "Yahoo"
        }]
    }, {
        name: 'text',
        content: ` or
`,
    }, {
        name: 'link',
        content: "http://search.msn.com/",
        title: "MSN Search",
        children: [{
            name: 'text',
            content: "MSN"
        }]
    }, {
        name: 'text',
        content: ".",
    }])
})
