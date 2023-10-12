module.exports = {
    name: 'Assessment',
    pid: 'assessment',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 80,
    interval: 10 * 1000,
    checker: async (ans, ctx) => {
        
        return true;
    },
    next: [
        {
            pid: "wirelessMystery"
        }
    ]
}
