

export default {
    name: '世外高人',
    pid: '世外高人',
    description: {
        before_solve: {
            content: `YouXam 眉头紧锁，看起来遇到了相当大的困难。「你来得正好，我正要找你呢。我需要你去趟本部，找一个人……」

---

「来者何人？」整个房间黑漆漆的，此人背对着你，你完全看不清他的长相。当你说明来意后，他背着手接过了 YouXam 的密信。

「哈哈哈哈……」他发出一阵意味深长的笑，然后提笔写了起来。「拿着，就让我来助你们一臂之力。」

纸上只有一行字：「编写一个 c 程序 *A*，运行后的输出是一个 python 程序 *B*，再运行，输出最开始的 c 程序 *A* 的源代码，这两个程序的源代码不能相同。」`
        },
        after_solve: {
            content: `你把神秘人给你的谜题连同你的答案一同交给 YouXam。

YouXam 接过来沉思良久。「原来如此！这样我就有办法对付牠们了！」

你不明所以地看着他。有那么一瞬间你甚至怀疑他吃错药了。`
        }
    },
    points: 200,
    next: [
        {
            pid: "周而复始"
        },
    ],
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }

        const res2 = await ctx.glot("c", {
            "command": "clang main.c -o main && rm main.c && ./main",
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
        if (res2.stdout.trim() === ans.trim()) {
            ctx.msg("两个程序的源代码不能相同");
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
                    "content": res2.stdout
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

        return true
    }
}
