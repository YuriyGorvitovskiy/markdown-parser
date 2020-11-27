import { Mark, MarkRule } from "./mark"
import * as ST from "./state"

type SL = 'bold' | 'italic'

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
    const pass1 = ST.State.of<SL>({ name: 'root', children: [] })
        .addText("12 _34 ")
        .addActiveMark({ name: 'bold', children: [] })
        .addText("56_ _78")
        .closeActiveMark()
        .addText(" 90_ AB")

    // Verify 
    expect(pass1.getCurrentMark().children).toMatchObject([{
        name: 'text',
        content: "12 _34 ",
    }, {
        name: 'bold',
        children: [{
            name: 'text',
            content: "56_ _78",
        }],
    }, {
        name: 'text',
        content: " 90_ AB",
    }] as Mark<SL>[])
})

test("State manipulation BOLD + ITALIC Pass 2", () => {
    const pass2 = ST.State.of<SL>({
        name: 'root',
        children: [{
            name: 'text',
            content: "12 _34 ",
        }, {
            name: 'bold',
            children: [{
                name: 'text',
                content: "56_ _78"
            }],
        }, {
            name: 'text',
            content: " 90_ AB",
        }]
    })
        .addText("12 ")
        .addActiveMark({ name: 'italic', children: [] })
        .addText("34 ")
        .addProcessedMarks(1)
        .addText("56")
        .closeActiveMark()
        .addText(" ")
        .addActiveMark({ name: 'italic', children: [] })
        .addText("78")
        .closeProcessedMarks(1)
        .addText(" 90")
        .closeActiveMark()
        .addText(" AB")


    // Verify 
    expect(pass2.getCurrentMark().children).toMatchObject([{
        name: 'text',
        content: "12 ",
    }, {
        name: 'italic',
        children: [{
            name: 'text',
            content: "34 "
        }, {
            name: 'bold',
            children: [{
                name: 'text',
                content: "56"
            }]
        }],
    }, {
        name: 'bold',
        children: [{
            name: 'text',
            content: " "
        }, {
            name: 'italic',
            children: [{
                name: 'text',
                content: "78"
            }]
        }]
    }, {
        name: 'italic',
        children: [{
            name: 'text',
            content: " 90"
        }],
    }, {
        name: 'text',
        content: " AB",
    }])
})

