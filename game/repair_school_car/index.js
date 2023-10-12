module.exports = {
    name: '修好搁浅的校车',
    pid: 'repair_school_car',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    manualScores: true,
    next: [
        {
            pid: "run_school_car"
        }
    ]
}
