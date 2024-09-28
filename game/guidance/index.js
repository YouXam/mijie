export default {
    name: '仙人指路',
    pid: 'guidance',
    description: {
        before_solve: {
            content: "编写一个 C 语言程序 A，运行后其输出是一个 Python 程序 B，再运行，输出最开始的 C 语言程序 A 的源代码。",
        },
    },
    points: 10,
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
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
                    "content": res2.stdout
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

        return true
    }
}
