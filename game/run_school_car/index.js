module.exports = {
    name: '让校车跑起来~',
    pid: 'run_school_car',
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
            pid: "ygmessage"
        }
    ]
}
