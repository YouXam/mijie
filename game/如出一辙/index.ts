import { Plugin } from "../../src/types";

export default {
    name: '如出一辙',
    pid: '如出一辙',
    description: {
        before_solve: {
            content: `嗯？你怎么又来了？」YouXam 看到你过来了，马上又把电脑合起来。

「感觉没什么事，想看看有什么我能做的。」

「智能车、周行、天枢那边都有你能帮上忙的地方。」

「感觉……没什么意思，我想来点有挑战性的工作……」

「想要挑战性的工作？那你把这个做一下吧：编写一个 C 语言或者 Python 程序，输出为该程序的源代码。」

---

1. 在第一个输入框中输入语言：\`c\` 或 \`python\`
2. 将对应语言的程序粘贴到第二个输入框中，如果该程序的输出和你输入的程序源代码一致，则通过本题。
`
        },
    },
    points: 10,
    inputs: [
        { name: '语言', placeholder: 'c / python' },
        { name: '程序', placeholder: '程序源代码' },
    ],
    next: [
        { pid: "兼收并蓄" }
    ],
    checker: async (ans, ctx) => {
        const code = ans.程序
        if (!code || !code?.trim()) {
            ctx.msg("未输入代码")
            return false
        }
        if (ans.语言 === 'c') {
            const res = await ctx.glot("c", {"command": "clang main.c -o a && rm main.c && ./a", "files": [{"name": "main.c", "content": code}]})
            if (res.code) {
                ctx.msg("Error: " + res.error);
            }
            ctx.msg(res.stdout)
            return code.trim() === res.stdout.trim()
        } else if (ans.语言 === 'python') {
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
                        "content": code
                    }
                ]
            })
            if (res.stderr) {
                ctx.msg(res.error);
            }
            ctx.msg(res.stdout)
            return code.trim() === res.stdout.trim()
        } else {
            ctx.msg("语言只能是 c 或 python")
            return false
        }
    }
} as Plugin<[
    '语言',
    '程序'
]>