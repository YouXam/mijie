import { Plugin } from "../../src/types";
import { Coordinate, move } from "./app/lib";


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
    server(app) {
        app.on<{ x: number, y: number }>('start', (data, ctx) => {
            if (isNaN(data.x) || isNaN(data.y)) return
            ctx.gameStorage.set('player', { x: data.x, y: data.y });
            ctx.gameStorage.set('enemy', { x: 0, y: 0 });
            ctx.gameStorage.delete('end')
        })
        app.on<{ x: number, y: number }>('move', async (data, ctx) => {
            const player = ctx.gameStorage.get<{ x: number, y: number }>('player');
            const enemy = ctx.gameStorage.get<{ x: number, y: number }>('enemy');
            const end = ctx.gameStorage.get<boolean>('end')
            if (end) return
            if (!player || !enemy || isNaN(data.x) || isNaN(data.y)) return;
            const result = await move(
                new Coordinate(player.x, player.y),
                new Coordinate(enemy.x, enemy.y),
                data.x, data.y
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
            }
        })
    }
} as Plugin<false>
