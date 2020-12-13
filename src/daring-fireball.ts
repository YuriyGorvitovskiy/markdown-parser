import HTML_ENTITY_LOOKUP from "./html-entities";
import { Mark, MarkRule, extractGroupContent } from "./mark";
import { parse } from "./parser";

export type DaringFireballMark =
    | "bullet-list"
    | "code-block"
    | "emphasis"
    | "escaped"
    | "header"
    | "horizontal-rule"
    | "html-tag"
    | "line-break"
    | "link"
    | "list-item"
    | "ordered-list"
    | "paragraph"
    | "quote"
    | "strong";

export interface HtmlTagMark extends Mark<DaringFireballMark> {
    tag: string;
}

export interface LinkMark extends Mark<DaringFireballMark> {
    title: string;
}

export interface HeaderMark extends Mark<DaringFireballMark> {
    content: "1" | "2" | "3" | "4" | "5" | "6";
}

interface Context {
    links: { [id: string]: { content: string; title: string } };
}
const HTML_BLOCK: MarkRule<DaringFireballMark, Context> = {
    pattern: /^<(address|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video)(?:\s+([^\u001D\u001E]+?)\s*)?(?:\/>|>([^\u001D\u001E]*?)^<\/\1>)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match, _regex, ctx) => ({
        mark: {
            name: "html-tag",
            tag: match[1],
            content: match[2],
            children: parse(match[3], { rules: [HTML_TAG, HTML_SINGLETON_TAG], context: () => ctx }).children,
            unbreakable: true,
        } as HtmlTagMark,
        text: "",
    }),
};

const HTML_TAG: MarkRule<DaringFireballMark, Context> = {
    pattern: /<(\w+)(?:\s+([^\u001D\u001E]+?))?(?:\s?\/>|>([\s\S]*?)<\/\1>)/m,
    process: (match, _regex, ctx) => ({
        mark: {
            name: "html-tag",
            tag: match[1],
            content: match[2],
            children: parse(match[3], { rules: [HTML_TAG, HTML_SINGLETON_TAG], context: () => ctx }).children,
            unbreakable: true,
        } as HtmlTagMark,
        text: "",
    }),
};

// https://www.lifewire.com/html-singleton-tags-3468620
const HTML_SINGLETON_TAG: MarkRule<DaringFireballMark, Context> = {
    pattern: /<(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)(?:\s+([^\u001D\u001E]+?))?(?:\s?>)/m,
    process: (match) => ({
        mark: {
            name: "html-tag",
            tag: match[1],
            content: match[2],
            children: [],
        } as HtmlTagMark,
        text: "",
    }),
};

const QUOTE: MarkRule<DaringFireballMark, Context> = {
    //pattern: /^(> ?[^\u001D\u001E]*?(?:\n[ \t]*)+(?:\n|$))/m,
    pattern: /(^|\u001E)((?:>(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)+)/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "quote",
            children: parse(extractGroupContent(match, regex, true, false).replace(/^> ?/gm, ""), {
                rules: RECURSIVE_RULES,
                context: () => ctx,
            }).children,
            unbreakable: true,
        },
        text: "",
    }),
};

const trimLastLineBreak = (s: string) => (s.endsWith("\n") ? s.substr(0, s.length - 1) : s);

const BULLET_LIST: MarkRule<DaringFireballMark, Context> = {
    // start with (^|\u001E)(?: {0,3}|\t)[*+-][ \t]
    // continue: (?:(?: {0,3}|\t)[*+-][ \t]|(?:    |\t)
    // paragraph line: (?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*\n)*
    // paragraph ending: (?:[ \t]*\n)*
    pattern: /(^|\u001E)((?: {0,3}|\t)[*+-][ \t](?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*(?:(?:(?: {0,3}|\t)[*+-][ \t]|(?: {4}|\t))(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)*)+/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "bullet-list",
            children: extractGroupContent(match, regex, true, false)
                .split(/^(?: {0,3}|\t)[*+-](?: {0,3}|\t)/gm)
                .slice(1)
                .map((t) => ({
                    name: "list-item",
                    children: parse(trimLastLineBreak(t.replace(/^(?: {4}|\t)/gm, "")), {
                        rules: RECURSIVE_RULES,
                        context: () => ctx,
                    }).children,
                    unbreakable: true,
                })),
            unbreakable: true,
        },
        text: "",
    }),
};

