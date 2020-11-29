import { Mark, MarkRule, contentFromGroup1, textFromGroup1 } from "./mark"
import { parse } from "./parser"

export type DaringFireballMark = 'html-tag'

export interface HtmlTagMark extends Mark<DaringFireballMark> {
    tag: string
}

const HTML_TAG: MarkRule<DaringFireballMark> = {
    pattern: /\<(\w+)(?:\s+([^\u001D\u001E]+?))?(?:\s?\/\>|\>(.*?)\<\/\1\>)/m,
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

export const DARING_FIREBALL_RULES = [
    HTML_TAG,
    HTML_SINGLETON_TAG
]