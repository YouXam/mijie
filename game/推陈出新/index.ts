import { Plugin } from "../../src/types";

export default {
    name: '推陈出新',
    pid: '推陈出新',
    description: {
        before_solve: {
            content: `「嗯？怎么回事？」YG学姐看着屏幕上的数据，皱起眉头。

「坏了，PID 参数还没调！之前修车的时候我们换了一些部件，也正因如此，旧 PID 参数在新系统中的效果不好。」

「我去把智能车召回来，调节和优化 PID 参数的工作就交给你，如何？」

「没问题。」你答应了YG学姐的请求。

---

你需要在沙河百团大战举办时间内（2024 年 10 月 20 日 10:00 - 15:00）前往智能创新社摊位完成此任务。`,
        },
        after_solve: {
            content: `满血复活的智能车很快就开始自动寻路，我们终于发现萨摩耶了！

萨摩耶发觉状况不妙，便求助哈士奇破坏智能车。然而，哈士奇刚张开大口，就被智能车喷出的胡椒粉呛得直打喷嚏！

YG学姐晃了晃手里的胡椒粉瓶。「这才是我的绝招！哈哈哈哈……啊嚏！啊嚏！」

哈士奇突然掉转方向，朝YG学姐发起了袭击！

说时迟那时快，你随手拿出一张纸，又抢过YG学姐的胡椒粉瓶。然后仅仅横着一张纸，就站在了祂和哈士奇之间。

哈士奇轻易而举地就咬碎了那张纸。可是牠突然打起喷嚏来，结果闭着嘴撞上了你的胸口！

萨摩耶和哈士奇都逃走了，留下惊魂未定的你和YG学姐。「你还好吧？」

你摇着手表示自己没事。「我们终于打平了。」

「不，是我们赢了。这次，我要让牠们一个也跑不了！」`
        }
    },
    points: 100,
    manualScores: true,
    next: [
        {
            pid: "通风报信"
        }
    ]
} as Plugin<true>;
