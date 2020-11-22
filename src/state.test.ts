import * as ST from "./state";

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
    pattern: /(?<=^|\W)`(.+?)`(?=\W|$)/,
}

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
test("State manipulation BOLD Pass 1 ", () => {
    // Execute
    const pass1 = ST.State.of({ type: ST.ROOT, children: [] })
        .addText("12 _34 ")
        .addActiveMark({ type: BOLD, children: [] })
        .addText("56_ _78")
        .closeActiveMark()
        .addText(" 90_ AB");

    // Verify 
    expect(pass1.getCurrentMark().children).toMatchObject([{
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

test("State manipulation BOLD + ITALIC Pass 2", () => {
    const pass2 = ST.State.of({
        type: ST.ROOT,
        children: [{
            type: ST.TEXT,
            content: "12 _34 ",
        } as ST.Mark, {
            type: BOLD,
            children: [{
                type: ST.TEXT,
                content: "56_ _78"
            }],
        } as ST.Mark, {
            type: ST.TEXT,
            content: " 90_ AB",
        } as ST.Mark]
    })
        .addText("12 ")
        .addActiveMark({ type: ITALIC, children: [] })
        .addText("34 ")
        .addProcessedMarks(1)
        .addText("56")
        .closeActiveMark()
        .addText(" ")
        .addActiveMark({ type: ITALIC, children: [] })
        .addText("78")
        .closeProcessedMarks(1)
        .addText(" 90")
        .closeActiveMark()
        .addText(" AB");


    // Verify 
    expect(pass2.getCurrentMark().children).toMatchObject([{
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

