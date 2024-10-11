import { Plugin } from "../../src/types";


export default {
    name: '逆转邮兵-III',
    pid: '逆转邮兵-III',
    description: {
        before_solve: {
            md: "problem.md",
        },
    },
    points: 5,
    inputs: [
        { name: '答案编号', placeholder: '答案编号' },
    ],
    next: [
        {
            pid: "逆转邮兵-IV"
        }
    ],
    checker: async (ans, ctx) => {
        const choice = ans.答案编号
        if (!['1', '2', '3'].includes(choice)) {
            ctx.msg(`答案编号只能是 1, 2, 3 中的一个。`)
            return false
        }
        if (choice === '2') {
            ctx.msg(`学姐沉默片刻，然后突然用很「成熟」的声音说：

「哎呀，没想到大婶我演了这么久，居然被你们识破了。那我也不用夹着嗓子说话了。」

「大婶我比较年轻态嘛，也想参加参加你们学生的活动，所以就弄了个玩偶装穿在身上。本来以为谁也认不出，没想到你这个小哥三言两语就戳穿了我的伪装啊——」大婶挥起玩偶拳头，捶了一下 Midoria7 的胸口。

你内心：「喂，戳穿你伪装的是我好吧！」`)
            return true
        } else if (choice === '1') {
            ctx.msg(`「其实你是学校里的流浪狗，所以可以不受限制地进出学校！也正因如此，即便是疫情那个学期你也可以在学校！」

学姐气炸了：「你他妈才是狗！你他妈全家都是狗！」

……………………

学姐抽泣着跑掉了。`)
        } else if (choice === '3') {
            ctx.msg(`「其实你来自另一个平行宇宙！在这个平行宇宙当中，你们没有遇到疫情，所以你自然可以在学校待两个学期！」

学姐沉默了一会儿，说：「你怎么不说我来自二次元呢——」

Midoria7 突然抢过话来。「真的吗学姐！」

然后 Midoria7 就和学姐攀谈起来，忘记了你们最初的目标……`)
        }
        return false
    }
} as Plugin<['答案编号']>
