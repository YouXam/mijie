import { Plugin } from "../../src/types";
import { Coordinate, move } from "./app/lib";

type Point = { x: number, y: number }

export default {
    name: 'BesiegeWithoutAssault',
    pid: 'BesiegeWithoutAssault',
    description: {
        before_solve: {
            mdv: {
                main: "app/main.md",
                include: ["app/**/*"]
            }
        },
    },
    points: 100,
    inputs: false,
    next: [{ pid: 'entrance' }],
    server(app) {
        app.on<{ x: number, y: number }>('start', (data, ctx) => {
            if (isNaN(data.x) || isNaN(data.y)) return
            ctx.gameStorage.set('player', { x: data.x, y: data.y });
            ctx.gameStorage.set('enemy', { x: 0, y: 0 });
            ctx.gameStorage.delete('end')
            ctx.gameStorage.set('length', 0)
        })
        app.on<Record<'next' | 'player' | 'enemy', Point>>('move', async (data, ctx) => {
            const player_p = ctx.gameStorage.get<{ x: number, y: number }>('player');
            const enemy_p = ctx.gameStorage.get<{ x: number, y: number }>('enemy');
            const length = ctx.gameStorage.get<number>('length') ?? 0
            const end = ctx.gameStorage.get<boolean>('end')
            if (end) return 'Error: 游戏已结束'
            if (!player_p || !enemy_p) return 'Error: 游戏为开始'
            if (isNaN(data.next.x) || isNaN(data.next.y)) return 'Error: 无效的坐标'
            const player = new Coordinate(player_p.x, player_p.y)
            const enemy = new Coordinate(enemy_p.x, enemy_p.y)
            if (!player.equal(new Coordinate(data.player.x, data.player.y))) return 'Error: 玩家位置不正确'
            if (!enemy.equal(new Coordinate(data.enemy.x, data.enemy.y))) return 'Error: 敌军位置不正确'
            const result = await move(
                player,
                enemy,
                data.next.x, data.next.y,
                length,
            )
            if (result.result === 'success') {
                ctx.pass(`敌军累计路程：${result.length}`)
                ctx.gameStorage.set('end', true)
            } else if (result.result !== 'continue') {
                ctx.nopass(result.result === 'out-of-range' ? '敌军逃出了包围圈' : '距离敌军太近了')
                ctx.gameStorage.set('end', true)
            } else {
                ctx.gameStorage.set('player', { x: result.you.x, y: result.you.y });
                ctx.gameStorage.set('enemy', { x: result.enemy.x, y: result.enemy.y });
                ctx.gameStorage.set('length', result.length)
            }
        })
    }
} as Plugin<false>
