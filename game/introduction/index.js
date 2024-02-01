module.exports = {
    name: 'Puzzle 100 - Introduction',
    pid: 'introduction',
    description: {
        before_solve: {
            md: "problem.md",
        }
    },
    async checker(answers) {
        return answers['成语'] === '心想事成';
    },
    points: 50,
    inputs: [
        { name: '成语', placeholder: '成语' },
    ],
    next: [
        {
            pid: 'palindrome'
        }
    ]
}
