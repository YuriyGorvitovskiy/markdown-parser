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

    return combo.split(rule.pattern)
        .reduce((s, t, ii) => {
            if (ii % 2) {
                const { mark, text } = rule.process(t)
                mark && s.addActiveMark(mark)
                text && processText(s, text)
                mark && s.closeActiveMark()
            } else {
                t && processText(s, t)
            }
            return s
        }, state)
        .getCurrentMark()
}

export const parse = <M extends string>(text: string, rules: MarkRule<M>[]): Mark<M> => {
    const cleanText = text.replace(BEGIN, "").replace(END, "")
    const root: Mark<M> = { name: 'root', children: [{ name: 'text', content: cleanText }] }
    return rules.reduce((m, r) => applyMarkPattern(m, r), root)
}