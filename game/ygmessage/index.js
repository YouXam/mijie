module.exports = {
    name: '传递YG的密信',
    pid: 'ygmessage',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    manualScores: true,
    next: [
        {
            pid: "last_problem"
        }
    ]
}
