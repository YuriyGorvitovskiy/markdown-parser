import { parse, DARING_FIREBALL_RULES } from "."

test("Horizontal rules", () => {
    // Setup
    const source = `* * *

    ***
    
    *****
    
    - - -
    
    ---------------------------------------`

    // Execute
    const result = parse(source, DARING_FIREBALL_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'horizontal-rule',
    }, {
        name: 'horizontal-rule',
    }, {
        name: 'horizontal-rule',
    }, {
        name: 'horizontal-rule',
    }, {
        name: 'horizontal-rule',
    }])
})
