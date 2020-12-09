import { match } from "assert"
import HTML_ENTITY_LOOKUP from "./html-entities"
import { Mark, MarkRule } from "./mark"
import { parse } from "./parser"

export type DaringFireballMark = 'bullet-list' | 'code' | 'escaped' | 'header' | 'horizontal-rule' | 'html-block' | 'html-tag' | 'line-break' | 'link' | 'list-item' | 'ordered-list' | 'quote' | 'paragraph'

export interface HtmlTagMark extends Mark<DaringFireballMark> {
    tag: string
}

export interface LinkMark extends Mark<DaringFireballMark> {
    title: string
}

export interface HeaderMark extends Mark<DaringFireballMark> {
    content: '1' | '2' | '3' | '4' | '5' | '6'
}

const HTML_BLOCK: MarkRule<DaringFireballMark> = {
    pattern: /^\<(address|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video)(?:\s+([^\u001D\u001E]+?)\s*)?(?:\/\>|\>([^\u001D\u001E]*?)^\<\/\1\>)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'html-tag',
            tag: match[1],
            content: match[2],
            children: parse(match[3], [HTML_TAG, HTML_SINGLETON_TAG]).children,
            unbreakable: true,
        } as HtmlTagMark,
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
            children: parse(match[3], [HTML_TAG, HTML_SINGLETON_TAG]).children,
            unbreakable: true,
        } as HtmlTagMark,
        text: "",
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
            children: parse(match[3], [HTML_TAG, HTML_SINGLETON_TAG]).children,
        } as HtmlTagMark,
        text: "",
    }),
}

const QUOTE: MarkRule<DaringFireballMark> = {
    //pattern: /^(> ?[^\u001D\u001E]*?(?:\n[ \t]*)+(?:\n|$))/m,
    pattern: /(?<=^|\u001E)((?:>(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)+)/m,
    process: (match) => ({
        mark: {
            name: 'quote',
            children: parse(match[1].replace(/^\> ?/gm, ""), RECURSIVE_RULES).children,
            unbreakable: true,
        },
        text: ""
    })
}

const trimLastLineBreak = (s: string) => s.endsWith('\n') ? s.substr(0, s.length - 1) : s

const BULLET_LIST: MarkRule<DaringFireballMark> = {
    // start with (?<=^|\u001E)(?: {0,3}|\t)[*+-][ \t]
    // continue: (?:(?: {0,3}|\t)[*+-][ \t]|(?:    |\t)
    // paragraph line: (?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*\n)*
    // paragraph ending: (?:[ \t]*\n)*
    pattern: /(?<=^|\u001E)((?: {0,3}|\t)[*+-][ \t](?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*(?:(?:(?: {0,3}|\t)[*+-][ \t]|(?:    |\t))(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)*)+/m,
    process: (match) => ({
        mark: {
            name: 'bullet-list',
            children: match[1].split(/^(?: {0,3}|\t)[*+-](?: {0,3}|\t)/gm)
                .slice(1)
                .map(t => ({
                    name: 'list-item',
                    children: parse(trimLastLineBreak(t.replace(/^(?:    |\t)/gm, "")), RECURSIVE_RULES).children,
                    unbreakable: true,
                })),
            unbreakable: true,
        },
        text: "",
    })
}

const ORDERED_LIST: MarkRule<DaringFireballMark> = {
    // start with (?<=^|\u001E)(?: {0,3}|\t)[*+-][ \t]
    // continue: (?:(?: {0,3}|\t)[*+-][ \t]|(?:    |\t)
    // paragraph line: (?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*\n)*
    // paragraph ending: (?:[ \t]*\n)*
    pattern: /(?<=^|\u001E)((?: {0,3}|\t)\d+\.[ \t](?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*(?:(?:(?: {0,3}|\t)\d+\.[ \t]|(?:    |\t))(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)*)+/m,
    process: (match) => ({
        mark: {
            name: 'ordered-list',
            children: match[1].split(/^(?: {0,3}|\t)\d+\.(?: {0,3}|\t)/gm)
                .slice(1)
                .map(t => ({
                    name: 'list-item',
                    children: parse(trimLastLineBreak(t.replace(/^(?:    |\t)/gm, "")), RECURSIVE_RULES).children,
                    unbreakable: true,
                })),
            unbreakable: true,
        },
        text: "",
    })
}

const CODE: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)((?:(?:    |\t)[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))(?:^(?:    |\t)[^\n\u001D\u001E]+(?:\n|$)|(?:^[ \t]*(?:\n|$)))*)/m,
    process: (match) => ({
        mark: {
            name: 'code',
            content: match[1].replace(/^(?:    |\t)/gm, ""),
        },
        text: "",
    })
}

const PARAGRAPH: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)(?:[ \t]*\n)*([^\u001D\u001E]+?)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'paragraph',
            children: parse(match[1], INLINE_RULES).children,
            unbreakable: true,
        } as HtmlTagMark,
        text: "",
    })
}


// We should capture \n at the end to avoid paragraph around header
const HEADER_UNDERLINE: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E)([^\s\u001D\u001E][^\n\u001D\u001E]*?)\n(=+|-+)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'header',
            content: match[2].startsWith("=") ? "1" : "2",
            children: parse(match[1], INLINE_RULES).children,
            unbreakable: true,
        } as HeaderMark,
        text: "",
    })
}

// We should capture \n at the end to avoid paragraph around header
const HEADER_SHARP: MarkRule<DaringFireballMark> = {
    pattern: /(?<=^|\u001E\n)(#{1,6})[ \t]+([^\s\u001D\u001E][^\n\u001D\u001E]*?)(?:[ \t]+#+)?(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match) => ({
        mark: {
            name: 'header',
            content: "" + match[1].length,
            children: parse(match[2], INLINE_RULES).children,
            unbreakable: true,
        } as HeaderMark,
        text: "",
    })
}

const HORIZONTAL_RULE: MarkRule<DaringFireballMark> = {
    pattern: /^(?:(?:[ \t]*\*+){3,}|(?:[ \t]*-+){3,}|(?:[ \t]*_+){3,})(?:\n[ \t]*)*(?:\n|$)/m,
    process: () => ({ mark: { name: 'horizontal-rule' }, text: "" }),
}

const LINE_BREAK: MarkRule<DaringFireballMark> = {
    pattern: /\s\s+\n/m,
    process: () => ({ mark: { name: 'line-break' }, text: "" }),
}

const LINK_INLINE: MarkRule<DaringFireballMark> = {
    pattern: /\[(.*?)\]\s*\(([^\s\u001D\u001E]*?)(?:\s+\"([^"\u001D\u001E]*)\")?\s*\)/m,
    process: (match) => ({
        mark: {
            name: 'link',
            content: match[2],
            title: match[3],
            children: []
        } as LinkMark,
        text: match[1],
    }),
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

export const BLOCK_RULES = [
    QUOTE, // should be before first 
    HTML_BLOCK, // should be before all, but QUOTE
    HEADER_UNDERLINE, // should be before HORIZONTAL_RULE
    HEADER_SHARP,
    HORIZONTAL_RULE, // should be before BULLET_LIST
    BULLET_LIST,
    ORDERED_LIST,
    CODE,
    PARAGRAPH,
]

export const INLINE_RULES = [
    LINE_BREAK,
    HTML_TAG,
    HTML_SINGLETON_TAG,
    LINK_INLINE,
    HTML_ESCAPE,
]

const RECURSIVE_RULES = [
    ...BLOCK_RULES,
    ...INLINE_RULES,
]

export const DARING_FIREBALL_RULES = [
    ...BLOCK_RULES,
    ...INLINE_RULES,
]