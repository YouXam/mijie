export default {
    name: '兼收并蓄',
    pid: 'mask',
    description: {
        before_solve: {
            content: "编写一个程序，其源代码可以同时作为c语言和python语言运行，输出 `Hello World!`",
        },
    },
    points: 10,
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }
        const res = await ctx.glot("python", {
            "files": [
                {
                    "name": "main.py",
                    "content": ans
                }
            ]
        })
        console.log(res)
        if (res.error) {
            ctx.msg(res.error + "\n");
        }
        if (res.code) return false
        ctx.msg("[Python]\n" + res.stdout);
        if (res.stdout.trim() !== "Hello World!") {
            return false
        }

        const res2 = await ctx.glot("c", {
            "files": [
                {
                    "name": "main.c",
                    "content": ans
                }
            ]
        })
        console.log(res2)
        if (res2.error) {
            ctx.msg(res2.error + "\n");
        }
        if (res2.code) return false
        ctx.msg("[C]\n" + res2.stdout);
        if (res2.stdout.trim() !== "Hello World!") {
            return false
        }

        return true
    }
}
