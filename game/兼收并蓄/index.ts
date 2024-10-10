import { Plugin } from "../../src/types";

export default {
    name: '兼收并蓄',
    pid: '兼收并蓄',
    description: {
        before_solve: {
            content: `「我做完了。不过……这和抓三条狗之间好像没什么关系吧？」

「你要是想干有关系的活，智能车、周行、天枢那边都有你能帮上忙的地方。」

「……」感觉他好像是在劝退，但是你已经打定主意要跟着他找活干，怎能就此放弃呢！

「你要是还想接着干就别废话，来，编写一个程序，其源代码可以同时作为 c 语言和 python 语言运行，输出为 \`Hello World!\`」`
        },
    },
    points: 50,
    next: [
        {
            pid: '殊途同归'
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
                    "name": "main.py",
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
        ctx.msg('[C]')
        if (res2.error) {
            ctx.msg(res2.error);
        }
        if (res2.code) return false
        ctx.msg(res2.stdout);
        if (res2.stdout.trim() !== "Hello World!") {
            return false
        }

        return true
    }
} as Plugin<true>