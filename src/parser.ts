import { Mark, MarkRule, Markdown } from "./mark"
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

const processText = <M extends string, C>(state: State<M>, rule: MarkRule<M, C>, text: string): State<M> => {
    return text.split(SPLIT).reduce((s, t, i) =>
        i % 2
            ? t.startsWith(BEGIN) ? s.addProcessedMarks(t.length) : s.closeProcessedMarks(t.length)
            : s.addText(t),
        state)
}

const applyMarkPattern = <M extends string, C>(root: Mark<M>, rule: MarkRule<M, C>, ctx: C): Mark<M> => {
    const state = State.of(root)
    const combo = mergeMarkText(root.children)

    const regex = new RegExp(rule.pattern, 'g' + rule.pattern.flags)
    let prevIndex = 0
    for (let match = regex.exec(combo); match !== null; prevIndex = regex.lastIndex, match = regex.exec(combo)) {
        const { mark, text } = rule.process(match, regex, ctx)
        processText(state, rule, combo.substring(prevIndex, match.index))
        mark && state.addActiveMark(mark)
        text && processText(state, rule, text)
        mark && state.closeActiveMark()
    }
    processText(state, rule, combo.substring(prevIndex))
    return state.getCurrentMark()
}

export const parse = <M extends string, C>(text: string, markdown: Markdown<M, C>): Mark<M> => {
    if (!text) {
        return { name: 'root', children: [] }
    }
    const cleanText = text.replace(BEGIN, "").replace(END, "")
    const root: Mark<M> = { name: 'root', children: [{ name: 'text', content: cleanText }] }

    const ctx = markdown.context()
    return markdown.rules.reduce((m, r) => applyMarkPattern(m, r, ctx), root)
}