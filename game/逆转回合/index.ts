import { Plugin } from "../../src/types";


export default {
    name: '逆转回合',
    pid: '逆转回合',
    description: {
        before_solve: {
            content: `「你好，我们又见面了。」成步堂 哈二再次出现。

「我发现你很擅长从已知的信息合理推导出未知的事物，这是成为一个好的律师必备的潜质！」

「我打算给你增加一些难度，让你再做一次这道题。如果你成功了，我将给你 100pt 的奖励。」

---

在南辕北辙的基础上，增加三个限制条件：

1. 限制必须在四个回合内抓住萨摩耶；
2. 萨摩耶的初始位置与玩家间的距离为 6~7；
3. 抓住萨摩耶的判定标准改为:玩家与萨摩耶的距离不超过 0.1。`
        }
    },
    points: 100,
    inputs: [
        { name: 'X', placeholder: 'X 坐标' },
        { name: 'Y', placeholder: 'Y 坐标' },
    ],
    next: [
        {
            pid: '南辕北辙',
            description: '返回'
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
            const dist = Math.random() + 6
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
            if ((sx - px) ** 2 + (sy - py) ** 2 < 0.01) {
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
        ctx.msg(`你在这一回合移动了 ${length.toFixed(6)} 单位长度，萨摩耶移动了 ${(length / 2).toFixed(6)} 单位长度。`)
        ctx.msg(`萨摩耶离你的距离：${Math.sqrt((sx - nx) ** 2 + (sy - ny) ** 2).toFixed(6)}`)
        ctx.msg(`你的位置：(${nx.toFixed(6)}, ${ny.toFixed(6)})`)
        console.log(`[逆转回合] <${ctx.username}> [Round ${round + 1}] 萨摩耶: (${sx.toFixed(6)}, ${sy.toFixed(6)}) 玩家: (${nx.toFixed(6)}, ${ny.toFixed(6)})`)
        if (round === 3) {
            ctx.msg('[你没有在四回合内抓住萨摩耶，游戏已重置]')
            ctx.gameStorage.delete('round')
            ctx.gameStorage.delete('ppos')
            ctx.gameStorage.delete('spos')
            return false
        }

        return false
    }
} as Plugin<['X', 'Y']>
