import { Plugin } from "../../src/types";

export default {
    name: '逆转文件',
    pid: '逆转文件',
    description: {
        before_solve: {
            content: `「这次的委托人是匿名的，对方通过电子邮件给我发送了一个 PDF 文件，告诉我这个文件中隐含有一个网址。」

「我原本以为这只是一场恶作剧，但是很快我就收到了一份支票，备注是『定金，事成之后四倍』。」

「然而，我找遍了 PDF 文件中指示的五个地方：大雕像、大钟、大楼、大石头和大门，都没有任何发现。」

「我曾经找一个世外高人帮我看过，然后他说：『因为你不是这里的新生，所以不明白那个东西意味着什么；天机不可泄露，你自己去想吧』」

「总之，你能帮我找到这个网址吗？」`,
        },
        after_solve: {
            content: `「原来如此……那个『大门』其实是你们徽章的一部分啊。」成步堂 哈二恍然大悟。

「那么我已经掌握了这个事件的真相了！作为感谢，这张支票就送给你了。」

「这是一张时间支票，可以让你回到去年哈士奇事件发生的时候。如果你想知道什么的话，就亲自跑一趟吧。」`   
        }
    },
    points: 0,
    inputs: [
        { name: '网址', placeholder: '网址' }
    ],
    next: [
        {
            pid: "EasyProblem"
        }
    ],
    files: [
        {
            filename: "file.pdf"
        }
    ],
    checker: async (ans, ctx) => {
        const url = ans['网址'];
        if (/^(https:\/\/|)hello\.bupt\.edu\.cn(|\/(|#\/(|entry(|\/))))$/gm.test(url)) {
            return true
        }
        return false
    }
} as Plugin<[
    '网址'
]>;