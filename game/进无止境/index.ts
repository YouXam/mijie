import { Plugin } from "../../src/types";

export default {
    name: '进无止境',
    pid: '进无止境',
    description: {
        before_solve: {
            md: "problem.md"
        },
        after_solve: {
            content: `「哈哈哈哈，阿拉斯加，我要你死无葬身之地！」Midoria7 放声狂笑。

一把椅子猝不及防地飞过来，但被他灵活地躲开了。椅子飞到了后面的杂物堆中，杂物堆发出了「嗷——」的一声惨叫。

潜伏者知道自己藏不住了，便从杂物堆中蹿出来。「是萨摩耶！快抓住牠！」

可是萨摩耶实在太敏捷了，大家根本抓不住！牠跳上 Midoria7 的办公桌，衔起他的推演结果就溜走了！`
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
            pid: "亡羊补牢"
        }
    ],
    async checker(ans, ctx) {
        const res = await ctx.glot('python', {
            command: [
                '1 3 4',
                '2 3 1',
                '2 4 10',
                '5000000000 10000000000 23974950',
                '1 3 2'
            ].map(x => `echo ${x} | python3 main.py`).join('; '),
            files: [
                {
                    name: "main.py",
                    content: ans.code
                }
            ]
        })
        const lines = res.stdout.trim().split('\n').map((x: string) => x.trim()).join('\n')
        return lines === [
            '2',
            '-1',
            '-1',
            '5023974950',
            '4'
        ].join('\n')
    }
} as Plugin<[
    'code',
]>;
