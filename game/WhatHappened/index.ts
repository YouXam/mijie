import { Plugin } from "../../src/types";

const stats = `1. 我有好消息和坏消息要告诉你，我猜你想先听坏消息。你不想听也没关系，反正嘴长在我身上。
2. 坏消息是：这道题没有正确答案。换言之，没有人可以通过这关，别白费力气了。
3. 好消息是：只有这一条坏消息了。
4. 哦，或许你在听到这条好消息之前还有抱什么侥幸心理。那只是因为你做我的解谜游戏做得还是太少了。
5. 经常参与我的解谜游戏的人都知道，我不怎么出解谜游戏。
6. 但是即便真的要出解谜游戏，也不会出得这么常规吧，比如直接把这个回合的回合数当作答案什么的。
7. 呃……你刚刚是不是填了 6 来着？这不是答案，而且我说了这题也没有正确答案。
8. 不过嘛，说不定它是个什么幸运数字，可能将来用得上，你可别忘了哦。
9. 提到这个，顺便一说……其实，我说这么多废话，费那么多口舌，目的也很单纯。
10. 就是为了说着说着让你忘了我之前都说了些什么。
11. 本关的回合数是不可以重置的哦。之前我说过的那些话，你不会再看到第二遍了。
12. 当然也不是完全没有办法的啦。你可以重新创建一个账号，然后通过至少 5 道题。
13. 不过因为本次解谜出了一大堆巨恶心的交互题，所以我觉得，任何一个正常人都不会喜欢把这些题再做一遍的。
14. 嗯……除了我。因为我是这 7 道题目的出题人，所以得一遍一遍调试那些题目。
15. 至于我是否觉得烦？当然烦了。但是一想到玩家们要绞尽脑汁解这些超恶心的交互题，我就感到心情舒畅。
16. 我每年过年的好心情就押在看大家做题上了。
17. 当然……我也不是那么喜欢幸灾乐祸的人啦。
18. 每年解谜我都有为通关者准备奖励的说。
19. 哦对了，再次提醒，这关没有答案来着，你过不了。
20. 只不过，经常参与我的解谜游戏的人都知道，我喜欢「故技重施」。
21. 所以，前两次解谜的最后一关都没有设置答案。
22. 这样大家都过不了关，那奖励不就是我的了吗？
23. 哎呀，这不叫私吞，没有那么恶劣，充其量只是物归原主而已。
24. 但是还是有一些幸运儿可以拿到奖励的。不过……你真的要抱这个侥幸心理吗？
25. 毕竟经常参与我的解谜游戏的人都知道，我不怎么出解谜游戏。
26. 到目前为止也只出了 3 次罢了。
27. 要是没记错的话，第一年我出了 8 道题，后来每年都是 7 道。
28. 一开始还挺忐忑，后来看到大家一边做题一边骂，我就放心了。
29. 嗯……归根结底，还是得感谢大家对我们的支持。
30. 那么作为报答，就送你一个幸运数字吧……哦不，幸运数字已经给过了，那这个 2 就叫「侥幸数字」吧。
31. 那么，再会了！（对话结束）
32. 嗯？你怎么还提交？我都说了，对话结束了。
33. （对话已结束）
34. （对话已结束）
35. （对话已结束）
36. 你烦不烦？我都说了这题没答案，你不要再交了！
37. 你到底想做什么？想要读破天机也别来找我啊，自己想去！
38. 你……你不会真的抱着侥幸心理在试我给你的那些侥幸数字吧？
39. 果然，我就知道，你不是那么容易善罢甘休的人。
40. 至少在解谜这件事情上，机会只青睐于那些死缠烂打的人，而你就是其中一位。
41. 否则你也不会通过那么多前置题目，来到这个鬼地方。
42. 我就再送给你一个「坚毅数字」，那就是 1。
43. （对话已结束）
44. 你还不走？果然，再这么一直吊着你，也没什么意思了呢。
45. 既然你已经通过了我的坚毅考验，我就多告诉你一些情报吧。
46. 首先，你还记得我给你的「幸运数字」吧？要是忘了，回去重新创建一个账号再把前置题目做一遍吧。记得把重要信息抄下来。
47. 我在第 14 回合的时候说过一个数字，你还记得吧？要是忘了……
48. 我在第 27 回合的时候说过两个数字，都要用。
49. 另外，解锁本关需要通过几个前置题目，你也记得吧？
50. 还有第 26 回合的那个数字。
51. 还有「坚毅数字」和「侥幸数字」。
52. 现在有八个数字了对吧。最后一个数字你自己猜哦。
53. 九个数字连起来可能意味着什么吧。接下来能不能上我的「龙年末班车」就看你本事了。`.split('\n')

export default {
    name: 'WhatHappened',
    pid: 'WhatHappened',
    description: {
        before_solve: {
            content: `别看我，我也一脸茫然。

这里本来应该是另一道题目，但是因为████████，迫不得已换成了这题。`
        },
    },
    points: Infinity,
    record: false,
    checker: async (ans, ctx) => {
        const round = ctx.gameStorage.get<number>('round') || 0
        if (round < stats.length) {
            ctx.msg(stats[round])
            ctx.gameStorage.set('round', round + 1)
        }
        return false
    }
} as Plugin<true>
