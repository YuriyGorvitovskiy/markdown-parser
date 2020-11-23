import { MarkRule } from "./mark"

export type SlackMark = 'code-block' | 'code-inline' | 'link' | 'emoji' | 'quote' | 'line-break' | 'bold' | 'italic' | 'strike'

export const CODE_BLOCK: MarkRule<SlackMark> = {
    name: 'code-block',
    pattern: /(?<=^|\W)```\n?([^\u001D\u001E]+?)```(?=\W|$)/m,
    unbreakable: true,
}

export const CODE_INLINE: MarkRule<SlackMark> = {
    name: 'code-inline',
    pattern: /(?<=^|\W)`([^\u001D\u001E\n]+?)`(?=\W|$)/,
    unbreakable: true,
}

export const LINK: MarkRule<SlackMark> = {
    name: 'link',
    pattern: /<([^\u001D\u001E]+?)>/,
    unbreakable: true,
}

export const EMOJI: MarkRule<SlackMark> = {
    name: 'emoji',
    pattern: /:([a-z0-9-+_]+):/,
    unbreakable: true,
}

export const QUOTE: MarkRule<SlackMark> = {
    name: 'quote',
    pattern: /(?<=(?:^|\n))\>\s?(.+?)(?:\n|$)/m,
}

export const LINE_BREAK: MarkRule<SlackMark> = {
    name: 'line-break',
    pattern: /(\n)/m,
    unbreakable: true,
}

export const BOLD: MarkRule<SlackMark> = {
    name: 'bold',
    pattern: /(?<=^|\W)\*(.+?)\*(?=\W|$)/,
}

export const ITALIC: MarkRule<SlackMark> = {
    name: 'italic',
    pattern: /(?<=^|\W)_(.+?)_(?=\W|$)/,
}

export const STRIKE: MarkRule<SlackMark> = {
    name: 'strike',
    pattern: /(?<=^|\W)\~(.+?)\~(?=\W|$)/,
}

export const SLACK_RULES = [
    CODE_BLOCK,
    CODE_INLINE,
    LINK,
    EMOJI,
    QUOTE,
    BOLD,
    ITALIC,
    STRIKE,
    LINE_BREAK,
]

