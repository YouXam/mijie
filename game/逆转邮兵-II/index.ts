import { Plugin } from "../../src/types";


export default {
    name: '逆转邮兵-II',
    pid: '逆转邮兵-II',
    description: {
        before_solve: {
            md: "problem.md",
        },
    },
    points: 10,
    inputs: [
        { name: '选择的证言', placeholder: '证言编号' },
        { name: '选择的证物', placeholder: '证物编号' }
    ],
    next: [
        {
            pid: "逆转邮兵-III"
        }
    ],
    checker: async (ans, ctx) => {
        const exhibit = ans.选择的证物
        const testimony = ans.选择的证言
        const possibleExhibits = ['1', '2', '3', '4', '5', '6', '7']
        const possibleTestimonies = ['1', '2', '3', '4']
        if (!possibleExhibits.includes(exhibit) || !possibleTestimonies.includes(testimony)) {
            ctx.msg(`证言编号和证物编号只能是 ${possibleTestimonies.join(', ')} 和 ${possibleExhibits.join(', ')} 中的一个。`)
            return false
        }
        if (exhibit === '4' && testimony == '3') { //  第3句证言 及 一则古老的通知
            ctx.msg(`「我手中有一份通知，说的是，2022年春季学期因为疫情原因不能正常开学，所有课程都改为线上教学了。」

「而在那一整个学期的时间里，沙河校区根本就没有开放！」

「所以说，学姐你只能吃一个学期餐厅，而不可能是两个学期！」

「诶……怎么这样……」学姐的声音更加慌乱了。`)
            return true
        } else if (exhibit ===  '1') { // 若出示「你的学生证」
            ctx.msg(`「这个证词，和我的学生证产生了矛盾！」

「逆转裁判玩多了吧你！有病……」

你刚才再说两句，学姐一句话就给你怼了回去：

「你们玩逆转裁判的别来沾边！看见你就恶心！」`)
        } else if (exhibit === '5') { // 若出示「一份传单」
            ctx.msg(`「我手中有一份传单……」

「什么？原来那个发传单的人是你？！」没等你说完，学姐就质问你。

「什么？竟然是你？」Midoria7 也认为你是发传单的人，你们 argue 了起来。

然后事情就大条了……`)
        } else if (exhibit === '6') { // 若出示「一条过时的新闻」
            ctx.msg(`「如果你不是新生的话，想必你一定听说过尹涛这个人！」

「诶……谁？」学姐的声音有点慌乱。

「诶……谁？」Midoria7 的声音也有些心虚！

你：「呃……没事了……」

学姐觉得你是一个怪人，不愿再接受你的搭话了。`)
        } else { // 若出示其它组合
            ctx.msg(`「你的这个说法与我的这个证据产生了矛盾！」

Midoria7 一言不发，学姐也一言不发，整个二维码广场安静得可怕！

「呃，哈哈哈哈，我的思路好像有点偏离，你们再给我一次机会吧！」

然而，学姐觉得你是一个怪人，不愿再接受你的搭话了。`)
        }
        return false
    }
} as Plugin<['选择的证言', '选择的证物']>
