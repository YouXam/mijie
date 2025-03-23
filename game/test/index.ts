import { createPlugin } from "../../src/types";


export default createPlugin({
    name: 'test',
    pid: 'test',
    description: {
        before_solve: {
            content: `test`
        },
    },
    points: 100,
    inputs: [
        { name: "x", placeholder: "请输入 x" },
    ],
    checker(ans, ctx) {
        ctx.msg(`你输入的是 ${ans.x}`)
        ctx.content("再试一次")
        return false;
    }
})