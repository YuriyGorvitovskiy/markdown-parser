import * as ST from "./state";

export const CODE_BLOCK: ST.MarkType = {
    name: "code-block",
    pattern: /(?<=^|\W)```\n?([^\u001D\u001E]+?)```(?=\W|$)/m,
    unbreakable: true,
}

export const CODE_INLINE: ST.MarkType = {
    name: "code-inline",
    pattern: /(?<=^|\W)`([^\u001D\u001E\n]+?)`(?=\W|$)/,
    unbreakable: true,
}

export const LINK: ST.MarkType = {
    name: "link",
    pattern: /<([^\u001D\u001E]+?)>/,
    unbreakable: true,
}

export const EMOJI: ST.MarkType = {
    name: "emoji",
    pattern: /:([a-z0-9-+_]+):/,
    unbreakable: true,
}

export const QUOTE: ST.MarkType = {
    name: "quote",
    pattern: /(?<=(?:^|\n))\>\s?(.+?)(?:\n|$)/m,
}

export const LINE_BREAK: ST.MarkType = {
    name: "line-break",
    pattern: /(\n)/m,
    unbreakable: true,
}

export const BOLD: ST.MarkType = {
    name: "bold",
    pattern: /(?<=^|\W)\*(.+?)\*(?=\W|$)/,
}

export const ITALIC: ST.MarkType = {
    name: "italic",
    pattern: /(?<=^|\W)_(.+?)_(?=\W|$)/,
}

export const STRIKE: ST.MarkType = {
    name: "strike",
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
];

