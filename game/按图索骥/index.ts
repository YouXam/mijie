import { Plugin } from "../../src/types";

export default {
    name: '按图索骥',
    pid: '按图索骥',
    description: {
        before_solve: {
            content: `「现在智能车已经没问题了。我还配置了 Quarix 的改进版萨摩耶探测器和 YouXam 设计的沙河校区自动寻路算法。」

YG学姐启动了智能车，然后看向手中的屏幕。一串串电机控制命令显示在屏幕上。

「咦？怎么回事？」YG学姐皱起眉头，「智能车的系统出了点小问题，控制命令里似乎被插入了别的东西。」

「我先手动接管智能车，麻烦你帮我找出有关的线索吧。」祂满眼期待地看着你。`,
        }
    },
    points: 120,
    next: [
        {
            pid: "推陈出新"
        }
    ],
    files: [
        {
            filename: "output"
        }
    ],
    checker(ans, ctx) {
        return ans.trim() === 'flag{this_is_QrGc0de}'
    }
} as Plugin<true>;
