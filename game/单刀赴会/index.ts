import { Plugin } from "../../src/types";


export default {
    name: '单刀赴会',
    pid: '单刀赴会',
    description: {
        before_solve: {
            content: `YouXam 沉思了一会儿，说：「我们干脆把阿拉斯加骗过来吧。就说我们把萨摩耶和哈士奇都抓住了，让牠来谈判。」

「但是我们不知道阿拉斯加在哪，怎么告诉牠呢？」你有些疑惑。

「事到如今，就借用一下学校的广播吧。」YouXam 手中盘着你拿回来的狗语翻译器。

没过多久，学校上空响起了一阵阵清脆的狗叫声。`
        },
        after_solve: {
            content: `阿拉斯加比想象中还要强大，我们集多人之力，并用周行的卦象推演之法，居然都奈何不了牠——而且我们感觉牠甚至能预判我们的测算！

看来这次是碰上硬钉子了。我们必须回去从长计议。

结果你们刚回到操场就发现——关哈士奇的笼子空了！

「一定是萨摩耶干的！这家伙来无影去无踪，我们上次追牠就追丢了！」Midoria7 恨恨地说。`
        }
    },
    points: 10,
    inputs: [
        { name: '答案编号', placeholder: '答案编号' },
    ],
    next: [
        {
            pid: "南辕北辙"
        },
    ],
    checker: async (ans, ctx) => {
        return true
    }
} as Plugin<['答案编号']>
