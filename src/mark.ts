export interface Mark<M extends string> {
    readonly name: M | "text" | "root";
    readonly content?: string;
    readonly children?: Mark<M>[];
    readonly unbreakable?: boolean;
}

/**
 * Because Safari and FireFox are not supporting lookbehind and lookahead Regular Expressions,
 * we should pass match and regex to the process function, to be able to ajust match.index and regex.lastIndex
 */
type PatternHandler<M extends string, C> = (
    match: RegExpExecArray,
    regexp: RegExp,
    ctx: C
) => { mark: Mark<M>; text: string };

export interface MarkRule<M extends string, C> {
    readonly pattern: RegExp;
    readonly process: PatternHandler<M, C>;
}

export interface Markdown<M extends string, C> {
    rules: MarkRule<M, C>[];
    context: () => C;
}

export const extractGroupContent = (
    match: RegExpMatchArray,
    regex: RegExp,
    lookbehind?: boolean,
    lookahead?: boolean
): string => {
    let index = 1;
    if (lookbehind) {
        match.index += match[index++].length;
    }
    const content = match[index++];
    if (lookahead) {
        regex.lastIndex -= match[index++].length;
    }
    return content;
};

export const contentFromGroup = <M extends string, C>(
    name: M,
    lookbehind?: boolean,
    lookahead?: boolean
): PatternHandler<M, C> => (match, regex) => ({
    mark: { name, content: extractGroupContent(match, regex, lookbehind, lookahead) },
    text: null,
});

export const textFromGroup = <M extends string, C>(
    name: M,
    lookbehind?: boolean,
    lookahead?: boolean
): PatternHandler<M, C> => (match, regex) => ({
    mark: { name, children: [] },
    text: extractGroupContent(match, regex, lookbehind, lookahead),
});
