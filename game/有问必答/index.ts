import { Plugin } from "../../src/types";

export default {
    name: '有问必答',
    pid: '有问必答',
    description: {
        before_solve: {
            mdv: {
                main: "md/App.vue",
                include: ["md/App.vue"],
            }
        },
    },
    points: 75,
    inputs: false,
    next: [
        {
            pid: "心领神会"
        }
    ],
    server(app) {
        app.on("pass", async (data, ctx) => {
            if (!data.token) return
            if (data.user !== ctx.username) return
            try {
                const payload = ctx.jwt.verify(data.token, process.env.JWT_SECRET || 'baituan_secret_key')
                if (typeof payload !== 'object') return
                if (payload.success === true) {
                    ctx.pass('')
                }
            } catch (e) {
                console.log(e)
            }
        })
    },
} as Plugin<false, {
    token?: string,
    user?: string,
}>;
