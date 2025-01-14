import { Plugin } from "../../src/types";


export default {
    name: 'BesiegeWithoutAssault',
    pid: 'BesiegeWithoutAssault',
    description: {
        before_solve: {
            content: `
BesiegeWithoutAssault`
        },
    },
    points: 100,
    inputs: [
        { name: 'X', placeholder: 'X 坐标' },
        { name: 'Y', placeholder: 'Y 坐标' },
        { name: 'Z', placeholder: 'Z 坐标' }
    ],
    checker: async (ans, ctx) => {
        const D = 1000
        const [nx, ny, nz] = [ans.X, ans.Y, ans.Z].map(x => parseFloat(x))
        if (isNaN(nx) || isNaN(ny) || isNaN(nz)) {
            ctx.msg(`请输入一个有效的坐标。`)
            return false
        }
        if (nx ** 2 + ny ** 2 + nz ** 2 > 10 ** 2) {
            ctx.msg('坐标超出范围，必须满足 x^2 + y^2 + z^2 <= 10。')
            return false
        }

        const round = ctx.gameStorage.get('round') || 0
        let [px, py, pz] = ctx.gameStorage.get('ppos') || [0, 0, 0]
        let [sx, sy, sz] = ctx.gameStorage.get('spos') || [0, 0, 0]

        if (round === 0) {
            const dist = Math.random() * 2 + 2
            const theta = Math.random() * 2 * Math.PI   // 0 ~ 2π
            const phi = Math.acos(1 - 2 * Math.random()) // 0 ~ π
            sx = dist * Math.sin(phi) * Math.cos(theta)
            sy = dist * Math.sin(phi) * Math.sin(theta)
            sz = dist * Math.cos(phi)
            ctx.gameStorage.set('spos', [sx, sy, sz])
        }

        const dx = (nx - px) / D, dy = (ny - py) / D, dz = (nz - pz) / D
        const length = Math.sqrt((nx - px) ** 2 + (ny - py) ** 2 + (nz - pz) ** 2)
        const dd = length / D / 2

        for (let i = 1; i <= D; i++) {
            px += dx
            py += dy
            pz += dz

            const vx = sx - px
            const vy = sy - py
            const vz = sz - pz
            const distSP = Math.sqrt(vx * vx + vy * vy + vz * vz)
            if (distSP > 0) {
                const ux = vx / distSP
                const uy = vy / distSP
                const uz = vz / distSP
                sx += ux * dd
                sy += uy * dd
                sz += uz * dd
            }
            if ((sx - px) ** 2 + (sy - py) ** 2 + (sz - pz) ** 2 < 0.1 ** 2) {
                ctx.gameStorage.delete('round')
                ctx.gameStorage.delete('ppos')
                ctx.gameStorage.delete('spos')
                return true
            }
            if ((sx ** 2 + sy ** 2 + sz ** 2) > 10 ** 2) {
                ctx.msg(`[Round ${round + 1}] 萤火虫逃跑成功！`)
                ctx.msg(`萤火虫的位置：(${sx.toFixed(6)}, ${sy.toFixed(6)}, ${sz.toFixed(6)})`)
                ctx.msg(`你的位置：(${px.toFixed(6)}, ${py.toFixed(6)}, ${pz.toFixed(6)})`)
                ctx.msg('[游戏已重置，玩家恢复到初始位置，萤火虫重新生成]')
                ctx.gameStorage.delete('round')
                ctx.gameStorage.delete('ppos')
                ctx.gameStorage.delete('spos')
                return false
            }
        }
        ctx.gameStorage.set('round', round + 1)
        ctx.gameStorage.set('ppos', [nx, ny, nz])
        ctx.gameStorage.set('spos', [sx, sy, sz])
        ctx.msg(`[Round ${round + 1}]`)
        ctx.msg(`你在这一回合移动了 ${length.toFixed(6)} 单位长度，萤火虫移动了 ${(length / 2).toFixed(6)} 单位长度。`)
        ctx.msg(`萤火虫离你的距离：${Math.sqrt((sx - nx) ** 2 + (sy - ny) ** 2 + (sz - nz) ** 2).toFixed(6)}`)
        ctx.msg(`你的位置：(${nx.toFixed(6)}, ${ny.toFixed(6)}, ${nz.toFixed(6)})`)
        console.log(`[CatchGlowworm] <${ctx.username}> [Round ${round + 1}] 萤火虫: (${sx.toFixed(6)}, ${sy.toFixed(6)}, ${sz.toFixed(6)}) 玩家: (${nx.toFixed(6)}, ${ny.toFixed(6)}, ${nz.toFixed(6)})`)

        return false
    }
} as Plugin<['X', 'Y', 'Z']>
