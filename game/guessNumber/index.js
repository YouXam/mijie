module.exports = {
    name: '猜数字',
    pid: 'guessNumber',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 20,
    interval: 1000,
    checker(ans, ctx) {
        if (isNaN(ans) ||  !ans.length) {
            ctx.msg('答案必须是数字')
            return false
        }
        const ansNumber = parseInt(ans);
        const storage = ctx.gameStorage;
        const sNumber = storage.get('number')
        let number = sNumber === null ? Math.floor(Math.random() * 100) : sNumber;
        const times = storage.get('times') || 0
        if (times >= 7) {
            ctx.msg('[第 1 次，剩余 6 次]')
            storage.set('times', 1)
            number = Math.floor(Math.random() * 100)
        } else {
            storage.set('times', times + 1)
            ctx.msg(`[第 ${times + 1} 次，剩余 ${7 - (times + 1)} 次${6 == times ? '，已重置口令' : ''}]`)
        }
        storage.set('number', number)
        if (ansNumber < number) {
            ctx.msg('太小了')
            return false
        } else if (ansNumber > number) {
            ctx.msg('太大了')
            return false
        } else {
            storage.set('times', 0)
            storage.set('number', null)
            ctx.msg('答对了')
            return true
        }
        
    },
    next: [
        {
            pid: "cheatAI"
        }
    ]
}
