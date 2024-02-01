module.exports = {
    name: 'Puzzle 100 - Calculator',
    pid: 'calculator',
    description: {
        before_solve: {
            md: "problem.md",
        }
    },
    checker: '1518',
    points: 50,
    next: [
        {
            pid: 'introduction'
        }
    ]
}
