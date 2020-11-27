import { MarkRule, contentFromMatch, textFromMatch } from "./mark"

export type SlackMark = 'code-block' | 'code-inline' | 'link' | 'emoji' | 'quote' | 'line-break' | 'bold' | 'italic' | 'strike'

export const CODE_BLOCK: MarkRule<SlackMark> = {
    // all markdown inside should be ignored 
    pattern: /(?<=^|\W)```\n?([^\u001D\u001E]+?)```(?=\W|$)/m,
    process: contentFromMatch('code-block'),
}
export const CODE_INLINE: MarkRule<SlackMark> = {
    // all markdown inside should be ignored 
    pattern: /(?<=^|\W)`([^\u001D\u001E\n]+?)`(?=\W|$)/,
    process: contentFromMatch('code-inline'),
}

export const LINK: MarkRule<SlackMark> = {
    // all markdown inside should be ignored 
    pattern: /<([^\u001D\u001E]+?)>/,
    process: contentFromMatch('link'),
}

export const EMOJI: MarkRule<SlackMark> = {
    // all markdown inside should be ignored
    pattern: /:([a-z0-9-+_]+):/,
    process: contentFromMatch('emoji'),
}

export const BOLD: MarkRule<SlackMark> = {
    pattern: /(?<=^|\W)\*(.+?)\*(?=\W|$)/,
    process: textFromMatch('bold'),
}

export const ITALIC: MarkRule<SlackMark> = {
    pattern: /(?<=^|\W)_(.+?)_(?=\W|$)/,
    process: textFromMatch('italic'),
}

export const STRIKE: MarkRule<SlackMark> = {
    pattern: /(?<=^|\W)\~(.+?)\~(?=\W|$)/,
    process: textFromMatch('strike'),
}

export const QUOTE: MarkRule<SlackMark> = {
    pattern: /(?<=(?:^|\n))(?:\>|\&gt;)\s?(.+?)(?:\n|$)/m,
    process: textFromMatch('quote'),
}

export const LINE_BREAK: MarkRule<SlackMark> = {
    // no rules inside
    pattern: /(\n)/m,
    process: contentFromMatch('line-break'),
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

