import { Plugin } from "../../src/types";

export default {
    name: '卦象骇客',
    pid: '卦象骇客',
    description: {
        before_solve: {
            md: 'problem.md'
        }
    },
    points: 90,
    next: [
        {
            pid: "通风报信"
        }
    ],
    inputs: [
        {
            name: 'A',
            placeholder: '第一个数字'
        },
        {
            name: 'B',
            placeholder: '第二个数字'
        }
    ],
    async checker(ans, ctx) {
        return ans.A.trim() === '102334155' && ans.B.trim() === '165580141' ||
            ans.A.trim() === '165580141' && ans.B.trim() === '102334155';
    }
} as Plugin<[
    'A',
    'B'
]>;
