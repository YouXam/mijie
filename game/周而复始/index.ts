import { Plugin } from "../../src/types";

export default {
    name: '周而复始',
    pid: '周而复始',
    description: {
        before_solve: {
            content: `「我们现在已经有把握对付这三条狗了。但是为了增加我们的胜算，我们还可以继续加强现在的规则。」

「怎么加强？」虽然你仍不明白 YouXam 到底有什么办法，但是你觉得他应该不会骗你。

「编写一个 c 语言程序 *A*，运行后输出 c 语言程序 *B*，运行后输出 c 语言程序 *C*，运行后输出最开始的 c 语言程序 *A* 的源代码。」

「另外还有一个附加条件：要求 *A*, *B*, *C* 三个文件通过 gzip 压缩后的文件大小大于 *A* 文件通过 gzip 压缩后的文件大小的 2 倍。」`
        }
    },
    points: 300,
    next: [
        {
            pid: "通风报信"
        }
    ],
    checker: async (ans, ctx) => {
        if (!ans || !ans?.trim()) {
            ctx.msg("未输入任何内容")
            return false
        }

        const resA = await ctx.glot("c", {
            "files": [
                {
                    "name": "main.c",
                    "content": ans
                }
            ]
        })
        ctx.msg('[A]')
        if (resA.error) {
            ctx.msg(resA.error);
        }
        if (resA.code) return false

        ctx.msg(resA.stdout);
        
        const resB = await ctx.glot("c", {
            "files": [
                {
                    "name": "main.c",
                    "content": resA.stdout
                }
            ]
        })
        ctx.msg('[B]')
        if (resB.error) {
            ctx.msg(resB.error);
        }
        if (resB.code) return false

        ctx.msg(resB.stdout);

        const resC = await ctx.glot("c", {
            "files": [
                {
                    "name": "main.c",
                    "content": resB.stdout
                }
            ]
        })
        ctx.msg('[C]')
        if (resC.error) {
            ctx.msg(resC.error);
        }
        if (resC.code) return false

        ctx.msg(resC.stdout);

        if (resC.stdout.trim() !== ans.trim()) {
            ctx.msg("C 的输出与 A 的源代码不一致")
            return false
        }

        const lenABC = Bun.gzipSync(ans + resA.stdout + resB.stdout).length;
        const lenA = Bun.gzipSync(ans).length;

        ctx.msg(`gzip(A + B + C) = ${lenABC}, gzip(A) = ${lenA}`)

        if (lenABC <= 2 * lenA) {
            ctx.msg("三个文件相似度过高")
            return false
        }

        return true
    }
} as Plugin<true>