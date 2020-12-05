import { parse, DARING_FIREBALL_RULES } from "."

test("HTML symbol with decimal code.", () => {
    // Execute
    const result = parse("Winking: &#128521;", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'Winking: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(128521),
    }])
})

test("HTML symbol with &#x hex code.", () => {
    // Execute
    const result = parse("Smirking: &#x1F60F;", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'Smirking: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(0x1F60F),
    }])
})

test("HTML symbol with &#X hex code.", () => {
    // Execute
    const result = parse("Grinning: &#X1F600;", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'Grinning: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(0x1F600),
    }])
})

test("HTML symbol with named code.", () => {
    // Execute
    const result = parse("Empty: &emptyset;", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'Empty: '
    }, {
        name: 'escaped',
        content: String.fromCodePoint(8709),
    }])
})

test("HTML symbol standalone.", () => {
    // Execute
    const result = parse("&copy;", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'escaped',
        content: "©",
    }])
})

test("HTML symbol inside word.", () => {
    // Execute
    const result = parse("http://images.google.com/images?num=30&amp;q=larry+bird", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: 'http://images.google.com/images?num=30'
    }, {
        name: 'escaped',
        content: "&",
    }, {
        name: 'text',
        content: 'q=larry+bird'
    }])
})

test("HTML symbol not escaped 1.", () => {
    // Execute
    const result = parse("AT&T", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "AT&T",
    }])
})

test("HTML symbol not escaped 2.", () => {
    // Execute
    const result = parse("4 < 5", DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "4 < 5",
    }])
})
