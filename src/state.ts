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

export interface MarkType {
    readonly name: string;
    readonly pattern?: RegExp;
    readonly unbreakable?: true;
}

export const TEXT: MarkType = {
    name: "text",
}

export const ROOT: MarkType = {
    name: "root",
}

export interface Mark {
    readonly type: MarkType;
    readonly content?: string;
    readonly children?: Mark[];
}


export interface Level {
    readonly unprocessed: Mark[];
    readonly mark: Mark;
}

// Alogorithm B Support
export class State {
    parents: Level[]
    current: Level

    constructor(parents: Level[], current: Level) {
        this.parents = parents;
        this.current = current;
    }

    addText(text: string): State {
        if (text) {
            this.current.mark.children.push({ type: TEXT, content: text })
        }
        return this
    }

    addActiveMark(mark: Mark): State {
        const backup: Level[] = []
        while (this.parents.length > 0) {
            backup.push(this.current)
            this.current = this.parents.pop()
        }

        this.current.mark.children.push(mark)
        this.parents.push(this.current)
        this.current = { mark, unprocessed: this.current.unprocessed }

        while (backup.length > 0) {
            this.parents.push(this.current);
            const back = backup.pop()
            const repeat = { ...back.mark, children: [] }
            this.current.mark.children.push(repeat)
            this.current = { mark: repeat, unprocessed: back.unprocessed }
        }
        return this;
    }

    closeActiveMark(): State {
        const backup: Level[] = []
        while (this.parents.length > 0) {
            backup.push(this.current)
            this.current = this.parents.pop()
        }

        while (backup.length > 1) {
            this.parents.push(this.current);
            const back = backup.pop()
            const repeat = { ...back.mark, children: [] }
            this.current.mark.children.push(repeat)
            this.current = { mark: repeat, unprocessed: back.unprocessed }
        }
        return this
    }

    addProcessedMarks(levels: number): State {
        while (levels-- > 0) {
            const next = this.current.unprocessed.shift()
            const repeat = { ...next, children: [] }
            this.current.mark.children.push(repeat)
            this.parents.push(this.current);

            this.current = { mark: repeat, unprocessed: next.children?.filter(m => m.type !== TEXT) }
        }
        return this
    }

    closeProcessedMarks(levels: number): State {
        while (levels-- > 0) {
            this.current = this.parents.pop()
        }

        return this;
    }

    getCurrentMark(): Mark {
        return this.current.mark;
    }

    static of(processedRoot: Mark): State {
        return new State([], {
            mark: { ...processedRoot, children: [] },
            unprocessed: [...processedRoot.children.filter(m => m.type !== TEXT)],
        })
    }
}



