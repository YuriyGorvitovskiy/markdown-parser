import { parse, DARING_FIREBALL } from ".";

test("Link with title and without title.", () => {
    // Setup
    const source = `This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: "Title",
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: " inline link.",
                },
            ],
        },
        {
            name: "paragraph",
            children: [
                {
                    name: "link",
                    content: "http://example.net/",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "This link",
                        },
                    ],
                },
                {
                    name: "text",
                    content: " has no title attribute.",
                },
            ],
        },
    ]);
});

test("Link with relative path.", () => {
    // Setup
    const source = `See my [About](/about/) page for details.`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "See my ",
        },
        {
            name: "link",
            content: "/about/",
            title: undefined,
            children: [
                {
                    name: "text",
                    content: "About",
                },
            ],
        },
        {
            name: "text",
            content: " page for details.",
        },
    ]);
});

test("Link with relative path.", () => {
    // Setup
    const source = `I get 10 times more traffic from [Google](http://google.com/ "Google")
than from [Yahoo](http://search.yahoo.com/ "Yahoo Search") or
[MSN](http://search.msn.com/ "MSN Search").`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "I get 10 times more traffic from ",
        },
        {
            name: "link",
            content: "http://google.com/",
            title: "Google",
            children: [
                {
                    name: "text",
                    content: "Google",
                },
            ],
        },
        {
            name: "text",
            content: `
than from `,
        },
        {
            name: "link",
            content: "http://search.yahoo.com/",
            title: "Yahoo Search",
            children: [
                {
                    name: "text",
                    content: "Yahoo",
                },
            ],
        },
        {
            name: "text",
            content: ` or
`,
        },
        {
            name: "link",
            content: "http://search.msn.com/",
            title: "MSN Search",
            children: [
                {
                    name: "text",
                    content: "MSN",
                },
            ],
        },
        {
            name: "text",
            content: ".",
        },
    ]);
});

test("Referenced Link with title.", () => {
    // Setup
    const source = `This is [an example][id] reference-style link.
[id]: http://example.com/  "Optional Title Here"`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: "Optional Title Here",
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link without title.", () => {
    // Setup
    const source = `This is [an example] [id] reference-style link.
[id]: http://example.com/`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with title in single quote.", () => {
    // Setup
    const source = `This is [an example][id] reference-style link.
[id]: http://example.com/  'Optional "Title" Here'`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: `Optional "Title" Here`,
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with title in parentheses.", () => {
    // Setup
    const source = `This is [an example][id] reference-style link.
[id]: http://example.com/ (Optional Title Here)`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: "Optional Title Here",
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with url in angle brackets.", () => {
    // Setup
    const source = `This is [an example][id] reference-style link.
[id]: <http://example.com/>  "Optional Title Here"`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: "Optional Title Here",
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with title on next line.", () => {
    // Setup
    const source = `This is [an example][id] reference-style link.
[id]: http://example.com/longish/path/to/resource/here
    "Optional Title Here"`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/longish/path/to/resource/here",
                    title: "Optional Title Here",
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with case insensitive id.", () => {
    // Setup
    const source = `This is [an example][id.CaSe] reference-style link.
[ID.case]: http://example.com/`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is ",
                },
                {
                    name: "link",
                    content: "http://example.com/",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "an example",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` reference-style link.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with implicit id.", () => {
    // Setup
    const source = `[Google][]
[Google]: http://google.com/`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "link",
                    content: "http://google.com/",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "Google",
                        },
                    ],
                },
            ],
        },
    ]);
});

test("Referenced Link with implicit id with space.", () => {
    // Setup
    const source = `Visit [Daring Fireball][] for more information.
[Daring Fireball]: http://daringfireball.net/`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "Visit ",
                },
                {
                    name: "link",
                    content: "http://daringfireball.net/",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "Daring Fireball",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` for more information.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with multiple definitions.", () => {
    // Setup
    const source = `I get 10 times more traffic from [Google] [1] than from
[Yahoo] [2] or [MSN] [3].

[1]: http://google.com/        "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[3]: http://search.msn.com/    "MSN Search"`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "I get 10 times more traffic from ",
                },
                {
                    name: "link",
                    content: "http://google.com/",
                    title: "Google",
                    children: [
                        {
                            name: "text",
                            content: "Google",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` than from
`,
                },
                {
                    name: "link",
                    content: "http://search.yahoo.com/",
                    title: "Yahoo Search",
                    children: [
                        {
                            name: "text",
                            content: "Yahoo",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` or `,
                },
                {
                    name: "link",
                    content: "http://search.msn.com/",
                    title: "MSN Search",
                    children: [
                        {
                            name: "text",
                            content: "MSN",
                        },
                    ],
                },
                {
                    name: "text",
                    content: `.`,
                },
            ],
        },
    ]);
});

test("Referenced Link with multiple definitions with implicit id.", () => {
    // Setup
    const source = `I get 10 times more traffic from [Google][] than from
[Yahoo][] or [MSN][].

[google]: http://google.com/        "Google"
[yahoo]:  http://search.yahoo.com/  "Yahoo Search"
[msn]:    http://search.msn.com/    "MSN Search"`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "I get 10 times more traffic from ",
                },
                {
                    name: "link",
                    content: "http://google.com/",
                    title: "Google",
                    children: [
                        {
                            name: "text",
                            content: "Google",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` than from
`,
                },
                {
                    name: "link",
                    content: "http://search.yahoo.com/",
                    title: "Yahoo Search",
                    children: [
                        {
                            name: "text",
                            content: "Yahoo",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` or `,
                },
                {
                    name: "link",
                    content: "http://search.msn.com/",
                    title: "MSN Search",
                    children: [
                        {
                            name: "text",
                            content: "MSN",
                        },
                    ],
                },
                {
                    name: "text",
                    content: `.`,
                },
            ],
        },
    ]);
});

test("Referenced Link doesn't exist", () => {
    // Setup
    const source = `[link text][A]
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "[link text][A]",
                },
            ],
        },
    ]);
});

test("Multiple Link.", () => {
    // Setup
    const source = `I get 10 times more traffic from [Google](http://google.com/ "Google") than from
[Yahoo](http://search.yahoo.com/ "Yahoo Search") or [MSN](http://search.msn.com/ "MSN Search").
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "I get 10 times more traffic from ",
                },
                {
                    name: "link",
                    content: "http://google.com/",
                    title: "Google",
                    children: [
                        {
                            name: "text",
                            content: "Google",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` than from
`,
                },
                {
                    name: "link",
                    content: "http://search.yahoo.com/",
                    title: "Yahoo Search",
                    children: [
                        {
                            name: "text",
                            content: "Yahoo",
                        },
                    ],
                },
                {
                    name: "text",
                    content: ` or `,
                },
                {
                    name: "link",
                    content: "http://search.msn.com/",
                    title: "MSN Search",
                    children: [
                        {
                            name: "text",
                            content: "MSN",
                        },
                    ],
                },
                {
                    name: "text",
                    content: `.`,
                },
            ],
        },
    ]);
});

test("Automaic links", () => {
    // Setup
    const source = `<http://example.com/>
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "link",
                    content: "http://example.com/",
                    children: [
                        {
                            name: "text",
                            content: "http://example.com/",
                        },
                    ],
                },
            ],
        },
    ]);
});

test("Automaic mailto links", () => {
    // Setup
    const source = `<address@example.com>
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "link",
                    content: "mailto:address@example.com",
                    children: [
                        {
                            name: "text",
                            content: "address@example.com",
                        },
                    ],
                },
            ],
        },
    ]);
});
