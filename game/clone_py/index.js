module.exports = {
    name: 'clone py',
    pid: 'clone_py',
    description: {
        before_solve: {
            content: "编写一个 Python 程序，其输出为该程序的源代码。",
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
        if (res.stderr) {
            ctx.msg(res.error + "\n");
        }
        ctx.msg(res.stdout)
        return ans.trim() === res.stdout.trim()
    }
}
