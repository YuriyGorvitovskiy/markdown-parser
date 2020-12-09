import { match } from "assert"
import { MarkRule, contentFromGroup, textFromGroup } from "./mark"

export type SlackMark = 'code-block' | 'code-inline' | 'link' | 'emoji' | 'quote' | 'line-break' | 'bold' | 'italic' | 'strike'

export const CODE_BLOCK: MarkRule<SlackMark> = {
    // all markdown inside should be ignored 
    pattern: /(^|\W)```\n?([^\u001D\u001E]+?)```(\W|$)/m,
    process: contentFromGroup('code-block', true, true)
}

export const CODE_INLINE: MarkRule<SlackMark> = {
    // all markdown inside should be ignored 
    pattern: /(^|\W)`([^\u001D\u001E\n]+?)`(\W|$)/,
    process: contentFromGroup('code-inline', true, true)
}

export const LINK: MarkRule<SlackMark> = {
    // all markdown inside href part should be ignored 
    pattern: /<([^\u001D\u001E]+?)(?:\|(.+?))?>/,
    process: (m) => ({ mark: { name: 'link', content: m[1], children: [] }, text: m[2] }),
}

export const EMOJI: MarkRule<SlackMark> = {
    // all markdown inside should be ignored
    pattern: /:([a-z0-9-+_]+):/,
    process: contentFromGroup('emoji'),
}

export const BOLD: MarkRule<SlackMark> = {
    pattern: /(^|\W)\*(.+?)\*(\W|$)/,
    process: textFromGroup('bold', true, true),
}

export const ITALIC: MarkRule<SlackMark> = {
    pattern: /(^|\W)_(.+?)_(\W|$)/,
    process: textFromGroup('italic', true, true),
}

export const STRIKE: MarkRule<SlackMark> = {
    pattern: /(^|\W)\~(.+?)\~(\W|$)/,
    process: textFromGroup('strike', true, true),
}

const QUOTE_EXTRACT = /^>\s?/m
export const QUOTE: MarkRule<SlackMark> = {
    pattern: /(?<=(?:^|\n))((?:(?:\>|\&gt\;)[^\n]+?(?:\n|$))+)/m,
    process: (m) => ({
        mark: { name: 'quote', children: [] },
        text: m[0].split(QUOTE_EXTRACT).join("")
    }),
}

export const LINE_BREAK: MarkRule<SlackMark> = {
    // no rules inside
    pattern: /\n/m,
    process: (m) => ({ mark: { name: 'line-break' }, text: null }),
}

/*
    Rules order dictates tags containement in the tree
    The Rule at the end of the array will be parents of the Rule at the beginning of the array.
 */
export const SLACK_RULES = [
    CODE_BLOCK, // Code block encapsulate multiple lines, and should run first
    CODE_INLINE, // CODE_INLINE should follow CODE_BLOCK, because CODE_INLINE pattern also match CODE_BLOCK pattern 
    QUOTE,
    LINK, // LINK should follow CODE_XXX rules, LINK pattern should be ignored in CODE_XXX
    EMOJI, // EMOJI should follow CODE_XXX & LINK rules, because EMOJI pattern should be ignored in CODE_XXX & LINK
    BOLD, // BOLD, ITALIC, STRIKE can come in any order, and should follow CODE_XXX, LINK, EMOJI and other unbreakable blocks
    ITALIC,
    STRIKE,
    LINE_BREAK, // LINE_BREAK should be last, because beacause all rules patterns are line base, so we should keep \n to apply all rules properly.
]

