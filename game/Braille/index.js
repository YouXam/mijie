module.exports = {
    name: 'Braille',
    pid: 'braille',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 50,
    checker: '盲文',
    next: [
        {
            pid: "getBones"
        }
    ]
}
