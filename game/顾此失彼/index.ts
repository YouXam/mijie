import { Plugin } from "../../src/types";

export default {
    name: '顾此失彼',
    pid: '顾此失彼',
    description: {
        before_solve: {
            content: `
「没问题了。」PYthok 伸了个懒腰，「小样，跟我斗，再回去刷100年CTF吧。」

「怎么回事？」你还没反应过来发生了什么。

「细节不重要了。总之，现在哈士奇博客的控制权在我们手里。保险起见，你来给它设置一个强密码吧。」

你觉得「这有什么难的」，便答应了他的要求。

---

<a href="https://setsetpassword.vercel.app/" target="_blank">打开题目链接</a>

将通过上述网站后拿到的答案用 \`flag{\` 和 \`}\` 包裹起来。
`
        },
        after_solve: {
            content: `「不是，为什么这个密码有这么多千奇百怪的要求……」你好不容易编出了一个符合全部要求的强密码，然后就忍不住向 PYthok 吐槽。

「现在我们已经做足了安全措施，也掌握了必要的情报，我们走吧！」

「去哪？」你感觉自己完全被蒙在鼓里，还什么都不知道呢！

「嘿嘿，天机不可泄露。很快你就会知道的！」`
        }
    },
    points: 200,
    next: [
        {
            pid: "通风报信"
        }
    ],
    inputs: [
        {
            name: 'flag',
            placeholder: 'flag{...}'
        }
    ],
    checker(ans, ctx) {
        return ans.flag.trim() === 'flag{Th1s_15_4_St0rNG_P@55w0rd!}'
    }
} as Plugin<[
    'flag',
]>;
