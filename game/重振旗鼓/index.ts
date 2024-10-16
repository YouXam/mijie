import { Plugin } from "../../src/types";

export default {
    name: '重振旗鼓',
    pid: '重振旗鼓',
    description: {
        before_solve: {
            content: `YG学姐看到智能车被毁成如此模样，面色阴沉。「这个……还能修好吗……？」Quarix 小心翼翼地问。

「能。」YG学姐环顾四周，「你们谁来搭把手？」

「我！」「我！」「我！」满屋子的人都站了起来。

YG学姐的手指在空中划过，最后停在了你身上。「就决定是你了。」祂眨眨眼，示意你跟上。

「情况比想象的糟，」YG学姐边走边说，「我需要你从实验室弄来一块全新的主板。」

「实验室的密码锁是用逻辑电路控制的。想进去，你就得先解开那个电路。快去快回吧！」

---

![](https://files.chouhsing.org/reinvigorate.png)

初始情况 A、B、C 都为0，你需要想办法让 Key 变为 1。

在输入框中输入一段最短操作序列，例如 B0 代表设置 B 为 0，C1 代表设置 C 为 1，答案形式类似 \`B0A0C1B1C0B0\`。`,
        },
    },
    points: 80,
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
        return ans.ans.trim() === 'C1'
    }
} as Plugin<[
    'ans'
]>;
