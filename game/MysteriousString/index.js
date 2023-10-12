module.exports = {
    name: '神秘的串',
    pid: 'MysteriousString',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 20,
    checker: 'puppy',
    next: [
        {
            pid: "guessNumber"
        }
    ]
}
