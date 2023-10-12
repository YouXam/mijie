module.exports = {
    name: 'SimpleXSS',
    pid: 'simpleXSS',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 100,
    interval: 2000,
    checker: "RealButterCookiesFromHusky",
    next: [
        {
            pid: "last_problem"
        }
    ]
}