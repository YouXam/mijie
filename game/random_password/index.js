module.exports = {
    name: '让我访问',
    pid: 'random_password',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 60,
    checker(ans, ctx) {
        const password = Math.random();
        const val = parseFloat(ans);
        if (!(val>password) && !(val<password)) {
            ctx.msg("Welcome to my blog");
            return true;
        }
        ctx.msg("Access denied");
        return false;
    },
    next: [
        {
            pid: "simpleXSS"
        }
    ]
}