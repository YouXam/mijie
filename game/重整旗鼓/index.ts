import { Plugin } from "../../src/types";

export default {
    name: '重整旗鼓',
    pid: '重整旗鼓',
    description: {
        before_solve: {
            content: `YG学姐看到智能车被毁成如此模样，面色阴沉。「这个……还能修好吗……？」Midoria7 小心翼翼地问。

「能。」YG学姐环顾四周，「你们谁来搭把手？」

「我！」「我！」「我！」满屋子的人都站了起来。

「就你了。」YG学姐指了指你，然后示意你跟祂走。

「智能车被损坏得太严重了，我们要从电路开始修。在此之前，我需要你先做一个简单的电路分析。」

---

![](https://files.chouhsing.org/reinvigorate.png)

初始情况 A、B、C 都为0，你需要想办法让 Key 变为 1。

在输入框中输入一段最短操作序列，例如 B0 代表设置 B 为 0，C1 代表设置 C 为 1，答案形式类似 \`B0A0C1B1C0B0\`。`,
        },
    },
    points: 145,
    inputs: [
        {
            name: 'ans',
            placeholder: '最短操作序列'
        }
    ],
    next: [
        {
            pid: "小试牛刀"
        }
    ],
    checker(ans, ctx) {
        return ans.ans.trim() === 'B1C1C0B0'
    }
} as Plugin<[
    'ans'
]>;
