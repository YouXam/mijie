export default {
    name: '殊途同归',
    pid: '殊途同归',
    description: {
        before_solve: {
            content: `「你完成得挺好。」YouXam 看了看你的代码，点了点头。

你趁他心情好，再次鼓起勇气提问：「我们做这个的目的是什么？」

「保密。」

「接下来我打算把这两个功能结合起来：编写一个程序，其源代码可以同时作为c语言和python语言运行，输出为该程序的源代码。」`
        },
    },
    points: 10,
    next: [
        {
            pid: "世外高人"
        }
    ],
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }
        const res = await ctx.glot("python", {
            "files": [
                {
                    "name": "run.py",
                    "content": `import os
with open("code.py", "r") as f:
    code = f.read()
os.remove("code.py")
process = os.popen('python', 'w')
process.write(code)
process.close()`
                },
                {
                    "name": "code.py",
                    "content": ans
                }
            ]
        })
        ctx.msg('[Python]')
        if (res.error) {
            ctx.msg(res.error);
        }
        if (res.code) return false
        ctx.msg(res.stdout);
        if (res.stdout.trim() !== ans.trim()) {
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
        ctx.msg('[C]')
        if (res2.error) {
            ctx.msg(res2.error);
        }
        if (res2.code) return false
        ctx.msg(res2.stdout);
        if (res2.stdout.trim() !== ans.trim()) {
            return false
        }

        return true
    }
}
