import { Plugin } from "../../src/types";


export default {
    name: '通风报信',
    pid: '通风报信',
    description: {
        before_solve: {
            content: `就在你们做好了充分的准备，打算抓哈士奇的时候，你突然得到了一个噩耗：

有一只发情的野猫啃坏了校内的网线，导致三个社团之间的通讯中断了！

为了保持各个社团之间的相互沟通，你需要承担起联络员的职责。

请在 *沙河百团大战举办时间内（2024 年 10 月 20 日 10:00 - 15:00）* 在沙河百团大战场地找到各个社团的代表——YG学姐、Midoria7 和 PYthok，并完成他们之间的联络任务。

---

三个 flag 不分顺序。`,
        },
    },
    points: 200,
    inputs: [
        { name: 'flag1', placeholder: 'flag{...}' },
        { name: 'flag2', placeholder: 'flag{...}' },
        { name: 'flag3', placeholder: 'flag{...}' },
    ],
    gameover: true,
    checker: async (ans, ctx) => {
        const input = [ ans.flag1, ans.flag2, ans.flag3 ].sort()
        const correct = ['flag{playground}', 'flag{line}', 'flag{mobile}'].sort()
        return input.every((v, i) => v === correct[i])
    }
} as Plugin<[
    'flag1',
    'flag2',
    'flag3'
]>
