import { parse, DARING_FIREBALL } from ".";

test("Backslash Escape", () => {
    // Setup
    const source = `\\\\\\*\\{a\\}`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "escaped",
            content: "\\",
        },
        {
            name: "escaped",
            content: "*",
        },
        {
            name: "escaped",
            content: "{",
        },
        {
            name: "text",
            content: "a",
        },
        {
            name: "escaped",
            content: "}",
        },
    ]);
});

test("Backslash Escape", () => {
    // Setup
    const source = `\\*literal asterisks\\*`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "escaped",
            content: "*",
        },
        {
            name: "text",
            content: "literal asterisks",
        },
        {
            name: "escaped",
            content: "*",
        },
    ]);
});

test("Backslash asteris with spaces", () => {
    // Setup
    const source = `*literal * asterisks*`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "emphasis",
            children: [
                {
                    name: "text",
                    content: "literal",
                },
                {
                    name: "escaped",
                    content: " * ",
                },
                {
                    name: "text",
                    content: "asterisks",
                },
            ],
        },
    ]);
});
