import * as ST from "./state";
import * as PR from "./parser";

const BOLD: ST.MarkType = {
    name: "bold",
    pattern: /(?<=^|\W)\*(.+?)\*(?=\W|$)/,
}
const ITALIC: ST.MarkType = {
    name: "bold",
    pattern: /(?<=^|\W)_(.+?)_(?=\W|$)/,
}
const CODE_INLINE: ST.MarkType = {
    name: "code-inline",
    pattern: /\`(.+?)\`/,
    unbreakable: true
}
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
    const result = PR.parse("12 _34 *56_ _78* 90_ AB", [BOLD]);

    // Verify 
    expect(result.children).toMatchObject([{
        type: ST.TEXT,
        content: "12 _34 ",
    }, {
        type: BOLD,
        children: [{
            type: ST.TEXT,
            content: "56_ _78"
        }],
    }, {
        type: ST.TEXT,
        content: " 90_ AB",
    }])
})

test("Parse with BOLD + ITALIC patterns", () => {
    const result = PR.parse("12 _34 *56_ _78* 90_ AB", [BOLD, ITALIC]);

    // Verify
    expect(result.children).toMatchObject([{
        type: ST.TEXT,
        content: "12 ",
    }, {
        type: ITALIC,
        children: [{
            type: ST.TEXT,
            content: "34 "
        }, {
            type: BOLD,
            children: [{
                type: ST.TEXT,
                content: "56"
            }]
        }],
    }, {
        type: BOLD,
        children: [{
            type: ST.TEXT,
            content: " "
        }]
    }, {
        type: ITALIC,
        children: [{
            type: BOLD,
            children: [{
                type: ST.TEXT,
                content: "78"
            }]
        }, {
            type: ST.TEXT,
            content: " 90"
        }],
    }, {
        type: ST.TEXT,
        content: " AB",
    }])
})

test("Parse with CODE_INLINE + BOLD patterns V1", () => {
    // Execute
    const result = PR.parse("12 *34 `56 78*` 90* AB", [CODE_INLINE, BOLD]);

    // Verify 
    expect(result.children).toMatchObject([{
        type: ST.TEXT,
        content: "12 ",
    }, {
        type: BOLD,
        children: [{
            type: ST.TEXT,
            content: "34 "
        }, {
            type: CODE_INLINE,
            content: "56 78*"
        }, {
            type: ST.TEXT,
            content: " 90"
        }],
    }, {
        type: ST.TEXT,
        content: " AB",
    }])
})

test("Parse with CODE_INLINE + BOLD patterns V2", () => {
    // Execute
    const result = PR.parse("12 *34 `56 78`* 90* AB", [CODE_INLINE, BOLD]);

    // Verify 
    expect(result.children).toMatchObject([{
        type: ST.TEXT,
        content: "12 ",
    }, {
        type: BOLD,
        children: [{
            type: ST.TEXT,
            content: "34 "
        }, {
            type: CODE_INLINE,
            content: "56 78"
        }],
    }, {
        type: ST.TEXT,
        content: " 90* AB",
    }])
})
