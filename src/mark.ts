export interface Mark<M extends string> {
    readonly name: M | 'text' | 'root'
    readonly content?: string
    readonly children?: Mark<M>[]
}

/**
 * Because Safari and FireFox are not supporting lookbehind and lookahead Regular Expressions, 
 * we should pass match and regex to the process function, to be able to ajust match.index and regex.lastIndex
 */
type PatternHandler<M extends string> = (match: RegExpExecArray, regexp: RegExp) => { mark: Mark<M>, text: string };

export interface MarkRule<M extends string> {
    readonly pattern: RegExp
    readonly process: PatternHandler<M>
}

export const extractGroupContent = (match, regex, lookbehind?: boolean, lookahead?: boolean) => {
    let index = 1
    if (lookbehind) {
        match.index += match[index++].length
    }
    const content = match[index++]
    if (lookahead) {
        regex.lastIndex -= match[index++].length
    }
    return content;
}

export const contentFromGroup = <M extends string>(name: M, lookbehind?: boolean, lookahead?: boolean): PatternHandler<M> =>
    ((match, regex) => ({
        mark: { name, content: extractGroupContent(match, regex, lookbehind, lookahead) },
        text: null
    }))

export const textFromGroup = <M extends string>(name: M, lookbehind?: boolean, lookahead?: boolean): PatternHandler<M> =>
    ((match, regex) => ({
        mark: { name, children: [] },
        text: extractGroupContent(match, regex, lookbehind, lookahead)
    }))

