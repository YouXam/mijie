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
    async checker(ans, ctx) {
        return ans.trim() === '102334155 165580141' || ans.trim() === '165580141 102334155'
    }
} as Plugin<true>;
