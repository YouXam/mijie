import { Plugin } from "../../src/types";

export default {
    name: '余音绕梁',
    pid: '余音绕梁',
    description: {
        before_solve: {
            content: `
「我昨天做了一个梦，梦中好像有一段神奇的音乐。所以我在想，我能不能把音乐元素也融入卦象之中呢？」

Midoria7 像往常一样分享着他的奇思妙想。

「不过……我想不起那段音乐具体是什么了，只记得这样一串信息，你能帮我回忆起来吗？」

\`GGAGCB GGAGDC GGGECBA FFECDC\``
        }
    },
    points: 70,
    next: [
        {
            pid: "包罗万象"
        }
    ],
    async checker(ans, ctx) {
        return ans.trim().toLowerCase() === 'birthday'.toLowerCase()
    }
} as Plugin<true>;
