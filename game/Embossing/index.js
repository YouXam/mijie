module.exports = {
    name: 'Embossing',
    pid: 'embossing',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 50,
    checker: '盲文',
    next: [
        {
            pid: "getBones"
        }
    ]
}
