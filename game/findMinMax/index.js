module.exports = {
    name: 'findMinMax',
    pid: 'findMinMax',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 40,
    checker: '207',
    next: [
        {
            pid: "coprimeCount"
        }
    ]
}
