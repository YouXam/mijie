import { createPlugin } from "../../src/types";
import { generateShuffleMap } from "./lib";

export default createPlugin({
    name: 'EncryptedDialog',
    pid: "EncryptedDialog",
    description: {
        before_solve: {
            md: "problem.md"
        }
    },
    next: [{ pid: 'entrance' }],
    points: 100,
    async checker(ans, ctx) {
        const isAscii = (x: string) => x.split('').every(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126 || c === '\n')
        if (!ans.split('').every(isAscii)) {
            ctx.msg("你的输入中包含了非 ASCII 可打印字符，请重新输入。")
            return false
        }
        let inputMap = ctx.gameStorage.get('inputMap')
        let outputMap = ctx.gameStorage.get('outputMap')
        if (!inputMap || !outputMap) {
            inputMap = generateShuffleMap()
            outputMap = generateShuffleMap()
            ctx.gameStorage.set('inputMap', inputMap)
            ctx.gameStorage.set('outputMap', outputMap)
        }
        const input = ans.split('').map(c => (inputMap as any)[c] || c).join('')
        const res = await ctx.ai([
            { "role": "system", "content": "You should only use English for chat with the user. To be more precisely, you can only output the ASCII printable characters." },
            { "role": "user", "content": input },
        ])
        if (res.success) {
            const reply = res?.response || ''
            console.log('<-', input)
            console.log('->', reply)
            const output = reply.split('').map((c: any) => isAscii(c) ? ((outputMap as any)[c] || c) : '□').join('')
            ctx.msg(output)
            return output === "The quick brown fox jumps over the lazy dog."
        }
        ctx.msg("AI 响应出现异常，请稍后重试。如果多次出现此问题，请联系管理员。")
        return false
    }
})