import { Plugin } from "../../src/types";

export default {
    name: '瓮中捉鳖',
    pid: '瓮中捉鳖',
    first: true,
    description: {
        before_solve: {
            content: `根据去年的经验，我们已经知道了哈士奇喜好 cookies。所以今年 PYthok 打算设置一个陷阱，诱捕哈士奇！

现在 PYthok 已经帮你准备好了 cookies。你可以从已有的道具中选择任意一个，帮助祂完成陷阱。

1. 比牛津词典还厚的百科全书
2. 发霉发臭还有股酸味的皮鞋
3. 度数高达1200的近视眼镜
4. 不使用道具`,
        },
    },
    points: 10,
    inputs: [
        { name: '选择的道具', placeholder: '道具编号' }
    ],
    next: [
        {
            pid: "逆转邮兵-I"
        }
    ],
    checker: async (ans, ctx) => {
        const choice = ans['选择的道具'];
        const plot = {
            "1": {
                result: true,
                content: `你把 cookies 放在宿舍楼的窗户下面，然后爬上五楼，从走廊窗户中向下望。陷阱的位置刚好在你眼皮底下。

很快，哈士奇过来吃 cookies 了，你看准时机，把百科全书扔了下去！

哈士奇被砸晕了！`
            },
            "2": {
                result: true,
                content: `你把 cookies 放在皮鞋里，然后远远跑开，等待哈士奇前来。

果不其然，哈士奇很快来到陷阱处，开始偷吃 cookies。

然而刚吃了几口，牠就口吐白沫，倒了！`
            },
            "3":{
                result: true,
                content: `你决定用 cookies 作为诱耳，讨好哈士奇，然后趁其不备捉住牠。

计划进行得很顺利。在哈士奇摇着尾巴吃你手中的 cookies 时，你猝不及防地把近视眼镜挂在了牠的头上！

哈士奇仓皇逃跑，但看不清路，没走几步就在台阶上摔晕了过去！`,
            },
            "4": {
                result: false,
                content: `我们把 cookies 布置好了，但是由于没有足够的道具，没有办法捉住哈士奇，只能看着牠大摇大摆地吃完 cookies 然后从容不迫地离开。`
            }
        }
        if (!Object.keys(plot).includes(choice)) {
            ctx.msg(`你必须在 ${Object.keys(plot).join('、')} 中选择一个道具编号。`)
            return false
        }
        ctx.msg(plot[choice as keyof typeof plot].content)
        return plot[choice as keyof typeof plot].result
    }
} as Plugin<[
    '选择的道具'
]>;