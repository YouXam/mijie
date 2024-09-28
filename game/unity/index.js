export default {
    name: '殊途同归',
    pid: 'unity',
    description: {
        before_solve: {
            content: "编写一个程序，其源代码可以同时作为c语言和python语言运行，输出为该程序的源代码，要求长度在 400 个字符以内。",
        },
    },
    points: 10,
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }
        if (ans.length > 400) {
            ctx.msg("代码长度超过 400 字符")
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
        if (res.error) {
            ctx.msg(res.error + "\n");
        }
        if (res.code) return false
        ctx.msg("[Python]\n" + res.stdout + '\n');
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
        if (res2.error) {
            ctx.msg(res2.error + "\n");
        }
        if (res2.code) return false
        ctx.msg("[C]\n" + res2.stdout);
        if (res2.stdout.trim() !== ans.trim()) {
            return false
        }

        return true
    }
}
