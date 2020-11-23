import { MarkRule } from "./mark"

export type SlackMark = 'code-block' | 'code-inline' | 'link' | 'emoji' | 'quote' | 'line-break' | 'bold' | 'italic' | 'strike'

export const CODE_BLOCK: MarkRule<SlackMark> = {
    name: 'code-block',
    pattern: /(?<=^|\W)```\n?([^\u001D\u001E]+?)```(?=\W|$)/m,
    unbreakable: true, // all markdown inside should be ignored 
}

export const CODE_INLINE: MarkRule<SlackMark> = {
    name: 'code-inline',
    pattern: /(?<=^|\W)`([^\u001D\u001E\n]+?)`(?=\W|$)/,
    unbreakable: true, // all markdown inside should be ignored 
}

export const LINK: MarkRule<SlackMark> = {
    name: 'link',
    pattern: /<([^\u001D\u001E]+?)>/,
    unbreakable: true, // all markdown inside should be ignored 
}

export const EMOJI: MarkRule<SlackMark> = {
    name: 'emoji',
    pattern: /:([a-z0-9-+_]+):/,
    unbreakable: true, // all markdown inside should be ignored 
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

export const QUOTE: MarkRule<SlackMark> = {
    name: 'quote',
    pattern: /(?<=(?:^|\n))(?:\>|\&gt;)\s?(.+?)(?:\n|$)/m,
}

export const LINE_BREAK: MarkRule<SlackMark> = {
    name: 'line-break',
    pattern: /(\n)/m,
    unbreakable: true, // no rules inside
}



/*
    Rules order dictates tags containement in the tree
    The Rule at the end of the array will be parents of the Rule at the beginning of the array.
 */
export const SLACK_RULES = [
    CODE_BLOCK, // Code block encapsulate multiple lines, and should run first
    CODE_INLINE, // CODE_INLINE should follow CODE_BLOCK, because CODE_INLINE pattern also match CODE_BLOCK pattern 
    LINK, // LINK should follow CODE_XXX rules, LINK pattern should be ignored in CODE_XXX
    EMOJI, // EMOJI should follow CODE_XXX & LINK rules, because EMOJI pattern should be ignored in CODE_XXX & LINK
    BOLD, // BOLD, ITALIC, STRIKE can come in any order, and should follow CODE_XXX, LINK, EMOJI and other unbreakable blocks
    ITALIC,
    STRIKE,
    QUOTE, // QUITE should follow all rules but LINE_BREAK, to preserve formating inside quote
    LINE_BREAK, // LINE_BREAK should be last, because beacause all rules patterns are line base, so we should keep \n to apply all rules properly.
]

