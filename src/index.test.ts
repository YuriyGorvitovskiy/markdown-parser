import { Mark, MarkRule, parse } from "."

type TEST = 'a' | 'b'

// Rule1 - rule processed first, rule boundaies {x} should be converted to tags <a>x</a>
const RULE_1: MarkRule<TEST> = {
    name: 'a',
    pattern: /\{(.+?)\}/,
}

// Rule2 - rule processed second, rule boundaies [x] should be converted to tags <b>x</b>
const RULE_2: MarkRule<TEST> = {
    name: 'b',
    pattern: /\[(.+?)\]/,
}

const TEST_RULES = [RULE_1, RULE_2]

const dump = (mark: Mark<TEST>): string => {
    switch (mark.name) {
        case 'a': return "<a>" + mark?.children.map(m => dump(m)).join("") + "</a>";
        case 'b': return "<b>" + mark?.children.map(m => dump(m)).join("") + "</b>";
        case 'root': return mark?.children.map(m => dump(m)).join("");
        case 'text': return mark.content;
    }
}

test("[x{y}z] => <b>x<a>y</a>z</b>", () => {
    // Execute
    const result = parse("[x{y}z]", TEST_RULES)

    // Verify
    expect(dump(result)).toEqual("<b>x<a>y</a>z</b>");
})

test("{x[y]z} => <a>x<b>y</b>z</a>", () => {
    // Execute
    const result = parse("{x[y]z}", TEST_RULES)

    // Verify
    expect(dump(result)).toEqual("<a>x<b>y</b>z</a>");
})

test("{x[y}z] => <a>x<b>y</b></a><b>z</b>", () => {
    // Execute
    const result = parse("{x[y}z]", TEST_RULES)

    // Verify
    expect(dump(result)).toEqual("<a>x<b>y</b></a><b>z</b>");
})

test("[x{y]z} => <b>x<a>y</a></b><a>z</a>", () => {
    // Execute
    const result = parse("[x{y]z}", TEST_RULES)

    // Verify
    expect(dump(result)).toEqual("<b>x<a>y</a></b><a>z</a>");
}) 