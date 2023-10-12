module.exports = {
    name: '让我访问',
    pid: 'random_password',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 60,
    interval: 10 * 1000,
    async checker(ans, ctx) {
        const code = `import random
password = random.random()
val = float(input())
if not (val > password) and not (val < password):
    print("Welcome to my blog")
else:
    print("Access denied")
        `
        const res = await ctx.runCode(code, 'python', ans);
        if (res.code) {
            ctx.msg(res.error);
            return false;
        }
        ctx.msg(res.stdout);
        return res.stdout.trim() === 'Welcome to my blog';
    },
    next: [
        {
            pid: "simpleXSS"
        }
    ]
}