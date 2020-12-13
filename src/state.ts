import { Mark } from "./mark";
/**
    1. Split string by pattern1: [text1, match2, text3, match4, text5]
    2  Create MarkTree: [text1, m2: [text2], text3, m4: [text4], text5]
    3. Create combo string: text1 + "{" + text2 + "}" + text3 + "{" + text4 + "}" + text5
    4. Split combo string by pattern2: [text6, match7, text8]
    5. Split text6 by /({+|}+)/: [text6.1, "{", text6.2]
    6. Split match3 by /({+|}+)/:  [text7.1, "}", text7.2, "{", text7.3]
    7. Split text7 by /({+|}+)/ [text8.1, "}", text8.2]
   8A. Merge with step 2: [text6.1, m2: [text6.2, m7: [text7.1]], m7: [text7.2, m4:[text7.3]], m4:[text8.1], text8.2]
   8B. Merge with step 2: [text6.1, m2: [text6.2], m7: [m2: [text7.1], text7.2, m4:[text7.3]], m4:[text8.1], text8.2]
   9A. Create combo string: text6.1 + "{" + text6.2 + "{" + text7.1 + "}}{" + text7.2 + "{" + ext7.3 + "}}{" + text8.1 + "}" + text8.2
   9B. Create combo string: text6.1 + "{" + text6.2 + "}{{" + text7.1 + "}" + text7.2 + "{" + ext7.3 + "}}{" + text8.1 + "}" + text8.2
   11. Repeat from step 4

   Example 12 _34 *56_ _78* 90_ AB (BOLD, ITALIC)
   1. Split string by (/(?<=^|\W)\*(.+?)\*(?=\W|$)/): ["12 _34 ", "56_ _78", " 90_ AB"]
   2. Create MarkTree: ["12 _34 ", b["56_ _78"], " 90_ AB"]
   3. Create combo string: "12 _34 {56_ _78} 90_ AB"
   4. Split string by (/(?<=^|\W)_(.+?)_(?=\W|$)/): ["12 ", "34 {56", " " , "78} 90", " AB"]
   5. Split strings by /({+|}+)/: [["12 "], ["34 ", "{", "56"], [" "] , ["78", "}", " 90"], [" AB"]]
  6A. Create MarkTree: ["12 ", i["34 ", b["56"]], b[" ", i["78"]], i[" 90"], " AB"]
  6B. Create MarkTree: ["12 ", i["34 ", b["56"]], b[" "], i[b["78"], " 90"], " AB"]

  Example 12 _34 *56_ _78* 90_ AB (ITALIC, BOLD)
   1. Split string by (/(?<=^|\W)_(.+?)_(?=\W|$)/): ["12 ", "34 *56", " ", "78* 90", " AB"]
   2. Create MarkTree: ["12 ", i["34 *56"], " ", i["78* 90"], " AB"]
   3. Create combo string: "12 {34 *56} {78* 90} AB"
   4. Split string by (/(?<=^|\W)\*(.+?)\*(?=\W|$)/): ["12 {34 ", "56} {78", " 90} AB"]
   5. Split strings by /({+|}+)/: [["12 ", "{", "34"], ["56", "}", " ", "{", "78"], [" 90", "}", " AB"]]
  6A. Create MarkTree: ["12 ", i["34", b["56"]], b[" ", i["78"]], i[" 90"], " AB"]
  6B. Create MarkTree: ["12 ", i["34 "], b[i["56"], " ", i["78"]], i[" 90"], " AB"]

  \u001D character "Group Separator", marks begining of exposed group
  \u001E character "Record Separator", marks ending of exposed group
  */

export interface Level<M extends string> {
    readonly unprocessed: Mark<M>[];
    readonly mark: Mark<M>;
    readonly secondary?: boolean;
}

// Alogorithm B Support
export class State<M extends string> {
    parents: Level<M>[];
    current: Level<M>;
    active: Level<M>;

    constructor(parents: Level<M>[], current: Level<M>) {
        this.parents = parents;
        this.current = current;
        this.active = null;
    }

    addText(text: string): State<M> {
        if (text) {
            this.current.mark.children.push({ name: "text", content: text });
        }
        return this;
    }

    addActiveMark(mark: Mark<M>): State<M> {
        // just open a new mark
        this.parents.push(this.current);
        this.active = this.current = { mark, unprocessed: this.current.unprocessed };
        return this;
    }

    closeActiveMark(): State<M> {
        const backup: Level<M>[] = [];
        // close all marks below active, and keep them in stack
        while (this.current !== this.active) {
            backup.push(this.current);
            const ended = this.current;
            this.current = this.parents.pop();
            const mark = ended.mark;
            if (!ended.secondary || mark.children?.length) {
                // add only primary or not empty mark secondary
                this.current.mark.children.push(mark);
            }
        }
        // close active
        const ended = this.current;
        this.current = this.parents.pop();
        this.active = null;
        const mark = ended.mark;
        if (!ended.secondary || mark.children?.length) {
            // add only primary or not empty mark secondary
            this.current.mark.children.push(mark);
        }

        // reopen marks we preserved in stack in reverse order
        while (backup.length > 0) {
            const back = backup.pop();
            const repeat = { ...back.mark, children: [] };
            this.parents.push(this.current);
            this.current = { mark: repeat, unprocessed: back.unprocessed, secondary: true };
        }
        return this;
    }

    addProcessedMarks(levels: number): State<M> {
        // Add unprocessed marks, recursively
        while (levels-- > 0) {
            const next = this.current.unprocessed.shift();
            const repeat = { ...next, children: next.unbreakable ? next.children : [] };
            this.parents.push(this.current);

            this.current = {
                mark: repeat,
                unprocessed: next.unbreakable ? [] : next.children?.filter((m) => m.name !== "text"),
            };
        }
        return this;
    }

    closeProcessedMarks(levels: number): State<M> {
        let activeClosed = false;
        // close all marks below recursively
        while (levels-- > 0) {
            if (this.active == this.current) {
                // if there is an active mark, close it also, but don't count
                const ended = this.current;
                this.current = this.parents.pop();
                const mark = ended.mark;
                if (!ended.secondary || mark.children?.length) {
                    // add only primary or not empty mark secondary
                    this.current.mark.children.push(mark);
                }
                activeClosed = true;
            }
            const ended = this.current;
            this.current = this.parents.pop();
            const mark = ended.mark;
            if (!ended.secondary || mark.children?.length) {
                // add only primary or not empty mark secondary
                this.current.mark.children.push(mark);
            }
        }

        if (activeClosed) {
            // reopen active mark
            const repeat = { ...this.active.mark, children: [] };
            this.parents.push(this.current);
            this.active = this.current = { mark: repeat, unprocessed: this.current.unprocessed, secondary: true };
        }

        return this;
    }

    getCurrentMark(): Mark<M> {
        return this.current.mark;
    }

    static of<M extends string>(processedRoot: Mark<M>): State<M> {
        return new State([], {
            mark: { ...processedRoot, children: [] },
            unprocessed: [...processedRoot.children.filter((m) => m.name !== "text")],
        });
    }
}
