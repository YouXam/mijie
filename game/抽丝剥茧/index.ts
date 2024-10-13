import { Plugin } from "../../src/types";

export default {
    name: '抽丝剥茧',
    pid: '抽丝剥茧',
    description: {
        before_solve: {
            content: `「我就知道你能行。」YG学姐蹬了蹬地面，坐着转椅滑到你的桌前。

「你会UART吗？不会也没关系，可以现学。」

「我刚修完通信模块，需要你手动解出这段UART数据流的信息，再与实际结果比较。」

「刚刚模块发送了两个字符，你先解算，算完了提交给我就行。」

----

![](https://files.chouhsing.org/%E6%8A%BD%E4%B8%9D%E5%89%A5%E8%8C%A7.png)`,
        },
        after_solve: {
            content: `你把分析结果写在纸上，递给YG学姐。

祂看了看，露出满意的笑容。

「恭喜，智能车已经修好了。这张纸就是你加入我们智能创新社的门票！」

「我已经把准备工作全部做完了。现在，跟着我出去抓萨摩耶吧。」`
        }
    },
    points: 100,
    next: [
        {
            pid: "按图索骥"
        }
    ],
    checker(ans, ctx) {
        return ans.trim() === '42'
    }
} as Plugin<true>;
