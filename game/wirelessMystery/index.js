module.exports = {
    name: '无线谜踪',
    pid: 'wirelessMystery',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
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
