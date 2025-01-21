import { Plugin } from "../../src/types";

export default {
    name: 'CAPTCHA',
    pid: 'captcha',
    description: {
        before_solve: {
            mdv: {
                main: "md/App.vue",
                include: ["md/*/*.png", "md/*.vue", "md/*.md"],
            }
        },
        after_solve: {
            mdv: {
                main: "md/Pass.vue",
                include: ["md/Pass.vue", "md/check.svg"],
            }
        }
    },
    points: 100,
    first: true,
    inputs: false,
    next: [
        { pid: 'CountLightsOut' },
        { pid: 'CatchGlowworm' },
        { pid: 'EncryptedDialog' },
        { pid: 'BesiegeWithoutAssault' },
        { pid: 'DigitalCircuit' }
    ],
    server(app) {
        const problems = [
            { name: 'bug', ans: 41058, ele: 'bug'},
            { name: 'resistor', ans: 1026, ele: `<span class="katex"><span class="katex-mathml"><math><semantics><mrow><mn>1</mn><mi mathvariant="normal">.</mi><mn>2</mn><mi>k</mi><mi mathvariant="normal">Ω</mi></mrow><annotation encoding="application/x-tex">1.2 k \Omega</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="strut" style="height:0.69444em;"></span><span class="strut bottom" style="height:0.69444em;vertical-align:0em;"></span><span class="base textstyle uncramped"><span class="mord mathrm">1</span><span class="mord mathrm">.</span><span class="mord mathrm">2</span><span class="mord mathit" style="margin-right:0.03148em;">k</span><span class="mord mathrm">Ω</span></span></span></span> 电阻` },
            { name: 'planet', ans: 8196, ele: '行星' },
            { name: 'unit', ans: 1029, ele: '长度单位' },
            { name: 'tone', ans: 33308, ele: '入声字' },
            { name: 'math', ans: 37888, ele: '大于2的数学常数' },
            { name: 'chordate', ans: 48250, ele: '脊索动物' }
        ]
        app.on("update", async (data: { name?: string }, ctx) => {
            const next = problems.filter(p => p.name !== data.name)
            const { name, ele } = next[Math.floor(Math.random() * next.length)]
            return { name, ele, ans: Math.random() * 40000 | 0 }
        })
        app.on('submit', async ({ name, result }: { name: string, result: number }, ctx) => {
            const problem = problems.find(p => p.name === name)
            if (result === problem?.ans) {
                ctx.pass()
                return true
            } else return false
        })
    }
} as Plugin<false>;
