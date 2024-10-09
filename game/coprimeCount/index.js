export default {
    name: 'coprimeCount',
    pid: 'coprimeCount',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            content: "校方思索良久，最后决定把原小麦铺超市的场地和场所强行回收，以弥补损失。"
        }
    },
    points: 0,
    checker: '400000000000',
    next: [
        {
            pid: "assessment"
        }
    ]
}
