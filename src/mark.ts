export interface Mark<M extends string> {
    readonly name: M | 'text' | 'root'
    readonly content?: string
    readonly children?: Mark<M>[]
}

type PatternHandler<M extends string> = (match: string) => { mark: Mark<M>, text: string };

export interface MarkRule<M extends string> {
    readonly pattern: RegExp
    readonly process: PatternHandler<M>
}

export const textFromMatch = <M extends string>(name: M): PatternHandler<M> =>
    ((m) => ({ mark: { name, children: [] }, text: m }))

export const contentFromMatch = <M extends string>(name: M): PatternHandler<M> =>
    ((m) => ({ mark: { name, content: m }, text: null }))

