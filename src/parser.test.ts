import { MarkRule, textFromGroup, contentFromGroup } from "./mark";
import { parse } from "./parser";

type SL = "bold" | "italic" | "code-inline";

const BOLD: MarkRule<SL, null> = {
    pattern: /(^|\W)\*(.+?)\*(\W|$)/,
    process: textFromGroup("bold", true, true),
};
const ITALIC: MarkRule<SL, null> = {
    pattern: /(^|\W)_(.+?)_(\W|$)/,
    process: textFromGroup("italic", true, true),
};
const CODE_INLINE: MarkRule<SL, null> = {
    pattern: /`(.+?)`/,
    process: contentFromGroup("code-inline"),
};
/*
    "asd\n>123\n> 456\n789".split(/(?<=(?:^|\n))\>\s?(.+?(?:\n|$))/m): ["asd↵", "123↵", "", "456↵", "789"]
    "asd\n>123\n> 456\n789".split(/(?<=(?:^|\n))((?:\>.+?(?:\n|$))+)/m): ["asd↵", ">123↵> 456↵", "789"]
*/

/*
   Example 12 _34 *56_ _78* 90_ AB (BOLD, ITALIC)
   1. Split string by (/(?<=^|\W)\*(.+?)\*(?=\W|$)/): ["12 _34 ", "56_ _78", " 90_ AB"]
   2. Create MarkTree: ["12 _34 ", b["56_ _78"], " 90_ AB"]
   3. Create combo string: "12 _34 {56_ _78} 90_ AB"
   4. Split string by (/(?<=^|\W)_(.+?)_(?=\W|$)/): ["12 ", "34 {56", " " , "78} 90", " AB"]
   5. Split strings by /({+|}+)/: [["12 "], ["34 ", "{", "56"], [" "] , ["78", "}", " 90"], [" AB"]]
  6A. Create MarkTree: ["12 ", i["34 ", b["56"]], b[" ", i["78"]], i[" 90"], " AB"]
  6B. Create MarkTree: ["12 ", i["34 ", b["56"]], b[" "], i[b["78"], " 90"], " AB"]
  */

test("Parse with BOLD pattern", () => {
    // Execute
    const result = parse("12 _34 *56_ _78* 90_ AB", { rules: [BOLD], context: () => null });

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "12 _34 ",
        },
        {
            name: "bold",
            children: [
                {
                    name: "text",
                    content: "56_ _78",
                },
            ],
        },
        {
            name: "text",
            content: " 90_ AB",
        },
    ]);
});

test("Parse with BOLD + ITALIC patterns", () => {
    const result = parse("12 _34 *56_ _78* 90_ AB", { rules: [BOLD, ITALIC], context: () => null });

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "12 ",
        },
        {
            name: "italic",
            children: [
                {
                    name: "text",
                    content: "34 ",
                },
                {
                    name: "bold",
                    children: [
                        {
                            name: "text",
                            content: "56",
                        },
                    ],
                },
            ],
        },
        {
            name: "bold",
            children: [
                {
                    name: "text",
                    content: " ",
                },
                {
                    name: "italic",
                    children: [
                        {
                            name: "text",
                            content: "78",
                        },
                    ],
                },
            ],
        },
        {
            name: "italic",
            children: [
                {
                    name: "text",
                    content: " 90",
                },
            ],
        },
        {
            name: "text",
            content: " AB",
        },
    ]);
});

test("Parse with CODE_INLINE + BOLD patterns V1", () => {
    // Execute
    const result = parse("12 *34 `56 78*` 90* AB", { rules: [CODE_INLINE, BOLD], context: () => null });

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "12 ",
        },
        {
            name: "bold",
            children: [
                {
                    name: "text",
                    content: "34 ",
                },
                {
                    name: "code-inline",
                    content: "56 78*",
                },
                {
                    name: "text",
                    content: " 90",
                },
            ],
        },
        {
            name: "text",
            content: " AB",
        },
    ]);
});

test("Parse with CODE_INLINE + BOLD patterns V2", () => {
    // Execute
    const result = parse("12 *34 `56 78`* 90* AB", { rules: [CODE_INLINE, BOLD], context: () => null });

    // Verify
    expect(result.children).toMatchObject([
        {
            name: "text",
            content: "12 ",
        },
        {
            name: "bold",
            children: [
                {
                    name: "text",
                    content: "34 ",
                },
                {
                    name: "code-inline",
                    content: "56 78",
                },
            ],
        },
        {
            name: "text",
            content: " 90* AB",
        },
    ]);
});

test("Empty string to parse", () => {
    // Execute
    const result = parse("", { rules: [CODE_INLINE, BOLD], context: () => null });

    // Verify
    expect(result.children).toMatchObject([]);
});
