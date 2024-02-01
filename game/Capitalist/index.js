module.exports = {
    name: 'Puzzle 10 - Capitalist',
    pid: "capitalist",
    description: {
        before_solve: {
            mdv: {
                main: "./problem/main.md",
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
        app.on("nopass", async (data, ctx) => {
            ctx.nopass(data.msg)
        })

        app.on("pass", async (data, ctx) => {
            ctx.pass(data.msg)
        })
    },
    points: 50,
    next: [
        {
            pid: 'red'
        }
    ]
}
