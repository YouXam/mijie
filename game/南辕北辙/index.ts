import { Plugin } from "../../src/types";


export default {
    name: '南辕北辙',
    pid: '南辕北辙',
    description: {
        before_solve: {
            content: `「别担心，我昨天晚上加班加点做了一个『萨摩耶探测器』，可以在任何地方知道萨摩耶与你的距离！」Quarix 显摆起了自己的新发明。

「但是我们追不上萨摩耶啊。谁能跑那么快？」

「YG学姐的智能车可以！」

「但是你这个探测器只能知道萨摩耶的距离，不能知道萨摩耶的方向啊？」

「呃……完了，忘了这回事了。那……你们……自己想想办法……？」

---

在平面直角坐标系中，玩家初始位置为 (0,0)，萨摩耶随机出现在离玩家距离 2~4 的任何位置。

玩家在每次回合结束时能获知萨摩耶离自己的距离，但不知道方向；萨摩耶总能感知到玩家的位置，并背对着玩家的方向逃跑。

在每次回合中，玩家可移动到指定坐标，萨摩耶同时也会逃跑。二者的速度之比为 2:1。

你需要在萨摩耶逃出坐标系范围之前抓住萨摩耶。抓住萨摩耶的判定标准为：玩家与萨摩耶的距离不超过 0.5。`
        },
        after_solve: {
            content: `可能是运气好，也可能是萨摩耶探测器真的起了作用。总之，我们终于发现了萨摩耶的踪迹！

然而，当我们出动人手去包围目标的时候，智能车的屏幕前突然出现了哈士奇！

智能车的信号就这样中断了；留在投屏上的最后一幕是哈士奇的喉咙。

过不多时，外派队员们带着智能车的尸体回来了。

没想到这次我们失败得如此彻底……并且损失如此惨重。

看来我们必须从长计议，分头行动，对三条狗逐个击破！

现在智能车的YG学姐、周行的 Midoria7 和天枢的 PYthok 分别有了自己的计划，你打算去帮谁呢？`
        }
    },
    points: 10,
    inputs: [
        { name: 'X', placeholder: 'X 坐标' },
        { name: 'Y', placeholder: 'Y 坐标' },
    ],
    next: [
        {
            pid: '有问必答',
            description: '帮 PYthok 收集情报 [进入天枢分支]'
        },
        {
            pid: '再世伏羲',
            description: '帮 Mioria7 改进卦象 [进入周行 Midoria7 分支]'
        },
        {
            pid: "如出一辙",
            description: "感觉没什么意思，不如来点挑战性的 [进入周行 YouXam 分支]"
        },
    ],
    checker: async (ans, ctx) => {
        const nx = parseFloat(ans.X)
        const ny = parseFloat(ans.Y)
        const D = 1000

        if (isNaN(nx) || isNaN(ny)) {
            ctx.msg(`请输入一个有效的坐标。`)
            return false
        }

        if (nx < -10 || nx > 10 || ny < -10 || ny > 10) {
            ctx.msg(`坐标范围应在 [-10, 10] 之间。`)
            return false
        }

        const round = ctx.gameStorage.get('round') || 0
        let [px, py] = ctx.gameStorage.get('ppos') || [0, 0]
        let [sx, sy] = ctx.gameStorage.get('spos') || [0, 0]
        
        if (round === 0) {
            const dist = Math.random() * 2 + 2
            const angle = Math.random() * Math.PI * 2
            sx = dist * Math.cos(angle)
            sy = dist * Math.sin(angle)
            ctx.gameStorage.set('spos', [sx, sy])
        }
        
        const dx = (nx - px) / D, dy = (ny - py) / D
        const length = Math.sqrt((nx - px) ** 2 + (ny - py) ** 2)
        const dd = Math.sqrt((nx - px) ** 2 + (ny - py) ** 2) / D / 2

        for (let i = 1; i <= D; i++) {
            px += dx
            py += dy
            const direction = Math.atan2(sy - py, sx - px)
            sx += Math.cos(direction) * dd
            sy += Math.sin(direction) * dd
            if ((sx - px) ** 2 + (sy - py) ** 2 < 0.25) {
                ctx.gameStorage.delete('round')
                ctx.gameStorage.delete('ppos')
                ctx.gameStorage.delete('spos')
                return true
            }
            if (Math.abs(sx) > 10 || Math.abs(sy) > 10) {
                ctx.msg(`[Round ${round + 1}] 萨摩耶逃跑成功！`)
                ctx.msg(`萨摩耶的位置：(${sx.toFixed(6)}, ${sy.toFixed(6)})`)
                ctx.msg(`你的位置：(${px.toFixed(6)}, ${py.toFixed(6)})`)
                ctx.msg('[游戏已重置，玩家恢复到初始位置，萨摩耶重新生成]')
                ctx.gameStorage.delete('round')
                ctx.gameStorage.delete('ppos')
                ctx.gameStorage.delete('spos')
                return false
            }
        }
        ctx.gameStorage.set('round', round + 1)
        ctx.gameStorage.set('ppos', [nx, ny])
        ctx.gameStorage.set('spos', [sx, sy])
        ctx.msg(`[Round ${round + 1}]`)
        ctx.msg(`你在这一回合移动了 ${length.toFixed(6)} 单位长度，萨摩耶移动了了 ${(length / 2).toFixed(6)} 单位长度。`)
        ctx.msg(`萨摩耶离你的距离：${Math.sqrt((sx - nx) ** 2 + (sy - ny) ** 2).toFixed(6)}`)
        ctx.msg(`你的位置：(${nx.toFixed(6)}, ${ny.toFixed(6)})`)
        console.log(`[南辕北辙] <${ctx.username}> [Round ${round + 1}] 萨摩耶: (${sx.toFixed(6)}, ${sy.toFixed(6)}) 玩家: (${nx.toFixed(6)}, ${ny.toFixed(6)})`)
 
        return false
    }
} as Plugin<['X', 'Y']>
