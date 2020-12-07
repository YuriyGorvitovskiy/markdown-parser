export interface Mark<M extends string> {
    readonly name: M | 'text' | 'root'
    readonly content?: string
    readonly children?: Mark<M>[]
    readonly unbreakable?: boolean
}

type PatternHandler<M extends string> = (match: string[]) => { mark: Mark<M>, text: string };

export interface MarkRule<M extends string> {
    readonly pattern: RegExp
    readonly process: PatternHandler<M>
}

export const textFromGroup1 = <M extends string>(name: M): PatternHandler<M> =>
    ((m) => ({ mark: { name, children: [] }, text: m[1] }))

export const contentFromGroup1 = <M extends string>(name: M): PatternHandler<M> =>
    ((m) => ({ mark: { name, content: m[1] }, text: null }))

