module.exports = {
    name: 'Puzzle 10 - Capitalist',
    pid: "capitalist",
    description: {
        before_solve: {
            mdv: {
                main: "./problem/App.vue",
                include: [
                    "./problem/**/*"
                ]
            }
        }
    },
    // inputs: [
    //     {
    //         name: 'first',
    //         placeholder: '请输入第一个数',
    //     },
    //     {
    //         name: 'second',
    //         placeholder: '请输入第二个数',
    //     }
    // ],
    inputs: false,
    server(app) {
        app.on("pass", async (data, ctx) => {
            if (!data.token) return
            try {
                const payload = ctx.jwt.verify(data.token, process.env.JWT_SECRET);
                if (payload.pass === true) {
                    ctx.pass("在第 " + (payload.round - 1) + " 回合结算后通过")
                }
            } catch (e) {
                console.log(e)
            }
            // ctx.pass(data.msg)
        })
    },
    points: 50,
    next: [
        {
            pid: 'red'
        }
    ]
}
