import { Plugin } from "../../src/types";

export default {
    name: '小试牛刀',
    pid: '小试牛刀',
    description: {
        before_solve: {
            content: `「嗯？没想到你完成得这么快。」

刚编完单片机代码的YG学姐发现你的分析速度竟然和祂写代码一样快，略微有些吃惊。

「这些调试单片机的任务本来应该交给我的下属去做；不过我现在觉得，或许交给你会是更好的选择。」

「可别让我失望哦。」

---

\`\`\`assembly
MOV R0, #0x72
MOV R1, #0x202
ADD R0, R0, R1
EOR R0, R0, #0xFF
LSL R0, R0, #2
SUB R0, R0, R1
AND R0, R0, #0xFF  
\`\`\`

求 R0 中的值
`,
        },
    },
    points: 55,
    inputs: [
        {
            name: 'R0中的值',
            placeholder: '十进制数字'
        }
    ],
    next: [
        {
            pid: "抽丝剥茧"
        }
    ],
    checker(ans, ctx) {
        return ans.R0中的值.trim() === '42'
    }
} as Plugin<[
    'R0中的值'
]>;
