import * as ST from "./state"

const BEGIN = "\u001D"
const END = "\u001E"
const SPLIT = /(\u001D+|\u001E+)/

const mergeMarkText = (mark: ST.Mark): string => {
    if (ST.TEXT === mark.type) {
        return mark.content
    }

    const text = mark.children?.reduce((a, m) => a + mergeMarkText(m), "") ?? ""
    if (ST.ROOT === mark.type) {
        return text
    }
    return BEGIN + text + END
}
const processText = (state: ST.State, text: string,): ST.State => {
    return text.split(SPLIT).reduce((s, t, i) =>
        i % 2
            ? t.startsWith(BEGIN) ? s.addProcessedMarks(t.length) : s.closeProcessedMarks(t.length)
            : s.addText(t),
        state)
}
const applyMarkPattern = (root: ST.Mark, type: ST.MarkType,): ST.Mark => {
    const state = ST.State.of(root);
    const text = mergeMarkText(root);

    return text.split(type.pattern)
        .reduce((s, t, ii) => {
            if (ii % 2) {
                if (type.unbreakable) {
                    s.addActiveMark({ type, content: t });
                } else {
                    s.addActiveMark({ type, children: [] })
                    processText(s, t)
                }
                return s.closeActiveMark()
            } else {
                return processText(s, t)
            }
        }, state)
        .getCurrentMark();
}

export const parse = (text: string, rules: ST.MarkType[]): ST.Mark => {
    const cleanText = text.replace(BEGIN, "").replace(END, "");
    const root: ST.Mark = { type: ST.ROOT, children: [{ type: ST.TEXT, content: cleanText }] };
    return rules.reduce((m, r) => applyMarkPattern(m, r), root);
}