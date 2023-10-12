module.exports = {
    name: '无线谜踪',
    pid: 'wirelessMystery',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 70,
    checker(ans) {
        return ans === 'HEBACGI' || ans === 'IGCABEH';
    },
    next: [
        {
            pid: "last_problem"
        }
    ]
}
