module.exports = {
    name: 'rollDice',
    pid: 'rollDice',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 35,
    checker: '35',
    next: [
        {
            pid: "wirelessMystery"
        }
    ]
}
