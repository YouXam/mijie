import { Plugin } from "../../src/types";


export default {
    name: '单刀赴会',
    pid: '单刀赴会',
    description: {
        before_solve: {
            content: `YouXam 沉思了一会儿，说：「我们干脆把阿拉斯加骗过来吧。就说我们把萨摩耶和哈士奇都抓住了，让牠来谈判。」

「但是我们不知道阿拉斯加在哪，怎么告诉牠呢？」你有些疑惑。

「事到如今，就借用一下学校的广播吧。」YouXam 手中盘着你拿回来的狗语翻译器。

没过多久，学校上空响起了一阵阵清脆的狗叫声。

--- 

Midoria7 已经布置好了一个先天八卦阵。在这个阵法中，阿拉斯加的方位会受到阵法影响，呈现出特定的规律。

只要找到这个规律，你就可以预测阿拉斯加的方位，然后就可以抓到阿拉斯加了！

每一回合你需要输入一个范围在 (-180, 180] 的浮点数，代表你预测的方位角，单位为角度。`
        },
        after_solve: {
            content: `阿拉斯加比想象中还要强大，我们集多人之力，并用周行的卦象推演之法，居然都奈何不了牠——而且我们感觉牠甚至能预判我们的测算！

看来这次是碰上硬钉子了。我们必须回去从长计议。

结果你们刚回到操场就发现——关哈士奇的笼子空了！

「一定是萨摩耶干的！这家伙来无影去无踪，我们上次追牠就追丢了！」Midoria7 恨恨地说。`
        }
    },
    points: 50,
    inputs: [
        { name: '方位角', placeholder: 'x.xx' },
    ],
    next: [
        {
            pid: "南辕北辙"
        },
    ],
    checker: async (ans, ctx) => {
        const deg = parseFloat(ans.方位角)
        if (isNaN(deg) || deg <= -180 || deg > 180) {
            ctx.msg('方位角不合法')
            return false
        }
        const last_n = ctx.gameStorage.get('deg') || Math.floor(Math.random() * 64)
        const now_n = ((last_n << 1) & 0x1f) ^ (Math.random() < 0.5 ? 1 : 0)
        const now_alpha = now_n < 32 ? -now_n * 5.625 : (now_n - 31) * 5.625
        ctx.gameStorage.set('deg', now_n)
        if (Math.abs(now_alpha - deg) <= 1) {
            ctx.msg(`阿拉斯加的方位角为 ${now_alpha.toFixed(3)}°，你的预测正确！`)
            return true
        }
        ctx.msg(`阿拉斯加的方位角为 ${now_alpha.toFixed(3)}°，你的预测错误！`)
        return false
    }
} as Plugin<['方位角']>
