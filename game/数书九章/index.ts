import { Plugin } from "../../src/types";

export default {
    name: '数书九章',
    pid: '数书九章',
    description: {
        before_solve: {
            md: "problem.md"
        }
    },
    points: 120,
    next: [
        {
            pid: "包罗万象"
        }
    ],
    inputs: [
        {
            name: 'code',
            placeholder: 'Python 代码'
        }
    ],
    async checker(ans, ctx) {
        const res = await ctx.glot('python', {
            command: [
                '998244353 114514 1919810 233333',
                '100000259 1923947 0 98098089',
                '100000853 13 9 801238904',
                '19260817 2389 12398 898091',
                '100000259 1923947 0 0'
            ].map(x => `echo ${x} | python3 main.py`).join('; '),
            files: [
                {
                    name: "main.py",
                    content: ans.code
                }
            ]
        })
        const lines = res.stdout.trim().split('\n').map((x: string) => x.trim()).join('\n')
        return lines === [
            'Yes',
            'No',
            'Yes',
            'Yes',
            'Yes'
        ].join('\n')
    }
} as Plugin<[
    'code',
]>;
