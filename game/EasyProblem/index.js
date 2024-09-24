module.exports = {
    name: 'EasyProblem',
    pid: 'easyProblem',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 0,
    checker: '正确的答案',
    first: true,
    next: [
        {
            pid: "MysteriousString"
        }
    ]
}
