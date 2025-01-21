import { Plugin } from "../../src/types";


export default {
    name: 'Entrance',
    pid: 'Entrance',
    description: {
        before_solve: {
            mdv: {
                main: "app/main.md",
                include: ["app/**/*"]
            }
        },
    },
    points: 0,
    inputs: false,
    next: [{ pid: 'entrance' }],
    server(app) {
        app.on('refresh', (_, ctx) => {
            const passed = [
                'BesiegeWithoutAssault',
                'CAPTCHA',
                'CatchGlowworm',
                'CountLightsOut',
                'DigitalCircuit',
                'EncryptedDialog'
            ].reduce((acc, cur) => acc + (Object.hasOwn(ctx.gameProcess.passed, cur.toLowerCase()) ? 1 : 0), 0)
            if (passed >= 5) {
                if (!Object.hasOwn(ctx.gameProcess.passed, 'Entrance'.toLowerCase())) {
                    ctx.pass()
                    return [passed, true]
                }
                return [passed, false]
            }
            return [passed, false]
        })
    }
} as Plugin<false>
