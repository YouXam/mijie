import { Plugin } from "../../src/types";

export default {
    name: '小试牛刀',
    pid: '小试牛刀',
    description: {
        before_solve: {
            content: `「嗯？没想到你完成得这么快。」

YG学姐放下手中的单片机，略带惊讶地看着你。

「这个汇编分析本该是我的工作，不过……」祂若有所思地顿了顿，「也许你更适合接手。」

「接下来还有不少挑战。」YG学姐眼中闪过一丝期待，「可别让我失望哦。」

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
