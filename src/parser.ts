import { Mark, MarkRule } from "./mark"
import { State } from "./state"

const BEGIN = "\u001D"
const END = "\u001E"
const SPLIT = /(\u001D+|\u001E+)/

const mergeMarkText = (marks: Mark<any>[]): string =>
    marks?.reduce(
        (a, m) => a + (
            'text' === m.name
                ? m.content
                : m.unbreakable
                    ? BEGIN + END
                    : BEGIN + mergeMarkText(m.children) + END),
        ""
    )

const processText = <M extends string>(state: State<M>, rule: MarkRule<M>, text: string): State<M> => {
    return text.split(SPLIT).reduce((s, t, i) =>
        i % 2
            ? t.startsWith(BEGIN) ? s.addProcessedMarks(t.length) : s.closeProcessedMarks(t.length, m => m.recursive ? applyMarkPattern(m, rule) : m)
            : s.addText(t),
        state)
}

const applyMarkPattern = <M extends string>(root: Mark<M>, rule: MarkRule<M>): Mark<M> => {
    const state = State.of(root)
    const combo = mergeMarkText(root.children)

    const regex = new RegExp(rule.pattern, 'g')
    let prevIndex = 0
    for (let match = regex.exec(combo); match !== null; prevIndex = regex.lastIndex, match = regex.exec(combo)) {
        processText(state, rule, combo.substring(prevIndex, match.index))
        const { mark, text } = rule.process(match)
        mark && state.addActiveMark(mark)
        text && processText(state, rule, text)
        mark && state.closeActiveMark(m => m.recursive ? applyMarkPattern(m, rule) : m)
    }
    processText(state, rule, combo.substring(prevIndex))
    return state.getCurrentMark()
}

export const parse = <M extends string>(text: string, rules: MarkRule<M>[]): Mark<M> => {
    const cleanText = text.replace(BEGIN, "").replace(END, "")
    const root: Mark<M> = { name: 'root', children: [{ name: 'text', content: cleanText }] }
    return rules.reduce((m, r) => applyMarkPattern(m, r), root)
}