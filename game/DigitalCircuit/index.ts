import { Plugin } from "../../src/types";

function xor(a: boolean, b: boolean) {
    return a !== b;
}
function signal(input: boolean[], last: boolean[]): boolean[] {
    let output: boolean[] = new Array(8).fill(false);
    //output[7,5,3,1]记录了本次的输入
    output[7] = input[3];
    output[5] = input[2];
    output[3] = input[1];
    output[1] = input[0];
    //output[6]只有在「本次输入与上次输入完全相反」时，才会得到true
    output[6] = xor(input[3], last[7]) && xor(input[2], last[5]) && xor(input[1], last[3]) && xor(input[0], last[1]);
    //output[4,2]组成二位计数器
    output[4] = xor(last[4], last[2]);
    output[2] = !last[2];
    //result[0]等于所有输入、（上次）输出的异或和
    output[0] = xor(input[0], xor(input[1], xor(input[2], xor(input[3], xor(last[0], xor(last[1], xor(last[2], xor(last[3], xor(last[4], xor(last[5], xor(last[6], last[7])))))))))));
    return output;
}

export default {
    name: 'DigitalCircuit',
    pid: 'DigitalCircuit',
    description: {
        before_solve: {
            content: `本关是一个由不同逻辑门（可能包含与非门、异或门等）构成的数字电路，包含 4 个输入端和 8 个输出端，初始输出为 \`00000000\`。

你需要通过合理输入，使得此电路能够输出 \`11111111\`。

---

输入的格式为一个长度为 4 的字符串，每个字符为 \`0\` 或 \`1\`，分别代表四个输入端的输入信号。`
        },
    },
    points: 100,
    next: [{ pid: 'entrance' }],
    checker: async (ans, ctx) => {
        const last = ctx.gameStorage.get('last') || new Array(8).fill(false);
        const input = ans.split('').filter(c => c === '0' || c === '1').map(c => c === '1');
        if (input.length !== 4) {
            ctx.msg(`输入的长度不为 4，得到的输入为 [${input.map(b => b ? '1' : '0').join('')}]`);
            return false;
        }
        ctx.msg(`输入：[${input.map(b => b ? '1' : '0').join('')}]`);
        const output = signal(input, last);
        ctx.msg(`输出：[${output.map(b => b ? '1' : '0').join('')}]`);
        ctx.gameStorage.set('last', output);
        return output.every(Boolean);
    }
} as Plugin<true>
