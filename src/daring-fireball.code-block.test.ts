import { parse, DARING_FIREBALL } from ".";

test("Paragraph and code", () => {
    // Setup
    const source = `This is a normal paragraph:

    This is a code block.`;
    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "This is a normal paragraph:",
                },
            ],
        },
        {
            name: "code-block",
            content: `This is a code block.`,
        },
    ]);
});

test("Paragraph and multiline code", () => {
    // Setup
    const source = `Here is an example of AppleScript:

    tell application "Foo"
\t    beep
    end tell`;
    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "text",
                    content: "Here is an example of AppleScript:",
                },
            ],
        },
        {
            name: "code-block",
            content: `tell application "Foo"
    beep
end tell`,
        },
    ]);
});

test("Code with HTML inside", () => {
    // Setup
    const source = `    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "code-block",
            content: `<div class="footer">
    &copy; 2004 Foo Corporation
</div>`,
        },
    ]);
});

test("Code between qoutes", () => {
    // Setup
    const source = `> Quoted line

    Code block
> Another quoted line

`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "quote",
            children: [
                {
                    name: "paragraph",
                    children: [
                        {
                            name: "text",
                            content: `Quoted line`,
                        },
                    ],
                },
            ],
        },
        {
            name: "code-block",
            content: `Code block
`,
        },
        {
            name: "quote",
            children: [
                {
                    name: "paragraph",
                    children: [
                        {
                            name: "text",
                            content: `Another quoted line`,
                        },
                    ],
                },
            ],
        },
    ]);
});
