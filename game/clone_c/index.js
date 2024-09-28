export default {
    name: 'clone c',
    pid: 'clone_c',
    description: {
        before_solve: {
            content: "编写一个 C 语言程序，其输出为该程序的源代码。",
        },
    },
    points: 10,
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }
        const res = await ctx.glot("c", {"command": "clang main.c -o a && rm main.c && ./a", "files": [{"name": "main.c", "content": ans}]})
        if (res.code) {
            ctx.msg("Error: " + res.error);
        }
        ctx.msg(res.stdout)
        return ans.trim() === res.stdout.trim()
    }
}
