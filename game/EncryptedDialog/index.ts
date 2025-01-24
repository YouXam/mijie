import { Plugin } from "../../src/types";
import { generateShuffleMap } from "./lib";

export default {
    name: 'EncryptedDialog',
    pid: "EncryptedDialog",
    description: {
        before_solve: {
            content: `本题是 AI 交互题。你只能用英语来和它交流（更准确地说，只能使用 ASCII 可打印字符，如果 AI 回复了非 ASCII 可打印字符，会使用 □ 来代替）。

你向 AI 输入的内容将会被一个「输入码表」转换成密文，再发送给 AI 作为输入；AI 的输出又会被一个「输出码表」转换成密文，再显示给你。

你事先无从知道这两份码表，我只能告诉你：码表是由26个英文字母到26个英文字母的一一映射（大小写不敏感）。

你的目标是让 AI 输出一字不差的 \`The quick brown fox jumps over the lazy dog.\`（注意这里的输出是最终显示到你屏幕上的输出）`
        },
    },
    interval: 10 * 1000,
    next: [{ pid: 'entrance' }],
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
        const target = "The quick brown fox jumps over the lazy dog."
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
            return output.toLowerCase() === target.toLowerCase()
        }
        ctx.msg("AI 响应出现异常，请稍后重试。如果多次出现此问题，请联系管理员。")
        return false
    },
    points: 100
} as Plugin<true>;

