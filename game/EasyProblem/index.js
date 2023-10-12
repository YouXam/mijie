module.exports = {
    name: 'EasyProblem',
    pid: 'easyProblem',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 10,
    checker: '正确的答案',
    first: true,
    next: [
        {
            pid: "MysteriousString"
        }
    ]
}
