import { Plugin } from "../../src/types";


export default {
    name: '逆转邮兵-I',
    pid: '逆转邮兵-I',
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
            pid: "逆转邮兵-II"
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
        if (exhibit === '2' && testimony == '2') { // 沙河校区地图 和 第2句证言
            ctx.msg(`你拿出地图，大喊：

「看好了。地图上的联廊连接的才不是学生餐厅和教工餐厅！而是教工餐厅和风味餐厅！」

「诶……这个……」学妹慌乱了片刻，随即解释道——`)
            return true
        } else if (exhibit ===  '1') { // 若出示「你的学生证」
            ctx.msg(`「这个证词，和我的学生证产生了矛盾！」

「你……你在干嘛？」Midoria7 小声问你。

「神金……」学妹抱怨了一句，怏怏地走开了。`)
        } else if (exhibit === '3') { // 若出示「萨摩耶犬种的体能数据」
            ctx.msg(`「我有证据证明，萨摩耶不可能在五秒钟的时间里跑过两餐厅的联廊！」

你刚要继续，Midoria7 突然拉着你小声说：「我刚估算了一下，要按照萨摩耶的最快速度来跑的话，这段距离用五秒钟绰绰有余……」

「哎……哈哈哈哈，是这样吗……不好意思啊，是我搞错了……」

学妹觉得你是一个怪人，不愿再接受你的搭话了。`)
        } else if (exhibit === '7') { // 若出示「教工餐厅今日食谱」
            ctx.msg(`「我有证据证明，萨摩耶不可能跑到教工餐厅去！因为教工餐厅今天的饭都很难吃！」

你刚要继续，Midoria7 突然拉着你小声说：「牠不是为了吃啊，是为了躲开我们啊……」

「哎……哈哈哈哈，好像有道理啊……」

然而，学妹觉得你是一个怪人，不愿再接受你的搭话了。`)
        } else if (exhibit === '5') { // 若出示「一份传单」
            ctx.msg(`「我手中有一份传单……」

「什么？原来那个发传单的人是你？！」没等你说完，学妹就质问你。

「什么？竟然是你？」Midoria7 也认为你是发传单的人，你们 argue 了起来。

然后事情就大条了……`)
        } else { // 若出示其它组合
            ctx.msg(`「你的这个说法与我的这个证据产生了矛盾！」

Midoria7 一言不发，学妹也一言不发，整个二维码广场安静得可怕！

「呃，哈哈哈哈，我的思路好像有点偏离，你们再给我一次机会吧！」

然而，学妹觉得你是一个怪人，不愿再接受你的搭话了。`)
        }
        return false
    }
} as Plugin<['选择的证言', '选择的证物']>
