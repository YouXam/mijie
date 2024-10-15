import { Plugin } from "../../src/types";

export default {
    name: '心领神会',
    pid: '心领神会',
    description: {
        before_solve: {
            content: `PYthok 看着面前的一串 emoji，按了按睛明穴。「这特么到底是啥……」

你看了看屏幕上的 emoji。「这不是『锄禾日当午，汗滴禾下土』吗？」

PYthok 抱着试试看的心态输入了密码 \`flag{锄禾日当午汗滴禾下土}\`。「嗯？这就过了？」他愣了半天，「不是，这么抽象？」

「快，这里还有两题，你来帮我想想吧。」

---

在第一个输入框中，填写需要回答的问题编号，在第二个输入框中填写 emoji 指代的诗词原句，不加标点符号。

任意一道题目回答正确即可通过此关卡。

1. ❔️🍺，🦬🧒👉️🌸
2. 👩‍👩‍👧‍👧⛰️🍳🛌☲🌾👑，💪🏿🕙☴👄🚴🧠⚔︎`,
        },
    },
    points: 75,
    inputs: [
        {
            name: '编号',
            placeholder: '编号(阿拉伯数字)'
        },
        {
            name: '诗句',
            placeholder: 'flag{...}'
        }
    ],
    next: [
        {
            pid: "寻寻觅觅"
        }
    ],
    checker(ans, ctx) {
        return ans['编号'] === '1' && ans['诗句'].trim() === 'flag{借问酒家何处有牧童遥指杏花村}'
            || ans['编号'] === '2' && ans['诗句'].trim() === 'flag{巴山楚水凄凉地二十三年弃置身}'
    }
} as Plugin<[
    '编号',
    '诗句'
]>;