const ORDERED_LIST: MarkRule<DaringFireballMark, Context> = {
    // start with (^|\u001E)(?: {0,3}|\t)[*+-][ \t]
    // continue: (?:(?: {0,3}|\t)[*+-][ \t]|(?:    |\t)
    // paragraph line: (?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*\n)*
    // paragraph ending: (?:[ \t]*\n)*
    pattern: /(^|\u001E)((?: {0,3}|\t)\d+\.[ \t](?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*(?:(?:(?: {0,3}|\t)\d+\.[ \t]|(?: {4}|\t))(?:[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))*(?:[ \t]*\n)*)*)+/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "ordered-list",
            children: extractGroupContent(match, regex, true, false)
                .split(/^(?: {0,3}|\t)\d+\.(?: {0,3}|\t)/gm)
                .slice(1)
                .map((t) => ({
                    name: "list-item",
                    children: parse(trimLastLineBreak(t.replace(/^(?: {4}|\t)/gm, "")), {
                        rules: RECURSIVE_RULES,
                        context: () => ctx,
                    }).children,
                    unbreakable: true,
                })),
            unbreakable: true,
        },
        text: "",
    }),
};

const CODE: MarkRule<DaringFireballMark, Context> = {
    pattern: /(^|\u001E)((?:(?: {4}|\t)[^\n\u001D\u001E]*[^\s\u001D\u001E][^\n\u001D\u001E]*(?:\n|$))(?:^(?: {4}|\t)[^\n\u001D\u001E]+(?:\n|$)|(?:^[ \t]*(?:\n|$)))*)/m,
    process: (match, regex) => ({
        mark: {
            name: "code-block",
            content: extractGroupContent(match, regex, true, false).replace(/^(?: {4}|\t)/gm, ""),
        },
        text: "",
    }),
};

const PARAGRAPH: MarkRule<DaringFireballMark, Context> = {
    pattern: /(^|\u001E)(?:[ \t]*\n)*([^\u001D\u001E]+?)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "paragraph",
            children: parse(extractGroupContent(match, regex, true, false), { rules: INLINE_RULES, context: () => ctx })
                .children,
            unbreakable: true,
        } as HtmlTagMark,
        text: "",
    }),
};

// We should capture \n at the end to avoid paragraph around header
const HEADER_UNDERLINE: MarkRule<DaringFireballMark, Context> = {
    pattern: /(^|\u001E)([^\s\u001D\u001E][^\n\u001D\u001E]*?)\n(=+|-+)(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "header",
            content: match[3].startsWith("=") ? "1" : "2",
            children: parse(extractGroupContent(match, regex, true, false), { rules: INLINE_RULES, context: () => ctx })
                .children,
            unbreakable: true,
        } as HeaderMark,
        text: "",
    }),
};

