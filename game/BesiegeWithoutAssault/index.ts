import { Plugin } from "../../src/types";


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
        app.on('next', (data, ctx) => {

        })
    }
} as Plugin<false>
