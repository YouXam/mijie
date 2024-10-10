import { Plugin } from "../../src/types";

export default {
    name: '包罗万象',
    pid: '包罗万象',
    description: {
        before_solve: {
            content: `「刚才我和 YouXam 沟通了一下，他觉得我们这种向卦象中添加其它元素的方案非常好。」Midoria7 很是兴奋。

「我决定好了！我要继续添加新元素，然后给它起名叫『包罗万象卦』！」

「包罗万象卦？」你听得有点迷迷糊糊的。

「没错！这就是我的卦文：\`wiskey of bravo: alpha victor 428790736 0220\`。 你能解出来吗？」`
        }
    },
    points: 100,
    next: [
        {
            pid: "卦象骇客"
        }
    ],
    async checker(ans, ctx) {
        return ans.trim().toLowerCase() === 'FOREVER YOUNG AND FREE'.toLowerCase()
    }
} as Plugin<true>;
