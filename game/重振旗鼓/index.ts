import { Plugin } from "../../src/types";

export default {
    name: '重振旗鼓',
    pid: '重振旗鼓',
    description: {
        before_solve: {
            content: `YG学姐看到智能车被毁成如此模样，面色阴沉。「这个……还能修好吗……？」Midoria 小心翼翼地问。

「能。」YG学姐环顾四周，「你们谁来搭把手？」

「我！」「我！」「我！」满屋子的人都站了起来。

YG学姐的手指在空中划过，最后停在了你身上。「就决定是你了。」祂眨眨眼，示意你跟上。

「情况比想象的糟，」YG学姐边走边说，「我们需要从实验室弄来一块全新的主板。」

你们穿梭在幽暗的地下通道中，脚步声在狭窄的空间里回荡。终于，一扇神秘的门出现在通道尽头。

「实验室的密码锁是用逻辑电路控制的，」YG学姐解释道，「想进去，我们就得先解开这个电路。」

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
