import { Plugin } from "../../src/types";

const stats = `...`.split('\n')

export default {
    name: 'WhatHappened',
    pid: 'WhatHappened',
    description: {
        before_solve: {
            mdv: {
                main: "main.vue",
                include: ["main.vue"]
            }
        },
    },
    points: Infinity,
    record: false,
    checker: async (ans, ctx) => {
        const round = ctx.gameStorage.get<number>('round') || 0
        if (round < stats.length) {
            ctx.msg(stats[round])
            ctx.gameStorage.set('round', round + 1)
        }
        return false
    }
} as Plugin<true>
