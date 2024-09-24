module.exports = {
    name: '神秘的串',
    pid: 'MysteriousString',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 0,
    checker: 'puppy',
    next: [
        {
            pid: "guessNumber"
        }
    ]
}
