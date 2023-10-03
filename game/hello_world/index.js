module.exports = {
    name: 'hello world', // 显示的名称
    slug: "hello-world", // 用于标识题目的唯一字符串，不可重复，只能包含字母、数字、下划线和连字符
    description: 'Answer is "hello world"',
    checker: "hello world",
    first: true,
    next: [
        {
            slug: "a-plus-b-problem",
            description: "可能是一个简单的计算题？" // 这里的描述只会在当前题目被解决后，选择下一题时显示
        },
        {
            slug: "random",
            description: "看看你的运气如何？"
        }
    ]
}