import { parse, DARING_FIREBALL } from ".";

test("Paragraph with code", () => {
    // Setup
    const source = "Use the `printf()` function.\n";
    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "Use the ",
                },
                {
                    name: "code-inline",
                    content: "printf()",
                },
                {
                    name: "text",
                    content: " function.",
                },
            ],
        },
    ]);
});

test("Code with literal backtick", () => {
    // Setup
    const source = "``There is a literal backtick (`) here.``.\n";
    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "code-inline",
                    content: "There is a literal backtick (`) here.",
                },
                {
                    name: "text",
                    content: ".",
                },
            ],
        },
    ]);
});

test("2 examples with backtick in code", () => {
    // Setup
    const source =
        "A single backtick in a code span: `` ` ``\n" + //
        "\n" + //
        "A backtick-delimited string in a code span: `` `foo` ``\n";

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "A single backtick in a code span: ",
                },
                {
                    name: "code-inline",
                    content: "`",
                },
            ],
        },
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "A backtick-delimited string in a code span: ",
                },
                {
                    name: "code-inline",
                    content: "`foo`",
                },
            ],
        },
    ]);
});

test("Code with html", () => {
    // Setup
    const source = "Please don't use any `<blink/>` tags.\n";

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "Please don't use any ",
                },
                {
                    name: "code-inline",
                    content: "<blink/>",
                },
                {
                    name: "text",
                    content: " tags.",
                },
            ],
        },
    ]);
});

test("Code with html escape", () => {
    // Setup
    const source = "`&#8212;` is the decimal-encoded equivalent of `&mdash;`.\n";

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "code-inline",
                    content: "&#8212;",
                },
                {
                    name: "text",
                    content: " is the decimal-encoded equivalent of ",
                },
                {
                    name: "code-inline",
                    content: "&mdash;",
                },
                {
                    name: "text",
                    content: ".",
                },
            ],
        },
    ]);
});
