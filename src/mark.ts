export interface Mark<M extends string> {
    readonly name: M | 'text' | 'root'
    readonly content?: string
    readonly children?: Mark<M>[]
}

export interface MarkRule<M extends string> {
    readonly name: M | 'text' | 'root'
    readonly pattern?: RegExp
    readonly unbreakable?: true
}
