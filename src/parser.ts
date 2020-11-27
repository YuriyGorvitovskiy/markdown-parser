import { Mark, MarkRule } from "./mark"
import { State } from "./state"

const BEGIN = "\u001D"
const END = "\u001E"
const SPLIT = /(\u001D+|\u001E+)/

const mergeMarkText = (mark: Mark<any>): string => {
    if ('text' === mark.name) {
        return mark.content
    }

    const text = mark.children?.reduce((a, m) => a + mergeMarkText(m), "") ?? ""
    if ('root' === mark.name) {
        return text
    }
    return BEGIN + text + END
}

const processText = <M extends string>(state: State<M>, text: string): State<M> => {
    return text.split(SPLIT).reduce((s, t, i) =>
        i % 2
            ? t.startsWith(BEGIN) ? s.addProcessedMarks(t.length) : s.closeProcessedMarks(t.length)
            : s.addText(t),
        state)
}

const applyMarkPattern = <M extends string>(root: Mark<M>, rule: MarkRule<M>): Mark<M> => {
    const state = State.of(root)
    const combo = mergeMarkText(root)

    const regex = new RegExp(rule.pattern, 'g')
    let prevIndex = 0
    for (let match = regex.exec(combo); match !== null; prevIndex = regex.lastIndex, match = regex.exec(combo)) {
        processText(state, combo.substring(prevIndex, match.index))
        const { mark, text } = rule.process(match)
        mark && state.addActiveMark(mark)
        text && processText(state, text)
        mark && state.closeActiveMark()
    }
    processText(state, combo.substring(prevIndex))
    return state.getCurrentMark()
}

export const parse = <M extends string>(text: string, rules: MarkRule<M>[]): Mark<M> => {
    const cleanText = text.replace(BEGIN, "").replace(END, "")
    const root: Mark<M> = { name: 'root', children: [{ name: 'text', content: cleanText }] }
    return rules.reduce((m, r) => applyMarkPattern(m, r), root)
}