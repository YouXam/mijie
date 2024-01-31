module.exports = {
    name: '修好搁浅的校车',
    pid: 'repair_school_car',
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
            pid: "run_school_car"
        }
    ]
}
