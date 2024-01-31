module.exports = {
    name: 'SimpleXSS',
    pid: 'simpleXSS',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 100,
    interval: 2000,
    checker: "RealButterCookiesFromHusky",
    next: [
        {
            pid: "last_problem"
        }
    ]
}