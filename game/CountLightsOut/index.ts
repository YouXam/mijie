import { Plugin } from "../../src/types";


export default {
    name: 'CountLightsOut',
    pid: 'CountLightsOut',
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
        app.on('init', (_, ctx) => {
            const cells = Array.from({ length: 36 }, () => Math.random() > 0.5)
            ctx.gameStorage.set("cells", cells)
            return cells.reduce((acc, cur) => acc + (cur ? 1 : 0), 0)
        })
        app.on('toggle', (index: number, ctx) => {
            const cells = ctx.gameStorage.get<Array<boolean>>("cells")
            if (!cells) return
            const row = Math.floor(index / 6), col = index % 6;
            [
                [row, col],
                [row - 1, col],
                [row + 1, col],
                [row, col - 1],
                [row, col + 1],
            ].forEach(([r, c]) => {
                if (r >= 0 && r < 6 && c >= 0 && c < 6) {
                    cells[r * 6 + c] = !cells[r * 6 + c]
                }
            })
            ctx.gameStorage.set("cells", cells)
            if (cells.every(x => !x)) {
                ctx.pass()
            }
            return cells.reduce((acc, cur) => acc + (cur ? 1 : 0), 0)
        })
    }
} as Plugin<false>
