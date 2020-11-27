import { parse, SLACK_RULES } from "."

// Test sets comes from https://github.com/rutan/slack_markdown/tree/master/spec/slack_markdown
test("Slack code-block parser.", () => {
    // Execute
    const result1 = parse("```\ndef hoge\n  1 + 1\nend\n```", SLACK_RULES)
    const result2 = parse("```\ndef hoge\n  1 + 1\nend\n``` fuga ```\ndef piyo\n  1 * 1\nend\n```", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'code-block',
        content: "def hoge\n  1 + 1\nend\n",
    }])

    expect(result2.children).toMatchObject([{
        name: 'code-block',
        content: "def hoge\n  1 + 1\nend\n",
    }, {
        name: 'text',
        content: " fuga ",
    }, {
        name: 'code-block',
        content: "def piyo\n  1 * 1\nend\n",
    }])
})

test("Slack code-inline parser.", () => {
    // Execute
    const result1 = parse("`hoge`", SLACK_RULES)
    const result2 = parse("`hoge` fuga `piyo`", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'code-inline',
        content: "hoge",
    }])
    expect(result2.children).toMatchObject([{
        name: 'code-inline',
        content: "hoge",
    }, {
        name: 'text',
        content: " fuga ",
    }, {
        name: 'code-inline',
        content: "piyo",
    }])
})

test("Slack link parser.", () => {
    // Execute
    const result = parse("123 <!456> 789", SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "123 ",
    }, {
        name: 'link',
        content: "!456",
    }, {
        name: 'text',
        content: " 789",
    }])
})

test("Slack link with text parser.", () => {
    // Execute
    const result = parse("123 <!4|56> 789", SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "123 ",
    }, {
        name: 'link',
        content: "!4",
        children: [{
            name: 'text',
            content: "56",
        }]
    }, {
        name: 'text',
        content: " 789",
    }])
})

test("Slack emoji parser.", () => {
    // Execute
    const result = parse("123:smile-456:789", SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'text',
        content: "123",
    }, {
        name: 'emoji',
        content: "smile-456",
    }, {
        name: 'text',
        content: "789",
    }])
})

test("Slack 'quote' parser.", () => {
    // Execute
    const result1 = parse("> 123", SLACK_RULES)
    const result2 = parse("> 123\n> 456", SLACK_RULES)
    const result3 = parse("> 123\n>456\n789\n> ABC", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'text',
            content: "123",
        }]
    }])
    expect(result2.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'text',
            content: "123",
        }, {
            name: 'line-break'
        }, {
            name: 'text',
            content: "456",
        }]
    }])
    expect(result3.children).toMatchObject([{
        name: 'quote',
        children: [{
            name: 'text',
            content: "123",
        }, {
            name: 'line-break'
        }, {
            name: 'text',
            content: "456",
        }, {
            name: 'line-break'
        }]
    }, {
        name: 'text',
        content: "789",
    }, {
        name: 'line-break',
    }, {
        name: 'quote',
        children: [{
            name: 'text',
            content: "ABC",
        }]
    }])
})

test("Slack bold parser.", () => {
    // Execute
    const result1 = parse("*hoge*", SLACK_RULES)
    const result2 = parse("hoge*fuga*poyo", SLACK_RULES)
    const result3 = parse("hoge *fuga* poyo", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'bold',
        children: [{
            name: 'text',
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        name: 'text',
        content: "hoge*fuga*poyo",
    }])

    expect(result3.children).toMatchObject([{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'bold',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }])
})

test("Slack italic parser.", () => {
    // Execute
    const result1 = parse("_hoge_", SLACK_RULES)
    const result2 = parse("hoge_fuga_poyo", SLACK_RULES)
    const result3 = parse("hoge _fuga_ poyo", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'italic',
        children: [{
            name: 'text',
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        name: 'text',
        content: "hoge_fuga_poyo",
    }])

    expect(result3.children).toMatchObject([{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'italic',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }])
})

test("Slack strike parser.", () => {
    // Execute
    const result1 = parse("~hoge~", SLACK_RULES)
    const result2 = parse("hoge~fuga~poyo", SLACK_RULES)
    const result3 = parse("hoge ~fuga~ poyo", SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        name: 'strike',
        children: [{
            name: 'text',
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        name: 'text',
        content: "hoge~fuga~poyo",
    }])

    expect(result3.children).toMatchObject([{
        name: 'text',
        content: "hoge ",
    }, {
        name: 'strike',
        children: [{
            name: 'text',
            content: "fuga",
        }]
    }, {
        name: 'text',
        content: " poyo",
    }])
})

/*
Source: https://github.com/rutan/slack_markdown/blob/master/spec/slack_markdown/processor_spec.rb

Text:
<@U12345> <@U23456> *SlackMarkdown* is `text formatter` _gem_ .
> :ru_shalm: is <http://toripota.com/img/ru_shalm.png>

HTML
"<a href=\"/@ru_shalm\" class=\"mention\">@ru_shalm</a> @U23456 <b>SlackMarkdown</b> is <code>text formatter</code> <i>gem</i> .<br><blockquote>
<img class=\"emoji\" title=\":ru_shalm:\" alt=\":ru_shalm:\" src=\"http://toripota.com/img/ru_shalm.png\" height=\"20\" width=\"20\" align=\"absmiddle\"> ~is~ <a href=\"http://localhost/?url=http%3A%2F%2Ftoripota.com%2Fimg%2Fru_shalm.png\" class=\"link\">http://toripota.com/img/ru_shalm.png</a><br>
</blockquote>"
*/

test("Slack parser", () => {
    // Setup
    const markdown = "<@U12345> <@U23456> *SlackMarkdown* is `text formatter` _gem_ .\n" +
        "> :ru_shalm: ~is~ <http://toripota.com/img/ru_shalm.png|`Code💬`*Foxy* girl>"

    // Execute
    const result = parse(markdown, SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        name: 'link',
        content: "@U12345",
    }, {
        name: 'text',
        content: " ",
    }, {
        name: 'link',
        content: "@U23456",
    }, {
        name: 'text',
        content: " ",
    }, {
        name: 'bold',
        children: [{
            name: 'text',
            content: "SlackMarkdown",
        }],
    }, {
        name: 'text',
        content: " is ",
    }, {
        name: 'code-inline',
        content: "text formatter",
    }, {
        name: 'text',
        content: " ",
    }, {
        name: 'italic',
        children: [{
            name: 'text',
            content: "gem",
        }],
    }, {
        name: 'text',
        content: " .",
    }, {
        name: 'line-break',
    }, {
        name: 'quote',
        children: [{
            name: 'emoji',
            content: "ru_shalm",
        }, {
            name: 'text',
            content: " ",
        }, {
            name: 'strike',
            children: [{
                name: 'text',
                content: "is",
            }],
        }, {
            name: 'text',
            content: " ",
        }, {
            name: 'link',
            content: "http://toripota.com/img/ru_shalm.png",
            children: [{
                name: 'code-inline',
                content: "Code💬",
            }, {
                name: 'bold',
                children: [{
                    name: 'text',
                    content: "Foxy",
                }],
            }, {
                name: 'text',
                content: " girl",
            }]
        }]
    },])
})
