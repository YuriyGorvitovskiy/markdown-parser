import { parse, DARING_FIREBALL } from ".";

test("Image inline", () => {
    // Setup
    const source = `![Alt text](/path/to/img.jpg)

![Alt text](/path/to/img.jpg "Optional title")
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "image",
                    content: "/path/to/img.jpg",
                    title: undefined,
                    children: [
                        {
                            name: "text",
                            content: "Alt text",
                        },
                    ],
                },
            ],
        },
        {
            name: "paragraph",
            children: [
                {
                    name: "image",
                    content: "/path/to/img.jpg",
                    title: "Optional title",
                    children: [
                        {
                            name: "text",
                            content: "Alt text",
                        },
                    ],
                },
            ],
        },
    ]);
});

test("Referenced image", () => {
    // Setup
    const source = `![Alt text][id]

[id]: url/to/image  "Optional title attribute"
`;

    // Execute
    const result = parse(source, DARING_FIREBALL);

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "paragraph",
            children: [
                {
                    name: "image",
                    content: "url/to/image",
                    title: "Optional title attribute",
                    children: [
                        {
                            name: "text",
                            content: "Alt text",
                        },
                    ],
                },
            ],
        },
    ]);
});
