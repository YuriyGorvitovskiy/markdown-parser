import { parse, DARING_FIREBALL } from "."

test("Block Quote with all lines marked", () => {
    // Setup
    const source = `> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
>
`
    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.`
            }]
        }, {
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.`
            }]
        }]
    }])
})

test("Block Quote with marks at paragraph start", () => {
    // Setup
    const source = `> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.

`
    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.`
            }]
        }, {
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.`
            }]
        }]
    }])
})

test("Block Quote with inner quote", () => {
    // Setup
    const source = `> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

`
    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `This is the first level of quoting.`
            }]
        }, {
            name: 'quote',
            children: [{
                name: 'paragraph',
                children: [{
                    name: 'text',
                    content: `This is nested blockquote.`
                }]
            }]
        }, {
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `Back to the first level.`
            }]
        }]
    }])

})

test("Block Quote of Header List and Code", () => {
    // Setup
    const source = `> ## This is a header.
> 
> 1.   This is the first list item.
> 2.   This is the second list item.
> 
> Here's some example code:
> 
>     return shell_exec("echo $input | $markdown_script");
`
    // Execute
    const result = parse(source, DARING_FIREBALL)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'header',
            content: '2',
            children: [{
                name: 'text',
                content: `This is a header.`
            }]
        }, {
            name: 'ordered-list',
            children: [{
                name: 'list-item',
                children: [{
                    name: 'text',
                    content: `This is the first list item.`
                }]
            }, {
                name: 'list-item',
                children: [{
                    name: 'paragraph',
                    children: [{
                        name: 'text',
                        content: `This is the second list item.`
                    }]
                }]
            }]
        }, {
            name: 'paragraph',
            children: [{
                name: 'text',
                content: `Here's some example code:`
            }]
        }, {
            name: 'code',
            content: `return shell_exec("echo $input | $markdown_script");
`
        }]
    }])
})
