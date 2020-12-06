import HTML_ENTITY_LOOKUP from "./html-entities"
import { Mark, MarkRule, textFromGroup1 } from "./mark"

export type DaringFireballMark = 'code' | 'escaped' | 'header' | 'html-block' | 'html-tag' | 'line-break' | 'quote' | 'paragraph'

export interface HtmlTagMark extends Mark<DaringFireballMark> {
    tag: string
}

export interface HeaderMark extends Mark<DaringFireballMark> {
    content: '1' | '2' | '3' | '4' | '5' | '6'
}

const HTML_BLOCK: MarkRule<DaringFireballMark> = {
    pattern: /^(\<(address|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video)(?:\s+([^\u001D\u001E]+?))?(?:\s?\/\>|\>(?:[^\u001D\u001E]*?)^\<\/\2\>))(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'html-block',
            content: match[1],
            children: [],
            unbreakable: true,
        },
        text: "",
    }),
}

const HTML_TAG: MarkRule<DaringFireballMark> = {
    pattern: /\<(\w+)(?:\s+([^\u001D\u001E]+?))?(?:\s?\/\>|\>([\s\S]*?)\<\/\1\>)/m,
    process: (match) => ({
        mark: {
            name: 'html-tag',
            tag: match[1],
            content: match[2],
            children: [],
            unbreakable: true,
        } as HtmlTagMark,
        text: match[3],
        recursive: true,
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

const QUOTE: MarkRule<DaringFireballMark> = {
    pattern: /^(> ?[^\u001D\u001E]*?(?:\n[ \t]*)+(?:\n|$))/m,
    process: (match) => ({
        mark: {
            name: 'quote',
            children: [],
            unbreakable: true,
        },
        text: match[1].replace(/^\> ?/gm, ""),
        recursive: true
    })
}

const CODE: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)((?:(?:    |\t)[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))(?:^(?:    |\t)[^\n\u001D\u001E]+(?:\n|$)|(?:^[ \t]*(?:\n|$)))*)/m,
    process: (match) => ({
        mark: {
            name: 'code',
            content: match[1].replace(/^(?:    |\t)/gm, ""),
        },
        text: ""
    })
}

// We should ignore all other blocks so we start with first non-boundary block 
const PARAGRAPH: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)(?:[ \t]*\n)*([^\u001D\u001E]+?)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'paragraph',
            children: [],
            unbreakable: true,
        } as HtmlTagMark,
        text: match[1],
    })
}

// We should capture \n at the end to avoid paragraph around header
const HEADER_UNDERLINE: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)([^\s\u001D\u001E][^\n\u001D\u001E]*?)\n(=+|-+)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'header',
            content: match[2].startsWith("=") ? "1" : "2",
            children: [],
            unbreakable: true,
        } as HeaderMark,
        text: match[1],
    })
}

// We should capture \n at the end to avoid paragraph around header
const HEADER_SHARP: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E\n)(#{1,6})[ \t]+([^\s\u001D\u001E][^\n\u001D\u001E]*?)(?:[ \t]+#+)?(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'header',
            content: "" + match[1].length,
            children: [],
            recursive: true,
            unbreakable: true,
        } as HeaderMark,
        text: match[2],
    })
}

const LINE_BREAK: MarkRule<DaringFireballMark> = {
    pattern: /\s\s+\n/m,
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
    QUOTE,
    HTML_BLOCK,
    CODE,
    HEADER_UNDERLINE,
    HEADER_SHARP,
    PARAGRAPH,
    HTML_TAG,
    HTML_SINGLETON_TAG,
    LINE_BREAK,
    HTML_ESCAPE,
]