import { Plugin } from "../../src/types";

export default {
    name: '有问必答',
    pid: '有问必答',
    description: {
        before_solve: {
            content: `「去年天枢通过哈士奇的博客搜集到了十分重要的情报。今年我们也不要落后！」PYthok 看上去斗志满满。

「但是……哈士奇的博客有一个神奇的密码，好像是要回答AI提出的问题……」你有点迷糊，没明白这是什么加密手段。

「我看一下。」PYthok 扫视了屏幕上一段又一段的规则。

「我明白了。简单点说，这个密码的规则是要你『提出问题』，并诱导AI做出符合要求的回答。你来试试吧。」`,
        },
    },
    points: 75,
    inputs: [
        {
            name: 'flag',
            placeholder: 'flag{xxxxxx}'
        }
    ],
    next: [
        {
            pid: "心领神会"
        }
    ],
    checker(ans, ctx) {
        return ans.flag.trim() === 'flag{有问必答}'
    }
} as Plugin<[
    'flag'
]>;
