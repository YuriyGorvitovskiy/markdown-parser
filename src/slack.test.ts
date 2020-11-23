import * as MP from ".";

// Test sets comes from https://github.com/rutan/slack_markdown/tree/master/spec/slack_markdown
test("Slack code-block parser.", () => {
    // Execute
    const result1 = MP.parse("```\ndef hoge\n  1 + 1\nend\n```", MP.SLACK_RULES)
    const result2 = MP.parse("```\ndef hoge\n  1 + 1\nend\n``` fuga ```\ndef piyo\n  1 * 1\nend\n```", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.CODE_BLOCK,
        content: "def hoge\n  1 + 1\nend\n",
    }])

    expect(result2.children).toMatchObject([{
        type: MP.CODE_BLOCK,
        content: "def hoge\n  1 + 1\nend\n",
    }, {
        type: MP.TEXT,
        content: " fuga ",
    }, {
        type: MP.CODE_BLOCK,
        content: "def piyo\n  1 * 1\nend\n",
    }])
})

test("Slack code-inline parser.", () => {
    // Execute
    const result1 = MP.parse("`hoge`", MP.SLACK_RULES)
    const result2 = MP.parse("`hoge` fuga `piyo`", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.CODE_INLINE,
        content: "hoge",
    }])
    expect(result2.children).toMatchObject([{
        type: MP.CODE_INLINE,
        content: "hoge",
    }, {
        type: MP.TEXT,
        content: " fuga ",
    }, {
        type: MP.CODE_INLINE,
        content: "piyo",
    }])
})

test("Slack link parser.", () => {
    // Execute
    const result = MP.parse("123 <!456> 789", MP.SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        type: MP.TEXT,
        content: "123 ",
    }, {
        type: MP.LINK,
        content: "!456",
    }, {
        type: MP.TEXT,
        content: " 789",
    }])
})

test("Slack emoji parser.", () => {
    // Execute
    const result = MP.parse("123:smile-456:789", MP.SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        type: MP.TEXT,
        content: "123",
    }, {
        type: MP.EMOJI,
        content: "smile-456",
    }, {
        type: MP.TEXT,
        content: "789",
    }])
})

test("Slack quote parser.", () => {
    // Execute
    const result1 = MP.parse("> 123", MP.SLACK_RULES)
    const result2 = MP.parse("> 123\n> 456", MP.SLACK_RULES)
    const result3 = MP.parse("> 123\n>456\n789\n> ABC", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "123",
        }]
    }])
    expect(result2.children).toMatchObject([{
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "123",
        }]
    }, {
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "456",
        }]
    }])
    expect(result3.children).toMatchObject([{
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "123",
        }]
    }, {
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "456",
        }]
    }, {
        type: MP.TEXT,
        content: "789",
    }, {
        type: MP.LINE_BREAK,
        content: "\n",
    }, {
        type: MP.QUOTE,
        children: [{
            type: MP.TEXT,
            content: "ABC",
        }]
    }])
})

test("Slack bold parser.", () => {
    // Execute
    const result1 = MP.parse("*hoge*", MP.SLACK_RULES)
    const result2 = MP.parse("hoge*fuga*poyo", MP.SLACK_RULES)
    const result3 = MP.parse("hoge *fuga* poyo", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.BOLD,
        children: [{
            type: MP.TEXT,
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge*fuga*poyo",
    }])

    expect(result3.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge ",
    }, {
        type: MP.BOLD,
        children: [{
            type: MP.TEXT,
            content: "fuga",
        }]
    }, {
        type: MP.TEXT,
        content: " poyo",
    }])
})

test("Slack italic parser.", () => {
    // Execute
    const result1 = MP.parse("_hoge_", MP.SLACK_RULES)
    const result2 = MP.parse("hoge_fuga_poyo", MP.SLACK_RULES)
    const result3 = MP.parse("hoge _fuga_ poyo", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.ITALIC,
        children: [{
            type: MP.TEXT,
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge_fuga_poyo",
    }])

    expect(result3.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge ",
    }, {
        type: MP.ITALIC,
        children: [{
            type: MP.TEXT,
            content: "fuga",
        }]
    }, {
        type: MP.TEXT,
        content: " poyo",
    }])
})

test("Slack strike parser.", () => {
    // Execute
    const result1 = MP.parse("~hoge~", MP.SLACK_RULES)
    const result2 = MP.parse("hoge~fuga~poyo", MP.SLACK_RULES)
    const result3 = MP.parse("hoge ~fuga~ poyo", MP.SLACK_RULES)

    // Verify
    expect(result1.children).toMatchObject([{
        type: MP.STRIKE,
        children: [{
            type: MP.TEXT,
            content: "hoge",
        }]
    }])

    expect(result2.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge~fuga~poyo",
    }])

    expect(result3.children).toMatchObject([{
        type: MP.TEXT,
        content: "hoge ",
    }, {
        type: MP.STRIKE,
        children: [{
            type: MP.TEXT,
            content: "fuga",
        }]
    }, {
        type: MP.TEXT,
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
<img class=\"emoji\" title=\":ru_shalm:\" alt=\":ru_shalm:\" src=\"http://toripota.com/img/ru_shalm.png\" height=\"20\" width=\"20\" align=\"absmiddle\"> is <a href=\"http://localhost/?url=http%3A%2F%2Ftoripota.com%2Fimg%2Fru_shalm.png\" class=\"link\">http://toripota.com/img/ru_shalm.png</a><br>
</blockquote>"
*/

test("Slack parser", () => {
    // Setup
    const markdown = "<@U12345> <@U23456> *SlackMarkdown* is `text formatter` _gem_ .\n" +
        "> :ru_shalm: is <http://toripota.com/img/ru_shalm.png>"

    // Execute
    const result = MP.parse(markdown, MP.SLACK_RULES)

    // Verify
    expect(result.children).toMatchObject([{
        type: MP.LINK,
        content: "@U12345",
    }, {
        type: MP.TEXT,
        content: " ",
    }, {
        type: MP.LINK,
        content: "@U23456",
    }, {
        type: MP.TEXT,
        content: " ",
    }, {
        type: MP.BOLD,
        children: [{
            type: MP.TEXT,
            content: "SlackMarkdown",
        }],
    }, {
        type: MP.TEXT,
        content: " is ",
    }, {
        type: MP.CODE_INLINE,
        content: "text formatter",
    }, {
        type: MP.TEXT,
        content: " ",
    }, {
        type: MP.ITALIC,
        children: [{
            type: MP.TEXT,
            content: "gem",
        }],
    }, {
        type: MP.TEXT,
        content: " .",
    }, {
        type: MP.LINE_BREAK,
        content: "\n",
    }, {
        type: MP.QUOTE,
        children: [{
            type: MP.EMOJI,
            content: "ru_shalm",
        }, {
            type: MP.TEXT,
            content: " is ",
        }, {
            type: MP.LINK,
            content: "http://toripota.com/img/ru_shalm.png",
        }]
    },])
})
