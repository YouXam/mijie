import { Plugin } from "../../src/types";

export default {
    name: '再世伏羲',
    pid: '再世伏羲',
    description: {
        before_solve: {
            md: "problem.md"
        },
        after_solve: {
            content: `Midoria7 听到你的回答之后，愉快地转着手中的笔。

「不错不错，等我再加几卦，一定要阿拉斯加好看！」

然后他就继续忘我地在本子上写写画画。

你突然觉得背后一凉，但是转过头来，却什么也没有发现。`
        }
    },
    points: 80,
    inputs: [
        {
            name: 'code',
            placeholder: 'Python 代码'
        }
    ],
    next: [
        {
            pid: "进无止境"
        }
    ],
    async checker(ans, ctx) {
        const res = await ctx.glot('python', {
            command: "echo 10 | python3 main.py; echo 1145141919810 | python3 main.py; echo 1000000000000000 | python3 main.py",
            files: [
                {
                    name: "main.py",
                    content: ans.code
                }
            ]
        })
        const lines = res.stdout.trim().split('\n').map((x: string) => x.trim()).join('\n')
        return lines === '107195610\n921401632\n227708814'
    }
} as Plugin<[
    'code',
]>;
