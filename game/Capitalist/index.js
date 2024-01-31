module.exports = {
    name: 'Capitalist',
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
    inputs: [
        {
            name: 'first',
            placeholder: '请输入第一个数',
        },
        {
            name: 'second',
            placeholder: '请输入第二个数',
        }
    ],
    async checker(answers, ctx) {
        console.log(answers)
        console.log(ctx)
    },
    points: 50
}
