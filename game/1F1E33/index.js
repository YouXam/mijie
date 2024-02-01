module.exports = {
    name: 'Puzzle 101 - 1F1E33',
    pid: '1F1E33',
    description: {
        before_solve: {
            md: "problem.md",
        }
    },
    async checker(answers) {
        if (answers && answers['第一个输入框'] === '39'
            && answers['第二个输入框'] === '41'
            && answers['第三个输入框'] === '0'
            && answers['第四个输入框'] === '80') {
                return true
            }
        return false
    },
    points: 50,
    inputs: [
        {
            name: '第一个输入框',
        },
        {
            name: '第二个输入框',
        },
        {
            name: '第三个输入框',
        },
        {
            name: '第四个输入框',
        }
    ],
    next: [
        {
            pid: 'calculator'
        }
    ]
}
