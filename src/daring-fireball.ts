import HTML_ENTITY_LOOKUP from "./html-entities"
import { Mark, MarkRule, textFromGroup1 } from "./mark"

export type DaringFireballMark = 'html-tag' | 'paragraph' | 'line-break' | 'escaped'

export interface HtmlTagMark extends Mark<DaringFireballMark> {
    tag: string
}

const HTML_TAG: MarkRule<DaringFireballMark> = {
    pattern: /\<(\w+)(?:\s+([^\u001D\u001E]+?))?(?:\s?\/\>|\>([\s\S]*?)\<\/\1\>)/m,
    process: (match) => ({
        mark: {
            name: 'html-tag',
            tag: match[1],
            content: match[2],
            children: [],
            recursive: true,
            unbreakable: true,
        } as HtmlTagMark,
        text: match[3],
    }),
}

// https://www.lifewire.com/html-singleton-tags-3468620
const HTML_SINGLETON_TAG: MarkRule<DaringFireballMark> = {
    pattern: /\<(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?:\s+([^\u001D\u001E]+?))?(?:\s?\>)/m,
    process: (match) => ({
        mark: {
            name: 'html-tag',
            tag: match[1],
            content: match[2],
            children: [],
        } as HtmlTagMark,
        text: match[3],
    }),
}

// [\s\S] is to match any character including newline
const PARAGRAPH: MarkRule<DaringFireballMark> = {
    pattern: /^(\S[\s\S]+?)\n\s*\n/m,
    process: textFromGroup1('paragraph'),
}

const LINE_BREAK: MarkRule<DaringFireballMark> = {
    pattern: /\s\s\n/m,
    process: () => ({ mark: { name: 'line-break' }, text: "" }),
}

const HTML_ESCAPE: MarkRule<DaringFireballMark> = {
    pattern: /&(?:(?:#)(\d+)|(?:#[xX])([\da-fA-F]+)|(\w+));/,
    process: (match) => ({
        mark: {
            name: 'escaped',
            content:
                match[1] ? String.fromCodePoint(parseInt(match[1], 10))
                    : match[2] ? String.fromCodePoint(parseInt(match[2], 16))
                        : HTML_ENTITY_LOOKUP[match[3]]
        },
        text: ""
    }),
}

export const DARING_FIREBALL_RULES = [
    HTML_TAG,
    HTML_SINGLETON_TAG,
    PARAGRAPH,
    LINE_BREAK,
    HTML_ESCAPE,
]