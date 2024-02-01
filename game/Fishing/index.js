module.exports = {
    name: 'Puzzle 1 - Fishing',
    pid: 'fishing',
    description: {
        before_solve: {
            md: "problem.md",
        }
    },
    points: 50,
    async checker(ans, ctx) {
        let ban = ctx.gameStorage.get("ban")
        if (ban && ban > Date.now()) {
            ctx.msg(`您已被封禁，剩余 ${Math.floor((ban - Date.now()) / 1000)} 秒。`)
            return false
        }
        if (ans === '0.3') {
            return true
        } else if (ans === '0.30000001' || ans === '0.30000000000000004') {
            ctx.msg('验证通过！您已被封禁 60 秒。')
            ctx.gameStorage.set("ban", Date.now() + 60 * 1000)
            return false
        }
        return false
    },
    next: [
        {
            pid: "capitalist"
        }
    ]
}