// We should capture \n at the end to avoid paragraph around header
const HEADER_SHARP: MarkRule<DaringFireballMark, Context> = {
    pattern: /(^|\u001E\n)(#{1,6})[ \t]+([^\s\u001D\u001E][^\n\u001D\u001E]*?)(?:[ \t]+#+)?(?:\n[ \t]*)+(?:\n|$)/m,
    process: (match, regex, ctx) => ({
        mark: {
            name: "header",
            content: "" + extractGroupContent(match, regex, true, false).length,
            children: parse(match[3], { rules: INLINE_RULES, context: () => ctx }).children,
            unbreakable: true,
        } as HeaderMark,
        text: "",
    }),
};

const HORIZONTAL_RULE: MarkRule<DaringFireballMark, Context> = {
    pattern: /^(?:(?:[ \t]*\*+){3,}|(?:[ \t]*-+){3,}|(?:[ \t]*_+){3,})(?:\n[ \t]*)*(?:\n|$)/m,
    process: () => ({ mark: { name: "horizontal-rule" }, text: "" }),
};

const LINE_BREAK: MarkRule<DaringFireballMark, Context> = {
    pattern: /\s\s+\n/m,
    process: () => ({ mark: { name: "line-break" }, text: "" }),
};

const LINK_INLINE: MarkRule<DaringFireballMark, Context> = {
    pattern: /\[(.*?)\]\s*\(([^\s\u001D\u001E]+?)(?:\s+"([^"\u001D\u001E]*)")?\s*\)/m,
    process: (match) => ({
        mark: {
            name: "link",
            content: match[2],
            title: match[3],
            children: [],
        } as LinkMark,
        text: match[1],
    }),
};

const LINK_REFERENCE: MarkRule<DaringFireballMark, Context> = {
    pattern: /(\[([^\]]*)\]\s?\[([.,/#!$%^&*;:{}=\-_`~()\w ]*)\])/m,
    process: (match, _regex, ctx) => {
        const definition = ctx.links[(match[3] || match[2]).toLowerCase()];
        return definition
            ? {
                  mark: { name: "link", ...definition, children: [] } as LinkMark,
                  text: match[2],
              }
            : {
                  mark: null,
                  text: match[1],
              };
    },
};

const LINK_DEFENITION: MarkRule<DaringFireballMark, Context> = {
    pattern: /\[([.,/#!$%^&*;:{}=\-_`~()\w ]+)\]:\s*<?([^<>\s\u001D\u001E]+)>?(?:\s+(["'])([^\u001D\u001E]*?)\3|\s+\(([^)\u001D\u001E]*)\))?/m,
    process: (match, _regex, ctx) => {
        ctx.links[match[1].toLowerCase()] = {
            content: match[2],
            title: match[4] || match[5],
        };
        return { mark: null, text: "" };
    },
};

const STRONG: MarkRule<DaringFireballMark, Context> = {
    pattern: /([_*]{2})(.+?)\1/m,
    process: (match) => ({
        mark: {
            name: "strong",
            children: [],
        },
        text: match[2],
    }),
};

const EMPHASIS: MarkRule<DaringFireballMark, Context> = {
    pattern: /([_*])(.+?)\1/m,
    process: (match) => ({
        mark: {
            name: "emphasis",
            children: [],
        },
        text: match[2],
    }),
};

const HTML_ESCAPE: MarkRule<DaringFireballMark, Context> = {
    pattern: /&(?:(?:#)(\d+)|(?:#[xX])([\da-fA-F]+)|(\w+));/,
    process: (match) => ({
        mark: {
            name: "escaped",
            content: match[1]
                ? String.fromCodePoint(parseInt(match[1], 10))
                : match[2]
                ? String.fromCodePoint(parseInt(match[2], 16))
                : HTML_ENTITY_LOOKUP[match[3]],
        },
        text: "",
    }),
};

const BACKSLASH_ESCAPE: MarkRule<DaringFireballMark, Context> = {
    pattern: /(?:\\([\\`*_{}[\]()#+-.!])|( [*_] ))/,
    process: (match) => ({
        mark: {
            name: "escaped",
            content: match[1] || match[2],
        },
        text: "",
    }),
};

const BLOCK_RULES = [
    QUOTE, // should be before first
    HTML_BLOCK, // should be before all, but QUOTE
    LINK_DEFENITION,
    HEADER_UNDERLINE, // should be before HORIZONTAL_RULE
    HEADER_SHARP,
    HORIZONTAL_RULE, // should be before BULLET_LIST
    BULLET_LIST,
    ORDERED_LIST,
    CODE,
    PARAGRAPH,
];

const INLINE_RULES = [
    BACKSLASH_ESCAPE,
    LINE_BREAK,
    HTML_TAG,
    HTML_SINGLETON_TAG,
    LINK_INLINE,
    LINK_REFERENCE,
    STRONG,
    EMPHASIS,
    HTML_ESCAPE,
];

const RECURSIVE_RULES = [...BLOCK_RULES, ...INLINE_RULES];

const DARING_FIREBALL_RULES = [...BLOCK_RULES, ...INLINE_RULES];

export const DARING_FIREBALL = {
    rules: DARING_FIREBALL_RULES,
    context: (): Context => ({
        links: {},
    }),
};
