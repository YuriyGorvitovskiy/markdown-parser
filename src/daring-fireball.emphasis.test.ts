import { parse, DARING_FIREBALL } from ".";

test("Emphasis variants", () => {
    // Setup
    const source = `*single asterisks*
_single underscores_
**double asterisks**
__double underscores__`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "emphasis",
            children: [
                {
                    name: "text",
                    content: "single asterisks",
                },
            ],
        },
        {
            name: "text",
            content: "\n",
        },
        {
            name: "emphasis",
            children: [
                {
                    name: "text",
                    content: "single underscores",
                },
            ],
        },
        {
            name: "text",
            content: "\n",
        },
        {
            name: "strong",
            children: [
                {
                    name: "text",
                    content: "double asterisks",
                },
            ],
        },
        {
            name: "text",
            content: "\n",
        },
        {
            name: "strong",
            children: [
                {
                    name: "text",
                    content: "double underscores",
                },
            ],
        },
    ]);
});

test("Emphasis inside word", () => {
    // Setup
    const source = `n*frigging*believable`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "n",
        },
        {
            name: "emphasis",
            children: [
                {
                    name: "text",
                    content: "frigging",
                },
            ],
        },
        {
            name: "text",
            content: "believable",
        },
    ]);
});

test("Text surrounded by asterisks", () => {
    // Setup
    const source = `\\*this text is surrounded by literal asterisks\\*`;

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
            content: "this text is surrounded by literal asterisks",
        },
        {
            name: "escaped",
            content: "*",
        },
    ]);
});
